import { NextRequest, NextResponse } from 'next/server';

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

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, history } = body;

    // For now, we'll implement a simple rule-based response system
    // You can replace this with actual AI integration (OpenAI, Anthropic, etc.)
    const response = await generateResponse(message, history);

    return NextResponse.json({
      response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}

async function generateResponse(message: string, history: Message[]): Promise<string> {
  const lowerMessage = message.toLowerCase();

  // Simple keyword-based responses
  // This is a placeholder - you'll want to integrate with a real AI service
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return 'Hello! How can I assist you with your data analysis today?';
  }

  if (lowerMessage.includes('customer') || lowerMessage.includes('csm')) {
    return `I can help you with customer success management data. Here are some things I can help with:

• Customer health scores and trends
• Product adoption rates
• Churn risk analysis
• Expansion opportunities
• CSM performance metrics

What specific customer data would you like to explore?`;
  }

  if (lowerMessage.includes('revenue') || lowerMessage.includes('commercial') || lowerMessage.includes('co')) {
    return `I can provide insights on commercial operations including:

• Quote-to-cash tracking
• Revenue recognition schedules
• Invoice and payment status
• Subscription management
• Order fulfillment metrics

What commercial data would you like me to analyze?`;
  }

  if (lowerMessage.includes('sales') || lowerMessage.includes('expansion') || lowerMessage.includes('se')) {
    return `I can help with sales expansion analysis:

• Expansion opportunities
• Competitive intelligence
• Pipeline tracking
• Success stories and best practices
• Lookalike customer analysis

What sales expansion information do you need?`;
  }

  if (lowerMessage.includes('health score')) {
    return `Based on the current data:

• Average health score across all accounts: 89.8
• 20 accounts are Thriving (90-100)
• 30 accounts are Healthy (75-89)
• Top performing customer: Global Financial Partners (92)
• Requires attention: Advanced Manufacturing Co (85)

Would you like me to dive deeper into any specific account?`;
  }

  if (lowerMessage.includes('product')) {
    return `Here's an overview of product penetration:

• Duo (Security): 94% penetration
• Meraki (Networking): 72% penetration
• Umbrella (Security): 48% penetration
• ThousandEyes (Monitoring): 20% penetration
• Splunk (Analytics): 8% penetration

Which product would you like to explore further?`;
  }

  if (lowerMessage.includes('arr') || lowerMessage.includes('annual recurring revenue')) {
    return `Current ARR insights:

• Total ARR: $8,482,756
• Highest ARR account: Global Financial Partners ($3,669,528)
• Average ARR per account: $1,696,551
• New business contribution: $2,800,000
• Expansion revenue: $5,230,000

Would you like a breakdown by customer tier or segment?`;
  }

  if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
    return `I'm your AI assistant for data analysis. I can help you with:

**Customer Success (CSM)**
• Health scores and trends
• Product adoption
• Churn prediction
• Expansion readiness

**Commercial Operations (CO)**
• Revenue tracking
• Quote and order status
• Invoice management
• Subscription analytics

**Sales Expansion (SE)**
• Opportunity identification
• Competitive insights
• Pipeline analysis
• Success stories

Just ask me a question about any of these areas!`;
  }

  // Default response for unrecognized queries
  return `I understand you're asking about: "${message}"

I'm here to help you analyze your customer data, commercial operations, and sales expansion opportunities. Could you please rephrase your question or ask about:

• Customer health and success metrics
• Revenue and commercial operations
• Sales expansion opportunities
• Product adoption and performance

Or type "help" to see what I can do!`;
}

