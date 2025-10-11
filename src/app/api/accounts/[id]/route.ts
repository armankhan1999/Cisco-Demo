import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const accountId = params.id;
    
    // Read accounts.json
    const accountsPath = join(process.cwd(), 'src', 'source_data', 'accounts.json');
    const accountsData = JSON.parse(readFileSync(accountsPath, 'utf-8'));
    
    // Find the account by ID
    const accountRecord = accountsData.find((record: any) => record.account.id === accountId);
    
    if (!accountRecord) {
      return NextResponse.json(
        { success: false, error: 'Account not found' },
        { status: 404 }
      );
    }
    
    // Calculate latest health score from timeline
    const latestTimeline = accountRecord.timeline && accountRecord.timeline.length > 0
      ? accountRecord.timeline[accountRecord.timeline.length - 1]
      : null;
    
    const healthScore = latestTimeline?.health_score || accountRecord.account.health_score || 0;
    
    // Determine risk level based on health score
    let riskLevel = 'Low';
    if (healthScore < 60) riskLevel = 'High';
    else if (healthScore < 75) riskLevel = 'Medium';
    
    return NextResponse.json({
      success: true,
      data: {
        id: accountRecord.account.id,
        name: accountRecord.account.name,
        tier: accountRecord.account.tier,
        industry: accountRecord.account.industry,
        arr: accountRecord.account.arr,
        csm_id: accountRecord.account.csm_id,
        story_type: accountRecord.account.story_type,
        is_hero_account: accountRecord.account.is_hero_account,
        created_date: accountRecord.account.created_date,
        geography: accountRecord.account.geography,
        hero_features: accountRecord.account.hero_features,
        health_score: healthScore,
        risk_level: riskLevel,
        timeline: accountRecord.timeline
      }
    });
  } catch (error) {
    console.error('Error fetching account:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
