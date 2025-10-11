import snowflake from 'snowflake-sdk';
import fs from 'fs';
import crypto from 'crypto';

let connectionInstance: any = null;

/**
 * Get or create Snowflake connection with JWT key-pair auth
 */
export async function getSnowflakeConnection() {
  if (connectionInstance?.isUp()) {
    return connectionInstance;
  }

  const privateKeyPath = process.env.SNOWFLAKE_PRIVATE_KEY_PATH;
  const privateKeyPass = process.env.SNOWFLAKE_PRIVATE_KEY_PASS;

  if (!privateKeyPath) {
    throw new Error('SNOWFLAKE_PRIVATE_KEY_PATH not configured in environment variables');
  }

  if (!fs.existsSync(privateKeyPath)) {
    throw new Error(`Private key file not found at: ${privateKeyPath}`);
  }

  // Read and decrypt the private key
  const privateKeyData = fs.readFileSync(privateKeyPath, 'utf8');
  
  // Decrypt the private key using the passphrase
  let privateKeyObject;
  try {
    privateKeyObject = crypto.createPrivateKey({
      key: privateKeyData,
      format: 'pem',
      passphrase: privateKeyPass,
    });
    
    // Export as PKCS8 format (unencrypted) which Snowflake SDK expects
    const privateKeyPem = privateKeyObject.export({
      type: 'pkcs8',
      format: 'pem',
    });
    
    console.log('✅ Private key decrypted and formatted successfully');
    
    connectionInstance = snowflake.createConnection({
      account: process.env.SNOWFLAKE_ACCOUNT,
      username: process.env.SNOWFLAKE_USERNAME,
      authenticator: 'SNOWFLAKE_JWT',
      privateKey: privateKeyPem as string,
      warehouse: process.env.SNOWFLAKE_WAREHOUSE,
      database: process.env.SNOWFLAKE_DATABASE,
    });
  } catch (keyError: any) {
    console.error('❌ Error processing private key:', keyError.message);
    throw new Error(`Failed to process private key: ${keyError.message}`);
  }

  await connectionInstance.connectAsync();

  // Set database context
  await executeSnowflakeQuery(`USE WAREHOUSE ${process.env.SNOWFLAKE_WAREHOUSE}`);
  await executeSnowflakeQuery(`USE DATABASE ${process.env.SNOWFLAKE_DATABASE}`);

  console.log('✅ Connected to Snowflake');
  return connectionInstance;
}

/**
 * Execute a Snowflake query
 */
export async function executeSnowflakeQuery(query: string): Promise<any[]> {
  const connection = await getSnowflakeConnection();

  return new Promise((resolve, reject) => {
    connection.execute({
      sqlText: query,
      complete: (err: any, stmt: any, rows: any[]) => {
        if (err) {
          reject(new Error(`Snowflake query failed: ${err.message}`));
        } else {
          resolve(rows || []);
        }
      },
    });
  });
}

/**
 * Main function: Convert natural language to SQL and execute
 *
 * @param message - User's natural language question
 * @param conversationHistory - Previous messages (optional)
 * @param tableName - Target table (default: T_BRZ_ACCOUNTS)
 * @returns Response with SQL, results, and explanation
 */
export async function callCortexAnalyst(
  message: string,
  conversationHistory: any[] = [],
  tableName: string = 'DB_CISCO_ANALYTICS.RAW.T_BRZ_ACCOUNTS'
) {
  console.log(`🔍 Processing question: "${message}"`);
  console.log(`📊 Target table: ${tableName}`);

  try {
    // Step 1: Get table schema
    const schemaResult = await executeSnowflakeQuery(`DESCRIBE TABLE ${tableName}`);

    const schemaInfo = schemaResult
      .map((col: any) => `${col.name} (${col.type})`)
      .join(', ');

    console.log(`✅ Schema retrieved: ${schemaResult.length} columns`);

    // Step 2: Generate SQL with CORTEX.COMPLETE
    const promptText = `Generate a single SQL query to answer this question. Return ONLY the SQL query with no explanation, no markdown formatting, no code blocks.

Database: ${tableName}
Available columns: ${schemaInfo.substring(0, 500)}...

Question: ${message}

Requirements:
- Use fully qualified table names (DB_CISCO_ANALYTICS.RAW.TABLE_NAME)
- Use UPPERCASE for all column names
- Return a single SELECT statement
- No explanatory text, just the SQL query

SQL query:`;

    const sqlGenResult = await executeSnowflakeQuery(`
      SELECT SNOWFLAKE.CORTEX.COMPLETE(
        'mistral-large',
        '${promptText.replace(/'/g, "''")}'
      ) as sql_query
    `);

    let sqlQuery = sqlGenResult?.[0]?.SQL_QUERY || sqlGenResult?.[0]?.sql_query || '';

    // Clean up the generated SQL
    sqlQuery = sqlQuery
      .replace(/```sql/gi, '')
      .replace(/```/g, '')
      .trim();

    console.log('✅ Generated SQL:', sqlQuery.substring(0, 100) + '...');

    // Step 3: Execute the generated SQL
    let queryResults: any[] | null = null;
    let queryError: string | null = null;

    try {
      queryResults = await executeSnowflakeQuery(sqlQuery);
      console.log(`✅ Query executed: ${queryResults?.length || 0} rows returned`);
    } catch (execError: any) {
      queryError = execError.message;
      console.error('❌ Query execution failed:', queryError);
    }

    // Step 4: Generate natural language explanation
    const explanationPrompt = `Based on this data query result, provide a brief natural language answer to the user's question.

User question: ${message}
SQL query executed: ${sqlQuery}
${queryResults ? `Result count: ${queryResults.length} rows` : `Error: ${queryError}`}
${queryResults?.length && queryResults.length > 0 ? `Sample data: ${JSON.stringify(queryResults[0])}` : ''}

Provide a concise, helpful answer in 2-3 sentences:`;

    const explanationResult = await executeSnowflakeQuery(`
      SELECT SNOWFLAKE.CORTEX.COMPLETE(
        'mistral-large',
        '${explanationPrompt.replace(/'/g, "''")}'
      ) as explanation
    `);

    const explanation =
      explanationResult?.[0]?.EXPLANATION ||
      explanationResult?.[0]?.explanation ||
      'Query executed successfully.';

    console.log('✅ Generated explanation');

    // Return response in Cortex Analyst format
    return {
      message: {
        content: [
          {
            type: 'text',
            text: explanation.trim(),
          },
          {
            type: 'sql',
            statement: sqlQuery,
          },
        ],
      },
      sql_query: sqlQuery,
      query_results: queryResults,
      error: queryError,
    };
  } catch (error: any) {
    console.error('❌ Cortex analyst error:', error);
    throw error;
  }
}

/**
 * Check if Snowflake credentials are configured
 */
export function isSnowflakeConfigured(): boolean {
  return !!(
    process.env.SNOWFLAKE_ACCOUNT &&
    process.env.SNOWFLAKE_USERNAME &&
    process.env.SNOWFLAKE_PRIVATE_KEY_PATH &&
    process.env.SNOWFLAKE_PRIVATE_KEY_PASS
  );
}

