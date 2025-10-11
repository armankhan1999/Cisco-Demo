// Type definitions for Snowflake integration

export interface SnowflakeQueryResult {
  [key: string]: string | number | boolean | null;
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface CortexAnalystResult {
  sql_query: string;
  query_results: SnowflakeQueryResult[] | null;
  explanation: string;
  error?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sqlQuery?: string;
  queryResults?: SnowflakeQueryResult[];
}

export interface SchemaColumn {
  name: string;
  type: string;
}

