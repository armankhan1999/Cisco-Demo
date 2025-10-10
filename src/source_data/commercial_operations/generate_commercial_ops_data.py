"""
Commercial Operations Synthetic Data Generator

This script generates enterprise-level synthetic data for Commercial Operations KPIs
aligned with existing account and license data from the ./data folder.

KPIs Supported:
- Net Revenue Retention (NRR)
- Annual Recurring Revenue (ARR)
- Days Sales Outstanding (DSO)
- Deferred Revenue Balance
- Quote-to-Cash Cycle Time
- Renewal Rate (GRR)
- Revenue Recognition Accuracy
- Expansion ARR Contribution
- Renewal Quote Velocity
- Quote Accuracy Rate
- Order Processing Error Rate
- Invoice Dispute Rate
- Payment Collection Rate
- Amendment Processing Time
- Mid-Cycle Utilization Alerts
"""

import json
import random
import uuid
from datetime import datetime, timedelta
from decimal import Decimal
from typing import List, Dict, Any
import os

# Set random seed for reproducibility
random.seed(42)

# Constants
PRODUCTS = ["Meraki", "Duo", "Umbrella", "ThousandEyes", "Splunk"]
PRODUCT_TIERS = {
    "Meraki": ["Enterprise", "Advanced"],
    "Duo": ["Essentials", "Advantage", "Premier"],
    "Umbrella": ["DNS Essentials", "DNS Advantage", "SIG Essentials", "SIG Advantage"],
    "ThousandEyes": ["Standard", "Enterprise"],
    "Splunk": ["ES Essentials", "ES Premier", "Observability"]
}

PRODUCT_UNIT_PRICES = {
    "Meraki": {"Enterprise": 150, "Advanced": 200},
    "Duo": {"Essentials": 6, "Advantage": 9, "Premier": 12},
    "Umbrella": {"DNS Essentials": 3, "DNS Advantage": 5, "SIG Essentials": 8, "SIG Advantage": 12},
    "ThousandEyes": {"Standard": 500, "Enterprise": 1000},
    "Splunk": {"ES Essentials": 5000, "ES Premier": 8000, "Observability": 6000}
}

PAYMENT_TERMS = ["Net 30", "Net 45", "Net 60", "Due on Receipt"]
BILLING_FREQUENCIES = ["annual", "quarterly", "monthly"]
QUOTE_TYPES = ["new_business", "renewal", "expansion", "amendment"]
ORDER_STATUSES = ["received", "validated", "processing", "fulfilled", "cancelled", "error"]
INVOICE_STATUSES = ["draft", "issued", "sent", "paid", "partially_paid", "overdue", "disputed"]
AMENDMENT_TYPES = ["quantity_increase", "quantity_decrease", "product_add", "product_remove", "billing_change", "term_change"]

# Load existing data
def load_existing_data():
    """Load existing accounts and licenses data"""
    base_path = "../../data/synthetic"

    with open(f"{base_path}/accounts.json", "r") as f:
        accounts_data = json.load(f)

    with open(f"{base_path}/licenses.json", "r") as f:
        licenses_data = json.load(f)

    return accounts_data, licenses_data

def generate_date_range(start_date, end_date):
    """Generate random date within range"""
    time_between = end_date - start_date
    days_between = time_between.days
    random_days = random.randint(0, days_between)
    return start_date + timedelta(days=random_days)

def calculate_arr_from_licenses(licenses: List[Dict]) -> float:
    """Calculate total ARR from licenses"""
    total_arr = 0
    for lic in licenses:
        product = lic["product_family"]
        tier = lic.get("tier", list(PRODUCT_TIERS[product])[0])
        unit_price = PRODUCT_UNIT_PRICES[product][tier]
        license_count = lic["license_count"]
        total_arr += unit_price * license_count
    return round(total_arr, 2)

