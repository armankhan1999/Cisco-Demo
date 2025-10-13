- # Lookalike Score Calculation 

  ------

  ## Overall Formula

  | Component                   | Weight   | Data Source                                   | Why This Weight?                             |
  | --------------------------- | -------- | --------------------------------------------- | -------------------------------------------- |
  | **Company Profile Match**   | 25%      | `accounts` table                              | Foundation for comparison                    |
  | **Product Portfolio Match** | **50%**  | `licenses` table                              | **Strongest predictor of expansion success** |
  | **Behavior & Usage Match**  | 25%      | `accounts`, `licenses`, `utilization_history` | Validates engagement patterns                |
  | **TOTAL**                   | **100%** | -                                             | Combined similarity score                    |

  ------

  ## Component 1: Company Profile Match (25%)

  | Factor                 | Weight within Component | Data Column(s)              | Calculation Logic                                            | Score Range |
  | ---------------------- | ----------------------- | --------------------------- | ------------------------------------------------------------ | ----------- |
  | **Industry Match**     | 40%                     | `accounts.industry`         | Exact match = 100<br>Different = 30                          | 30-100      |
  | **Tier Match**         | 30%                     | `accounts.tier`             | Same tier = 100<br>Adjacent tier (e.g., Enterprise↔Strategic) = 80<br>Different = 30 | 30-100      |
  | **ARR Size Proximity** | 20%                     | `accounts.arr`              | Formula: 100 - \|log(ARR₁) - log(ARR₂)\| × 15<br>(Logarithmic scale for fair comparison) | 0-100       |
  | **Geographic Match**   | 10%                     | `accounts.geography.region` | Same region = 100<br>Different region = 40                   | 40-100      |

  

  ------

  ## Component 2: Product Portfolio Match (50%) ⭐ MOST IMPORTANT

  | Factor                           | Weight within Component | Data Column(s)                 | Calculation Logic                                            | Score Range |
  | -------------------------------- | ----------------------- | ------------------------------ | ------------------------------------------------------------ | ----------- |
  | **Product Overlap (Jaccard)**    | 50%                     | `licenses.product_family`      | Intersection ÷ Union × 100<br>Example: {Meraki, Duo} vs {Meraki, Duo, Umbrella}<br>= 2/3 = 67 | 0-100       |
  | **Portfolio Size Similarity**    | 20%                     | `COUNT(licenses)` per customer | Formula: 100 - \|count₁ - count₂\| × 10<br>Max penalty: 100 points | 0-100       |
  | **Utilization Similarity**       | 20%                     | `licenses.utilization` (avg)   | Formula: 100 - \|util₁ - util₂\|<br>Example: \|92% - 88%\| = 4 → Score 96 | 0-100       |
  | **Adoption Maturity Similarity** | 10%                     | `licenses.adoption_stage`      | Mature=100, Growth=75, Early=50, Trial=25<br>Formula: 100 - \|maturity₁ - maturity₂\| ÷ 2 | 0-100       |

  ------

  ## Component 3: Behavior & Usage Match (25%)

  | Factor                      | Weight within Component | Data Column(s)                                | Calculation Logic                                            | Score Range |
  | --------------------------- | ----------------------- | --------------------------------------------- | ------------------------------------------------------------ | ----------- |
  | **Health Score Similarity** | 30%                     | `accounts.health_score`                       | Formula: 100 - \|health₁ - health₂\|<br>Example: \|85 - 82\| = 3 → Score 97 | 0-100       |
  | **Risk Profile Similarity** | 20%                     | `accounts.renewal_risk_score`                 | Formula: 100 - \|risk₁ - risk₂\|<br>Example: \|15 - 18\| = 3 → Score 97 | 0-100       |
  | **Utilization Level**       | 25%                     | `licenses.utilization` (avg)                  | Formula: 100 - \|util₁ - util₂\|<br>Same as product component | 0-100       |
  | **Growth Velocity**         | 15%                     | `utilization_history.month_over_month_change` | Formula: 100 - \|change₁ - change₂\| × 10<br>Example: \|+3.2% - +2.8%\| = 0.4 → Score 96 | 0-100       |
  | **Trend Direction**         | 10%                     | `utilization_history.utilization_trend`       | Both "increasing" = 100<br>Mixed = 70<br>Both "decreasing" = 100 (similar)<br>Opposite = 40 | 40-100      |

  

  ------

  ## Final Score Composition

  | Customer Pair         | Company Profile (25%)  | Product Portfolio (50%) | Behavior (25%)         | **Overall Score** | **Classification** |
  | --------------------- | ---------------------- | ----------------------- | ---------------------- | ----------------- | ------------------ |
  | A ↔ B (Example Above) | 99.7 × 0.25 = **24.9** | 80.7 × 0.50 = **40.4**  | 96.9 × 0.25 = **24.2** | **89.5**          | **Highly Similar** |
  | Different Industry    | 45.0 × 0.25 = 11.3     | 80.7 × 0.50 = 40.4      | 96.9 × 0.25 = 24.2     | 75.9              | Moderately Similar |
  | No Product Overlap    | 99.7 × 0.25 = 24.9     | 15.0 × 0.50 = 7.5       | 96.9 × 0.25 = 24.2     | 56.6              | Not Similar        |

  ------

  ## Score Interpretation Guide

  | Score Range  | Classification     | Confidence Level | Use Case                   | Typical Characteristics                       |
  | ------------ | ------------------ | ---------------- | -------------------------- | --------------------------------------------- |
  | **90-100**   | Extremely Similar  | ✓✓✓ Very High    | Primary reference accounts | Near-identical profiles across all dimensions |
  | **80-89**    | Highly Similar     | ✓✓ High          | Strong lookalike patterns  | Shared products + similar behaviors           |
  | **70-79**    | Moderately Similar | ✓ Medium         | Pattern validation         | Some commonalities, verify fit                |
  | **60-69**    | Somewhat Similar   | ⚠ Low            | Use with caution           | Weak signals, need additional data            |
  | **Below 60** | Not Similar        | ✗ Insufficient   | Not recommended            | Too different for meaningful comparison       |

  **Key Dependencies**

  * data quality and availability

  

  ## Key Takeaways

  1. **Product Portfolio is King (50% weight)** - Customers with overlapping products are most predictive
  2. **Industry matters but isn't everything** - A different industry only costs 7 points (out of 100)
  3. **Minimum threshold of 70** - Below this, similarities are too weak for reliable predictions
  4. **All scores recalculated nightly** - Always reflects most current customer data
  5. **Transparent & explainable** - Every score can be broken down into its components

  

  ------

  ## Example: Complete Calculation

  ### Customer A: TechCorp Industries

  - Industry: Technology | Tier: Enterprise | ARR: $1,522,871 | Region: Americas
  - Products: Meraki (95% util, Mature), Duo (92% util, Mature)
  - Health: 95 | Risk: 15 | Avg Util: 93.5% | MoM Change: +3.5% | Trend: Increasing

  ### Customer B: GlobalHealth Inc

  - Industry: Healthcare | Tier: Enterprise | ARR: $1,285,000 | Region: Americas
  - Products: Meraki (88% util, Mature), Duo (85% util, Mature), Umbrella (82% util, Growth)
  - Health: 88 | Risk: 22 | Avg Util: 85% | MoM Change: +2.8% | Trend: Increasing

  ### Detailed Calculation:

  | Component                   | Sub-Factor      | Customer A    | Customer B              | Calculation       | Score    | Weight  | Contribution |
  | --------------------------- | --------------- | ------------- | ----------------------- | ----------------- | -------- | ------- | ------------ |
  | **Company Profile**         |                 |               |                         |                   |          | **25%** |              |
  |                             | Industry        | Technology    | Healthcare              | Different = 30    | 30       | 40%     | 3.0          |
  |                             | Tier            | Enterprise    | Enterprise              | Exact = 100       | 100      | 30%     | 7.5          |
  |                             | ARR             | $1,522,871    | $1,285,000              | log diff = 0.073  | 98.9     | 20%     | 4.95         |
  |                             | Geography       | Americas      | Americas                | Exact = 100       | 100      | 10%     | 2.5          |
  |                             |                 |               |                         | **Subtotal**      | **76.2** |         | **17.9**     |
  | **Product Portfolio**       |                 |               |                         |                   |          | **50%** |              |
  |                             | Product Overlap | {Meraki, Duo} | {Meraki, Duo, Umbrella} | 2/3 = 67          | 67       | 50%     | 16.8         |
  |                             | Portfolio Size  | 2 products    | 3 products              | \|2-3\| = 1 → 90  | 90       | 20%     | 4.5          |
  |                             | Utilization     | 93.5%         | 85%                     | \|93.5-85\| = 8.5 | 91.5     | 20%     | 4.6          |
  |                             | Maturity        | Mature avg    | Mature/Growth           | ~92 vs ~88        | 96       | 10%     | 2.4          |
  |                             |                 |               |                         | **Subtotal**      | **78.6** |         | **28.3**     |
  | **Behavior**                |                 |               |                         |                   |          | **25%** |              |
  |                             | Health          | 95            | 88                      | \|95-88\| = 7     | 93       | 30%     | 7.0          |
  |                             | Risk            | 15            | 22                      | \|15-22\| = 7     | 93       | 20%     | 4.7          |
  |                             | Utilization     | 93.5%         | 85%                     | \|93.5-85\| = 8.5 | 91.5     | 25%     | 5.7          |
  |                             | Velocity        | +3.5%         | +2.8%                   | \|3.5-2.8\| = 0.7 | 93       | 15%     | 3.5          |
  |                             | Trend           | Increasing    | Increasing              | Both same = 100   | 100      | 10%     | 2.5          |
  |                             |                 |               |                         | **Subtotal**      | **93.6** |         | **23.4**     |
  |                             |                 |               |                         |                   |          |         |              |
  | **OVERALL LOOKALIKE SCORE** |                 |               |                         |                   |          |         | **69.6**     |

  ### Result Interpretation:

  **Score: 69.6 → Classification: "Somewhat Similar" (Below 70 threshold)**

  **Why the score is lower:**

  - ✗ Different industries (Technology vs Healthcare) significantly impacts Company Profile
  - ✓ Strong product overlap (both have Meraki + Duo)
  - ✓ Similar behavioral patterns (both healthy, growing)

  **Business Insight:** Despite different industries, the strong product portfolio overlap (2 of 3 products shared) and similar usage behaviors suggest potential cross-industry patterns worth exploring, but verify industry-specific requirements before making recommendations.

  ------

  1. 