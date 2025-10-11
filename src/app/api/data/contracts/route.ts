import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Simplified response for build compatibility
    const data = {
      contracts: [],
      summary: "Contract data"
    };
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading contracts:', error);
    return NextResponse.json({ error: 'Failed to load contracts' }, { status: 500 });
  }
}
