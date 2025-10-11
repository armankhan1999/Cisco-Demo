import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customerId = params.id;
    
    const dataPath = join(process.cwd(), 'src', 'source_data');
    
    // Load all 6 JSON files in parallel
    const [accountsData, customersData, contractsData, stakeholdersData, usersData, licensesData] = await Promise.all([
      JSON.parse(readFileSync(join(dataPath, 'accounts.json'), 'utf-8')),
      JSON.parse(readFileSync(join(dataPath, 'master-data', 'customers.json'), 'utf-8')),
      JSON.parse(readFileSync(join(dataPath, 'master-data', 'contracts.json'), 'utf-8')),
      JSON.parse(readFileSync(join(dataPath, 'master-data', 'stakeholders.json'), 'utf-8')),
      JSON.parse(readFileSync(join(dataPath, 'master-data', 'users.json'), 'utf-8')),
      JSON.parse(readFileSync(join(dataPath, 'master-data', 'licenses.json'), 'utf-8'))
    ]);
    
    // Find account record
    const accountRecord = accountsData.find((record: any) => record.account.id === customerId);
    if (!accountRecord) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }
    
    // Find customer master record
    const customer = customersData.find((c: any) => c.customer_id === customerId);
    
    // Find contract
    const contract = contractsData.find((c: any) => c.customer_id === customerId);
    
    // Filter stakeholders by customer_id
    const stakeholders = stakeholdersData.filter((s: any) => {
      // Check if stakeholder has customer_id field or account_id field
      return s.customer_id === customerId || s.account_id === customerId;
    });
    
    // Filter users by customer_id
    const users = usersData.filter((u: any) => u.customer_id === customerId || u.account_id === customerId);
    
    // Filter licenses by customer_id
    const licenses = licensesData.filter((l: any) => l.customer_id === customerId);
    
    // Calculate active users from licenses
    const activeUsers = licenses.reduce((sum: number, license: any) => {
      const licenseActiveUsers = Math.round((license.license_count || 0) * (license.utilization || 0) / 100);
      return sum + licenseActiveUsers;
    }, 0);
    
    // Get latest health score from timeline
    const latestTimeline = accountRecord.timeline && accountRecord.timeline.length > 0
      ? accountRecord.timeline[accountRecord.timeline.length - 1]
      : null;
    
    const healthScore = latestTimeline?.health_score || accountRecord.account.health_score || 0;
    
    // Get last 6 months of timeline for health history
    const healthTimeline = accountRecord.timeline ? accountRecord.timeline.slice(-6) : [];
    
    return NextResponse.json({
      success: true,
      data: {
        // Account info
        account: {
          id: accountRecord.account.id,
          name: accountRecord.account.name,
          tier: accountRecord.account.tier,
          industry: accountRecord.account.industry,
          arr: accountRecord.account.arr,
          csm_id: accountRecord.account.csm_id,
          created_date: accountRecord.account.created_date,
          geography: accountRecord.account.geography,
          health_score: healthScore,
          is_hero_account: accountRecord.account.is_hero_account,
          story_type: accountRecord.account.story_type
        },
        
        // Customer master data
        customer: customer || null,
        
        // Contract
        contract: contract || null,
        
        // Stakeholders (3-10 people)
        stakeholders: stakeholders.slice(0, 10),
        
        // Users (limit to first 10 for performance)
        users: users.slice(0, 10),
        totalUsers: users.length,
        
        // Licenses
        licenses: licenses,
        
        // Calculated metrics
        metrics: {
          arr: accountRecord.account.arr,
          activeUsers: activeUsers,
          productCount: licenses.length,
          healthScore: healthScore
        },
        
        // Health timeline (last 6 months)
        healthTimeline: healthTimeline,
        
        // Full timeline available
        fullTimeline: accountRecord.timeline
      }
    });
  } catch (error) {
    console.error('Error fetching customer profile:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
