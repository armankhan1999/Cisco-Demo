import { NextRequest, NextResponse } from 'next/server';
import { callCortexAnalyst, isSnowflakeConfigured } from '@/lib/snowflake';

/**
 * Test endpoint for Snowflake Cortex
 * Usage: GET /api/test-cortex?q=your+question
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || 'List all customers who have placed more than 3 orders';
  
  console.log('🧪 Testing Cortex with query:', query);
  console.log('Snowflake configured:', isSnowflakeConfigured());
  
  if (!isSnowflakeConfigured()) {
    return NextResponse.json({
      error: 'Snowflake is not configured',
      details: {
        account: !!process.env.SNOWFLAKE_ACCOUNT,
        username: !!process.env.SNOWFLAKE_USERNAME,
        privateKeyPath: !!process.env.SNOWFLAKE_PRIVATE_KEY_PATH,
        privateKeyPass: !!process.env.SNOWFLAKE_PRIVATE_KEY_PASS,
      }
    }, { status: 500 });
  }
  
  try {
    const result = await callCortexAnalyst(query);
    
    return NextResponse.json({
      success: true,
      query: query,
      response: result.explanation,
      sql: result.sql_query,
      resultsCount: result.query_results?.length || 0,
      results: result.query_results?.slice(0, 5), // First 5 rows
      error: result.error,
    });
    
  } catch (error) {
    const err = error as Error;
    console.error('❌ Cortex test failed:', err);
    return NextResponse.json({
      success: false,
      error: err.message,
      stack: err.stack,
    }, { status: 500 });
  }
}

