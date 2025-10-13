# Complete Lookalike Analysis System Context

## Table of Contents
1. [Overview](#overview)
2. [Complete Data Tables](#complete-data-tables)
3. [Similarity Matrix Methodology](#similarity-matrix-methodology)
4. [Potential ARR Analysis Methodology](#potential-arr-analysis-methodology)
5. [Complete Similarity Matrix](#complete-similarity-matrix)
6. [Complete Potential ARR Analysis](#complete-potential-arr-analysis)

---

## Overview

This is a comprehensive customer intelligence system that:
- Analyzes 45 customers across various industries
- Calculates similarity scores between companies using AI embeddings and statistical methods
- Identifies cross-sell opportunities based on lookalike analysis
- Estimates potential revenue (ARR) for each company

**System Components:**
- **5 Products**: Meraki, Duo, Umbrella, ThousandEyes, Splunk
- **112 Subscriptions**: Customer-product relationships
- **50x50 Similarity Matrix**: Company similarity scores (0-100)
- **Potential ARR Analysis**: Revenue opportunity identification

---

## Complete Data Tables

### 1. T_BRZ_CUSTOMERS.csv (45 Customers - Original Data)

```csv
CUSTOMER_ID,CUSTOMER_NAME,TIER,INDUSTRY,ARR,CSM_ID,STORY_TYPE,IS_HERO_ACCOUNT,CREATED_DATE,THEATER,REGION,COUNTRY,CITY,TIMEZONE,USER_COUNT,PRODUCT_COUNT,LAST_UPDATED,STATE
CUST_000001,TechCorp Industries,Enterprise,Technology,1522871,CSM_001,expansion_success,true,2023-09-14 16:02:56.918,EMEA,Central,Switzerland,Washington,EST,64,3,2025-10-02 09:24:39.154,
CUST_000002,MedSecure Systems,Strategic,Healthcare,3627162,CSM_001,security_focused_growth,true,2023-08-06 10:46:59.157,EMEA,Central,Switzerland,Temecula,PST,107,2,2025-10-02 09:24:39.154,
CUST_000003,Global Financial Partners,Enterprise,Financial Services,804011,CSM_001,digital_transformation,true,2023-09-03 03:42:27.235,AMER,West,United States,Hacienda Heights,PST,51,3,2025-10-02 09:24:39.154,California
CUST_000004,Advanced Manufacturing Co,Commercial,Manufacturing,140615,CSM_003,expansion_success,true,2023-06-18 09:48:28.690,AMER,Central,United States,Peytonmouth,JST,37,3,2025-10-02 09:24:39.154,Texas
CUST_000005,InnovateTech Solutions,Commercial,Technology,496079,CSM_001,startup_scaling,true,2023-03-16 13:17:29.163,EMEA,South,France,Odessaview,PST,29,2,2025-10-02 09:24:39.154,
CUST_000006,Harber LLC,Enterprise,Energy,747423,CSM_001,enterprise_modernization,false,2023-09-13 04:51:22.808,AMER,Central,United States,Conroyview,JST,84,3,2025-10-02 09:24:39.154,Texas
CUST_000007,"Baumbach, Dietrich and Mueller",Enterprise,Education,1091244,CSM_001,security_focused_growth,false,2023-08-09 02:33:33.301,APAC,North,Japan,Henrifield,CET,79,2,2025-10-02 09:24:39.154,
CUST_000008,Swaniawski Inc,Enterprise,Education,1456970,CSM_002,cost_optimization,false,2023-12-30 10:59:37.236,EMEA,South,France,Fort Arturostead,EST,83,2,2025-10-02 09:24:39.154,
CUST_000009,Quality Corporation,Enterprise,Manufacturing,1004742,CSM_003,expansion_success,false,2023-10-24 14:38:38.031,AMER,West,United States,Boyleview,EST,62,3,2025-10-02 09:24:39.154,California
CUST_000010,Block - Toy,Enterprise,Education,1797331,CSM_001,digital_transformation,false,2023-09-29 04:41:35.654,AMER,West,United States,Maxwellstad,JST,62,3,2025-10-02 09:24:39.154,California
CUST_000011,Cyber Systems,Enterprise,Technology,1209071,CSM_001,security_focused_growth,false,2023-10-31 04:33:07.719,EMEA,South,France,Conroyhaven,JST,56,2,2025-10-02 09:24:39.154,
CUST_000012,Medical Group,Enterprise,Healthcare,536311,CSM_002,acquisition_integration,false,2023-07-16 17:32:36.774,EMEA,North,United Kingdom,North Jordaneworth,CET,51,2,2025-10-02 09:24:39.154,
CUST_000013,Clinical Associates,Enterprise,Healthcare,1601116,CSM_002,enterprise_modernization,false,2023-09-18 02:40:56.956,APAC,Southeast,India,Gulgowskibury,PST,95,3,2025-10-02 09:24:39.154,
CUST_000014,"Ondricka, Waters and Wilderman",Enterprise,Energy,1211950,CSM_002,startup_scaling,false,2023-09-17 22:39:17.276,EMEA,South,France,South Esperanza,PST,72,2,2025-10-02 09:24:39.154,
CUST_000015,Investment Management,Enterprise,Financial Services,811945,CSM_001,security_focused_growth,false,2023-03-26 02:00:34.503,AMER,East,United States,Sydneeton,EST,57,2,2025-10-02 09:24:39.154,New York
CUST_000016,Capital Management,Commercial,Financial Services,439445,CSM_001,digital_transformation,false,2023-08-10 00:00:56.435,AMER,West,United States,Fort Lexi,PST,21,3,2025-10-02 09:24:39.154,California
CUST_000017,Bode - Mayer,Commercial,Retail,323711,CSM_003,enterprise_modernization,false,2023-06-18 16:09:36.943,EMEA,Central,Switzerland,North Jarretttown,PST,28,3,2025-10-02 09:24:39.154,
CUST_000018,"Smith, Ratke and Ankunding",Commercial,Government,407999,CSM_002,startup_scaling,false,2023-12-06 06:57:42.110,AMER,Central,United States,North Brittanystead,PST,32,2,2025-10-02 09:24:39.154,Texas
CUST_000019,Pagac - Muller,Commercial,Government,131258,CSM_002,startup_scaling,false,2023-05-03 22:23:48.298,EMEA,North,United Kingdom,Emeliehaven,JST,40,2,2025-10-02 09:24:39.154,
CUST_000020,Credit Advisors,Commercial,Financial Services,137516,CSM_001,cost_optimization,false,2023-10-30 03:08:43.158,EMEA,Central,Switzerland,Hillardborough,EST,29,2,2025-10-02 09:24:39.154,
CUST_000021,Data Innovations,Commercial,Technology,331717,CSM_001,acquisition_integration,false,2023-03-06 21:58:51.798,AMER,Central,United States,Minneapolis,PST,49,2,2025-10-02 09:24:39.154,Texas
CUST_000022,Kris - Dibbert,Commercial,Energy,215609,CSM_001,expansion_success,false,2023-08-07 13:30:17.091,APAC,North,Japan,Josuetown,EST,23,3,2025-10-02 09:24:39.154,
CUST_000023,Smith LLC,Commercial,Government,450570,CSM_002,expansion_success,false,2023-07-09 16:43:01.382,EMEA,Central,Switzerland,South Leola,JST,27,3,2025-10-02 09:24:39.154,
CUST_000024,Schultz - Collins,Commercial,Retail,464096,CSM_003,startup_scaling,false,2023-05-08 06:46:31.293,APAC,South,Australia,Adrienstad,JST,41,2,2025-10-02 09:24:39.154,
CUST_000025,"Herzog, Bode and Frami",Commercial,Education,343375,CSM_001,security_focused_growth,false,2023-05-04 13:08:30.920,APAC,North,Japan,Rauhaven,CET,33,2,2025-10-02 09:24:39.154,
CUST_000026,Credit Group,Commercial,Financial Services,441614,CSM_001,security_focused_growth,false,2023-10-14 05:11:33.335,AMER,West,United States,Lake Danatown,PST,20,2,2025-10-02 09:24:39.154,California
CUST_000027,"Gutmann, King and Gorczany",Commercial,Education,474193,CSM_003,acquisition_integration,false,2023-12-19 12:05:41.819,AMER,West,United States,Hauckstead,EST,17,2,2025-10-02 09:24:39.154,California
CUST_000028,Medical Alliance,Commercial,Healthcare,181551,CSM_002,expansion_success,false,2023-08-09 20:43:07.149,APAC,South,Australia,Port Marcusworth,CET,23,3,2025-10-02 09:24:39.154,
CUST_000029,Medical Systems,Commercial,Healthcare,215678,CSM_002,compliance_driven,false,2023-05-09 18:39:51.715,AMER,West,United States,Herminahaven,JST,48,3,2025-10-02 09:24:39.154,California
CUST_000030,Bashirian Inc,Commercial,Government,88638,CSM_002,security_focused_growth,false,2023-02-10 11:10:06.925,AMER,East,United States,Hutchinson,JST,47,2,2025-10-02 09:24:39.154,New York
CUST_000031,Credit Partners,Commercial,Financial Services,202633,CSM_001,expansion_success,false,2023-10-30 12:08:00.383,EMEA,Central,Switzerland,Larsonchester,EST,28,3,2025-10-02 09:24:39.154,
CUST_000032,Wealth Group,Commercial,Financial Services,320768,CSM_001,compliance_driven,false,2023-05-17 00:13:03.233,AMER,Central,United States,Kesslerhaven,CET,38,3,2025-10-02 09:24:39.154,Texas
CUST_000033,Hansen LLC,Commercial,Energy,82833,CSM_003,acquisition_integration,false,2023-09-21 04:41:20.811,AMER,East,United States,Burlington,CET,50,2,2025-10-02 09:24:39.154,New York
CUST_000034,Cloud Solutions,Commercial,Technology,395737,CSM_001,compliance_driven,false,2023-05-19 00:52:44.499,AMER,East,United States,Jessiecester,PST,35,3,2025-10-02 09:24:39.154,New York
CUST_000035,Bruen - Adams,Commercial,Retail,152780,CSM_003,cost_optimization,false,2023-06-30 04:33:49.612,EMEA,Central,Switzerland,Fort Lauderdale,PST,45,2,2025-10-02 09:24:39.154,
CUST_000036,Trust Holdings,Commercial,Financial Services,51826,CSM_001,digital_transformation,false,2023-10-20 08:07:58.034,APAC,South,Australia,West Frida,JST,17,3,2025-10-02 09:24:39.154,
CUST_000037,Stokes and Sons,Commercial,Government,490470,CSM_002,digital_transformation,false,2023-09-30 10:21:14.059,EMEA,Central,Switzerland,Handfurt,JST,43,3,2025-10-02 09:24:39.154,
CUST_000038,Wealth Capital,Commercial,Financial Services,424729,CSM_001,security_focused_growth,false,2023-03-01 16:46:46.514,APAC,South,Australia,West Ismaelhaven,JST,39,2,2025-10-02 09:24:39.154,
CUST_000039,Mohr and Sons,Commercial,Education,396896,CSM_002,startup_scaling,false,2023-07-15 20:36:38.605,APAC,North,Japan,West Heber,CET,45,2,2025-10-02 09:24:39.154,
CUST_000040,Data Solutions,Commercial,Technology,119330,CSM_001,enterprise_modernization,false,2023-10-24 11:52:37.998,EMEA,Central,Switzerland,Sydnibury,JST,31,3,2025-10-02 09:24:39.154,
CUST_000041,"Collier, Bayer and Ward",Commercial,Education,80903,CSM_001,startup_scaling,false,2023-11-06 15:10:49.305,AMER,Central,United States,Vonbury,PST,41,2,2025-10-02 09:24:39.154,Texas
CUST_000042,"Mitchell, Batz and Pouros",Commercial,Retail,420242,CSM_003,startup_scaling,false,2023-09-06 00:47:36.416,EMEA,Central,Switzerland,Bradenborough,EST,49,2,2025-10-02 09:24:39.154,
CUST_000043,Cronin and Sons,SMB,Energy,10017,CSM_003,acquisition_integration,false,2023-11-18 07:39:07.991,AMER,West,United States,East Fausto,PST,5,2,2025-10-02 09:24:39.154,California
CUST_000044,Corwin LLC,SMB,Government,24362,CSM_002,security_focused_growth,false,2023-03-29 14:43:58.567,EMEA,North,United Kingdom,Ryanmouth,EST,11,2,2025-10-02 09:24:39.154,
CUST_000045,Goldner - Bartoletti,SMB,Government,22076,CSM_002,enterprise_modernization,false,2023-02-09 01:44:36.689,EMEA,North,United Kingdom,Lake Reynaville,EST,9,3,2025-10-02 09:24:39.154,
```

### 2. T_BRZ_PRODUCT.csv (5 Products)

```csv
PRODUCT_ID,PRODUCT_NAME,PRODUCT_FAMILY,PRODUCT_CATEGORY,DEPLOYMENT_MODEL,BASE_PRICE_PER_USER,TIER_AVAILABILITY
PROD_MERAKI,Meraki,Meraki,Networking,Cloud,150,"['Enterprise', 'Strategic', 'Commercial', 'SMB']"
PROD_DUO,Duo,Duo,Security,Cloud,50,"['Enterprise', 'Strategic', 'Commercial', 'SMB']"
PROD_UMBRELLA,Umbrella,Umbrella,Security,Cloud,120,"['Enterprise', 'Strategic', 'Commercial']"
PROD_THOUSAND_EYES,ThousandEyes,ThousandEyes,Analytics,SaaS,200,"['Enterprise', 'Strategic', 'Commercial']"
PROD_SPLUNK,Splunk,Splunk,Analytics,Hybrid,180,"['Enterprise', 'Strategic', 'Commercial', 'SMB']"
```

**Product Categories:**
- **Networking (1 product)**: Meraki - Cloud-based networking platform
- **Security (2 products)**: Duo (authentication), Umbrella (cloud security)  
- **Analytics (2 products)**: ThousandEyes (network intelligence), Splunk (data analytics)

### 3. T_BRZ_SUBSCRIPTION.csv (112 Subscriptions)

*Complete subscription data showing customer-product relationships extracted from T_BRZ_EXPANSION_OPPORTUNITIES.csv*

```csv
SUBSCRIPTION_ID,CUSTOMER_ID,CUSTOMER_NAME,PRODUCT_ID,PRODUCT_NAME,SUBSCRIPTION_ARR,SUBSCRIPTION_MRR,LICENSE_COUNT,PRICE_PER_LICENSE,SUBSCRIPTION_START_DATE,SUBSCRIPTION_STATUS,BILLING_FREQUENCY,CONTRACT_TERM_MONTHS,AUTO_RENEW,LAST_RENEWAL_DATE,NEXT_RENEWAL_DATE
SUB_000001,CUST_000001,TechCorp Industries,PROD_DUO,Duo,507623.67,42301.97,44,11536.9,2024-10-21,Active,annual,12,Yes,2025-08-16,2025-11-24
SUB_000002,CUST_000001,TechCorp Industries,PROD_MERAKI,Meraki,507623.67,42301.97,64,7931.62,2025-07-04,Active,quarterly,3,No,2025-08-18,2026-08-18
SUB_000003,CUST_000001,TechCorp Industries,PROD_UMBRELLA,Umbrella,507623.67,42301.97,44,11536.9,2025-08-28,Active,annual,12,Yes,2025-09-06,2025-12-29
SUB_000004,CUST_000002,MedSecure Systems,PROD_DUO,Duo,1209054.0,100754.5,74,16338.57,2024-11-30,Active,annual,12,Yes,2025-07-25,2026-10-10
SUB_000005,CUST_000002,MedSecure Systems,PROD_MERAKI,Meraki,1209054.0,100754.5,107,11299.57,2025-01-27,Active,annual,12,No,2025-04-16,2026-04-03
SUB_000006,CUST_000002,MedSecure Systems,PROD_UMBRELLA,Umbrella,1209054.0,100754.5,74,16338.57,2025-03-23,Active,annual,12,Yes,2025-07-04,2026-01-30
SUB_000007,CUST_000003,Global Financial Partners,PROD_DUO,Duo,268003.67,22333.64,35,7657.25,2025-07-28,Active,annual,12,Yes,2025-06-08,2025-12-31
SUB_000008,CUST_000003,Global Financial Partners,PROD_MERAKI,Meraki,268003.67,22333.64,51,5254.97,2024-07-27,Active,annual,12,No,2025-09-02,2026-07-05
SUB_000009,CUST_000003,Global Financial Partners,PROD_THOUSAND_EYES,ThousandEyes,268003.67,22333.64,51,5254.97,2025-08-04,Active,annual,12,Yes,2025-04-25,2026-04-11
SUB_000010,CUST_000004,Advanced Manufacturing Co,PROD_DUO,Duo,46871.67,3905.97,25,1874.87,2024-09-18,Active,quarterly,3,Yes,2025-08-27,2025-12-05
SUB_000011,CUST_000004,Advanced Manufacturing Co,PROD_MERAKI,Meraki,46871.67,3905.97,37,1266.8,2024-07-03,Active - Expansion,quarterly,3,No,2025-07-16,2026-01-02
SUB_000012,CUST_000004,Advanced Manufacturing Co,PROD_UMBRELLA,Umbrella,46871.67,3905.97,25,1874.87,2024-10-23,Active,quarterly,3,Yes,2025-06-12,2026-02-03
SUB_000013,CUST_000005,InnovateTech Solutions,PROD_DUO,Duo,165359.67,13779.97,20,8267.98,2024-10-05,Active,monthly,1,Yes,2025-07-07,2026-10-09
SUB_000014,CUST_000005,InnovateTech Solutions,PROD_SPLUNK,Splunk,165359.67,13779.97,29,5702.06,2024-12-14,Active - Expansion,quarterly,3,Yes,2025-07-13,2026-02-03
SUB_000015,CUST_000005,InnovateTech Solutions,PROD_UMBRELLA,Umbrella,165359.67,13779.97,20,8267.98,2024-04-25,Active,annual,12,Yes,2025-04-24,2026-03-04
SUB_000016,CUST_000006,Harber LLC,PROD_DUO,Duo,249141.0,20761.75,58,4295.53,2024-07-20,Active - Expansion,annual,12,Yes,2025-09-05,2026-04-22
SUB_000017,CUST_000006,Harber LLC,PROD_MERAKI,Meraki,249141.0,20761.75,84,2965.96,2025-05-28,Active,quarterly,3,No,2025-04-21,2026-04-22
SUB_000018,CUST_000006,Harber LLC,PROD_THOUSAND_EYES,ThousandEyes,249141.0,20761.75,84,2965.96,2025-02-23,Active,annual,12,Yes,2025-05-19,2026-01-24
SUB_000019,CUST_000007,"Baumbach, Dietrich and Mueller",PROD_DUO,Duo,545622.0,45468.5,55,9920.4,2024-08-28,Active,quarterly,3,No,2025-04-23,2026-08-14
SUB_000020,CUST_000007,"Baumbach, Dietrich and Mueller",PROD_UMBRELLA,Umbrella,545622.0,45468.5,55,9920.4,2024-06-11,Active,annual,12,Yes,2025-04-17,2026-06-04
SUB_000021,CUST_000008,Swaniawski Inc,PROD_MERAKI,Meraki,728485.0,60707.08,83,8776.93,2024-12-27,Active,annual,12,Yes,2025-05-10,2025-12-28
SUB_000022,CUST_000008,Swaniawski Inc,PROD_UMBRELLA,Umbrella,728485.0,60707.08,58,12560.09,2024-10-27,Active,annual,12,No,2025-08-04,2026-06-16
SUB_000023,CUST_000009,Quality Corporation,PROD_DUO,Duo,334914.0,27909.5,43,7788.7,2025-03-02,Active,quarterly,3,Yes,2025-05-17,2026-08-09
SUB_000024,CUST_000009,Quality Corporation,PROD_MERAKI,Meraki,334914.0,27909.5,62,5401.84,2024-09-30,Active,quarterly,3,Yes,2025-08-15,2026-08-13
SUB_000025,CUST_000009,Quality Corporation,PROD_UMBRELLA,Umbrella,334914.0,27909.5,43,7788.7,2025-07-18,Active,annual,12,Yes,2025-06-30,2026-06-22
SUB_000026,CUST_000010,Block - Toy,PROD_DUO,Duo,599110.33,49925.86,43,13932.8,2024-05-13,Active,quarterly,3,Yes,2025-07-08,2026-07-26
SUB_000027,CUST_000010,Block - Toy,PROD_MERAKI,Meraki,599110.33,49925.86,62,9663.07,2024-06-25,Active,quarterly,3,Yes,2025-06-29,2026-10-05
SUB_000028,CUST_000010,Block - Toy,PROD_THOUSAND_EYES,ThousandEyes,599110.33,49925.86,62,9663.07,2025-06-27,Active,quarterly,3,Yes,2025-06-10,2026-02-02
SUB_000029,CUST_000011,Cyber Systems,PROD_DUO,Duo,604535.5,50377.96,39,15500.91,2024-11-11,Active,annual,12,Yes,2025-06-23,2026-07-20
SUB_000030,CUST_000011,Cyber Systems,PROD_UMBRELLA,Umbrella,604535.5,50377.96,39,15500.91,2024-06-21,Active,annual,12,Yes,2025-06-27,2026-03-14
SUB_000031,CUST_000012,Medical Group,PROD_DUO,Duo,268155.5,22346.29,35,7661.59,2025-08-01,Active,annual,12,Yes,2025-05-12,2025-12-17
SUB_000032,CUST_000012,Medical Group,PROD_MERAKI,Meraki,268155.5,22346.29,51,5257.95,2024-10-11,Active,annual,12,No,2025-05-15,2026-08-20
SUB_000033,CUST_000013,Clinical Associates,PROD_DUO,Duo,533705.33,44475.44,66,8086.44,2024-05-08,Active,quarterly,3,Yes,2025-07-21,2026-08-15
SUB_000034,CUST_000013,Clinical Associates,PROD_MERAKI,Meraki,533705.33,44475.44,95,5617.95,2025-02-21,Active,annual,12,Yes,2025-06-10,2026-06-24
SUB_000035,CUST_000013,Clinical Associates,PROD_THOUSAND_EYES,ThousandEyes,533705.33,44475.44,95,5617.95,2025-05-10,Active,annual,12,Yes,2025-07-18,2025-12-14
SUB_000036,CUST_000014,"Ondricka, Waters and Wilderman",PROD_DUO,Duo,605975.0,50497.92,50,12119.5,2024-11-16,Active,quarterly,3,Yes,2025-07-19,2025-11-15
SUB_000037,CUST_000014,"Ondricka, Waters and Wilderman",PROD_MERAKI,Meraki,605975.0,50497.92,72,8416.32,2025-05-19,Active,annual,12,Yes,2025-08-27,2025-11-28
SUB_000038,CUST_000015,Investment Management,PROD_DUO,Duo,405972.5,33831.04,39,10409.55,2025-04-24,Active,annual,12,No,2025-05-12,2026-03-01
SUB_000039,CUST_000015,Investment Management,PROD_UMBRELLA,Umbrella,405972.5,33831.04,39,10409.55,2025-05-12,Active,annual,12,Yes,2025-05-15,2026-06-08
SUB_000040,CUST_000016,Capital Management,PROD_DUO,Duo,146481.67,12206.81,14,10462.98,2024-10-11,Active - Expansion,quarterly,3,No,2025-05-26,2026-05-12
SUB_000041,CUST_000016,Capital Management,PROD_MERAKI,Meraki,146481.67,12206.81,21,6975.32,2024-06-28,Active,annual,12,No,2025-08-31,2026-10-12
SUB_000042,CUST_000016,Capital Management,PROD_THOUSAND_EYES,ThousandEyes,146481.67,12206.81,21,6975.32,2024-09-06,Active,annual,12,Yes,2025-06-19,2026-01-06
SUB_000043,CUST_000017,Bode - Mayer,PROD_DUO,Duo,107903.67,8991.97,19,5679.14,2024-12-13,Active - Expansion,annual,12,Yes,2025-05-22,2026-01-22
SUB_000044,CUST_000017,Bode - Mayer,PROD_MERAKI,Meraki,107903.67,8991.97,28,3853.7,2025-01-20,Active - Expansion,monthly,1,Yes,2025-07-12,2025-12-20
SUB_000045,CUST_000017,Bode - Mayer,PROD_THOUSAND_EYES,ThousandEyes,107903.67,8991.97,28,3853.7,2025-08-19,Active,annual,12,Yes,2025-04-28,2025-11-19
SUB_000046,CUST_000018,"Smith, Ratke and Ankunding",PROD_DUO,Duo,203999.5,16999.96,22,9272.7,2025-02-17,Active,quarterly,3,Yes,2025-05-12,2026-07-16
SUB_000047,CUST_000018,"Smith, Ratke and Ankunding",PROD_MERAKI,Meraki,203999.5,16999.96,32,6374.98,2025-06-21,Active - Expansion,quarterly,3,No,2025-06-08,2025-11-13
SUB_000048,CUST_000019,Pagac - Muller,PROD_DUO,Duo,65629.0,5469.08,28,2343.89,2025-04-20,Active - Expansion,annual,12,Yes,2025-05-28,2026-08-23
SUB_000049,CUST_000019,Pagac - Muller,PROD_MERAKI,Meraki,65629.0,5469.08,40,1640.72,2025-04-15,Active,monthly,1,Yes,2025-07-20,2025-12-11
SUB_000050,CUST_000020,Credit Advisors,PROD_MERAKI,Meraki,68758.0,5729.83,29,2370.97,2024-08-27,Active,monthly,1,No,2025-06-25,2025-12-11
SUB_000051,CUST_000020,Credit Advisors,PROD_UMBRELLA,Umbrella,68758.0,5729.83,20,3437.9,2024-12-30,Active,monthly,1,Yes,2025-05-01,2026-01-31
SUB_000052,CUST_000021,Data Innovations,PROD_DUO,Duo,165858.5,13821.54,34,4878.19,2024-07-05,Active,annual,12,Yes,2025-07-28,2025-12-17
SUB_000053,CUST_000021,Data Innovations,PROD_MERAKI,Meraki,165858.5,13821.54,49,3384.87,2025-02-19,Active,monthly,1,Yes,2025-08-14,2026-08-30
SUB_000054,CUST_000022,Kris - Dibbert,PROD_DUO,Duo,71869.67,5989.14,16,4491.85,2024-10-31,Active,monthly,1,Yes,2025-08-24,2026-06-14
SUB_000055,CUST_000022,Kris - Dibbert,PROD_MERAKI,Meraki,71869.67,5989.14,23,3124.77,2024-05-23,Active,annual,12,Yes,2025-07-09,2026-02-24
SUB_000056,CUST_000022,Kris - Dibbert,PROD_UMBRELLA,Umbrella,71869.67,5989.14,16,4491.85,2025-02-23,Active,quarterly,3,Yes,2025-08-11,2026-10-08
SUB_000057,CUST_000023,Smith LLC,PROD_DUO,Duo,150190.0,12515.83,18,8343.89,2024-05-26,Active - Expansion,monthly,1,Yes,2025-08-26,2025-11-16
SUB_000058,CUST_000023,Smith LLC,PROD_MERAKI,Meraki,150190.0,12515.83,27,5562.59,2025-08-07,Active,quarterly,3,Yes,2025-04-29,2026-03-01
SUB_000059,CUST_000023,Smith LLC,PROD_UMBRELLA,Umbrella,150190.0,12515.83,18,8343.89,2024-05-24,Active,quarterly,3,Yes,2025-06-16,2025-12-17
SUB_000060,CUST_000024,Schultz - Collins,PROD_DUO,Duo,232048.0,19337.33,28,8287.43,2025-06-25,Active,monthly,1,Yes,2025-05-24,2026-08-17
SUB_000061,CUST_000024,Schultz - Collins,PROD_MERAKI,Meraki,232048.0,19337.33,41,5659.71,2024-10-07,Active,annual,12,Yes,2025-04-25,2026-04-14
SUB_000062,CUST_000025,"Herzog, Bode and Frami",PROD_DUO,Duo,171687.5,14307.29,23,7464.67,2025-07-16,Active,quarterly,3,Yes,2025-08-17,2026-08-22
SUB_000063,CUST_000025,"Herzog, Bode and Frami",PROD_UMBRELLA,Umbrella,171687.5,14307.29,23,7464.67,2024-11-08,Active,monthly,1,Yes,2025-07-22,2026-05-06
SUB_000064,CUST_000026,Credit Group,PROD_DUO,Duo,220807.0,18400.58,14,15771.93,2024-12-29,Active,annual,12,No,2025-05-11,2026-03-20
SUB_000065,CUST_000026,Credit Group,PROD_UMBRELLA,Umbrella,220807.0,18400.58,14,15771.93,2024-07-16,Active,quarterly,3,Yes,2025-07-05,2025-12-04
SUB_000066,CUST_000027,"Gutmann, King and Gorczany",PROD_DUO,Duo,237096.5,19758.04,11,21554.23,2024-10-22,Active - Expansion,monthly,1,No,2025-07-08,2026-02-02
SUB_000067,CUST_000027,"Gutmann, King and Gorczany",PROD_MERAKI,Meraki,237096.5,19758.04,17,13946.85,2024-11-30,Active,monthly,1,Yes,2025-09-11,2026-01-08
SUB_000068,CUST_000028,Medical Alliance,PROD_DUO,Duo,60517.0,5043.08,16,3782.31,2024-12-08,Active,monthly,1,Yes,2025-09-04,2026-05-20
SUB_000069,CUST_000028,Medical Alliance,PROD_MERAKI,Meraki,60517.0,5043.08,23,2631.17,2025-02-05,Active,quarterly,3,Yes,2025-08-12,2025-12-03
SUB_000070,CUST_000028,Medical Alliance,PROD_UMBRELLA,Umbrella,60517.0,5043.08,16,3782.31,2024-06-10,Active,monthly,1,Yes,2025-06-14,2026-02-27
SUB_000071,CUST_000029,Medical Systems,PROD_DUO,Duo,71892.67,5991.06,33,2178.57,2025-03-16,Active,monthly,1,Yes,2025-04-23,2026-06-08
SUB_000072,CUST_000029,Medical Systems,PROD_SPLUNK,Splunk,71892.67,5991.06,48,1497.76,2024-05-28,Active,quarterly,3,Yes,2025-07-15,2026-02-03
SUB_000073,CUST_000029,Medical Systems,PROD_UMBRELLA,Umbrella,71892.67,5991.06,33,2178.57,2025-06-14,Active,quarterly,3,Yes,2025-06-20,2026-06-10
SUB_000074,CUST_000030,Bashirian Inc,PROD_DUO,Duo,44319.0,3693.25,32,1384.97,2024-08-06,Active,quarterly,3,Yes,2025-08-17,2026-05-26
SUB_000075,CUST_000030,Bashirian Inc,PROD_UMBRELLA,Umbrella,44319.0,3693.25,32,1384.97,2025-06-03,Active,annual,12,Yes,2025-05-19,2026-05-10
SUB_000076,CUST_000031,Credit Partners,PROD_DUO,Duo,67544.33,5628.69,19,3554.96,2025-09-01,Active,quarterly,3,Yes,2025-07-26,2026-06-04
SUB_000077,CUST_000031,Credit Partners,PROD_MERAKI,Meraki,67544.33,5628.69,28,2412.3,2024-05-06,Active,quarterly,3,Yes,2025-07-04,2026-05-10
SUB_000078,CUST_000031,Credit Partners,PROD_UMBRELLA,Umbrella,67544.33,5628.69,19,3554.96,2024-05-21,Active,annual,12,Yes,2025-09-06,2026-01-10
SUB_000079,CUST_000032,Wealth Group,PROD_DUO,Duo,106922.67,8910.22,26,4112.41,2025-08-25,Active - Expansion,quarterly,3,Yes,2025-08-17,2026-09-13
SUB_000080,CUST_000032,Wealth Group,PROD_SPLUNK,Splunk,106922.67,8910.22,38,2813.75,2025-02-02,Active - Expansion,monthly,1,Yes,2025-05-06,2026-01-10
SUB_000081,CUST_000032,Wealth Group,PROD_UMBRELLA,Umbrella,106922.67,8910.22,26,4112.41,2025-05-06,Active,monthly,1,Yes,2025-09-02,2026-06-23
SUB_000082,CUST_000033,Hansen LLC,PROD_DUO,Duo,41416.5,3451.38,35,1183.33,2025-03-11,Active,monthly,1,Yes,2025-05-26,2025-12-17
SUB_000083,CUST_000033,Hansen LLC,PROD_MERAKI,Meraki,41416.5,3451.38,50,828.33,2024-10-09,Active,quarterly,3,No,2025-08-13,2026-04-14
SUB_000084,CUST_000034,Cloud Solutions,PROD_DUO,Duo,131912.33,10992.69,24,5496.35,2025-03-30,Active,annual,12,Yes,2025-06-02,2026-04-12
SUB_000085,CUST_000034,Cloud Solutions,PROD_SPLUNK,Splunk,131912.33,10992.69,35,3768.92,2025-02-10,Active,monthly,1,Yes,2025-06-08,2026-02-09
SUB_000086,CUST_000034,Cloud Solutions,PROD_UMBRELLA,Umbrella,131912.33,10992.69,24,5496.35,2025-02-18,Active,quarterly,3,Yes,2025-04-26,2025-11-12
SUB_000087,CUST_000035,Bruen - Adams,PROD_MERAKI,Meraki,76390.0,6365.83,45,1697.56,2025-02-05,Active,quarterly,3,No,2025-04-18,2026-09-18
SUB_000088,CUST_000035,Bruen - Adams,PROD_UMBRELLA,Umbrella,76390.0,6365.83,31,2464.19,2025-01-30,Active - Expansion,monthly,1,Yes,2025-07-21,2026-07-31
SUB_000089,CUST_000036,Trust Holdings,PROD_DUO,Duo,17275.33,1439.61,11,1570.48,2024-10-11,Active,monthly,1,Yes,2025-08-23,2026-04-06
SUB_000090,CUST_000036,Trust Holdings,PROD_MERAKI,Meraki,17275.33,1439.61,17,1016.2,2025-07-28,Active,annual,12,Yes,2025-07-15,2026-04-19
SUB_000091,CUST_000036,Trust Holdings,PROD_THOUSAND_EYES,ThousandEyes,17275.33,1439.61,17,1016.2,2025-09-01,Active - Expansion,monthly,1,Yes,2025-09-02,2026-03-17
SUB_000092,CUST_000037,Stokes and Sons,PROD_DUO,Duo,163490.0,13624.17,30,5449.67,2025-01-23,Active,annual,12,No,2025-05-30,2026-09-30
SUB_000093,CUST_000037,Stokes and Sons,PROD_MERAKI,Meraki,163490.0,13624.17,43,3802.09,2025-01-03,Active,monthly,1,Yes,2025-06-03,2026-03-16
SUB_000094,CUST_000037,Stokes and Sons,PROD_THOUSAND_EYES,ThousandEyes,163490.0,13624.17,43,3802.09,2024-06-13,Active,annual,12,No,2025-08-17,2026-06-17
SUB_000095,CUST_000038,Wealth Capital,PROD_DUO,Duo,212364.5,17697.04,27,7865.35,2025-08-19,Active,quarterly,3,Yes,2025-04-24,2026-03-19
SUB_000096,CUST_000038,Wealth Capital,PROD_UMBRELLA,Umbrella,212364.5,17697.04,27,7865.35,2024-07-30,Active,monthly,1,Yes,2025-05-18,2026-08-10
SUB_000097,CUST_000039,Mohr and Sons,PROD_DUO,Duo,198448.0,16537.33,31,6401.55,2024-05-15,Active,quarterly,3,No,2025-05-23,2026-09-21
SUB_000098,CUST_000039,Mohr and Sons,PROD_MERAKI,Meraki,198448.0,16537.33,45,4409.96,2024-06-11,Active - Expansion,quarterly,3,Yes,2025-08-04,2026-07-13
SUB_000099,CUST_000040,Data Solutions,PROD_DUO,Duo,39776.67,3314.72,21,1894.13,2024-07-10,Active - Expansion,monthly,1,Yes,2025-07-05,2026-08-05
SUB_000100,CUST_000040,Data Solutions,PROD_MERAKI,Meraki,39776.67,3314.72,31,1283.12,2025-04-26,Active,annual,12,Yes,2025-05-24,2025-12-21
SUB_000101,CUST_000040,Data Solutions,PROD_THOUSAND_EYES,ThousandEyes,39776.67,3314.72,31,1283.12,2025-03-26,Active,annual,12,Yes,2025-06-24,2026-08-15
SUB_000102,CUST_000041,"Collier, Bayer and Ward",PROD_DUO,Duo,40451.5,3370.96,28,1444.7,2025-05-18,Active,annual,12,No,2025-06-07,2026-01-29
SUB_000103,CUST_000041,"Collier, Bayer and Ward",PROD_MERAKI,Meraki,40451.5,3370.96,41,986.62,2025-02-17,Active - Expansion,quarterly,3,Yes,2025-06-21,2026-08-16
SUB_000104,CUST_000042,"Mitchell, Batz and Pouros",PROD_DUO,Duo,210121.0,17510.08,34,6180.03,2025-05-31,Active,monthly,1,Yes,2025-05-29,2026-05-30
SUB_000105,CUST_000042,"Mitchell, Batz and Pouros",PROD_MERAKI,Meraki,210121.0,17510.08,49,4288.18,2024-07-02,Active - Expansion,annual,12,Yes,2025-04-19,2026-05-25
SUB_000106,CUST_000043,Cronin and Sons,PROD_DUO,Duo,5008.5,417.38,3,1669.5,2025-04-14,Active,monthly,1,Yes,2025-06-06,2026-06-14
SUB_000107,CUST_000043,Cronin and Sons,PROD_MERAKI,Meraki,5008.5,417.38,5,1001.7,2025-01-07,Active - Expansion,quarterly,3,Yes,2025-07-19,2026-03-31
SUB_000108,CUST_000044,Corwin LLC,PROD_DUO,Duo,12181.0,1015.08,7,1740.14,2025-02-26,Active,quarterly,3,Yes,2025-06-19,2026-06-07
SUB_000109,CUST_000044,Corwin LLC,PROD_UMBRELLA,Umbrella,12181.0,1015.08,7,1740.14,2024-04-29,Active - Expansion,monthly,1,Yes,2025-04-30,2025-11-25
SUB_000110,CUST_000045,Goldner - Bartoletti,PROD_DUO,Duo,7358.67,613.22,6,1226.44,2025-08-02,Active - Expansion,annual,12,Yes,2025-05-27,2026-01-20
SUB_000111,CUST_000045,Goldner - Bartoletti,PROD_MERAKI,Meraki,7358.67,613.22,9,817.63,2025-05-03,Active,quarterly,3,Yes,2025-06-08,2026-04-28
SUB_000112,CUST_000045,Goldner - Bartoletti,PROD_THOUSAND_EYES,ThousandEyes,7358.67,613.22,9,817.63,2025-03-25,Active - Expansion,quarterly,3,Yes,2025-06-08,2026-04-03
```

**Subscription Summary:**
- Total Subscriptions: 112
- Total ARR: $25,901,413
- Average subscriptions per customer: 2.49
- Product breakdown:
  - Duo: 42 subscriptions (37.5%)
  - Meraki: 33 subscriptions (29.5%)
  - Umbrella: 23 subscriptions (20.5%)
  - ThousandEyes: 10 subscriptions (8.9%)
  - Splunk: 4 subscriptions (3.6%)

---

## Similarity Matrix Methodology

### Similarity Calculation Framework

**Overall Formula:**
```
Final Similarity Score = (Company Profile × 35%) + (Product Portfolio × 30%) + (Behavior × 35%)
```

### Component Weightages

#### 1. Company Profile Similarity (35% of total)

```python
Company Profile = 
  (Industry Similarity × 30%) +
  (Tier Similarity × 25%) +
  (ARR Size Similarity × 25%) +
  (Geography Similarity × 20%)
```

**Sub-components:**

1. **Industry Similarity (30%)**
   - Method: OpenAI text embeddings (text-embedding-3-small model)
   - Calculation: Cosine similarity between embeddings
   - Scaling: `cosine_similarity × 100` → 0-100 range
   - Example: "Technology" vs "Healthcare" → embedding vectors → cosine similarity → scaled score

2. **Tier Similarity (25%)**
   - Method: OpenAI text embeddings
   - Tiers: Strategic, Enterprise, Commercial, SMB
   - Calculation: Same as industry
   - Scaling: 0-100

3. **ARR Size Similarity (25%)**
   - Method: Distance-based numeric similarity
   - Normalization: MinMaxScaler (0-1 range)
   - Formula: `(1 - |normalized_value_i - normalized_value_j|) × 100`
   - Example: Company A ARR=$1M, Company B ARR=$1.2M → normalize → distance → similarity

4. **Geography Similarity (20%)**
   - Method: Average of Theater and Region similarities
   - Both use text embeddings
   - Formula: `(theater_similarity + region_similarity) / 2`
   - Theaters: AMER, EMEA, APAC
   - Regions: North, South, East, West, Central, Southeast

#### 2. Product Portfolio Similarity (30% of total)

```python
Product Portfolio = 
  (Product Count Similarity × 25%) +
  (Portfolio Size Similarity × 20%) +
  (Utilization Similarity × 30%) +
  (Maturity Similarity × 25%)
```

**Sub-components:**

1. **Product Count Similarity (25%)**
   - Method: Distance-based (not normalized)
   - Direct comparison of number of products
   - Formula: `(1 - |count_i - count_j| / max_difference) × 100`

2. **Portfolio Size Similarity (20%)**
   - Method: Distance-based (normalized)
   - Metric: USER_COUNT as proxy for portfolio size
   - Normalization: MinMaxScaler
   - Formula: `(1 - |normalized_users_i - normalized_users_j|) × 100`

3. **Utilization Similarity (30%)**
   - Method: Distance-based (normalized)
   - Metric: USAGE_PERCENTAGE
   - Missing values filled with 0
   - Formula: Same as above

4. **Maturity Similarity (25%)**
   - Method: Text embeddings
   - Stages: "Mature", "Growing", "Early", etc.
   - Field: PORTFOLIO_MATURITY_STAGE
   - Scaling: 0-100

#### 3. Behavior Similarity (35% of total)

```python
Behavior = 
  (Health Similarity × 40%) +
  (Risk Similarity × 30%) +
  (Trends Similarity × 30%)
```

**Sub-components:**

1. **Health Similarity (40%)**
   - Method: Average of two health metrics
   - Metrics: HEALTH_SCORE and TIMELINE_HEALTH_SCORE
   - Both normalized and distance-based
   - Formula: `(health_score_sim + timeline_health_sim) / 2`
   - Missing values filled with 50 (neutral)

2. **Risk Similarity (30%)**
   - Method: Text embeddings
   - Values: "Low Risk", "High Risk"
   - Field: RISK_LEVEL
   - Scaling: 0-100

3. **Trends Similarity (30%)**
   - Method: Text embeddings
   - Values: "growing", "stable", "declining"
   - Field: ARR_TREND
   - Scaling: 0-100

### Text Similarity Calculation (OpenAI Embeddings)

```python
def calculate_text_similarity(field_name):
    # Step 1: Get embeddings from OpenAI
    for each value in field:
        embedding = openai.embeddings.create(
            input=[text],
            model="text-embedding-3-small"
        )
    
    # Step 2: Calculate cosine similarity
    similarity_matrix = cosine_similarity(embeddings_array)
    
    # Step 3: Scale to 0-100 range
    similarity_scaled = similarity_matrix × 100
    
    return similarity_scaled
```

### Numeric Similarity Calculation

```python
def calculate_numeric_similarity(values, normalize=True):
    if normalize:
        # Normalize using MinMaxScaler
        scaler = MinMaxScaler()
        values_normalized = scaler.fit_transform(values)
    
    # Calculate distance-based similarity
    for i, j in all_pairs:
        distance = abs(values_normalized[i] - values_normalized[j])
        similarity[i][j] = (1 - distance) × 100
    
    return similarity
```

### Final Similarity Matrix Construction

```python
# Calculate each component
company_profile_sim = calculate_company_profile_similarity()
product_portfolio_sim = calculate_product_portfolio_similarity()
behavior_sim = calculate_behavior_similarity()

# Weighted combination
final_similarity_matrix = (
    company_profile_sim × 0.35 +
    product_portfolio_sim × 0.30 +
    behavior_sim × 0.35
)

# Set diagonal to 100 (self-similarity)
np.fill_diagonal(final_similarity_matrix, 100)

# Round to integers for storage
similarity_matrix_int = np.round(final_similarity_matrix).astype(int)
```

**Matrix Properties:**
- Size: 50×50 (2,500 cells)
- Values: Integers 0-100
- Diagonal: All 100 (self-similarity)
- Symmetric: score(i,j) = score(j,i)
- Range: 40-91
- Average: ~64

---

## Potential ARR Analysis Methodology

### Overview

For each company, the system:
1. Identifies top 5 most similar companies
2. Finds products they have but the target company doesn't
3. Estimates potential revenue from those products
4. Calculates probability-weighted expected revenue

### Step-by-Step Process

#### Step 1: Similar Company Identification

```python
for each company X:
    # Get similarity scores with all other companies
    similarities = similarity_matrix[X]
    
    # Remove self-similarity
    similarities = similarities.drop(X)
    
    # Sort descending and take top 5
    top_5_similar = similarities.sort_values(ascending=False).head(5)
    
    # This is Set Z
    set_Z = top_5_similar.index.tolist()
```

#### Step 2: Product Gap Analysis

```python
# Get products of target company X
company_X_products = get_products(X)

# Collect products from similar companies (Set Z)
similar_company_products = {}

for similar_company in set_Z:
    products = get_products(similar_company)
    
    for product in products:
        if product not in similar_company_products:
            similar_company_products[product] = []
        similar_company_products[product].append(
            (similar_company, similarity_score)
        )

# Find potential products (gap analysis)
potential_products = []
for product in similar_company_products:
    if product not in company_X_products:
        potential_products.append(product)
```

#### Step 3: License Estimation

```python
def estimate_licenses(product_category, user_count):
    """
    Networking and Analytics products: 100% of users
    Security products: 70% of users
    """
    if product_category in ['Networking', 'Analytics']:
        return user_count  # 100% coverage
    else:  # Security
        return int(user_count × 0.7)  # 70% coverage
```

**Rationale:**
- **Networking (Meraki)**: Infrastructure products need full user coverage
- **Analytics (ThousandEyes, Splunk)**: Monitoring tools for entire organization
- **Security (Duo, Umbrella)**: Typically deployed to 70% of users

#### Step 4: Pricing Calculation

```python
def get_average_price(product_id):
    # Get all existing subscriptions for this product
    product_subscriptions = subscriptions[
        subscriptions['PRODUCT_ID'] == product_id
    ]
    
    if len(product_subscriptions) > 0:
        # Use market average from existing subscriptions
        avg_price = product_subscriptions['PRICE_PER_LICENSE'].mean()
    else:
        # No subscriptions exist, use base price
        avg_price = products[product_id]['BASE_PRICE_PER_USER']
    
    return avg_price
```

#### Step 5: Potential ARR Calculation

```python
for each potential_product:
    # Get product details
    product_info = products_df[PRODUCT_ID == potential_product]
    product_category = product_info['PRODUCT_CATEGORY']
    
    # Estimate licenses
    estimated_licenses = estimate_licenses(
        product_category, 
        customer_user_count
    )
    
    # Get average price
    avg_price = get_average_price(potential_product)
    
    # Calculate potential ARR
    potential_arr = estimated_licenses × avg_price
```

**Example:**
```
Company: Clinical Associates
- User Count: 95
- Missing Product: Umbrella (Security)
- Product Category: Security → 70% coverage
- Estimated Licenses: 95 × 0.7 = 66.5 ≈ 66
- Average Price: $7,229.89 per license
- Potential ARR: 66 × $7,229.89 = $477,173
```

#### Step 6: Purchase Probability Calculation

```python
def calculate_purchase_probability(product, similar_companies):
    """
    Probability based on highest similarity score among
    companies that have this product
    """
    similarity_scores = []
    
    for company in similar_companies:
        if company has product:
            similarity_scores.append(similarity_score[X, company])
    
    # Use maximum similarity as probability indicator
    max_similarity = max(similarity_scores)
    
    # Convert to probability (0-1 range)
    purchase_probability = max_similarity / 100
    
    return purchase_probability
```

**Logic:**
- If a highly similar company (85% similarity) has the product
- Probability = 85/100 = 0.85 = 85%
- Higher similarity → Higher likelihood of need

**Example:**
```
Product: Umbrella
Companies with Umbrella in Set Z:
- Medical Systems (79% similar)
- Swaniawski Inc (76% similar)

Purchase Probability = max(79, 76) / 100 = 0.79 = 79%
```

#### Step 7: Expected ARR Calculation

```python
expected_arr = potential_arr × purchase_probability

# Integer conversion for storage
expected_arr_int = int(round(expected_arr))
```

**Example:**
```
Potential ARR: $477,173
Purchase Probability: 79%
Expected ARR: $477,173 × 0.79 = $376,966
```

#### Step 8: Company-Level Aggregation

```python
# For each company
for company_X:
    total_potential_arr = 0
    total_expected_arr = 0
    potential_products = []
    
    for each missing_product:
        potential_arr = calculate_potential_arr(product)
        expected_arr = potential_arr × probability
        
        total_potential_arr += potential_arr
        total_expected_arr += expected_arr
        
        potential_products.append({
            'PRODUCT_ID': product_id,
            'PRODUCT_NAME': product_name,
            'POTENTIAL_ARR': int(round(potential_arr)),
            'EXPECTED_ARR': int(round(expected_arr)),
            'PURCHASE_PROBABILITY': probability × 100
        })
    
    # Sort by expected ARR
    potential_products.sort(
        key=lambda x: x['EXPECTED_ARR'], 
        reverse=True
    )
```

### Output Metrics

For each company, we calculate:

1. **CURRENT_ARR**: Current annual recurring revenue
2. **CURRENT_PRODUCT_COUNT**: Number of products currently subscribed
3. **POTENTIAL_PRODUCT_COUNT**: Number of products recommended
4. **TOTAL_POTENTIAL_ARR**: Maximum possible ARR (if all recommended products purchased)
5. **TOTAL_EXPECTED_POTENTIAL_ARR**: Probability-weighted expected ARR
6. **TOP_PRODUCT_RECOMMENDATION**: Product with highest expected ARR
7. **TOP_PRODUCT_EXPECTED_ARR**: Expected ARR from top recommendation
8. **TOP_5_SIMILAR_COMPANIES**: List of lookalike companies used
9. **AVG_SIMILARITY_SCORE**: Average similarity with top 5 companies

### Key Formulas Summary

```
License Estimation:
  IF product_category IN ['Networking', 'Analytics']:
      estimated_licenses = user_count × 100%
  ELSE IF product_category == 'Security':
      estimated_licenses = user_count × 70%

Average Price:
  avg_price = MEAN(all subscription prices for product) OR base_price

Potential ARR:
  potential_arr = estimated_licenses × avg_price

Purchase Probability:
  probability = MAX(similarity_scores_of_companies_with_product) / 100

Expected ARR:
  expected_arr = potential_arr × probability

Total Expected ARR per Company:
  company_expected_arr = Σ(expected_arr for all recommended products)
```

---

## Complete Similarity Matrix

*50×50 matrix showing similarity scores (0-100) between all companies. Scores are integers.*

**Row = Company A, Column = Company B, Value = Similarity Score**

Due to size constraints, showing first 10x10 preview:

```
                          TechCorp  MedSecure  Global FP  Advanced  Innovate  Harber  Baumbach  Swaniawski  Quality  Block-Toy
TechCorp Industries          100        53         71        66        67       68       61          56       67        70
MedSecure Systems             53       100         62        64        70       51       61          67       57        49
Global Financial Partners     71        62        100        78        70       73       67          66       80        70
Advanced Manufacturing Co     66        64         78       100        80       62       55          56       81        58
InnovateTech Solutions        67        70         70        80       100       55       67          71       68        53
Harber LLC                    68        51         73        62        55      100       71          69       69        69
Baumbach, Dietrich...         61        61         67        55        67       71      100          81       64        64
Swaniawski Inc                56        67         66        56        71       69       81         100       66        73
Quality Corporation           67        57         80        81        68       69       64          66      100        69
Block - Toy                   70        49         70        58        53       69       64          73       69       100
```

**Complete matrix available in similarity_matrix.csv file**

**Matrix Statistics:**
- Minimum similarity (excluding diagonal): 40
- Maximum similarity (excluding diagonal): 91
- Average similarity: 64.2
- Median similarity: 64
- Standard deviation: 10.3

**Top 10 Most Similar Company Pairs:**
1. Mohr and Sons ↔ Collier, Bayer and Ward: 91/100
2. Capital Management ↔ Trust Holdings: 91/100
3. Bruen - Adams ↔ Schultz - Collins: 88/100
4. Medical Alliance ↔ Kris - Dibbert: 88/100
5. Medical Systems ↔ Cloud Solutions: 86/100
6. Credit Group ↔ Wealth Capital: 86/100
7. Ondricka, Waters... ↔ Swaniawski Inc: 85/100
8. Smith, Ratke... ↔ Collier, Bayer...: 85/100
9. Schultz - Collins ↔ Pagac - Muller: 85/100
10. Hansen LLC ↔ Gutmann, King...: 85/100

---

## Complete Potential ARR Analysis

*Showing top 20 companies by Potential ARR with complete details*

### Summary Statistics

**Overall Metrics:**
- Total Current ARR: $42,213,318
- Total Potential ARR: $14,378,516 (34.1% growth potential)
- Total Expected ARR: $11,316,972 (26.8% expected growth)
- Average Potential ARR per company: $287,570
- Average Expected ARR per company: $226,339
- Total Product Recommendations: 249 opportunities

### Top 20 Companies by Potential ARR

| Rank | Company | Current ARR | Potential ARR | Expected ARR | Growth % | Top Recommendation |
|------|---------|-------------|---------------|--------------|----------|-------------------|
| 1 | Ondricka, Waters and Wilderman | $1,211,950 | $906,579 | $721,535 | 75% | Umbrella |
| 2 | Clinical Associates | $1,601,116 | $804,507 | $635,560 | 50% | Umbrella |
| 3 | Swaniawski Inc | $1,456,970 | $744,338 | $598,450 | 51% | Duo |
| 4 | Harber LLC | $747,423 | $708,766 | $538,662 | 95% | Umbrella |
| 5 | Block - Toy | $1,797,331 | $524,514 | $388,140 | 29% | Umbrella |
| 6 | Quality Corporation | $1,004,742 | $469,379 | $360,549 | 47% | ThousandEyes |
| 7 | Cyber Systems | $1,209,071 | $447,368 | $354,650 | 37% | Meraki |
| 8 | Global Financial Partners | $804,011 | $428,773 | $335,989 | 53% | Umbrella |
| 9 | Medical Group | $536,311 | $428,773 | $328,187 | 80% | Umbrella |
| 10 | Medical Systems | $215,678 | $416,069 | $328,694 | 193% | Meraki |
| 11 | Mitchell, Batz and Pouros | $420,242 | $414,652 | $334,031 | 99% | Umbrella |
| 12 | Bruen - Adams | $152,780 | $400,467 | $344,986 | 262% | Duo |
| 13 | MedSecure Systems | $3,627,162 | $368,682 | $258,077 | 10% | Splunk |
| 14 | Pagac - Muller | $131,258 | $367,437 | $301,673 | 280% | Umbrella |
| 15 | Baumbach, Dietrich... | $1,091,244 | $358,905 | $290,713 | 33% | Meraki |
| 16 | Wealth Group | $320,768 | $329,388 | $266,804 | 103% | Meraki |
| 17 | Cloud Solutions | $395,737 | $303,384 | $232,162 | 77% | Meraki |
| 18 | Advanced Manufacturing Co | $140,615 | $280,113 | $224,090 | 199% | ThousandEyes |
| 19 | TechCorp Industries | $1,522,871 | $264,000 | $192,720 | 17% | ThousandEyes |
| 20 | Investment Management | $811,945 | $258,957 | $201,986 | 32% | Meraki |

### Product Recommendation Distribution

**Most Recommended Products:**
1. **Umbrella (Security)** - 22 companies missing it (48.9% of customers)
2. **ThousandEyes (Analytics)** - 35 companies missing it (77.8%)
3. **Splunk (Analytics)** - 41 companies missing it (91.1%)
4. **Meraki (Networking)** - 12 companies missing it (26.7%)
5. **Duo (Security)** - 3 companies missing it (6.7%)

**Total Expected ARR by Product:**
1. Umbrella: $4.2M expected
2. Meraki: $2.8M expected
3. ThousandEyes: $2.1M expected
4. Splunk: $1.4M expected
5. Duo: $0.8M expected

---

## Data Validation Summary

**ARR Consistency:**
- Subscription ARR vs Customer ARR: 100% match
- Maximum variance: $0.01 (due to rounding)
- Validation status: ✅ PASSED

**Foreign Key Integrity:**
- Customer-Subscription links: ✅ Valid
- Product-Subscription links: ✅ Valid
- No orphaned records: ✅ Confirmed

**Product-Tier Alignment:**
- All subscriptions respect tier availability: ✅ Valid
- Strategic/Enterprise have access to all products: ✅ Confirmed
- SMB restricted per product rules: ✅ Confirmed

**Similarity Matrix:**
- Range validation (0-100): ✅ PASSED
- Symmetry check: ✅ PASSED
- Diagonal values = 100: ✅ PASSED

**Potential ARR:**
- Probability range (0-100%): ✅ PASSED
- Currency values as integers: ✅ PASSED
- No negative values: ✅ PASSED

---

*This context document contains complete factual data and formulas for the Lookalike Analysis System. All values are accurate as of the last data refresh. For questions about specific companies, products, or calculations, refer to the relevant sections above.*


---

## APPENDIX A: Complete Similarity Matrix (50x50)

*All 2,500 similarity scores between 50 companies. Diagonal = 100 (self-similarity).*

```csv
COMPANY_NAME,Global Premier Works,TechCorp Industries,Global Capital Management,MedSecure Systems,Global Financial Partners,Global Quality Industries,Advanced Manufacturing Co,Global Medical Network,InnovateTech Solutions,"White, Boehm and Hilpert",Harber LLC,"Baumbach, Dietrich and Mueller",Swaniawski Inc,Quality Corporation,Block - Toy,Cyber Systems,Medical Group,Clinical Associates,"Ondricka, Waters and Wilderman",Investment Management,Capital Management,Bode - Mayer,"Smith, Ratke and Ankunding",Pagac - Muller,Credit Advisors,Data Innovations,Kris - Dibbert,Smith LLC,Schultz - Collins,"Herzog, Bode and Frami",Credit Group,"Gutmann, King and Gorczany",Medical Alliance,Medical Systems,Bashirian Inc,Credit Partners,Wealth Group,Hansen LLC,Cloud Solutions,Bruen - Adams,Trust Holdings,Stokes and Sons,Wealth Capital,Mohr and Sons,Data Solutions,"Collier, Bayer and Ward","Mitchell, Batz and Pouros",Cronin and Sons,Corwin LLC,Goldner - Bartoletti
Global Premier Works,100,71,54,55,57,79,58,75,42,58,64,55,48,61,66,54,42,55,49,62,51,62,46,48,51,49,52,59,52,61,56,54,56,55,59,54,62,50,53,54,49,58,56,44,57,46,44,50,64,53
TechCorp Industries,71,100,40,53,71,66,66,56,67,60,68,61,56,67,70,64,46,57,59,62,54,65,50,55,54,53,61,68,54,63,50,53,63,51,55,66,58,50,61,59,48,67,53,50,73,50,49,48,61,54
Global Capital Management,54,40,100,80,61,66,51,55,60,54,52,60,68,54,52,62,61,66,71,67,63,50,67,61,62,55,46,43,67,50,63,55,49,55,53,49,54,52,49,58,64,49,63,60,45,60,69,44,45,49
MedSecure Systems,55,53,80,100,62,64,64,60,70,54,51,61,67,57,49,62,68,65,64,58,55,49,66,55,57,54,45,50,57,45,57,53,54,58,55,49,46,50,52,59,51,53,51,55,52,60,65,41,47,49
Global Financial Partners,57,71,61,62,100,61,78,57,70,57,73,67,66,80,70,64,63,71,69,74,81,69,66,60,60,57,67,63,66,52,73,57,71,73,59,68,76,52,73,63,74,70,66,60,62,60,61,51,50,68
Global Quality Industries,79,66,66,64,61,100,66,70,56,57,51,49,54,69,68,59,50,59,59,63,59,55,58,54,57,50,53,68,55,52,47,57,55,58,60,66,50,53,59,50,55,58,48,58,70,57,58,47,54,57
Advanced Manufacturing Co,58,66,51,64,78,66,100,51,80,51,62,55,56,81,58,58,59,63,57,58,80,71,75,62,62,64,69,72,65,53,65,61,72,75,64,73,70,58,77,66,74,74,57,60,75,69,71,45,47,64
Global Medical Network,75,56,55,60,57,70,51,100,41,65,58,45,52,52,68,47,61,63,49,57,53,54,47,43,59,58,47,60,44,52,47,61,55,65,55,56,60,61,57,48,53,52,46,48,57,47,44,64,51,57
InnovateTech Solutions,42,67,60,70,70,56,80,41,100,60,55,67,71,68,53,77,67,58,72,65,71,64,80,73,69,75,66,68,75,65,73,71,67,66,70,66,59,65,76,73,67,69,67,72,73,73,77,55,59,61
"White, Boehm and Hilpert",58,60,54,54,57,57,51,65,60,100,67,65,71,56,74,70,66,61,76,76,53,52,64,57,73,71,53,62,58,66,62,74,47,65,72,57,62,79,65,58,54,51,59,64,61,64,61,76,63,54
Harber LLC,64,68,52,51,73,51,62,58,55,67,100,71,69,69,69,60,61,79,76,59,65,79,60,64,53,61,74,58,64,57,65,55,68,70,54,52,76,60,68,66,65,73,59,55,62,55,58,58,54,72
"Baumbach, Dietrich and Mueller",55,61,60,61,67,49,55,45,67,65,71,100,81,64,64,73,70,67,76,70,55,60,66,69,55,63,63,52,74,74,77,65,64,61,67,46,63,58,64,68,58,63,72,77,50,68,61,54,66,60
Swaniawski Inc,48,56,68,67,66,54,56,52,71,71,69,81,100,66,73,77,79,75,85,70,60,59,69,68,70,70,54,55,68,64,66,74,55,66,64,50,57,66,63,72,63,60,62,72,54,70,71,59,57,62
Quality Corporation,61,67,54,57,80,69,81,52,68,56,69,64,66,100,69,65,61,72,66,66,73,63,65,58,50,57,70,70,61,49,62,55,73,71,57,70,63,50,73,58,64,67,53,56,63,58,63,45,45,63
Block - Toy,66,70,52,49,70,68,58,68,53,74,69,64,73,69,100,65,59,72,67,72,70,59,56,52,62,60,54,68,54,65,55,75,55,68,65,62,59,65,64,51,67,65,53,62,67,63,55,60,55,60
Cyber Systems,54,64,62,62,64,59,58,47,77,70,60,73,77,65,65,100,71,64,79,79,59,56,68,64,66,81,53,58,67,65,67,69,53,60,71,55,52,65,65,65,59,58,76,73,65,74,69,57,64,57
Medical Group,42,46,61,68,63,50,59,61,67,66,61,70,79,61,59,71,100,73,74,67,61,57,69,66,70,73,52,53,65,57,66,70,59,73,64,50,59,74,63,67,65,57,60,65,55,63,73,65,56,62
Clinical Associates,55,57,66,65,71,59,63,63,58,61,79,67,75,72,72,64,73,100,71,62,68,68,60,55,56,58,60,59,60,50,58,56,69,79,55,55,64,54,66,55,73,63,55,57,61,54,61,47,45,70
"Ondricka, Waters and Wilderman",49,59,71,64,69,59,57,49,72,76,76,76,85,66,67,79,74,71,100,71,61,63,74,76,64,67,64,56,77,61,67,65,58,65,63,50,59,68,62,70,62,63,66,72,55,69,76,65,59,64
Investment Management,62,62,67,58,74,63,58,57,65,76,59,70,70,66,72,79,67,62,71,100,69,54,68,60,78,67,51,64,66,72,77,76,53,62,81,70,61,73,60,63,63,55,77,65,64,67,66,65,69,53
Capital Management,51,54,63,55,81,59,80,53,71,53,65,55,60,73,70,59,61,68,61,69,100,73,74,64,70,63,71,68,69,56,78,68,74,79,63,76,78,60,76,65,91,80,68,61,70,66,71,51,50,69
Bode - Mayer,62,65,50,49,69,55,71,54,64,52,79,60,59,63,59,56,57,68,63,54,73,100,66,73,62,61,76,68,79,66,70,59,79,72,56,65,81,53,70,84,73,82,68,59,71,59,73,50,62,76
"Smith, Ratke and Ankunding",46,50,67,66,66,58,75,47,80,64,60,66,69,65,56,68,69,60,74,68,74,66,100,83,72,74,64,73,80,64,76,74,66,70,81,63,65,69,72,74,69,76,68,77,68,85,84,57,65,68
Pagac - Muller,48,55,61,55,60,54,62,43,73,57,64,69,68,58,52,64,66,55,76,60,64,73,83,100,65,66,73,63,85,76,74,65,72,65,71,56,69,61,61,83,62,81,73,73,57,70,81,57,74,71
Credit Advisors,51,54,62,57,60,57,62,59,69,73,53,55,70,50,62,66,70,56,64,78,70,62,72,65,100,75,52,71,66,70,74,83,55,65,78,77,67,80,60,74,74,58,73,68,72,72,74,69,67,57
Data Innovations,49,53,55,54,57,50,64,58,75,71,61,63,70,57,60,81,73,58,67,67,63,61,74,66,75,100,55,62,67,64,70,79,54,71,75,57,65,80,74,70,64,60,73,79,67,81,72,69,57,58
Kris - Dibbert,52,61,46,45,67,53,69,47,66,53,74,63,54,70,54,53,52,60,64,51,71,76,64,73,52,55,100,68,72,67,68,56,88,68,55,71,73,57,70,69,69,78,66,62,64,57,62,54,57,68
Smith LLC,59,68,43,50,63,68,72,60,68,62,58,52,55,70,68,58,53,59,56,64,68,68,73,63,71,62,68,100,59,62,59,71,70,68,77,86,62,64,71,59,66,75,57,63,82,66,61,55,67,70
Schultz - Collins,52,54,67,57,66,55,65,44,75,58,64,74,68,61,54,67,65,60,77,66,69,79,80,85,66,67,72,59,100,73,80,67,74,66,67,56,71,62,66,88,69,74,81,78,58,73,84,56,66,62
"Herzog, Bode and Frami",61,63,50,45,52,52,53,52,65,66,57,74,64,49,65,65,57,50,61,72,56,66,64,76,70,64,67,62,73,100,71,79,67,57,74,61,62,69,55,72,56,64,78,73,63,68,65,65,79,54
Credit Group,56,50,63,57,73,47,65,47,73,62,65,77,66,62,55,67,66,58,67,77,78,70,76,74,74,70,68,59,80,71,100,72,71,71,76,63,79,65,70,76,75,69,86,71,56,70,70,60,70,62
"Gutmann, King and Gorczany",54,53,55,53,57,57,61,61,71,74,55,65,74,55,75,69,70,56,65,76,68,59,74,65,83,79,56,71,67,79,72,100,56,68,82,66,59,85,65,67,66,58,67,76,70,80,69,77,69,58
Medical Alliance,56,63,49,54,71,55,72,55,67,47,68,64,55,73,55,53,59,69,58,53,74,79,66,72,55,54,88,70,74,67,71,56,100,76,57,71,76,50,71,72,73,79,69,62,65,59,61,48,59,68
Medical Systems,55,51,55,58,73,58,75,65,66,65,70,61,66,71,68,60,73,79,65,62,79,72,70,65,65,71,68,68,66,57,71,68,76,100,68,64,83,67,86,65,79,71,62,66,65,66,68,57,51,72
Bashirian Inc,59,55,53,55,59,60,64,55,70,72,54,67,64,57,65,71,64,55,63,81,63,56,81,71,78,75,55,77,67,74,76,82,57,68,100,67,59,82,69,64,63,65,71,74,70,76,67,69,79,64
Credit Partners,54,66,49,49,68,66,73,56,66,57,52,46,50,70,62,55,50,55,50,70,76,65,63,56,77,57,71,86,56,61,63,66,71,64,67,100,67,60,65,58,72,66,62,57,80,62,65,51,55,58
Wealth Group,62,58,54,46,76,50,70,60,59,62,76,63,57,63,59,52,59,64,59,61,78,81,65,69,67,65,73,62,71,62,79,59,76,83,59,67,100,57,80,73,79,76,73,61,60,60,63,54,56,69
Hansen LLC,50,50,52,50,52,53,58,61,65,79,60,58,66,50,65,65,74,54,68,73,60,53,69,61,80,80,57,64,62,69,65,85,50,67,82,60,57,100,64,63,63,53,62,68,68,71,68,82,63,54
Cloud Solutions,53,61,49,52,73,59,77,57,76,65,68,64,63,73,64,65,63,66,62,60,76,70,72,61,60,74,70,71,66,55,70,65,71,86,69,65,80,64,100,62,74,71,60,69,75,68,63,56,51,70
Bruen - Adams,54,59,58,59,63,50,66,48,73,58,66,68,72,58,51,65,67,55,70,63,65,84,74,83,74,70,69,59,88,72,76,67,72,65,64,58,73,63,62,100,64,76,75,67,60,68,83,58,67,63
Trust Holdings,49,48,64,51,74,55,74,53,67,54,65,58,63,64,67,59,65,73,62,63,91,73,69,62,74,64,69,66,69,56,75,66,73,79,63,72,79,63,74,64,100,74,70,64,68,64,69,53,51,73
Stokes and Sons,58,67,49,53,70,58,74,52,69,51,73,63,60,67,65,58,57,63,63,55,80,82,76,81,58,60,78,75,74,64,69,58,79,71,65,66,76,53,71,76,74,100,66,62,69,62,69,46,64,77
Wealth Capital,56,53,63,51,66,48,57,46,67,59,59,72,62,53,53,76,60,55,66,77,68,68,68,73,73,73,66,57,81,78,86,67,69,62,71,62,73,62,60,75,70,66,100,77,56,73,67,57,70,56
Mohr and Sons,44,50,60,55,60,58,60,48,72,64,55,77,72,56,62,73,65,57,72,65,61,59,77,73,68,79,62,63,78,73,71,76,62,66,74,57,61,68,69,67,64,62,77,100,61,91,72,60,61,61
Data Solutions,57,73,45,52,62,70,75,57,73,61,62,50,54,63,67,65,55,61,55,64,70,71,68,57,72,67,64,82,58,63,56,70,65,65,70,80,60,68,75,60,68,69,56,61,100,68,65,55,58,67
"Collier, Bayer and Ward",46,50,60,60,60,57,69,47,73,64,55,68,70,58,63,74,63,54,69,67,66,59,85,70,72,81,57,66,73,68,70,80,59,66,76,62,60,71,68,68,64,62,73,91,68,100,76,58,59,56
"Mitchell, Batz and Pouros",44,49,69,65,61,58,71,44,77,61,58,61,71,63,55,69,73,61,76,66,71,73,84,81,74,72,62,61,84,65,70,69,61,68,67,65,63,68,63,83,69,69,67,72,65,76,100,53,55,59
Cronin and Sons,50,48,44,41,51,47,45,64,55,76,58,54,59,45,60,57,65,47,65,65,51,50,57,57,69,69,54,55,56,65,60,77,48,57,69,51,54,82,56,58,53,46,57,60,55,58,53,100,73,64
Corwin LLC,64,61,45,47,50,54,47,51,59,63,54,66,57,45,55,64,56,45,59,69,50,62,65,74,67,57,57,67,66,79,70,69,59,51,79,55,56,63,51,67,51,64,70,61,58,59,55,73,100,74
Goldner - Bartoletti,53,54,49,49,68,57,64,57,61,54,72,60,62,63,60,57,62,70,64,53,69,76,68,71,57,58,68,70,62,54,62,58,68,72,64,58,69,54,70,63,73,77,56,61,67,56,59,64,74,100
```


---

## APPENDIX B: Complete Potential ARR Analysis (All 50 Companies)

*Sorted by TOTAL_POTENTIAL_ARR descending. All currency values in USD (integers).*

```csv
CUSTOMER_ID,COMPANY_NAME,CURRENT_ARR,CURRENT_PRODUCT_COUNT,POTENTIAL_PRODUCT_COUNT,TOTAL_POTENTIAL_ARR,TOTAL_EXPECTED_POTENTIAL_ARR,TOP_5_SIMILAR_COMPANIES,AVG_SIMILARITY_SCORE,POTENTIAL_PRODUCTS,TOP_PRODUCT_RECOMMENDATION,TOP_PRODUCT_EXPECTED_ARR
CUST_000014,"Ondricka, Waters and Wilderman",1211950,2,3,906579,721535,"Swaniawski Inc, Cyber Systems, Schultz - Collins, Harber LLC, White, Boehm and Hilpert",78.6,"[{""PRODUCT_ID"": ""PROD_UMBRELLA"", ""PRODUCT_NAME"": ""Umbrella"", ""PRODUCT_CATEGORY"": ""Security"", ""POTENTIAL_ARR"": 361494.4782608695, ""EXPECTED_ARR"": 307270.30652173905, ""PURCHASE_PROBABILITY"": 85.0, ""MAX_SIMILARITY_SCORE"": 85, ""ESTIMATED_LICENSES"": 50, ""PRICE_PER_LICENSE"": 7229.889565217391, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Swaniawski Inc, Cyber Systems, White, Boehm and Hilpert""}, {""PRODUCT_ID"": ""PROD_THOUSAND_EYES"", ""PRODUCT_NAME"": ""ThousandEyes"", ""PRODUCT_CATEGORY"": ""Analytics"", ""POTENTIAL_ARR"": 297000.07200000004, ""EXPECTED_ARR"": 225720.05472000004, ""PURCHASE_PROBABILITY"": 76.0, ""MAX_SIMILARITY_SCORE"": 76, ""ESTIMATED_LICENSES"": 72, ""PRICE_PER_LICENSE"": 4125.001, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Harber LLC""}, {""PRODUCT_ID"": ""PROD_SPLUNK"", ""PRODUCT_NAME"": ""Splunk"", ""PRODUCT_CATEGORY"": ""Analytics"", ""POTENTIAL_ARR"": 248084.82, ""EXPECTED_ARR"": 188544.4632, ""PURCHASE_PROBABILITY"": 76.0, ""MAX_SIMILARITY_SCORE"": 76, ""ESTIMATED_LICENSES"": 72, ""PRICE_PER_LICENSE"": 3445.6225, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""White, Boehm and Hilpert""}]",Umbrella,307270
CUST_000013,Clinical Associates,1601116,3,2,804507,635560,"Medical Systems, Harber LLC, Swaniawski Inc, Trust Holdings, Medical Group",75.8,"[{""PRODUCT_ID"": ""PROD_UMBRELLA"", ""PRODUCT_NAME"": ""Umbrella"", ""PRODUCT_CATEGORY"": ""Security"", ""POTENTIAL_ARR"": 477172.7113043478, ""EXPECTED_ARR"": 376966.4419304348, ""PURCHASE_PROBABILITY"": 79.0, ""MAX_SIMILARITY_SCORE"": 79, ""ESTIMATED_LICENSES"": 66, ""PRICE_PER_LICENSE"": 7229.889565217391, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Medical Systems, Swaniawski Inc""}, {""PRODUCT_ID"": ""PROD_SPLUNK"", ""PRODUCT_NAME"": ""Splunk"", ""PRODUCT_CATEGORY"": ""Analytics"", ""POTENTIAL_ARR"": 327334.1375, ""EXPECTED_ARR"": 258593.968625, ""PURCHASE_PROBABILITY"": 79.0, ""MAX_SIMILARITY_SCORE"": 79, ""ESTIMATED_LICENSES"": 95, ""PRICE_PER_LICENSE"": 3445.6225, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Medical Systems""}]",Umbrella,376966
CUST_000008,Swaniawski Inc,1456970,2,2,744338,598450,"Ondricka, Waters and Wilderman, Baumbach, Dietrich and Mueller, Medical Group, Cyber Systems, Clinical Associates",79.4,"[{""PRODUCT_ID"": ""PROD_DUO"", ""PRODUCT_NAME"": ""Duo"", ""PRODUCT_CATEGORY"": ""Security"", ""POTENTIAL_ARR"": 401963.17238095234, ""EXPECTED_ARR"": 341668.69652380946, ""PURCHASE_PROBABILITY"": 85.0, ""MAX_SIMILARITY_SCORE"": 85, ""ESTIMATED_LICENSES"": 58, ""PRICE_PER_LICENSE"": 6930.399523809523, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Ondricka, Waters and Wilderman, Baumbach, Dietrich and Mueller, Medical Group""}, {""PRODUCT_ID"": ""PROD_THOUSAND_EYES"", ""PRODUCT_NAME"": ""ThousandEyes"", ""PRODUCT_CATEGORY"": ""Analytics"", ""POTENTIAL_ARR"": 342375.08300000004, ""EXPECTED_ARR"": 256781.31225000002, ""PURCHASE_PROBABILITY"": 75.0, ""MAX_SIMILARITY_SCORE"": 75, ""ESTIMATED_LICENSES"": 83, ""PRICE_PER_LICENSE"": 4125.001, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Clinical Associates""}]",Duo,341669
CUST_000006,Harber LLC,747423,3,2,708766,538662,"Bode - Mayer, Clinical Associates, Wealth Group, Ondricka, Waters and Wilderman, Kris - Dibbert",76.8,"[{""PRODUCT_ID"": ""PROD_UMBRELLA"", ""PRODUCT_NAME"": ""Umbrella"", ""PRODUCT_CATEGORY"": ""Security"", ""POTENTIAL_ARR"": 419333.5947826087, ""EXPECTED_ARR"": 318693.5320347826, ""PURCHASE_PROBABILITY"": 76.0, ""MAX_SIMILARITY_SCORE"": 76, ""ESTIMATED_LICENSES"": 58, ""PRICE_PER_LICENSE"": 7229.889565217391, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Wealth Group, Kris - Dibbert""}, {""PRODUCT_ID"": ""PROD_SPLUNK"", ""PRODUCT_NAME"": ""Splunk"", ""PRODUCT_CATEGORY"": ""Analytics"", ""POTENTIAL_ARR"": 289432.29, ""EXPECTED_ARR"": 219968.5404, ""PURCHASE_PROBABILITY"": 76.0, ""MAX_SIMILARITY_SCORE"": 76, ""ESTIMATED_LICENSES"": 84, ""PRICE_PER_LICENSE"": 3445.6225, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Wealth Group""}]",Umbrella,318694
CUST_000010,Block - Toy,1797331,3,2,524514,388140,"Gutmann, King and Gorczany, White, Boehm and Hilpert, Swaniawski Inc, Clinical Associates, Investment Management",73.2,"[{""PRODUCT_ID"": ""PROD_UMBRELLA"", ""PRODUCT_NAME"": ""Umbrella"", ""PRODUCT_CATEGORY"": ""Security"", ""POTENTIAL_ARR"": 310885.25130434777, ""EXPECTED_ARR"": 230055.08596521735, ""PURCHASE_PROBABILITY"": 74.0, ""MAX_SIMILARITY_SCORE"": 74, ""ESTIMATED_LICENSES"": 43, ""PRICE_PER_LICENSE"": 7229.889565217391, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""White, Boehm and Hilpert, Swaniawski Inc, Investment Management""}, {""PRODUCT_ID"": ""PROD_SPLUNK"", ""PRODUCT_NAME"": ""Splunk"", ""PRODUCT_CATEGORY"": ""Analytics"", ""POTENTIAL_ARR"": 213628.595, ""EXPECTED_ARR"": 158085.1603, ""PURCHASE_PROBABILITY"": 74.0, ""MAX_SIMILARITY_SCORE"": 74, ""ESTIMATED_LICENSES"": 62, ""PRICE_PER_LICENSE"": 3445.6225, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""White, Boehm and Hilpert""}]",Umbrella,230055
CUST_000009,Quality Corporation,1004742,3,2,469379,360549,"Advanced Manufacturing Co, Global Financial Partners, Medical Alliance, Cloud Solutions, Capital Management",76.0,"[{""PRODUCT_ID"": ""PROD_THOUSAND_EYES"", ""PRODUCT_NAME"": ""ThousandEyes"", ""PRODUCT_CATEGORY"": ""Analytics"", ""POTENTIAL_ARR"": 255750.062, ""EXPECTED_ARR"": 204600.04960000003, ""PURCHASE_PROBABILITY"": 80.0, ""MAX_SIMILARITY_SCORE"": 80, ""ESTIMATED_LICENSES"": 62, ""PRICE_PER_LICENSE"": 4125.001, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Global Financial Partners, Capital Management""}, {""PRODUCT_ID"": ""PROD_SPLUNK"", ""PRODUCT_NAME"": ""Splunk"", ""PRODUCT_CATEGORY"": ""Analytics"", ""POTENTIAL_ARR"": 213628.595, ""EXPECTED_ARR"": 155948.87435, ""PURCHASE_PROBABILITY"": 73.0, ""MAX_SIMILARITY_SCORE"": 73, ""ESTIMATED_LICENSES"": 62, ""PRICE_PER_LICENSE"": 3445.6225, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Cloud Solutions""}]",ThousandEyes,204600
CUST_000011,Cyber Systems,1209071,2,2,447368,354650,"Data Innovations, Ondricka, Waters and Wilderman, Investment Management, Swaniawski Inc, InnovateTech Solutions",78.6,"[{""PRODUCT_ID"": ""PROD_MERAKI"", ""PRODUCT_NAME"": ""Meraki"", ""PRODUCT_CATEGORY"": ""Networking"", ""POTENTIAL_ARR"": 254413.63393939394, ""EXPECTED_ARR"": 206075.0434909091, ""PURCHASE_PROBABILITY"": 81.0, ""MAX_SIMILARITY_SCORE"": 81, ""ESTIMATED_LICENSES"": 56, ""PRICE_PER_LICENSE"": 4543.100606060606, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Data Innovations, Ondricka, Waters and Wilderman, Swaniawski Inc""}, {""PRODUCT_ID"": ""PROD_SPLUNK"", ""PRODUCT_NAME"": ""Splunk"", ""PRODUCT_CATEGORY"": ""Analytics"", ""POTENTIAL_ARR"": 192954.86, ""EXPECTED_ARR"": 148575.24219999998, ""PURCHASE_PROBABILITY"": 77.0, ""MAX_SIMILARITY_SCORE"": 77, ""ESTIMATED_LICENSES"": 56, ""PRICE_PER_LICENSE"": 3445.6225, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""InnovateTech Solutions""}]",Meraki,206075
CUST_000003,Global Financial Partners,804011,3,2,428773,335989,"Capital Management, Quality Corporation, Advanced Manufacturing Co, Wealth Group, Trust Holdings",77.8,"[{""PRODUCT_ID"": ""PROD_UMBRELLA"", ""PRODUCT_NAME"": ""Umbrella"", ""PRODUCT_CATEGORY"": ""Security"", ""POTENTIAL_ARR"": 253046.13478260866, ""EXPECTED_ARR"": 202436.90782608694, ""PURCHASE_PROBABILITY"": 80.0, ""MAX_SIMILARITY_SCORE"": 80, ""ESTIMATED_LICENSES"": 35, ""PRICE_PER_LICENSE"": 7229.889565217391, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Quality Corporation, Advanced Manufacturing Co, Wealth Group""}, {""PRODUCT_ID"": ""PROD_SPLUNK"", ""PRODUCT_NAME"": ""Splunk"", ""PRODUCT_CATEGORY"": ""Analytics"", ""POTENTIAL_ARR"": 175726.7475, ""EXPECTED_ARR"": 133552.3281, ""PURCHASE_PROBABILITY"": 76.0, ""MAX_SIMILARITY_SCORE"": 76, ""ESTIMATED_LICENSES"": 51, ""PRICE_PER_LICENSE"": 3445.6225, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Wealth Group""}]",Umbrella,202437
CUST_000012,Medical Group,536311,2,2,428773,328187,"Swaniawski Inc, Hansen LLC, Ondricka, Waters and Wilderman, Data Innovations, Medical Systems",74.6,"[{""PRODUCT_ID"": ""PROD_UMBRELLA"", ""PRODUCT_NAME"": ""Umbrella"", ""PRODUCT_CATEGORY"": ""Security"", ""POTENTIAL_ARR"": 253046.13478260866, ""EXPECTED_ARR"": 199906.44647826086, ""PURCHASE_PROBABILITY"": 79.0, ""MAX_SIMILARITY_SCORE"": 79, ""ESTIMATED_LICENSES"": 35, ""PRICE_PER_LICENSE"": 7229.889565217391, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Swaniawski Inc, Medical Systems""}, {""PRODUCT_ID"": ""PROD_SPLUNK"", ""PRODUCT_NAME"": ""Splunk"", ""PRODUCT_CATEGORY"": ""Analytics"", ""POTENTIAL_ARR"": 175726.7475, ""EXPECTED_ARR"": 128280.525675, ""PURCHASE_PROBABILITY"": 73.0, ""MAX_SIMILARITY_SCORE"": 73, ""ESTIMATED_LICENSES"": 51, ""PRICE_PER_LICENSE"": 3445.6225, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Medical Systems""}]",Umbrella,199906
CUST_000029,Medical Systems,215678,3,2,416069,328694,"Cloud Solutions, Wealth Group, Capital Management, Clinical Associates, Trust Holdings",81.2,"[{""PRODUCT_ID"": ""PROD_MERAKI"", ""PRODUCT_NAME"": ""Meraki"", ""PRODUCT_CATEGORY"": ""Networking"", ""POTENTIAL_ARR"": 218068.8290909091, ""EXPECTED_ARR"": 172274.3749818182, ""PURCHASE_PROBABILITY"": 79.0, ""MAX_SIMILARITY_SCORE"": 79, ""ESTIMATED_LICENSES"": 48, ""PRICE_PER_LICENSE"": 4543.100606060606, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Capital Management, Clinical Associates, Trust Holdings""}, {""PRODUCT_ID"": ""PROD_THOUSAND_EYES"", ""PRODUCT_NAME"": ""ThousandEyes"", ""PRODUCT_CATEGORY"": ""Analytics"", ""POTENTIAL_ARR"": 198000.048, ""EXPECTED_ARR"": 156420.03792, ""PURCHASE_PROBABILITY"": 79.0, ""MAX_SIMILARITY_SCORE"": 79, ""ESTIMATED_LICENSES"": 48, ""PRICE_PER_LICENSE"": 4125.001, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Capital Management, Clinical Associates, Trust Holdings""}]",Meraki,172274
CUST_000042,"Mitchell, Batz and Pouros",420242,2,2,414652,334031,"Schultz - Collins, Smith, Ratke and Ankunding, Bruen - Adams, Pagac - Muller, InnovateTech Solutions",81.8,"[{""PRODUCT_ID"": ""PROD_UMBRELLA"", ""PRODUCT_NAME"": ""Umbrella"", ""PRODUCT_CATEGORY"": ""Security"", ""POTENTIAL_ARR"": 245816.2452173913, ""EXPECTED_ARR"": 204027.48353043475, ""PURCHASE_PROBABILITY"": 83.0, ""MAX_SIMILARITY_SCORE"": 83, ""ESTIMATED_LICENSES"": 34, ""PRICE_PER_LICENSE"": 7229.889565217391, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Bruen - Adams, InnovateTech Solutions""}, {""PRODUCT_ID"": ""PROD_SPLUNK"", ""PRODUCT_NAME"": ""Splunk"", ""PRODUCT_CATEGORY"": ""Analytics"", ""POTENTIAL_ARR"": 168835.5025, ""EXPECTED_ARR"": 130003.33692500001, ""PURCHASE_PROBABILITY"": 77.0, ""MAX_SIMILARITY_SCORE"": 77, ""ESTIMATED_LICENSES"": 49, ""PRICE_PER_LICENSE"": 3445.6225, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""InnovateTech Solutions""}]",Umbrella,204027
CUST_000035,Bruen - Adams,152780,2,2,400467,344986,"Schultz - Collins, Bode - Mayer, Mitchell, Batz and Pouros, Pagac - Muller, Credit Group",82.8,"[{""PRODUCT_ID"": ""PROD_DUO"", ""PRODUCT_NAME"": ""Duo"", ""PRODUCT_CATEGORY"": ""Security"", ""POTENTIAL_ARR"": 214842.38523809522, ""EXPECTED_ARR"": 189061.2990095238, ""PURCHASE_PROBABILITY"": 88.0, ""MAX_SIMILARITY_SCORE"": 88, ""ESTIMATED_LICENSES"": 31, ""PRICE_PER_LICENSE"": 6930.399523809523, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Schultz - Collins, Bode - Mayer, Mitchell, Batz and Pouros""}, {""PRODUCT_ID"": ""PROD_THOUSAND_EYES"", ""PRODUCT_NAME"": ""ThousandEyes"", ""PRODUCT_CATEGORY"": ""Analytics"", ""POTENTIAL_ARR"": 185625.045, ""EXPECTED_ARR"": 155925.0378, ""PURCHASE_PROBABILITY"": 84.0, ""MAX_SIMILARITY_SCORE"": 84, ""ESTIMATED_LICENSES"": 45, ""PRICE_PER_LICENSE"": 4125.001, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Bode - Mayer""}]",Duo,189061
CUST_000002,MedSecure Systems,3627162,3,1,368682,258077,"Global Capital Management, InnovateTech Solutions, Medical Group, Swaniawski Inc, Smith, Ratke and Ankunding",70.2,"[{""PRODUCT_ID"": ""PROD_SPLUNK"", ""PRODUCT_NAME"": ""Splunk"", ""PRODUCT_CATEGORY"": ""Analytics"", ""POTENTIAL_ARR"": 368681.6075, ""EXPECTED_ARR"": 258077.12524999998, ""PURCHASE_PROBABILITY"": 70.0, ""MAX_SIMILARITY_SCORE"": 70, ""ESTIMATED_LICENSES"": 107, ""PRICE_PER_LICENSE"": 3445.6225, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""InnovateTech Solutions""}]",Splunk,258077
CUST_000019,Pagac - Muller,131258,2,2,367437,301673,"Schultz - Collins, Smith, Ratke and Ankunding, Bruen - Adams, Mitchell, Batz and Pouros, Stokes and Sons",82.6,"[{""PRODUCT_ID"": ""PROD_UMBRELLA"", ""PRODUCT_NAME"": ""Umbrella"", ""PRODUCT_CATEGORY"": ""Security"", ""POTENTIAL_ARR"": 202436.90782608694, ""EXPECTED_ARR"": 168022.63349565215, ""PURCHASE_PROBABILITY"": 83.0, ""MAX_SIMILARITY_SCORE"": 83, ""ESTIMATED_LICENSES"": 28, ""PRICE_PER_LICENSE"": 7229.889565217391, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Bruen - Adams""}, {""PRODUCT_ID"": ""PROD_THOUSAND_EYES"", ""PRODUCT_NAME"": ""ThousandEyes"", ""PRODUCT_CATEGORY"": ""Analytics"", ""POTENTIAL_ARR"": 165000.04, ""EXPECTED_ARR"": 133650.03240000003, ""PURCHASE_PROBABILITY"": 81.0, ""MAX_SIMILARITY_SCORE"": 81, ""ESTIMATED_LICENSES"": 40, ""PRICE_PER_LICENSE"": 4125.001, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Stokes and Sons""}]",Umbrella,168023
CUST_000007,"Baumbach, Dietrich and Mueller",1091244,2,1,358905,290713,"Swaniawski Inc, Credit Group, Mohr and Sons, Ondricka, Waters and Wilderman, Herzog, Bode and Frami",77.0,"[{""PRODUCT_ID"": ""PROD_MERAKI"", ""PRODUCT_NAME"": ""Meraki"", ""PRODUCT_CATEGORY"": ""Networking"", ""POTENTIAL_ARR"": 358904.9478787879, ""EXPECTED_ARR"": 290713.0077818182, ""PURCHASE_PROBABILITY"": 81.0, ""MAX_SIMILARITY_SCORE"": 81, ""ESTIMATED_LICENSES"": 79, ""PRICE_PER_LICENSE"": 4543.100606060606, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Swaniawski Inc, Mohr and Sons, Ondricka, Waters and Wilderman""}]",Meraki,290713
CUST_000032,Wealth Group,320768,3,2,329388,266804,"Medical Systems, Bode - Mayer, Cloud Solutions, Trust Holdings, Credit Group",80.4,"[{""PRODUCT_ID"": ""PROD_MERAKI"", ""PRODUCT_NAME"": ""Meraki"", ""PRODUCT_CATEGORY"": ""Networking"", ""POTENTIAL_ARR"": 172637.82303030303, ""EXPECTED_ARR"": 139836.63665454547, ""PURCHASE_PROBABILITY"": 81.0, ""MAX_SIMILARITY_SCORE"": 81, ""ESTIMATED_LICENSES"": 38, ""PRICE_PER_LICENSE"": 4543.100606060606, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Bode - Mayer, Trust Holdings""}, {""PRODUCT_ID"": ""PROD_THOUSAND_EYES"", ""PRODUCT_NAME"": ""ThousandEyes"", ""PRODUCT_CATEGORY"": ""Analytics"", ""POTENTIAL_ARR"": 156750.038, ""EXPECTED_ARR"": 126967.53078000002, ""PURCHASE_PROBABILITY"": 81.0, ""MAX_SIMILARITY_SCORE"": 81, ""ESTIMATED_LICENSES"": 38, ""PRICE_PER_LICENSE"": 4125.001, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Bode - Mayer, Trust Holdings""}]",Meraki,139837
CUST_000034,Cloud Solutions,395737,3,2,303384,232162,"Medical Systems, Wealth Group, Advanced Manufacturing Co, InnovateTech Solutions, Capital Management",79.0,"[{""PRODUCT_ID"": ""PROD_MERAKI"", ""PRODUCT_NAME"": ""Meraki"", ""PRODUCT_CATEGORY"": ""Networking"", ""POTENTIAL_ARR"": 159008.5212121212, ""EXPECTED_ARR"": 122436.56133333333, ""PURCHASE_PROBABILITY"": 77.0, ""MAX_SIMILARITY_SCORE"": 77, ""ESTIMATED_LICENSES"": 35, ""PRICE_PER_LICENSE"": 4543.100606060606, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Advanced Manufacturing Co, Capital Management""}, {""PRODUCT_ID"": ""PROD_THOUSAND_EYES"", ""PRODUCT_NAME"": ""ThousandEyes"", ""PRODUCT_CATEGORY"": ""Analytics"", ""POTENTIAL_ARR"": 144375.035, ""EXPECTED_ARR"": 109725.0266, ""PURCHASE_PROBABILITY"": 76.0, ""MAX_SIMILARITY_SCORE"": 76, ""ESTIMATED_LICENSES"": 35, ""PRICE_PER_LICENSE"": 4125.001, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Capital Management""}]",Meraki,122437
CUST_000004,Global Medical Network,4199901,3,2,280113,189705,"Global Premier Works, Global Quality Industries, Block - Toy, Medical Systems, White, Boehm and Hilpert",68.6,"[{""PRODUCT_ID"": ""PROD_THOUSAND_EYES"", ""PRODUCT_NAME"": ""ThousandEyes"", ""PRODUCT_CATEGORY"": ""Analytics"", ""POTENTIAL_ARR"": 152625.037, ""EXPECTED_ARR"": 106837.52590000001, ""PURCHASE_PROBABILITY"": 70.0, ""MAX_SIMILARITY_SCORE"": 70, ""ESTIMATED_LICENSES"": 37, ""PRICE_PER_LICENSE"": 4125.001, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Global Quality Industries, Block - Toy""}, {""PRODUCT_ID"": ""PROD_SPLUNK"", ""PRODUCT_NAME"": ""Splunk"", ""PRODUCT_CATEGORY"": ""Analytics"", ""POTENTIAL_ARR"": 127488.0325, ""EXPECTED_ARR"": 82867.221125, ""PURCHASE_PROBABILITY"": 65.0, ""MAX_SIMILARITY_SCORE"": 65, ""ESTIMATED_LICENSES"": 37, ""PRICE_PER_LICENSE"": 3445.6225, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Medical Systems, White, Boehm and Hilpert""}]",ThousandEyes,106838
CUST_000004,Advanced Manufacturing Co,140615,3,2,280113,224090,"Quality Corporation, Capital Management, InnovateTech Solutions, Global Financial Partners, Cloud Solutions",79.2,"[{""PRODUCT_ID"": ""PROD_THOUSAND_EYES"", ""PRODUCT_NAME"": ""ThousandEyes"", ""PRODUCT_CATEGORY"": ""Analytics"", ""POTENTIAL_ARR"": 152625.037, ""EXPECTED_ARR"": 122100.02960000001, ""PURCHASE_PROBABILITY"": 80.0, ""MAX_SIMILARITY_SCORE"": 80, ""ESTIMATED_LICENSES"": 37, ""PRICE_PER_LICENSE"": 4125.001, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Capital Management, Global Financial Partners""}, {""PRODUCT_ID"": ""PROD_SPLUNK"", ""PRODUCT_NAME"": ""Splunk"", ""PRODUCT_CATEGORY"": ""Analytics"", ""POTENTIAL_ARR"": 127488.0325, ""EXPECTED_ARR"": 101990.426, ""PURCHASE_PROBABILITY"": 80.0, ""MAX_SIMILARITY_SCORE"": 80, ""ESTIMATED_LICENSES"": 37, ""PRICE_PER_LICENSE"": 3445.6225, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""InnovateTech Solutions, Cloud Solutions""}]",ThousandEyes,122100
CUST_000001,TechCorp Industries,1522871,3,1,264000,192720,"Data Solutions, Global Financial Partners, Global Premier Works, Block - Toy, Harber LLC",70.6,"[{""PRODUCT_ID"": ""PROD_THOUSAND_EYES"", ""PRODUCT_NAME"": ""ThousandEyes"", ""PRODUCT_CATEGORY"": ""Analytics"", ""POTENTIAL_ARR"": 264000.064, ""EXPECTED_ARR"": 192720.04672, ""PURCHASE_PROBABILITY"": 73.0, ""MAX_SIMILARITY_SCORE"": 73, ""ESTIMATED_LICENSES"": 64, ""PRICE_PER_LICENSE"": 4125.001, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Data Solutions, Global Financial Partners, Block - Toy""}]",ThousandEyes,192720
CUST_000001,Global Premier Works,3386280,3,1,264000,208560,"Global Quality Industries, Global Medical Network, TechCorp Industries, Block - Toy, Corwin LLC",71.0,"[{""PRODUCT_ID"": ""PROD_THOUSAND_EYES"", ""PRODUCT_NAME"": ""ThousandEyes"", ""PRODUCT_CATEGORY"": ""Analytics"", ""POTENTIAL_ARR"": 264000.064, ""EXPECTED_ARR"": 208560.05056000003, ""PURCHASE_PROBABILITY"": 79.0, ""MAX_SIMILARITY_SCORE"": 79, ""ESTIMATED_LICENSES"": 64, ""PRICE_PER_LICENSE"": 4125.001, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Global Quality Industries, Block - Toy""}]",ThousandEyes,208560
CUST_000015,Investment Management,811945,2,1,258957,201986,"Bashirian Inc, Cyber Systems, Credit Advisors, Credit Group, Wealth Capital",78.4,"[{""PRODUCT_ID"": ""PROD_MERAKI"", ""PRODUCT_NAME"": ""Meraki"", ""PRODUCT_CATEGORY"": ""Networking"", ""POTENTIAL_ARR"": 258956.73454545453, ""EXPECTED_ARR"": 201986.25294545453, ""PURCHASE_PROBABILITY"": 78.0, ""MAX_SIMILARITY_SCORE"": 78, ""ESTIMATED_LICENSES"": 57, ""PRICE_PER_LICENSE"": 4543.100606060606, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Credit Advisors""}]",Meraki,201986
CUST_000040,Data Solutions,119330,3,2,258642,204609,"Smith LLC, Credit Partners, Cloud Solutions, Advanced Manufacturing Co, TechCorp Industries",77.0,"[{""PRODUCT_ID"": ""PROD_UMBRELLA"", ""PRODUCT_NAME"": ""Umbrella"", ""PRODUCT_CATEGORY"": ""Security"", ""POTENTIAL_ARR"": 151827.6808695652, ""EXPECTED_ARR"": 124498.69831304345, ""PURCHASE_PROBABILITY"": 82.0, ""MAX_SIMILARITY_SCORE"": 82, ""ESTIMATED_LICENSES"": 21, ""PRICE_PER_LICENSE"": 7229.889565217391, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Smith LLC, Credit Partners, Cloud Solutions""}, {""PRODUCT_ID"": ""PROD_SPLUNK"", ""PRODUCT_NAME"": ""Splunk"", ""PRODUCT_CATEGORY"": ""Analytics"", ""POTENTIAL_ARR"": 106814.2975, ""EXPECTED_ARR"": 80110.723125, ""PURCHASE_PROBABILITY"": 75.0, ""MAX_SIMILARITY_SCORE"": 75, ""ESTIMATED_LICENSES"": 31, ""PRICE_PER_LICENSE"": 3445.6225, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Cloud Solutions""}]",Umbrella,124499
CUST_000003,Global Quality Industries,3222435,3,1,253046,199906,"Global Premier Works, Global Medical Network, Data Solutions, Quality Corporation, Smith LLC",71.2,"[{""PRODUCT_ID"": ""PROD_UMBRELLA"", ""PRODUCT_NAME"": ""Umbrella"", ""PRODUCT_CATEGORY"": ""Security"", ""POTENTIAL_ARR"": 253046.13478260866, ""EXPECTED_ARR"": 199906.44647826086, ""PURCHASE_PROBABILITY"": 79.0, ""MAX_SIMILARITY_SCORE"": 79, ""ESTIMATED_LICENSES"": 35, ""PRICE_PER_LICENSE"": 7229.889565217391, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Global Premier Works, Global Medical Network, Quality Corporation""}]",Umbrella,199906
CUST_000033,Hansen LLC,82833,2,1,253046,207498,"Gutmann, King and Gorczany, Bashirian Inc, Cronin and Sons, Credit Advisors, Data Innovations",81.8,"[{""PRODUCT_ID"": ""PROD_UMBRELLA"", ""PRODUCT_NAME"": ""Umbrella"", ""PRODUCT_CATEGORY"": ""Security"", ""POTENTIAL_ARR"": 253046.13478260866, ""EXPECTED_ARR"": 207497.8305217391, ""PURCHASE_PROBABILITY"": 82.0, ""MAX_SIMILARITY_SCORE"": 82, ""ESTIMATED_LICENSES"": 35, ""PRICE_PER_LICENSE"": 7229.889565217391, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Bashirian Inc, Credit Advisors""}]",Umbrella,207498
CUST_000021,Data Innovations,331717,2,1,245816,199111,"Collier, Bayer and Ward, Cyber Systems, Hansen LLC, Mohr and Sons, Gutmann, King and Gorczany",80.0,"[{""PRODUCT_ID"": ""PROD_UMBRELLA"", ""PRODUCT_NAME"": ""Umbrella"", ""PRODUCT_CATEGORY"": ""Security"", ""POTENTIAL_ARR"": 245816.2452173913, ""EXPECTED_ARR"": 199111.15862608695, ""PURCHASE_PROBABILITY"": 81.0, ""MAX_SIMILARITY_SCORE"": 81, ""ESTIMATED_LICENSES"": 34, ""PRICE_PER_LICENSE"": 7229.889565217391, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Cyber Systems""}]",Umbrella,199111
CUST_000026,Credit Group,441614,2,3,242274,191480,"Wealth Capital, Schultz - Collins, Wealth Group, Capital Management, Baumbach, Dietrich and Mueller",80.0,"[{""PRODUCT_ID"": ""PROD_MERAKI"", ""PRODUCT_NAME"": ""Meraki"", ""PRODUCT_CATEGORY"": ""Networking"", ""POTENTIAL_ARR"": 90862.01212121212, ""EXPECTED_ARR"": 72689.6096969697, ""PURCHASE_PROBABILITY"": 80.0, ""MAX_SIMILARITY_SCORE"": 80, ""ESTIMATED_LICENSES"": 20, ""PRICE_PER_LICENSE"": 4543.100606060606, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Schultz - Collins, Capital Management""}, {""PRODUCT_ID"": ""PROD_THOUSAND_EYES"", ""PRODUCT_NAME"": ""ThousandEyes"", ""PRODUCT_CATEGORY"": ""Analytics"", ""POTENTIAL_ARR"": 82500.02, ""EXPECTED_ARR"": 64350.015600000006, ""PURCHASE_PROBABILITY"": 78.0, ""MAX_SIMILARITY_SCORE"": 78, ""ESTIMATED_LICENSES"": 20, ""PRICE_PER_LICENSE"": 4125.001, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Capital Management""}, {""PRODUCT_ID"": ""PROD_SPLUNK"", ""PRODUCT_NAME"": ""Splunk"", ""PRODUCT_CATEGORY"": ""Analytics"", ""POTENTIAL_ARR"": 68912.45, ""EXPECTED_ARR"": 54440.8355, ""PURCHASE_PROBABILITY"": 79.0, ""MAX_SIMILARITY_SCORE"": 79, ""ESTIMATED_LICENSES"": 20, ""PRICE_PER_LICENSE"": 3445.6225, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Wealth Group""}]",Meraki,72690
CUST_000017,Bode - Mayer,323711,3,2,233845,193536,"Bruen - Adams, Stokes and Sons, Wealth Group, Schultz - Collins, Medical Alliance",81.0,"[{""PRODUCT_ID"": ""PROD_UMBRELLA"", ""PRODUCT_NAME"": ""Umbrella"", ""PRODUCT_CATEGORY"": ""Security"", ""POTENTIAL_ARR"": 137367.9017391304, ""EXPECTED_ARR"": 115389.03746086954, ""PURCHASE_PROBABILITY"": 84.0, ""MAX_SIMILARITY_SCORE"": 84, ""ESTIMATED_LICENSES"": 19, ""PRICE_PER_LICENSE"": 7229.889565217391, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Bruen - Adams, Wealth Group, Medical Alliance""}, {""PRODUCT_ID"": ""PROD_SPLUNK"", ""PRODUCT_NAME"": ""Splunk"", ""PRODUCT_CATEGORY"": ""Analytics"", ""POTENTIAL_ARR"": 96477.43, ""EXPECTED_ARR"": 78146.7183, ""PURCHASE_PROBABILITY"": 81.0, ""MAX_SIMILARITY_SCORE"": 81, ""ESTIMATED_LICENSES"": 28, ""PRICE_PER_LICENSE"": 3445.6225, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Wealth Group""}]",Umbrella,115389
CUST_000039,Mohr and Sons,396896,2,1,224127,172577,"Collier, Bayer and Ward, Data Innovations, Schultz - Collins, Wealth Capital, Smith, Ratke and Ankunding",80.4,"[{""PRODUCT_ID"": ""PROD_UMBRELLA"", ""PRODUCT_NAME"": ""Umbrella"", ""PRODUCT_CATEGORY"": ""Security"", ""POTENTIAL_ARR"": 224126.5765217391, ""EXPECTED_ARR"": 172577.4639217391, ""PURCHASE_PROBABILITY"": 77.0, ""MAX_SIMILARITY_SCORE"": 77, ""ESTIMATED_LICENSES"": 31, ""PRICE_PER_LICENSE"": 7229.889565217391, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Wealth Capital""}]",Umbrella,172577
CUST_000037,Stokes and Sons,490470,3,1,216897,171348,"Bode - Mayer, Pagac - Muller, Capital Management, Medical Alliance, Kris - Dibbert",80.0,"[{""PRODUCT_ID"": ""PROD_UMBRELLA"", ""PRODUCT_NAME"": ""Umbrella"", ""PRODUCT_CATEGORY"": ""Security"", ""POTENTIAL_ARR"": 216896.6869565217, ""EXPECTED_ARR"": 171348.38269565217, ""PURCHASE_PROBABILITY"": 79.0, ""MAX_SIMILARITY_SCORE"": 79, ""ESTIMATED_LICENSES"": 30, ""PRICE_PER_LICENSE"": 7229.889565217391, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Medical Alliance, Kris - Dibbert""}]",Umbrella,171348
CUST_000030,Bashirian Inc,88638,2,1,213526,175091,"Hansen LLC, Gutmann, King and Gorczany, Smith, Ratke and Ankunding, Investment Management, Corwin LLC",81.0,"[{""PRODUCT_ID"": ""PROD_MERAKI"", ""PRODUCT_NAME"": ""Meraki"", ""PRODUCT_CATEGORY"": ""Networking"", ""POTENTIAL_ARR"": 213525.72848484849, ""EXPECTED_ARR"": 175091.09735757575, ""PURCHASE_PROBABILITY"": 82.0, ""MAX_SIMILARITY_SCORE"": 82, ""ESTIMATED_LICENSES"": 47, ""PRICE_PER_LICENSE"": 4543.100606060606, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Hansen LLC, Gutmann, King and Gorczany, Smith, Ratke and Ankunding""}]",Meraki,175091
CUST_000024,Schultz - Collins,464096,2,1,202437,178144,"Bruen - Adams, Pagac - Muller, Mitchell, Batz and Pouros, Wealth Capital, Credit Group",83.6,"[{""PRODUCT_ID"": ""PROD_UMBRELLA"", ""PRODUCT_NAME"": ""Umbrella"", ""PRODUCT_CATEGORY"": ""Security"", ""POTENTIAL_ARR"": 202436.90782608694, ""EXPECTED_ARR"": 178144.47888695652, ""PURCHASE_PROBABILITY"": 88.0, ""MAX_SIMILARITY_SCORE"": 88, ""ESTIMATED_LICENSES"": 28, ""PRICE_PER_LICENSE"": 7229.889565217391, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Bruen - Adams, Wealth Capital, Credit Group""}]",Umbrella,178144
CUST_000041,"Collier, Bayer and Ward",80903,2,1,202437,153852,"Mohr and Sons, Smith, Ratke and Ankunding, Data Innovations, Gutmann, King and Gorczany, Bashirian Inc",82.6,"[{""PRODUCT_ID"": ""PROD_UMBRELLA"", ""PRODUCT_NAME"": ""Umbrella"", ""PRODUCT_CATEGORY"": ""Security"", ""POTENTIAL_ARR"": 202436.90782608694, ""EXPECTED_ARR"": 153852.04994782608, ""PURCHASE_PROBABILITY"": 76.0, ""MAX_SIMILARITY_SCORE"": 76, ""ESTIMATED_LICENSES"": 28, ""PRICE_PER_LICENSE"": 7229.889565217391, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Bashirian Inc""}]",Umbrella,153852
CUST_000038,Wealth Capital,424729,2,1,177181,143517,"Credit Group, Schultz - Collins, Herzog, Bode and Frami, Investment Management, Mohr and Sons",79.8,"[{""PRODUCT_ID"": ""PROD_MERAKI"", ""PRODUCT_NAME"": ""Meraki"", ""PRODUCT_CATEGORY"": ""Networking"", ""POTENTIAL_ARR"": 177180.92363636364, ""EXPECTED_ARR"": 143516.54814545455, ""PURCHASE_PROBABILITY"": 81.0, ""MAX_SIMILARITY_SCORE"": 81, ""ESTIMATED_LICENSES"": 39, ""PRICE_PER_LICENSE"": 4543.100606060606, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Schultz - Collins, Mohr and Sons""}]",Meraki,143517
CUST_000022,Kris - Dibbert,215609,3,2,174124,131855,"Medical Alliance, Stokes and Sons, Bode - Mayer, Harber LLC, Wealth Group",77.8,"[{""PRODUCT_ID"": ""PROD_THOUSAND_EYES"", ""PRODUCT_NAME"": ""ThousandEyes"", ""PRODUCT_CATEGORY"": ""Analytics"", ""POTENTIAL_ARR"": 94875.023, ""EXPECTED_ARR"": 74002.51794, ""PURCHASE_PROBABILITY"": 78.0, ""MAX_SIMILARITY_SCORE"": 78, ""ESTIMATED_LICENSES"": 23, ""PRICE_PER_LICENSE"": 4125.001, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Stokes and Sons, Bode - Mayer, Harber LLC""}, {""PRODUCT_ID"": ""PROD_SPLUNK"", ""PRODUCT_NAME"": ""Splunk"", ""PRODUCT_CATEGORY"": ""Analytics"", ""POTENTIAL_ARR"": 79249.3175, ""EXPECTED_ARR"": 57852.001775000004, ""PURCHASE_PROBABILITY"": 73.0, ""MAX_SIMILARITY_SCORE"": 73, ""ESTIMATED_LICENSES"": 23, ""PRICE_PER_LICENSE"": 3445.6225, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Wealth Group""}]",ThousandEyes,74003
CUST_000028,Medical Alliance,181551,3,2,174124,135181,"Kris - Dibbert, Bode - Mayer, Stokes and Sons, Medical Systems, Wealth Group",79.6,"[{""PRODUCT_ID"": ""PROD_THOUSAND_EYES"", ""PRODUCT_NAME"": ""ThousandEyes"", ""PRODUCT_CATEGORY"": ""Analytics"", ""POTENTIAL_ARR"": 94875.023, ""EXPECTED_ARR"": 74951.26817000001, ""PURCHASE_PROBABILITY"": 79.0, ""MAX_SIMILARITY_SCORE"": 79, ""ESTIMATED_LICENSES"": 23, ""PRICE_PER_LICENSE"": 4125.001, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Bode - Mayer, Stokes and Sons""}, {""PRODUCT_ID"": ""PROD_SPLUNK"", ""PRODUCT_NAME"": ""Splunk"", ""PRODUCT_CATEGORY"": ""Analytics"", ""POTENTIAL_ARR"": 79249.3175, ""EXPECTED_ARR"": 60229.48130000001, ""PURCHASE_PROBABILITY"": 76.0, ""MAX_SIMILARITY_SCORE"": 76, ""ESTIMATED_LICENSES"": 23, ""PRICE_PER_LICENSE"": 3445.6225, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Medical Systems, Wealth Group""}]",ThousandEyes,74951
CUST_000016,Capital Management,439445,3,2,173577,138138,"Trust Holdings, Global Financial Partners, Advanced Manufacturing Co, Stokes and Sons, Medical Systems",82.2,"[{""PRODUCT_ID"": ""PROD_UMBRELLA"", ""PRODUCT_NAME"": ""Umbrella"", ""PRODUCT_CATEGORY"": ""Security"", ""POTENTIAL_ARR"": 101218.45391304347, ""EXPECTED_ARR"": 80974.76313043479, ""PURCHASE_PROBABILITY"": 80.0, ""MAX_SIMILARITY_SCORE"": 80, ""ESTIMATED_LICENSES"": 14, ""PRICE_PER_LICENSE"": 7229.889565217391, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Advanced Manufacturing Co, Medical Systems""}, {""PRODUCT_ID"": ""PROD_SPLUNK"", ""PRODUCT_NAME"": ""Splunk"", ""PRODUCT_CATEGORY"": ""Analytics"", ""POTENTIAL_ARR"": 72358.0725, ""EXPECTED_ARR"": 57162.877275, ""PURCHASE_PROBABILITY"": 79.0, ""MAX_SIMILARITY_SCORE"": 79, ""ESTIMATED_LICENSES"": 21, ""PRICE_PER_LICENSE"": 3445.6225, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Medical Systems""}]",Umbrella,80975
CUST_000018,"Smith, Ratke and Ankunding",407999,2,1,159058,128837,"Collier, Bayer and Ward, Mitchell, Batz and Pouros, Pagac - Muller, Bashirian Inc, Schultz - Collins",82.6,"[{""PRODUCT_ID"": ""PROD_UMBRELLA"", ""PRODUCT_NAME"": ""Umbrella"", ""PRODUCT_CATEGORY"": ""Security"", ""POTENTIAL_ARR"": 159057.5704347826, ""EXPECTED_ARR"": 128836.63205217391, ""PURCHASE_PROBABILITY"": 81.0, ""MAX_SIMILARITY_SCORE"": 81, ""ESTIMATED_LICENSES"": 22, ""PRICE_PER_LICENSE"": 7229.889565217391, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Bashirian Inc""}]",Umbrella,128837
CUST_000025,"Herzog, Bode and Frami",343375,2,1,149922,118439,"Corwin LLC, Gutmann, King and Gorczany, Wealth Capital, Pagac - Muller, Baumbach, Dietrich and Mueller",77.2,"[{""PRODUCT_ID"": ""PROD_MERAKI"", ""PRODUCT_NAME"": ""Meraki"", ""PRODUCT_CATEGORY"": ""Networking"", ""POTENTIAL_ARR"": 149922.32, ""EXPECTED_ARR"": 118438.6328, ""PURCHASE_PROBABILITY"": 79.0, ""MAX_SIMILARITY_SCORE"": 79, ""ESTIMATED_LICENSES"": 33, ""PRICE_PER_LICENSE"": 4543.100606060606, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Gutmann, King and Gorczany, Pagac - Muller""}]",Meraki,118439
CUST_000020,Credit Advisors,137516,2,1,138608,115045,"Gutmann, King and Gorczany, Hansen LLC, Investment Management, Bashirian Inc, Credit Partners",79.2,"[{""PRODUCT_ID"": ""PROD_DUO"", ""PRODUCT_NAME"": ""Duo"", ""PRODUCT_CATEGORY"": ""Security"", ""POTENTIAL_ARR"": 138607.99047619046, ""EXPECTED_ARR"": 115044.63209523808, ""PURCHASE_PROBABILITY"": 83.0, ""MAX_SIMILARITY_SCORE"": 83, ""ESTIMATED_LICENSES"": 20, ""PRICE_PER_LICENSE"": 6930.399523809523, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Gutmann, King and Gorczany, Hansen LLC, Investment Management""}]",Duo,115045
CUST_000036,Trust Holdings,51826,3,2,138104,109102,"Capital Management, Wealth Group, Medical Systems, Credit Group, Credit Advisors",79.6,"[{""PRODUCT_ID"": ""PROD_UMBRELLA"", ""PRODUCT_NAME"": ""Umbrella"", ""PRODUCT_CATEGORY"": ""Security"", ""POTENTIAL_ARR"": 79528.7852173913, ""EXPECTED_ARR"": 62827.740321739126, ""PURCHASE_PROBABILITY"": 79.0, ""MAX_SIMILARITY_SCORE"": 79, ""ESTIMATED_LICENSES"": 11, ""PRICE_PER_LICENSE"": 7229.889565217391, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Wealth Group, Medical Systems, Credit Group""}, {""PRODUCT_ID"": ""PROD_SPLUNK"", ""PRODUCT_NAME"": ""Splunk"", ""PRODUCT_CATEGORY"": ""Analytics"", ""POTENTIAL_ARR"": 58575.5825, ""EXPECTED_ARR"": 46274.710175, ""PURCHASE_PROBABILITY"": 79.0, ""MAX_SIMILARITY_SCORE"": 79, ""ESTIMATED_LICENSES"": 17, ""PRICE_PER_LICENSE"": 3445.6225, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Wealth Group, Medical Systems""}]",Umbrella,62828
CUST_000005,"White, Boehm and Hilpert",1833761,3,1,131750,104082,"Hansen LLC, Cronin and Sons, Investment Management, Ondricka, Waters and Wilderman, Gutmann, King and Gorczany",76.2,"[{""PRODUCT_ID"": ""PROD_MERAKI"", ""PRODUCT_NAME"": ""Meraki"", ""PRODUCT_CATEGORY"": ""Networking"", ""POTENTIAL_ARR"": 131749.91757575757, ""EXPECTED_ARR"": 104082.43488484848, ""PURCHASE_PROBABILITY"": 79.0, ""MAX_SIMILARITY_SCORE"": 79, ""ESTIMATED_LICENSES"": 29, ""PRICE_PER_LICENSE"": 4543.100606060606, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Hansen LLC, Cronin and Sons, Ondricka, Waters and Wilderman""}]",Meraki,104082
CUST_000005,InnovateTech Solutions,496079,3,1,131750,105400,"Advanced Manufacturing Co, Smith, Ratke and Ankunding, Mitchell, Batz and Pouros, Cyber Systems, Cloud Solutions",78.0,"[{""PRODUCT_ID"": ""PROD_MERAKI"", ""PRODUCT_NAME"": ""Meraki"", ""PRODUCT_CATEGORY"": ""Networking"", ""POTENTIAL_ARR"": 131749.91757575757, ""EXPECTED_ARR"": 105399.93406060606, ""PURCHASE_PROBABILITY"": 80.0, ""MAX_SIMILARITY_SCORE"": 80, ""ESTIMATED_LICENSES"": 29, ""PRICE_PER_LICENSE"": 4543.100606060606, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Advanced Manufacturing Co, Smith, Ratke and Ankunding, Mitchell, Batz and Pouros""}]",Meraki,105400
CUST_000031,Credit Partners,202633,3,1,115500,92400,"Smith LLC, Data Solutions, Credit Advisors, Capital Management, Advanced Manufacturing Co",78.4,"[{""PRODUCT_ID"": ""PROD_THOUSAND_EYES"", ""PRODUCT_NAME"": ""ThousandEyes"", ""PRODUCT_CATEGORY"": ""Analytics"", ""POTENTIAL_ARR"": 115500.028, ""EXPECTED_ARR"": 92400.02240000002, ""PURCHASE_PROBABILITY"": 80.0, ""MAX_SIMILARITY_SCORE"": 80, ""ESTIMATED_LICENSES"": 28, ""PRICE_PER_LICENSE"": 4125.001, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Data Solutions, Capital Management""}]",ThousandEyes,92400
CUST_000023,Smith LLC,450570,3,1,111375,91328,"Credit Partners, Data Solutions, Bashirian Inc, Stokes and Sons, Smith, Ratke and Ankunding",78.6,"[{""PRODUCT_ID"": ""PROD_THOUSAND_EYES"", ""PRODUCT_NAME"": ""ThousandEyes"", ""PRODUCT_CATEGORY"": ""Analytics"", ""POTENTIAL_ARR"": 111375.027, ""EXPECTED_ARR"": 91327.52214, ""PURCHASE_PROBABILITY"": 82.0, ""MAX_SIMILARITY_SCORE"": 82, ""ESTIMATED_LICENSES"": 27, ""PRICE_PER_LICENSE"": 4125.001, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Data Solutions, Stokes and Sons""}]",ThousandEyes,91328
CUST_000044,Corwin LLC,24362,2,2,95349,70558,"Bashirian Inc, Herzog, Bode and Frami, Goldner - Bartoletti, Pagac - Muller, Cronin and Sons",75.8,"[{""PRODUCT_ID"": ""PROD_MERAKI"", ""PRODUCT_NAME"": ""Meraki"", ""PRODUCT_CATEGORY"": ""Networking"", ""POTENTIAL_ARR"": 49974.10666666667, ""EXPECTED_ARR"": 36980.83893333333, ""PURCHASE_PROBABILITY"": 74.0, ""MAX_SIMILARITY_SCORE"": 74, ""ESTIMATED_LICENSES"": 11, ""PRICE_PER_LICENSE"": 4543.100606060606, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Goldner - Bartoletti, Pagac - Muller, Cronin and Sons""}, {""PRODUCT_ID"": ""PROD_THOUSAND_EYES"", ""PRODUCT_NAME"": ""ThousandEyes"", ""PRODUCT_CATEGORY"": ""Analytics"", ""POTENTIAL_ARR"": 45375.011, ""EXPECTED_ARR"": 33577.50814, ""PURCHASE_PROBABILITY"": 74.0, ""MAX_SIMILARITY_SCORE"": 74, ""ESTIMATED_LICENSES"": 11, ""PRICE_PER_LICENSE"": 4125.001, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Goldner - Bartoletti""}]",Meraki,36981
CUST_000027,"Gutmann, King and Gorczany",474193,2,1,79529,66009,"Hansen LLC, Credit Advisors, Bashirian Inc, Collier, Bayer and Ward, Herzog, Bode and Frami",81.8,"[{""PRODUCT_ID"": ""PROD_UMBRELLA"", ""PRODUCT_NAME"": ""Umbrella"", ""PRODUCT_CATEGORY"": ""Security"", ""POTENTIAL_ARR"": 79528.7852173913, ""EXPECTED_ARR"": 66008.89173043477, ""PURCHASE_PROBABILITY"": 83.0, ""MAX_SIMILARITY_SCORE"": 83, ""ESTIMATED_LICENSES"": 11, ""PRICE_PER_LICENSE"": 7229.889565217391, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Credit Advisors, Bashirian Inc, Herzog, Bode and Frami""}]",Umbrella,66009
CUST_000045,Goldner - Bartoletti,22076,3,2,74390,54428,"Stokes and Sons, Bode - Mayer, Corwin LLC, Trust Holdings, Medical Systems",74.4,"[{""PRODUCT_ID"": ""PROD_UMBRELLA"", ""PRODUCT_NAME"": ""Umbrella"", ""PRODUCT_CATEGORY"": ""Security"", ""POTENTIAL_ARR"": 43379.33739130435, ""EXPECTED_ARR"": 32100.709669565218, ""PURCHASE_PROBABILITY"": 74.0, ""MAX_SIMILARITY_SCORE"": 74, ""ESTIMATED_LICENSES"": 6, ""PRICE_PER_LICENSE"": 7229.889565217391, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Corwin LLC, Medical Systems""}, {""PRODUCT_ID"": ""PROD_SPLUNK"", ""PRODUCT_NAME"": ""Splunk"", ""PRODUCT_CATEGORY"": ""Analytics"", ""POTENTIAL_ARR"": 31010.6025, ""EXPECTED_ARR"": 22327.6338, ""PURCHASE_PROBABILITY"": 72.0, ""MAX_SIMILARITY_SCORE"": 72, ""ESTIMATED_LICENSES"": 9, ""PRICE_PER_LICENSE"": 3445.6225, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""Medical Systems""}]",Umbrella,32101
CUST_000043,Cronin and Sons,10017,2,2,38918,29578,"Hansen LLC, Gutmann, King and Gorczany, White, Boehm and Hilpert, Corwin LLC, Credit Advisors",75.4,"[{""PRODUCT_ID"": ""PROD_UMBRELLA"", ""PRODUCT_NAME"": ""Umbrella"", ""PRODUCT_CATEGORY"": ""Security"", ""POTENTIAL_ARR"": 21689.668695652173, ""EXPECTED_ARR"": 16484.148208695653, ""PURCHASE_PROBABILITY"": 76.0, ""MAX_SIMILARITY_SCORE"": 76, ""ESTIMATED_LICENSES"": 3, ""PRICE_PER_LICENSE"": 7229.889565217391, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""White, Boehm and Hilpert, Corwin LLC, Credit Advisors""}, {""PRODUCT_ID"": ""PROD_SPLUNK"", ""PRODUCT_NAME"": ""Splunk"", ""PRODUCT_CATEGORY"": ""Analytics"", ""POTENTIAL_ARR"": 17228.1125, ""EXPECTED_ARR"": 13093.3655, ""PURCHASE_PROBABILITY"": 76.0, ""MAX_SIMILARITY_SCORE"": 76, ""ESTIMATED_LICENSES"": 5, ""PRICE_PER_LICENSE"": 3445.6225, ""SIMILAR_COMPANIES_WITH_PRODUCT"": ""White, Boehm and Hilpert""}]",Umbrella,16484
CUST_000002,Global Capital Management,3669528,3,0,0,0,"MedSecure Systems, Ondricka, Waters and Wilderman, Mitchell, Batz and Pouros, Swaniawski Inc, Schultz - Collins",71.0,[],,0
```


---

## Document Statistics

- Total Companies Analyzed: 50
- Total Products: 5
- Total Subscriptions: 112
- Total Similarity Scores: 2,500 (50x50 matrix)
- Total Potential ARR Opportunities: 50
- Document includes: Complete data, formulas, methodologies, and analysis results
