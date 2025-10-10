# Master Data Requirements for Sales Expansion Dashboards

## Current Master Data Files
Located in: `c:/Users/Ateeqh Ur Rehman/Downloads/cisco/cisco-main/data/synthetic/master-data/`

### 1. customers.json ✅ EXISTS
**Purpose**: Customer account information and opportunities
**Current Structure**:
```json
{
  "customer_id": "CUST_000001",
  "customer_name": "Advanced Manufacturing Co",
  "industry": "Manufacturing", 
  "tier": "Strategic|Enterprise|Commercial|SMB",
  "arr": 1500000,
  "story_type": "existing_customer|new_opportunity",
  "stage": "Negotiation|Proposal|Qualification|Prospecting",
  "health_score": 85,
  "contract_start": "2023-01-15",
  "contract_end": "2025-01-15"
}
```

### 2. licenses.json ✅ EXISTS  
**Purpose**: Product licensing and usage data
**Current Structure**:
```json
{
  "license_id": "LIC_000001",
  "customer_id": "CUST_000001", 
  "product_family": "Duo|Meraki|Umbrella|Thousand Eyes|Splunk",
  "license_count": 500,
  "utilization": 75,
  "adoption_stage": "Pilot|Growing|Mature|Declining",
  "last_usage_date": "2024-10-01"
}
```

### 3. contracts.json ✅ EXISTS
**Purpose**: Contract terms and renewal information  
**Current Structure**:
```json
{
  "contract_id": "CONT_000001",
  "customer_id": "CUST_000001",
  "start_date": "2023-01-15", 
  "end_date": "2025-01-15",
  "auto_renew": true,
  "total_value": 1500000,
  "payment_terms": "Annual"
}
```

## MISSING DATA FILES - NEED TO BE CREATED

### 4. product-roadmap.json ❌ MISSING
**Purpose**: Strategic product initiatives and roadmap
**Required Structure**:
```json
[
  {
    "initiative_id": "INIT_001",
    "initiative": "Zero Trust Network Access 2.0",
    "product": "Duo",
    "priority": "critical|high|medium|low",
    "timeline": "Q1 2025",
    "investment_level": 15000000,
    "expected_roi": 250,
    "market_impact": "Strengthens position in enterprise security market",
    "customer_demand": 92,
    "competitive_advantage": "First-to-market with AI-powered risk assessment",
    "risk_factors": ["Technical complexity", "Integration challenges"],
    "success_metrics": ["30% increase in enterprise deals", "25% improvement in time-to-value"]
  }
]
```

### 5. competitive-intelligence.json ❌ MISSING
**Purpose**: Competitor analysis and market positioning
**Required Structure**:
```json
[
  {
    "competitor": "Microsoft",
    "market_share": 28,
    "strengths": ["Ecosystem integration", "Enterprise relationships", "Bundling strategy"],
    "weaknesses": ["Complex licensing", "Security gaps", "Limited innovation"],
    "threat_level": "high|medium|low",
    "competing_products": ["Duo", "Umbrella"],
    "win_loss_ratio": 1.2,
    "pricing_strategy": "Aggressive bundling with Office 365",
    "recent_moves": ["Enhanced conditional access", "Zero Trust marketing push"],
    "counter_strategies": ["Emphasize security-first approach", "Highlight integration gaps"]
  }
]
```

### 6. market-segments.json ❌ MISSING
**Purpose**: Market segment analysis and performance
**Required Structure**:
```json
[
  {
    "segment": "Enterprise Security",
    "industries": ["Financial Services", "Healthcare", "Government"],
    "key_products": ["Duo", "Umbrella", "Splunk"],
    "win_rate": 78,
    "sales_cycle": 120,
    "competitive_threats": ["Microsoft", "Okta", "CrowdStrike"],
    "strategic_priority": "high|medium|low",
    "growth_opportunity": 45
  }
]
```

### 7. sales-performance.json ❌ MISSING
**Purpose**: Sales performance metrics and benchmarks
**Required Structure**:
```json
{
  "pipeline_metrics": {
    "total_pipeline_value": 8500000,
    "weighted_pipeline_value": 2800000,
    "conversion_rate": 33,
    "forecast_accuracy": 87,
    "average_deal_size": 1060000,
    "sales_velocity": 89
  },
  "regional_performance": [
    {
      "region": "North America",
      "pipeline_value": 4800000,
      "conversion_rate": 34,
      "deal_count": 28,
      "growth": 15
    }
  ],
  "quarterly_trends": [
    {
      "quarter": "Q4 2024",
      "pipeline_value": 8500000,
      "closed_value": 2800000,
      "conversion_rate": 33
    }
  ]
}
```

### 8. product-performance.json ❌ MISSING
**Purpose**: Product portfolio performance metrics
**Required Structure**:
```json
[
  {
    "product": "Duo",
    "total_customers": 42,
    "total_arr": 2100000,
    "average_arr": 50000,
    "market_penetration": 84,
    "growth_rate": 25,
    "churn_rate": 3,
    "health_score": 88,
    "competitive_position": "leader|challenger|follower",
    "strategic_importance": "high|medium|low",
    "customer_satisfaction": 89,
    "usage_metrics": {
      "average_utilization": 78,
      "adoption_rate": 85,
      "feature_usage": 72
    }
  }
]
```

## DASHBOARD DATA MAPPING

### Command Center Dashboard
- **Data Sources**: customers.json, licenses.json, contracts.json
- **Missing**: None (uses existing master data)

### Multi-Product Intelligence  
- **Data Sources**: customers.json, licenses.json
- **Missing**: None (calculates penetration matrix from existing data)

### Account Expansion Hub
- **Data Sources**: customers.json, licenses.json, contracts.json  
- **Missing**: None (generates recommendations from existing data)

### Pipeline & Performance Analytics
- **Data Sources**: customers.json, sales-performance.json
- **Missing**: sales-performance.json ❌

### Product Strategy Center
- **Data Sources**: customers.json, licenses.json, product-performance.json, competitive-intelligence.json, product-roadmap.json, market-segments.json
- **Missing**: product-performance.json ❌, competitive-intelligence.json ❌, product-roadmap.json ❌, market-segments.json ❌

## PRIORITY FOR CREATION

1. **HIGH PRIORITY**: 
   - sales-performance.json (needed for Pipeline Analytics)
   - product-performance.json (needed for Product Strategy)

2. **MEDIUM PRIORITY**:
   - competitive-intelligence.json (enhances Product Strategy)
   - market-segments.json (enhances Product Strategy)

3. **LOW PRIORITY**:
   - product-roadmap.json (nice-to-have for Product Strategy)

## IMPLEMENTATION NOTES

- All services should read from master data files in `/data/synthetic/master-data/`
- No hardcoded or synthetic data generation in services
- Services should handle missing data gracefully with fallbacks
- Data consistency across all dashboards is critical
- Use TypeScript interfaces to ensure data structure compliance
