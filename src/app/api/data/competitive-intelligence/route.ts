import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Simplified response for build compatibility
    const data = {
      competitors: [],
      analysis: "Competitive intelligence data"
    };
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading competitive intelligence:', error);
    return NextResponse.json({ error: 'Failed to load competitive intelligence' }, { status: 500 });
  }
}
