import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { callCortexAnalyst, isSnowflakeConfigured } from '@/lib/snowflake';
import { getContextSummary, shouldUseCortex } from '@/lib/context-loader';
import type { SnowflakeQueryResult } from '@/types/snowflake';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatRequest {
  message: string;
  history: Message[];
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, history } = body;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    console.log(`📨 Received message: "${message}"`);

    // Check if we should use Snowflake Cortex for data queries
    const useCortex = shouldUseCortex(message) && isSnowflakeConfigured();

    let response: string;
    let sqlQuery: string | undefined;
    let queryResults: SnowflakeQueryResult[] | undefined;

    if (useCortex) {
      console.log('🔍 Using Snowflake Cortex for data query');
      try {
        const cortexResult = await callCortexAnalyst(message, history);
        
        // Extract the response from Cortex
        response = cortexResult.explanation;
        sqlQuery = cortexResult.sql_query;
        queryResults = cortexResult.query_results || undefined;

        // OpenAI enhancement is optional - Cortex already provides good responses
        // Only enhance if OpenAI key is valid and we have results
        if (queryResults && queryResults.length > 0 && process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('sk-')) {
          try {
            const enhanced = await enhanceResponseWithOpenAI(
              message,
              response,
              queryResults
            );
            response = enhanced;
          } catch (_) {
            // If enhancement fails, just use the Cortex response (which is already good)
            console.log('Note: Using Cortex response without OpenAI enhancement');
          }
        }
      } catch (cortexError) {
        const error = cortexError as Error;
        console.error('⚠️  Cortex query failed, falling back to OpenAI:', error.message);
        // Fall back to OpenAI if Cortex fails
        response = await generateOpenAIResponse(message, history);
      }
    } else {
      console.log('💬 Using OpenAI for response');
      response = await generateOpenAIResponse(message, history);
    }

    return NextResponse.json({
      response,
      sqlQuery,
      queryResults: queryResults?.slice(0, 10), // Limit results to first 10 rows
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const err = error as Error;
    console.error('❌ Error in chat API:', err);
    return NextResponse.json(
      { 
        error: 'Failed to process chat message',
        details: err.message 
      },
      { status: 500 }
    );
  }
}

/**
 * Generate response using OpenAI with business context
 */
async function generateOpenAIResponse(
  message: string,
  history: Message[]
): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    return getFallbackResponse(message);
  }

  const contextSummary = getContextSummary();

  const systemPrompt = `You are an AI assistant for Cisco Analytics, specializing in Customer Success Management (CSM), Commercial Operations (CO), and Sales Expansion (SE).

${contextSummary}

Your role is to:
1. Help users understand business metrics and KPIs
2. Explain how metrics are calculated
3. Provide insights and recommendations
4. Answer questions about customers, revenue, products, and sales

Be concise, professional, and data-driven in your responses. When discussing metrics, explain both what they mean and why they matter.`;

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-5).map(h => ({
      role: h.role,
      content: h.content
    })),
    { role: 'user', content: message }
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages,
      temperature: 0.7,
      max_tokens: 800,
    });

    return completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';
  } catch (error) {
    const err = error as Error & { status?: number };
    console.error('OpenAI API error:', err);
    if (err.status === 401) {
      return 'OpenAI API key is invalid. Please check your configuration.';
    }
    return getFallbackResponse(message);
  }
}

/**
 * Enhance Cortex response with OpenAI for better natural language
 */
async function enhanceResponseWithOpenAI(
  userQuestion: string,
  cortexResponse: string,
  queryResults: SnowflakeQueryResult[]
): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    return cortexResponse;
  }

  try {
    const enhancementPrompt = `The user asked: "${userQuestion}"

I retrieved data from the database and got this initial response:
${cortexResponse}

Here's a sample of the data (first 3 rows):
${JSON.stringify(queryResults.slice(0, 3), null, 2)}

Please provide a clear, insightful response that:
1. Directly answers the user's question
2. Highlights key findings from the data
3. Provides actionable insights if relevant
4. Uses bullet points for multiple items
5. Give all the facts and data)`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a data analyst providing clear, actionable insights from query results.' },
        { role: 'user', content: enhancementPrompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return completion.choices[0]?.message?.content || cortexResponse;
  } catch (error) {
    console.error('Error enhancing response:', error);
    return cortexResponse;
  }
}

/**
 * Fallback responses when OpenAI is not available
 */
function getFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return 'Hello! I\'m your AI assistant for Cisco Analytics. I can help you analyze customer data, commercial operations, and sales expansion opportunities. What would you like to know?';
  }

  if (lowerMessage.includes('help')) {
    return `I can help you with:

**Customer Success (CSM)**
• Health scores and retention metrics
• Product adoption and utilization
• Churn prediction and prevention
• Customer engagement analysis

**Commercial Operations (CO)**
• Revenue tracking and recognition
• Quote-to-cash cycle metrics
• Invoice and payment management
• Subscription analytics

**Sales Expansion (SE)**
• Expansion opportunities
• Cross-sell and upsell analysis
• White space identification
• Win rate and pipeline metrics

Just ask me a question about any of these areas!`;
  }

  return `I can help you analyze your Cisco Analytics data. Try asking questions like:

• "Show me customers with health scores below 70"
• "What's our Net Revenue Retention this quarter?"
• "List top 10 customers by ARR"
• "Explain how churn rate is calculated"
• "What expansion opportunities do we have?"

Note: For the best experience, please configure your OpenAI API key in the environment variables.`;
}