class CommercialOpsDataGenerator:
    def __init__(self):
        self.accounts_data, self.licenses_data = load_existing_data()
        self.generated_data = {}
        self.current_date = datetime(2025, 10, 7)

    def generate_all(self):
        """Generate all commercial operations data"""
        print("Starting Commercial Operations Data Generation...")

        # Step 1: Generate modified accounts
        print("\n[1/14] Generating modified accounts...")
        self.generate_accounts()

        # Step 2: Generate modified licenses
        print("[2/14] Generating modified licenses...")
        self.generate_licenses()

        # Step 3: Generate subscriptions
        print("[3/14] Generating subscriptions...")
        self.generate_subscriptions()

        # Step 4: Generate quotes and line items
        print("[4/14] Generating quotes and quote line items...")
        self.generate_quotes()

        # Step 5: Generate orders
        print("[5/14] Generating orders...")
        self.generate_orders()

        # Step 6: Generate invoices
        print("[6/14] Generating invoices...")
        self.generate_invoices()

        # Step 7: Generate payments
        print("[7/14] Generating payments...")
        self.generate_payments()

        # Step 8: Generate amendments
        print("[8/14] Generating amendments...")
        self.generate_amendments()

        # Step 9: Generate revenue movements
        print("[9/14] Generating revenue movements...")
        self.generate_revenue_movements()

        # Step 10: Generate revenue recognition schedule
        print("[10/14] Generating revenue recognition schedule...")
        self.generate_revenue_recognition_schedule()

        # Step 11: Generate utilization history
        print("[11/14] Generating utilization history...")
        self.generate_utilization_history()

        # Step 12: Generate utilization alerts
        print("[12/14] Generating utilization alerts...")
        self.generate_utilization_alerts()

        # Step 13: Generate quote-to-cash tracking
        print("[13/14] Generating quote-to-cash tracking...")
        self.generate_quote_to_cash_tracking()

        # Step 14: Generate KPI metrics
        print("[14/14] Generating KPI metrics...")
        self.generate_kpi_metrics()

        print("\n✓ All data generation complete!")

    def generate_accounts(self):
        """Generate modified accounts with reduced timeline and new fields"""
        modified_accounts = []

        for account_item in self.accounts_data[:50]:  # Take only 50 accounts
            account = account_item["account"].copy()

            # Calculate revenue metrics
            arr = account["arr"]
            starting_arr = arr * random.uniform(0.7, 0.95)  # Starting ARR was lower
            expansion_arr = arr * random.uniform(0.05, 0.25) if random.random() > 0.3 else 0
            churn_arr = arr * random.uniform(0, 0.05) if random.random() > 0.8 else 0
            contraction_arr = arr * random.uniform(0, 0.05) if random.random() > 0.85 else 0

            # Add new commercial ops fields
            account["mrr"] = round(arr / 12, 2)
            account["starting_arr"] = round(starting_arr, 2)
            account["expansion_arr"] = round(expansion_arr, 2)
            account["churn_arr"] = round(churn_arr, 2)
            account["contraction_arr"] = round(contraction_arr, 2)
            account["arr_trend"] = random.choice(["growing", "stable", "declining"], weights=[0.6, 0.3, 0.1])[0]
            account["payment_terms"] = random.choice(PAYMENT_TERMS)
            account["billing_frequency"] = random.choice(BILLING_FREQUENCIES, weights=[0.7, 0.2, 0.1])[0]

            # Risk and health scores
            utilization_avg = random.uniform(30, 95)
            account["renewal_risk_score"] = int(max(0, min(100, 100 - utilization_avg + random.uniform(-10, 10))))
            account["health_score"] = int(min(100, utilization_avg + random.uniform(-5, 15)))

            # Invoice and payment dates
            last_invoice_date = self.current_date - timedelta(days=random.randint(15, 90))
            account["last_invoice_date"] = last_invoice_date.isoformat()
            account["last_payment_date"] = (last_invoice_date + timedelta(days=random.randint(10, 45))).isoformat()

            # Reduce timeline to last 3 months only (keep structure intact)
            timeline = account_item.get("timeline", [])[-3:]  # Last 3 months only

            modified_accounts.append({
                "account": account,
                "timeline": timeline
            })

        self.generated_data["accounts"] = modified_accounts
        self.save_json("accounts.json", modified_accounts)
        print(f"  ✓ Generated {len(modified_accounts)} accounts")

    def generate_licenses(self):
        """Generate modified licenses with new commercial ops fields"""
        modified_licenses = []

        for license in self.licenses_data:
            lic = license.copy()

            product = lic["product_family"]
            tier = random.choice(list(PRODUCT_TIERS[product]))
            unit_price = PRODUCT_UNIT_PRICES[product][tier]
            license_count = lic["license_count"]

            # Add new fields
            lic["license_type"] = random.choice(["subscription", "perpetual"], weights=[0.95, 0.05])[0]
            lic["tier"] = tier
            lic["unit_price"] = unit_price
            lic["annual_value"] = round(unit_price * license_count, 2)
            lic["billing_frequency"] = random.choice(BILLING_FREQUENCIES, weights=[0.7, 0.2, 0.1])[0]

            # Contract dates
            impl_date = datetime.fromisoformat(lic["implementation_date"].replace('Z', '+00:00'))
            renewal_date = datetime.fromisoformat(lic["renewal_date"].replace('Z', '+00:00'))

            lic["contract_start_date"] = impl_date.isoformat()
            lic["contract_end_date"] = renewal_date.isoformat()

            # Calculate term months
            months_diff = (renewal_date.year - impl_date.year) * 12 + (renewal_date.month - impl_date.month)
            lic["contract_term_months"] = months_diff

            lic["auto_renew"] = random.choice([True, False], weights=[0.8, 0.2])[0]
            lic["utilization_trend"] = random.choice(["increasing", "stable", "decreasing"], weights=[0.4, 0.4, 0.2])[0]
            lic["last_utilization_check"] = (self.current_date - timedelta(days=random.randint(0, 7))).isoformat()
            lic["utilization_alert_threshold"] = random.choice([75, 80, 85, 90])
            lic["utilization_alert_enabled"] = True

            modified_licenses.append(lic)

        self.generated_data["licenses"] = modified_licenses
        self.save_json("licenses.json", modified_licenses)
        print(f"  ✓ Generated {len(modified_licenses)} licenses")

    def generate_subscriptions(self):
        """Generate subscriptions table"""
        subscriptions = []
        subscription_counter = 1

        for account_item in self.generated_data["accounts"]:
            account = account_item["account"]
            customer_id = account["id"]

            # Get licenses for this customer
            customer_licenses = [l for l in self.generated_data["licenses"] if l["customer_id"] == customer_id]

            for license in customer_licenses:
                subscription = {
                    "subscription_id": f"SUB_{customer_id}_{license['product_family']}_{subscription_counter:03d}",
                    "customer_id": customer_id,
                    "license_id": license["license_id"],
                    "product_family": license["product_family"],
                    "subscription_type": random.choice(["new", "expansion", "renewal"], weights=[0.3, 0.3, 0.4])[0],
                    "subscription_status": random.choice(["active", "cancelled", "suspended"], weights=[0.92, 0.05, 0.03])[0],
                    "mrr": round(license["annual_value"] / 12, 2),
                    "arr": license["annual_value"],
                    "quantity": license["license_count"],
                    "unit_price": license["unit_price"],
                    "billing_frequency": license["billing_frequency"],
                    "subscription_start_date": license["contract_start_date"],
                    "subscription_end_date": license["contract_end_date"],
                    "contract_term_months": license["contract_term_months"],
                    "renewal_date": license["renewal_date"],
                    "next_billing_date": (datetime.fromisoformat(license["renewal_date"].replace('Z', '+00:00')) - timedelta(days=30)).isoformat(),
                    "auto_renew": license["auto_renew"],
                    "renewal_status": random.choice(["pending", "quoted", "renewed"], weights=[0.3, 0.4, 0.3])[0],
                    "renewal_probability": round(random.uniform(60, 95), 2),
                    "churn_risk_score": round(account["renewal_risk_score"] + random.uniform(-5, 5), 2),
                    "payment_terms": account["payment_terms"],
                    "payment_method": random.choice(["invoice", "credit_card", "ACH", "wire_transfer"], weights=[0.5, 0.2, 0.2, 0.1])[0],
                    "created_date": license["implementation_date"],
                    "created_by": "system",
                    "modified_date": None,
                    "modified_by": None
                }

                subscriptions.append(subscription)
                subscription_counter += 1

        self.generated_data["subscriptions"] = subscriptions
        self.save_json("subscriptions.json", subscriptions)
        print(f"  ✓ Generated {len(subscriptions)} subscriptions")

    def generate_quotes(self):
        """Generate quotes and quote line items"""
        quotes = []
        quote_line_items = []
        quote_counter = 1
        line_item_counter = 1

        # Generate quotes for each account (1-3 quotes per account per year)
        for account_item in self.generated_data["accounts"]:
            account = account_item["account"]
            customer_id = account["id"]

            # Number of quotes for this account
            num_quotes = random.randint(1, 4)

            for i in range(num_quotes):
                quote_date = generate_date_range(
                    self.current_date - timedelta(days=365),
                    self.current_date
                )

                # Quote type distribution
                quote_type = random.choice(QUOTE_TYPES, weights=[0.2, 0.5, 0.25, 0.05])[0]
                quote_status = random.choice(["accepted", "rejected", "expired", "sent"], weights=[0.7, 0.1, 0.1, 0.1])[0]

                # Get subscriptions for this customer
                customer_subs = [s for s in self.generated_data["subscriptions"] if s["customer_id"] == customer_id]

                if not customer_subs:
                    continue

                # Select 1-3 products for this quote
                num_products = min(random.randint(1, 3), len(customer_subs))
                quote_subs = random.sample(customer_subs, num_products)

                # Calculate quote totals
                total_amount = sum(s["arr"] for s in quote_subs)
                discount_percentage = random.uniform(0, 25) if quote_type == "renewal" else random.uniform(0, 15)
                discount_amount = total_amount * (discount_percentage / 100)
                net_amount = total_amount - discount_amount

                quote_id = f"QUO_{quote_date.strftime('%Y%m%d')}_{customer_id}_{quote_counter:03d}"

                quote = {
                    "quote_id": quote_id,
                    "quote_number": f"Q-{quote_date.year}-{quote_counter:04d}",
                    "customer_id": customer_id,
                    "opportunity_id": f"OPP_{quote_date.year}_{quote_counter:03d}",
                    "quote_type": quote_type,
                    "quote_status": quote_status,
                    "total_amount": round(total_amount, 2),
                    "arr_value": round(total_amount, 2),
                    "discount_percentage": round(discount_percentage, 2),
                    "discount_amount": round(discount_amount, 2),
                    "net_amount": round(net_amount, 2),
                    "product_families": [s["product_family"] for s in quote_subs],
                    "total_licenses": sum(s["quantity"] for s in quote_subs),
                    "contract_term_months": 12 if quote_type != "amendment" else random.choice([12, 24, 36]),
                    "billing_frequency": account["billing_frequency"],
                    "payment_terms": account["payment_terms"],
                    "quote_created_date": quote_date.isoformat(),
                    "quote_sent_date": (quote_date + timedelta(days=random.randint(0, 2))).isoformat(),
                    "quote_expiry_date": (quote_date + timedelta(days=30)).isoformat(),
                    "quote_accepted_date": (quote_date + timedelta(days=random.randint(3, 20))).isoformat() if quote_status == "accepted" else None,
                    "quote_rejected_date": (quote_date + timedelta(days=random.randint(3, 25))).isoformat() if quote_status == "rejected" else None,
                    "is_amendment": quote_type == "amendment",
                    "parent_quote_id": None,
                    "amendment_reason": None,
                    "amendment_count": 0,
                    "requires_amendment": random.random() < 0.02,  # 2% require amendments
                    "amendment_reasons": [],
                    "quote_accuracy_flag": random.random() > 0.02,  # 98% accurate
                    "created_by": "commercial_ops@cisco.com",
                    "approved_by": "manager@cisco.com" if total_amount > 50000 else None,
                    "approval_date": (quote_date + timedelta(hours=random.randint(1, 24))).isoformat() if total_amount > 50000 else None,
                    "requires_approval": total_amount > 50000,
                    "converted_to_order": quote_status == "accepted",
                    "order_id": f"ORD_{quote_date.strftime('%Y%m%d')}_{quote_counter:03d}" if quote_status == "accepted" else None,
                    "created_date": quote_date.isoformat(),
                    "modified_date": None
                }

                quotes.append(quote)

                # Generate quote line items
                for line_num, sub in enumerate(quote_subs, 1):
                    line_total = sub["arr"] * (1 - discount_percentage / 100)

                    line_item = {
                        "line_item_id": f"LI_{quote_id}_{line_item_counter:04d}",
                        "quote_id": quote_id,
                        "line_number": line_num,
                        "product_family": sub["product_family"],
                        "product_sku": f"SKU_{sub['product_family']}_{sub['quantity']}",
                        "product_name": f"{sub['product_family']} {sub['quantity']} Licenses",
                        "product_tier": PRODUCT_TIERS[sub["product_family"]][0],
                        "quantity": sub["quantity"],
                        "unit_price": sub["unit_price"],
                        "list_price": sub["unit_price"],
                        "discount_percentage": round(discount_percentage, 2),
                        "discount_amount": round(sub["arr"] * (discount_percentage / 100), 2),
                        "net_price": round(sub["unit_price"] * (1 - discount_percentage / 100), 2),
                        "line_total": round(line_total, 2),
                        "arr_contribution": round(line_total, 2),
                        "billing_frequency": sub["billing_frequency"],
                        "contract_term_months": quote["contract_term_months"],
                        "created_date": quote_date.isoformat()
                    }

                    quote_line_items.append(line_item)
                    line_item_counter += 1

                quote_counter += 1

        self.generated_data["quotes"] = quotes
        self.generated_data["quote_line_items"] = quote_line_items
        self.save_json("quotes.json", quotes)
        self.save_json("quote_line_items.json", quote_line_items)
        print(f"  ✓ Generated {len(quotes)} quotes and {len(quote_line_items)} quote line items")

    def save_json(self, filename, data):
        """Save data to JSON file"""
        filepath = f"./Commercial Operations/synthetic-data/{filename}"
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2, default=str)

    def generate_orders(self):
        """Generate orders from accepted quotes"""
        print("  → Generating orders (this might take a moment)...")
        # This will be implemented in part 2
        pass

    def generate_invoices(self):
        """Generate invoices"""
        print("  → Generating invoices (this might take a moment)...")
        # This will be implemented in part 2
        pass

    def generate_payments(self):
        """Generate payments"""
        print("  → Generating payments (this might take a moment)...")
        # This will be implemented in part 2
        pass

    def generate_amendments(self):
        """Generate amendments"""
        print("  → Generating amendments (this might take a moment)...")
        # This will be implemented in part 2
        pass

    def generate_revenue_movements(self):
        """Generate revenue movements"""
        print("  → Generating revenue movements (this might take a moment)...")
        # This will be implemented in part 2
        pass

    def generate_revenue_recognition_schedule(self):
        """Generate revenue recognition schedule"""
        print("  → Generating revenue recognition schedule (this might take a moment)...")
        # This will be implemented in part 2
        pass

    def generate_utilization_history(self):
        """Generate utilization history"""
        print("  → Generating utilization history (this might take a moment)...")
        # This will be implemented in part 2
        pass

    def generate_utilization_alerts(self):
        """Generate utilization alerts"""
        print("  → Generating utilization alerts (this might take a moment)...")
        # This will be implemented in part 2
        pass

    def generate_quote_to_cash_tracking(self):
        """Generate quote-to-cash tracking"""
        print("  → Generating quote-to-cash tracking (this might take a moment)...")
        # This will be implemented in part 2
        pass

    def generate_kpi_metrics(self):
        """Generate KPI metrics"""
        print("  → Generating KPI metrics (this might take a moment)...")
        # This will be implemented in part 2
        pass

if __name__ == "__main__":
    generator = CommercialOpsDataGenerator()
    generator.generate_all()
    print("\n" + "="*60)
    print("Commercial Operations Synthetic Data Generation Complete!")
    print("="*60)
    print(f"\nData files saved to: ./Commercial Operations/synthetic-data/")
    print("\nNext steps:")
    print("1. Review generated files")
    print("2. Run KPI calculations")
    print("3. Validate data relationships")
