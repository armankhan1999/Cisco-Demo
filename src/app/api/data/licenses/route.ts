import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src', 'source_data', 'master-data', 'licenses.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading licenses:', error);
    return NextResponse.json({ error: 'Failed to load licenses' }, { status: 500 });
  }
}
