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
  const privateKeyContent = process.env.SNOWFLAKE_PRIVATE_KEY;
  const privateKeyPass = process.env.SNOWFLAKE_PRIVATE_KEY_PASS;

  // Get private key data - either from file (local dev) or env variable (production)
  let privateKeyData: string;
  
  if (privateKeyContent) {
    // Production: Use private key from environment variable
    console.log('✅ Using private key from environment variable');
    privateKeyData = privateKeyContent;
  } else if (privateKeyPath) {
    // Local development: Read from file
    if (!fs.existsSync(privateKeyPath)) {
      throw new Error(`Private key file not found at: ${privateKeyPath}`);
    }
    console.log('✅ Using private key from file path');
    privateKeyData = fs.readFileSync(privateKeyPath, 'utf8');
  } else {
    throw new Error('Neither SNOWFLAKE_PRIVATE_KEY nor SNOWFLAKE_PRIVATE_KEY_PATH is configured');
  }
  
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
- Use DISTINCT when selecting to avoid duplicate rows
- Use proper GROUP BY when counting or aggregating
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

    // Step 4: Generate natural language explanation with actual data
    let explanation = '';
    
    if (queryError) {
      explanation = `There was an error executing the query: ${queryError}`;
    } else if (!queryResults || queryResults.length === 0) {
      explanation = `No results found matching your criteria.`;
    } else {
      // Format the actual data in the response
      const dataPreview = queryResults.slice(0, 20); // First 20 results
      const columnNames = Object.keys(dataPreview[0]);
      
      // Check if we need to deduplicate (if only one column and has duplicates)
      let uniqueData = dataPreview;
      if (columnNames.length === 1) {
        const seen = new Set();
        uniqueData = dataPreview.filter(row => {
          const value = row[columnNames[0]];
          if (seen.has(value)) return false;
          seen.add(value);
          return true;
        });
      }
      
      // Create a formatted list of results
      let formattedData = '';
      if (uniqueData.length === 1) {
        // Single result - show all columns
        formattedData = Object.entries(uniqueData[0])
          .map(([key, value]) => `**${key}**: ${value}`)
          .join('\n');
      } else if (columnNames.length === 1) {
        // Single column - simple list
        formattedData = uniqueData.map((row, idx) => {
          const value = row[columnNames[0]];
          return `${idx + 1}. ${value}`;
        }).join('\n');
      } else {
        // Multiple columns - show with additional info
        formattedData = uniqueData.map((row, idx) => {
          const mainValue = row[columnNames[0]] || Object.values(row)[0];
          const additionalInfo = columnNames.length > 1 
            ? ` - ${Object.entries(row).slice(1, 3).map(([k, v]) => `${k}: ${v}`).join(', ')}` 
            : '';
          return `${idx + 1}. **${mainValue}**${additionalInfo}`;
        }).join('\n');
      }
      
      const totalCount = queryResults.length;
      const uniqueCount = columnNames.length === 1 ? uniqueData.length : totalCount;
      const showing = uniqueData.length;
      
      if (columnNames.length === 1 && uniqueCount < totalCount) {
        explanation = `Found ${uniqueCount} unique result${uniqueCount !== 1 ? 's' : ''} (${totalCount} total rows)${uniqueCount > showing ? ` - showing first ${showing}` : ''}:\n\n${formattedData}`;
      } else {
        explanation = `Found ${totalCount} result${totalCount !== 1 ? 's' : ''}${totalCount > showing ? ` (showing first ${showing})` : ''}:\n\n${formattedData}`;
      }
      
      if (uniqueCount > showing) {
        explanation += `\n\n*Note: ${uniqueCount - showing} more result(s) not shown.*`;
      }
    }

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

