import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';

interface ChatLookalikeRequest {
  message: string;
  context: {
    totalAccounts: number;
    totalExpectedArr: number;
    avgSimilarity: number;
    topAccounts: Array<{
      name: string;
      currentArr: number;
      expectedArr: number;
      similarity: number;
      topProduct: string;
      currentProducts: number;
      potentialProducts: number;
    }>;
  };
}

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('sk-')
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

// Load context file
let contextContent = '';
try {
  const contextPath = path.join(process.cwd(), 'src', 'data', 'context-new.md');
  contextContent = fs.readFileSync(contextPath, 'utf-8');
} catch (error) {
  console.error('Error loading context-new.md:', error);
  contextContent = 'Context file not available';
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatLookalikeRequest = await request.json();
    const { message, context } = body;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    console.log(`📊 Lookalike Chat - Received message: "${message}"`);

    if (!openai) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    // Prepare the data context for the AI
    const dataContext = `
You are analyzing Lookalike Customer Analysis data for expansion opportunities.

**Current Data Summary:**
- Total Accounts Analyzed: ${context.totalAccounts}
- Total Expected ARR Opportunity: $${(context.totalExpectedArr / 1000000).toFixed(1)}M
- Average Similarity Score: ${context.avgSimilarity.toFixed(1)}%

**Top 10 Accounts with Highest Potential:**
${context.topAccounts.map((account, idx) => `
${idx + 1}. ${account.name}
   - Current ARR: $${(account.currentArr / 1000).toFixed(0)}K
   - Expected ARR Opportunity: $${(account.expectedArr / 1000).toFixed(0)}K
   - Similarity Score: ${account.similarity.toFixed(1)}%
   - Top Recommended Product: ${account.topProduct}
   - Current Products: ${account.currentProducts}
   - Potential Products: ${account.potentialProducts}
`).join('\n')}
`;

    const systemPrompt = `You are a business intelligence assistant analyzing lookalike customer data for expansion opportunities at Cisco.

${dataContext}

**Complete System Context and Methodology:**

${contextContent}

**Your Role:**
You are an expert data analyst helping sales and account teams understand expansion opportunities. You have access to:
1. Complete customer profiles and ARR data
2. Similarity scoring methodology and formulas
3. Potential ARR calculations for each customer
4. Product catalog and pricing information
5. Top similar companies for each customer

**Instructions:**
- Reference specific customer names, ARR values, and similarity scores from the data
- When explaining calculations, reference the formulas from the context (e.g., similarity scoring methodology)
- Provide concrete, actionable recommendations
- Explain what the data means in business terms
- Use bullet points for clarity when listing multiple items
- Be direct and professional
- Always cite specific numbers and percentages
- When discussing similarity scores, explain what they mean (e.g., "79% similar means strong alignment in company profile, product portfolio, and behavior")

**When answering:**
- For similarity questions: Reference Section 2 (Similarity Matrix Methodology) with specific weightages
- For ARR opportunity questions: Reference Section 3 (Potential ARR Analysis) and show calculations
- For product recommendations: Reference the product catalog and explain why specific products are recommended
- For specific companies: Look up their actual data from the context and provide precise numbers

Always ground your answers in the actual data and methodology provided in the context.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const response = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';

    console.log('✅ Lookalike Chat - Response generated successfully');

    return NextResponse.json({
      response,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    const err = error as Error;
    console.error('❌ Error in lookalike chat API:', err);
    return NextResponse.json(
      {
        error: 'Failed to process chat message',
        details: err.message
      },
      { status: 500 }
    );
  }
}
