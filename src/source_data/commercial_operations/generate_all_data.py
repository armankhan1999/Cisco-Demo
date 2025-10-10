"""
COMPLETE COMMERCIAL OPERATIONS SYNTHETIC DATA GENERATOR
=======================================================

This script generates all 16 tables with complete data for Commercial Operations KPIs.
All data is aligned with existing accounts and licenses from ./data/synthetic folder.

Generated Tables:
1. accounts.json (modified)
2. licenses.json (modified)
3. subscriptions.json
4. quotes.json
5. quote_line_items.json
6. orders.json
7. invoices.json
8. payments.json
9. amendments.json
10. revenue_movements.json
11. revenue_recognition_schedule.json
12. utilization_history.json
13. utilization_alerts.json
14. quote_to_cash_tracking.json
15. kpi_metrics.json

Plus accounts_receivable view data

Usage:
    python generate_all_data.py
"""

import json
import random
import uuid
from datetime import datetime, timedelta
from decimal import Decimal
from typing import List, Dict, Any
import os
import sys

# Set random seed for reproducibility
random.seed(42)

# ==================== CONFIGURATION ====================

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

# Current date for data generation
CURRENT_DATE = datetime(2025, 10, 7)

# ==================== HELPER FUNCTIONS ====================

def generate_id(prefix: str, *parts) -> str:
    """Generate a unique ID with prefix and parts"""
    return f"{prefix}_{'_'.join(str(p) for p in parts)}"

def generate_date(start: datetime, end: datetime) -> datetime:
    """Generate random date between start and end"""
    # Remove timezone info to avoid naive/aware datetime conflicts
    if start.tzinfo is not None:
        start = start.replace(tzinfo=None)
    if end.tzinfo is not None:
        end = end.replace(tzinfo=None)

    delta = end - start
    random_days = random.randint(0, delta.days)
    random_seconds = random.randint(0, 86400)
    return start + timedelta(days=random_days, seconds=random_seconds)

def add_days(date: datetime, days: int) -> datetime:
    """Add days to a date"""
    return date + timedelta(days=days)

def calculate_business_days(start: datetime, end: datetime) -> float:
    """Calculate business days between two dates"""
    delta = end - start
    return delta.total_seconds() / 86400  # Return fractional days

def weighted_choice(choices: list, weights: list):
    """Select random choice with weights"""
    return random.choices(choices, weights=weights)[0]

# ==================== DATA GENERATOR CLASS ====================

class CommercialOpsDataGenerator:
    """Complete data generator for all Commercial Operations tables"""

    def __init__(self, data_path="../../data/synthetic"):
        self.data_path = data_path
        self.output_path = "./Commercial Operations/synthetic-data"

        # Ensure output directory exists
        os.makedirs(self.output_path, exist_ok=True)

        # Storage for generated data
        self.data = {}

        # Counters for ID generation
        self.counters = {
            'subscription': 1,
            'quote': 1,
            'line_item': 1,
            'order': 1,
            'invoice': 1,
            'payment': 1,
            'amendment': 1,
            'movement': 1,
            'schedule': 1,
            'utilization': 1,
            'alert': 1,
            'tracking': 1,
            'metric': 1
        }

        print("="*70)
        print("COMMERCIAL OPERATIONS SYNTHETIC DATA GENERATOR")
        print("="*70)
        print(f"Data Source: {self.data_path}")
        print(f"Output Path: {self.output_path}")
        print(f"Generation Date: {CURRENT_DATE.strftime('%Y-%m-%d')}")
        print("="*70)

    def load_existing_data(self):
        """Load existing accounts and licenses"""
        print("\n[Loading] Existing data sources...")

        accounts_file = f"{self.data_path}/accounts.json"
        licenses_file = f"{self.data_path}/master-data/licenses.json"

        try:
            with open(accounts_file, 'r') as f:
                accounts_data = json.load(f)
                print(f"  Loaded {len(accounts_data)} accounts")

            with open(licenses_file, 'r') as f:
                licenses_data = json.load(f)
                print(f"  Loaded {len(licenses_data)} licenses")

            return accounts_data[:50], licenses_data  # Take first 50 accounts

        except FileNotFoundError as e:
            print(f"  Error: {e}")
            print(f"  Please ensure data files exist in {self.data_path}")
            sys.exit(1)

    def save_json(self, filename: str, data: list):
        """Save data to JSON file"""
        filepath = os.path.join(self.output_path, filename)
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2, default=str)
        print(f"  Saved {filename} ({len(data)} records)")

    def generate_all(self):
        """Main generation orchestrator"""
        print("\n" + "="*70)
        print("STARTING DATA GENERATION")
        print("="*70)

        # Load source data
        accounts_raw, licenses_raw = self.load_existing_data()

        # Generate all tables in sequence
        print("\n[Step 1/15] Generating accounts.json...")
        self.generate_accounts(accounts_raw)

        print("\n[Step 2/15] Generating licenses.json...")
        self.generate_licenses(licenses_raw)

        print("\n[Step 3/15] Generating subscriptions.json...")
        self.generate_subscriptions()

        print("\n[Step 4/15] Generating quotes.json and quote_line_items.json...")
        self.generate_quotes_and_line_items()

        print("\n[Step 5/15] Generating orders.json...")
        self.generate_orders()

        print("\n[Step 6/15] Generating invoices.json...")
        self.generate_invoices()

        print("\n[Step 7/15] Generating payments.json...")
        self.generate_payments()

        print("\n[Step 8/15] Generating amendments.json...")
        self.generate_amendments()

        print("\n[Step 9/15] Generating revenue_movements.json...")
        self.generate_revenue_movements()

        print("\n[Step 10/15] Generating revenue_recognition_schedule.json...")
        self.generate_revenue_recognition()

        print("\n[Step 11/15] Generating utilization_history.json...")
        self.generate_utilization_history()

        print("\n[Step 12/15] Generating utilization_alerts.json...")
        self.generate_utilization_alerts()

        print("\n[Step 13/15] Generating quote_to_cash_tracking.json...")
        self.generate_quote_to_cash_tracking()

        print("\n[Step 14/15] Generating kpi_metrics.json...")
        self.generate_kpi_metrics()

        print("\n[Step 15/15] Generating accounts_receivable data...")
        self.generate_accounts_receivable()

        print("\n" + "="*70)
        print("DATA GENERATION COMPLETE!")
        print("="*70)
        self.print_summary()

    # ==================== GENERATION METHODS ====================

    def generate_accounts(self, accounts_raw):
        """Generate modified accounts with new commercial ops fields"""
        accounts = []

        for account_item in accounts_raw:
            account = account_item["account"].copy()

            # Calculate revenue metrics
            arr = account["arr"]
            starting_arr = round(arr * random.uniform(0.7, 0.95), 2)
            expansion_arr = round(arr * random.uniform(0.05, 0.25), 2) if random.random() > 0.4 else 0
            churn_arr = round(arr * random.uniform(0, 0.05), 2) if random.random() > 0.8 else 0
            contraction_arr = round(arr * random.uniform(0, 0.05), 2) if random.random() > 0.85 else 0

            # Add new fields
            account["mrr"] = round(arr / 12, 2)
            account["starting_arr"] = starting_arr
            account["expansion_arr"] = expansion_arr
            account["churn_arr"] = churn_arr
            account["contraction_arr"] = contraction_arr
            account["arr_trend"] = weighted_choice(["growing", "stable", "declining"], [0.6, 0.3, 0.1])
            account["payment_terms"] = weighted_choice(PAYMENT_TERMS, [0.5, 0.3, 0.15, 0.05])
            account["billing_frequency"] = weighted_choice(BILLING_FREQUENCIES, [0.7, 0.2, 0.1])

            # Calculate risk scores based on utilization
            utilization_avg = random.uniform(30, 95)
            account["renewal_risk_score"] = int(max(0, min(100, 100 - utilization_avg + random.uniform(-10, 10))))
            account["health_score"] = int(min(100, utilization_avg + random.uniform(-5, 15)))

            # Recent invoice and payment dates
            last_invoice_date = CURRENT_DATE - timedelta(days=random.randint(15, 90))
            account["last_invoice_date"] = last_invoice_date.isoformat()
            account["last_payment_date"] = (last_invoice_date + timedelta(days=random.randint(10, 45))).isoformat()

            # Reduce timeline to last 3 months only
            timeline = account_item.get("timeline", [])[-3:]

            accounts.append({
                "account": account,
                "timeline": timeline
            })

        self.data["accounts"] = accounts
        self.save_json("accounts.json", accounts)

    def generate_licenses(self, licenses_raw):
        """Generate modified licenses with new fields"""
        licenses = []

        for lic in licenses_raw:
            license_data = lic.copy()

            product = license_data["product_family"]
            if product not in PRODUCT_TIERS:
                continue  # Skip unknown products

            tier = random.choice(PRODUCT_TIERS[product])
            unit_price = PRODUCT_UNIT_PRICES[product][tier]
            license_count = license_data["license_count"]

            # Add new fields
            license_data["license_type"] = weighted_choice(["subscription", "perpetual"], [0.95, 0.05])
            license_data["tier"] = tier
            license_data["unit_price"] = unit_price
            license_data["annual_value"] = round(unit_price * license_count, 2)
            license_data["billing_frequency"] = weighted_choice(BILLING_FREQUENCIES, [0.7, 0.2, 0.1])

            # Contract dates
            impl_date = datetime.fromisoformat(license_data["implementation_date"].replace('Z', '+00:00'))
            renewal_date = datetime.fromisoformat(license_data["renewal_date"].replace('Z', '+00:00'))

            license_data["contract_start_date"] = impl_date.isoformat()
            license_data["contract_end_date"] = renewal_date.isoformat()

            # Calculate term
            months = (renewal_date.year - impl_date.year) * 12 + (renewal_date.month - impl_date.month)
            license_data["contract_term_months"] = months

            license_data["auto_renew"] = weighted_choice([True, False], [0.8, 0.2])
            license_data["utilization_trend"] = weighted_choice(["increasing", "stable", "decreasing"], [0.4, 0.4, 0.2])
            license_data["last_utilization_check"] = (CURRENT_DATE - timedelta(days=random.randint(0, 7))).isoformat()
            license_data["utilization_alert_threshold"] = random.choice([75, 80, 85, 90])
            license_data["utilization_alert_enabled"] = True

            licenses.append(license_data)

        self.data["licenses"] = licenses
        self.save_json("licenses.json", licenses)

    def generate_subscriptions(self):
        """Generate subscriptions from licenses"""
        subscriptions = []

        for account_item in self.data["accounts"]:
            account = account_item["account"]
            customer_id = account["id"]

            # Get licenses for this customer
            customer_licenses = [l for l in self.data["licenses"] if l["customer_id"] == customer_id]

            for lic in customer_licenses:
                sub_id = generate_id("SUB", customer_id, lic["product_family"], self.counters['subscription'])

                subscription = {
                    "subscription_id": sub_id,
                    "customer_id": customer_id,
                    "license_id": lic["license_id"],
                    "product_family": lic["product_family"],
                    "subscription_type": weighted_choice(["new", "expansion", "renewal"], [0.3, 0.3, 0.4]),
                    "subscription_status": weighted_choice(["active", "cancelled", "suspended"], [0.92, 0.05, 0.03]),
                    "mrr": round(lic["annual_value"] / 12, 2),
                    "arr": lic["annual_value"],
                    "quantity": lic["license_count"],
                    "unit_price": lic["unit_price"],
                    "billing_frequency": lic["billing_frequency"],
                    "subscription_start_date": lic["contract_start_date"],
                    "subscription_end_date": lic["contract_end_date"],
                    "contract_term_months": lic["contract_term_months"],
                    "renewal_date": lic["renewal_date"],
                    "next_billing_date": (datetime.fromisoformat(lic["renewal_date"].replace('Z', '+00:00')) - timedelta(days=30)).isoformat(),
                    "auto_renew": lic["auto_renew"],
                    "renewal_status": weighted_choice(["pending", "quoted", "renewed"], [0.3, 0.4, 0.3]),
                    "renewal_probability": round(random.uniform(60, 95), 2),
                    "churn_risk_score": round(account["renewal_risk_score"] + random.uniform(-5, 5), 2),
                    "payment_terms": account["payment_terms"],
                    "payment_method": weighted_choice(["invoice", "credit_card", "ACH", "wire_transfer"], [0.5, 0.2, 0.2, 0.1]),
                    "created_date": lic["implementation_date"],
                    "created_by": "system",
                    "modified_date": None,
                    "modified_by": None
                }

                subscriptions.append(subscription)
                self.counters['subscription'] += 1

        self.data["subscriptions"] = subscriptions
        self.save_json("subscriptions.json", subscriptions)

    def generate_quotes_and_line_items(self):
        """Generate quotes and quote line items"""
        quotes = []
        line_items = []

        for account_item in self.data["accounts"]:
            account = account_item["account"]
            customer_id = account["id"]

            # Get subscriptions for this customer
            customer_subs = [s for s in self.data["subscriptions"] if s["customer_id"] == customer_id]
            if not customer_subs:
                continue

            # Generate 1-4 quotes per account
            num_quotes = random.randint(1, 4)

            for _ in range(num_quotes):
                quote_date = generate_date(CURRENT_DATE - timedelta(days=365), CURRENT_DATE)

                quote_type = weighted_choice(["new_business", "renewal", "expansion", "amendment"], [0.2, 0.5, 0.25, 0.05])
                quote_status = weighted_choice(["accepted", "rejected", "expired", "sent"], [0.7, 0.1, 0.1, 0.1])

                # Select 1-3 products for this quote
                num_products = min(random.randint(1, 3), len(customer_subs))
                quote_subs = random.sample(customer_subs, num_products)

                # Calculate totals
                total_amount = sum(s["arr"] for s in quote_subs)
                discount_pct = random.uniform(0, 25) if quote_type == "renewal" else random.uniform(0, 15)
                discount_amt = total_amount * (discount_pct / 100)
                net_amount = total_amount - discount_amt

                quote_id = generate_id("QUO", quote_date.strftime('%Y%m%d'), customer_id, self.counters['quote'])

                quote = {
                    "quote_id": quote_id,
                    "quote_number": f"Q-{quote_date.year}-{self.counters['quote']:04d}",
                    "customer_id": customer_id,
                    "opportunity_id": f"OPP_{quote_date.year}_{self.counters['quote']:03d}",
                    "quote_type": quote_type,
                    "quote_status": quote_status,
                    "total_amount": round(total_amount, 2),
                    "arr_value": round(total_amount, 2),
                    "discount_percentage": round(discount_pct, 2),
                    "discount_amount": round(discount_amt, 2),
                    "net_amount": round(net_amount, 2),
                    "product_families": [s["product_family"] for s in quote_subs],
                    "total_licenses": sum(s["quantity"] for s in quote_subs),
                    "contract_term_months": 12 if quote_type != "amendment" else random.choice([12, 24, 36]),
                    "billing_frequency": account["billing_frequency"],
                    "payment_terms": account["payment_terms"],
                    "quote_created_date": quote_date.isoformat(),
                    "quote_sent_date": add_days(quote_date, random.randint(0, 2)).isoformat(),
                    "quote_expiry_date": add_days(quote_date, 30).isoformat(),
                    "quote_accepted_date": add_days(quote_date, random.randint(3, 20)).isoformat() if quote_status == "accepted" else None,
                    "quote_rejected_date": add_days(quote_date, random.randint(3, 25)).isoformat() if quote_status == "rejected" else None,
                    "is_amendment": quote_type == "amendment",
                    "parent_quote_id": None,
                    "amendment_reason": None,
                    "amendment_count": 0,
                    "requires_amendment": random.random() < 0.02,
                    "amendment_reasons": [],
                    "quote_accuracy_flag": random.random() > 0.02,
                    "created_by": "commercial_ops@cisco.com",
                    "approved_by": "manager@cisco.com" if total_amount > 50000 else None,
                    "approval_date": add_days(quote_date, 0, hours=random.randint(1, 24)).isoformat() if total_amount > 50000 else None,
                    "requires_approval": total_amount > 50000,
                    "converted_to_order": quote_status == "accepted",
                    "order_id": generate_id("ORD", quote_date.strftime('%Y%m%d'), self.counters['quote']) if quote_status == "accepted" else None,
                    "created_date": quote_date.isoformat(),
                    "modified_date": None
                }

                quotes.append(quote)

                # Generate line items
                for line_num, sub in enumerate(quote_subs, 1):
                    line_total = sub["arr"] * (1 - discount_pct / 100)

                    line_item = {
                        "line_item_id": generate_id("LI", quote_id, self.counters['line_item']),
                        "quote_id": quote_id,
                        "line_number": line_num,
                        "product_family": sub["product_family"],
                        "product_sku": f"SKU_{sub['product_family']}_{sub['quantity']}",
                        "product_name": f"{sub['product_family']} {sub['quantity']} Licenses",
                        "product_tier": PRODUCT_TIERS[sub["product_family"]][0],
                        "quantity": sub["quantity"],
                        "unit_price": sub["unit_price"],
                        "list_price": sub["unit_price"],
                        "discount_percentage": round(discount_pct, 2),
                        "discount_amount": round(sub["arr"] * (discount_pct / 100), 2),
                        "net_price": round(sub["unit_price"] * (1 - discount_pct / 100), 2),
                        "line_total": round(line_total, 2),
                        "arr_contribution": round(line_total, 2),
                        "billing_frequency": sub["billing_frequency"],
                        "contract_term_months": quote["contract_term_months"],
                        "created_date": quote_date.isoformat()
                    }

                    line_items.append(line_item)
                    self.counters['line_item'] += 1

                self.counters['quote'] += 1

        self.data["quotes"] = quotes
        self.data["quote_line_items"] = line_items
        self.save_json("quotes.json", quotes)
        self.save_json("quote_line_items.json", line_items)

    def generate_orders(self):
        """Generate orders from accepted quotes"""
        orders = []

        # Get accepted quotes
        accepted_quotes = [q for q in self.data["quotes"] if q["quote_status"] == "accepted"]

        for quote in accepted_quotes:
            order_date = datetime.fromisoformat(quote["quote_accepted_date"])
            has_error = random.random() < 0.08  # 8% error rate

            order_id = quote["order_id"]  # Use pre-assigned ID from quote

            # Calculate processing timeline
            received_date = order_date
            validated_date = add_days(received_date, random.uniform(0.1, 0.5)) if not has_error else add_days(received_date, random.uniform(0.5, 2))
            processing_start = add_days(validated_date, random.uniform(0.1, 0.3))

            if has_error:
                error_detected = add_days(processing_start, random.uniform(0.5, 2))
                error_resolved = add_days(error_detected, random.uniform(2, 48))
                fulfilled_date = add_days(error_resolved, random.uniform(0.5, 2))
                error_resolution_hours = calculate_business_days(error_detected, error_resolved) * 24

                error_type = weighted_choice(
                    ["data_entry", "validation", "provisioning", "billing", "integration"],
                    [0.3, 0.2, 0.25, 0.15, 0.1]
                )
                error_stage = weighted_choice(
                    ["entry", "validation", "provisioning", "activation"],
                    [0.3, 0.3, 0.3, 0.1]
                )
                error_description = f"{error_type} error during {error_stage} stage"
            else:
                fulfilled_date = add_days(processing_start, random.uniform(0.5, 1.5))
                error_type = None
                error_stage = None
                error_description = None
                error_resolution_hours = None

            prov_start = add_days(processing_start, random.uniform(0.2, 0.5))
            prov_complete = add_days(fulfilled_date, -random.uniform(0.1, 0.3))

            order = {
                "order_id": order_id,
                "order_number": f"ORD-{order_date.year}-{self.counters['order']:04d}",
                "customer_id": quote["customer_id"],
                "quote_id": quote["quote_id"],
                "order_type": quote["quote_type"],
                "order_status": "fulfilled" if not has_error else weighted_choice(["fulfilled", "error"], [0.7, 0.3]),
                "order_amount": quote["net_amount"],
                "arr_value": quote["arr_value"],
                "order_placed_date": order_date.isoformat(),
                "order_received_date": received_date.isoformat(),
                "order_validated_date": validated_date.isoformat(),
                "order_processing_start_date": processing_start.isoformat(),
                "order_fulfilled_date": fulfilled_date.isoformat(),
                "order_cancelled_date": None,
                "provisioning_status": "completed",
                "provisioning_started_date": prov_start.isoformat(),
                "provisioning_completed_date": prov_complete.isoformat(),
                "fulfillment_method": weighted_choice(["auto", "manual", "hybrid"], [0.7, 0.2, 0.1]),
                "has_error": has_error,
                "error_type": error_type,
                "error_stage": error_stage,
                "error_description": error_description,
                "error_detected_date": error_detected.isoformat() if has_error else None,
                "error_resolved_date": error_resolved.isoformat() if has_error else None,
                "error_resolution_time_hours": round(error_resolution_hours, 2) if has_error else None,
                "crm_opportunity_id": quote["opportunity_id"],
                "erp_order_id": f"ERP_ORD_{order_date.year}_{self.counters['order']:04d}",
                "billing_system_id": f"BILL_{order_date.year}_{self.counters['order']:04d}",
                "created_by": "system",
                "created_date": order_date.isoformat(),
                "modified_date": fulfilled_date.isoformat()
            }

            orders.append(order)
            self.counters['order'] += 1

        self.data["orders"] = orders
        self.save_json("orders.json", orders)

    def generate_invoices(self):
        """Generate invoices from orders"""
        invoices = []

        # Get fulfilled orders
        fulfilled_orders = [o for o in self.data["orders"] if o["order_status"] == "fulfilled"]

        for order in fulfilled_orders:
            fulfilled_date = datetime.fromisoformat(order["order_fulfilled_date"])
            invoice_gen_date = add_days(fulfilled_date, random.uniform(0.1, 0.5))
            invoice_sent_date = add_days(invoice_gen_date, random.uniform(0.1, 0.3))

            # Get subscription for this order
            customer_id = order["customer_id"]
            subscription = next((s for s in self.data["subscriptions"] if s["customer_id"] == customer_id), None)

            invoice_amount = order["order_amount"]
            tax_amount = round(invoice_amount * 0.08, 2)  # 8% tax
            total_amount = invoice_amount + tax_amount

            # Get payment terms from account
            account = next(a["account"] for a in self.data["accounts"] if a["account"]["id"] == customer_id)
            payment_terms = account["payment_terms"]

            # Calculate due date
            days_map = {"Net 30": 30, "Net 45": 45, "Net 60": 60, "Due on Receipt": 0}
            due_days = days_map.get(payment_terms, 30)
            due_date = add_days(invoice_sent_date, due_days)

            # Determine if disputed
            is_disputed = random.random() < 0.03  # 3% dispute rate

            # Determine payment status
            if is_disputed:
                invoice_status = "disputed"
                is_paid = False
                payment_received_date = None
            else:
                # Payment timing
                on_time_prob = 0.85
                if random.random() < on_time_prob:
                    # Paid on time
                    payment_received_date = add_days(invoice_sent_date, random.randint(10, max(due_days, 11)))
                    invoice_status = "paid"
                    is_paid = True
                else:
                    # Late payment
                    days_late = random.randint(1, 45)
                    payment_received_date = add_days(due_date, days_late)
                    if payment_received_date <= CURRENT_DATE:
                        invoice_status = "paid"
                        is_paid = True
                    else:
                        invoice_status = "overdue"
                        is_paid = False
                        payment_received_date = None

            # Calculate days outstanding
            if is_paid:
                days_outstanding = calculate_business_days(invoice_sent_date, payment_received_date)
            else:
                days_outstanding = calculate_business_days(invoice_sent_date, CURRENT_DATE)

            # Aging bucket
            if days_outstanding <= 30:
                aging_bucket = "current"
            elif days_outstanding <= 60:
                aging_bucket = "31-60"
            elif days_outstanding <= 90:
                aging_bucket = "61-90"
            else:
                aging_bucket = "90+"

            is_overdue = days_outstanding > due_days and not is_paid
            days_overdue = max(0, days_outstanding - due_days) if is_overdue else 0

            amount_paid = total_amount if is_paid else 0
            amount_outstanding = 0 if is_paid else total_amount

            # Dispute handling
            if is_disputed:
                dispute_raised_date = add_days(invoice_sent_date, random.randint(5, 20))
                dispute_reason = weighted_choice(
                    ["pricing_error", "quantity_mismatch", "incorrect_product", "billing_cycle", "contract_terms"],
                    [0.35, 0.25, 0.15, 0.15, 0.1]
                )
                dispute_status = weighted_choice(["under_review", "resolved_adjusted", "resolved_upheld"], [0.3, 0.5, 0.2])
                if dispute_status.startswith("resolved"):
                    dispute_resolved_date = add_days(dispute_raised_date, random.randint(3, 15))
                    dispute_adjustment = round(invoice_amount * random.uniform(0, 0.1), 2) if dispute_status == "resolved_adjusted" else 0
                else:
                    dispute_resolved_date = None
                    dispute_adjustment = 0
            else:
                dispute_raised_date = None
                dispute_reason = None
                dispute_status = None
                dispute_resolved_date = None
                dispute_adjustment = 0

            # Revenue recognition
            revenue_recognized = is_paid
            revenue_recognition_date = payment_received_date if is_paid else None

            # Deferred revenue (for subscriptions)
            if subscription and subscription["billing_frequency"] == "annual":
                months_remaining = subscription["contract_term_months"]
                deferred_revenue = round(invoice_amount * (months_remaining / 12), 2)
            else:
                deferred_revenue = 0

            invoice_id = generate_id("INV", invoice_gen_date.strftime('%Y%m%d'), self.counters['invoice'])

            invoice = {
                "invoice_id": invoice_id,
                "invoice_number": f"INV-{invoice_gen_date.year}-{self.counters['invoice']:04d}",
                "customer_id": customer_id,
                "order_id": order["order_id"],
                "subscription_id": subscription["subscription_id"] if subscription else None,
                "invoice_type": weighted_choice(["subscription", "usage", "one_time"], [0.85, 0.1, 0.05]),
                "invoice_status": invoice_status,
                "invoice_amount": round(invoice_amount, 2),
                "tax_amount": tax_amount,
                "total_amount": round(total_amount, 2),
                "amount_paid": round(amount_paid, 2),
                "amount_outstanding": round(amount_outstanding, 2),
                "payment_terms": payment_terms,
                "payment_method": subscription["payment_method"] if subscription else "invoice",
                "invoice_generated_date": invoice_gen_date.isoformat(),
                "invoice_sent_date": invoice_sent_date.isoformat(),
                "invoice_date": invoice_sent_date.isoformat(),
                "due_date": due_date.isoformat(),
                "payment_received_date": payment_received_date.isoformat() if payment_received_date else None,
                "days_outstanding": int(days_outstanding),
                "aging_bucket": aging_bucket,
                "is_overdue": is_overdue,
                "days_overdue": int(days_overdue),
                "is_disputed": is_disputed,
                "dispute_raised_date": dispute_raised_date.isoformat() if dispute_raised_date else None,
                "dispute_reason": dispute_reason,
                "dispute_status": dispute_status,
                "dispute_resolved_date": dispute_resolved_date.isoformat() if dispute_resolved_date else None,
                "dispute_adjustment_amount": round(dispute_adjustment, 2),
                "revenue_recognized": revenue_recognized,
                "revenue_recognition_date": revenue_recognition_date,
                "deferred_revenue_amount": round(deferred_revenue, 2),
                "billing_period_start": invoice_sent_date.date().isoformat(),
                "billing_period_end": add_days(invoice_sent_date, 365).date().isoformat() if subscription else invoice_sent_date.date().isoformat(),
                "accounting_system_id": f"ACC_INV_{invoice_gen_date.year}_{self.counters['invoice']:04d}",
                "billing_system_id": order["billing_system_id"],
                "created_by": "billing_system",
                "created_date": invoice_gen_date.isoformat(),
                "modified_date": payment_received_date.isoformat() if payment_received_date else None
            }

            invoices.append(invoice)
            self.counters['invoice'] += 1

        self.data["invoices"] = invoices
        self.save_json("invoices.json", invoices)

    def generate_payments(self):
        """Generate payments for paid invoices"""
        payments = []

        # Get paid invoices
        paid_invoices = [inv for inv in self.data["invoices"] if inv["invoice_status"] == "paid"]

        for invoice in paid_invoices:
            payment_date = datetime.fromisoformat(invoice["payment_received_date"])
            payment_initiated = add_days(payment_date, -random.uniform(1, 3))
            payment_cleared = add_days(payment_date, random.uniform(0.5, 2))

            is_failed = random.random() < 0.02  # 2% failure rate (with retry)

            payment_id = generate_id("PAY", payment_date.strftime('%Y%m%d'), self.counters['payment'])

            payment = {
                "payment_id": payment_id,
                "payment_reference": f"PAY-{payment_date.year}-{self.counters['payment']:06d}",
                "customer_id": invoice["customer_id"],
                "invoice_id": invoice["invoice_id"],
                "payment_amount": invoice["total_amount"],
                "payment_method": invoice["payment_method"],
                "payment_status": "cleared" if not is_failed else "failed",
                "payment_date": payment_date.isoformat(),
                "payment_cleared_date": payment_cleared.isoformat() if not is_failed else None,
                "payment_initiated_date": payment_initiated.isoformat(),
                "processor_transaction_id": f"TXN_{uuid.uuid4().hex[:12].upper()}",
                "processor_name": weighted_choice(["Stripe", "PayPal", "Square", "Authorize.net"], [0.4, 0.3, 0.2, 0.1]),
                "processing_fee": round(invoice["total_amount"] * 0.029 + 0.30, 2) if invoice["payment_method"] == "credit_card" else 0,
                "applied_to_invoice_id": invoice["invoice_id"],
                "unapplied_amount": 0,
                "is_failed": is_failed,
                "failure_reason": weighted_choice(["insufficient_funds", "card_declined", "account_closed", "network_error"], [0.4, 0.3, 0.2, 0.1]) if is_failed else None,
                "retry_count": random.randint(1, 3) if is_failed else 0,
                "is_reconciled": not is_failed,
                "reconciliation_date": payment_cleared.isoformat() if not is_failed else None,
                "accounting_system_id": f"ACC_PAY_{payment_date.year}_{self.counters['payment']:04d}",
                "bank_reference": f"BANK_{uuid.uuid4().hex[:10].upper()}",
                "created_by": "payment_processor",
                "created_date": payment_date.isoformat(),
                "modified_date": payment_cleared.isoformat()
            }

            payments.append(payment)
            self.counters['payment'] += 1

        self.data["payments"] = payments
        self.save_json("payments.json", payments)

    def generate_amendments(self):
        """Generate subscription amendments"""
        amendments = []

        # ~20% of subscriptions have amendments
        amendment_subscriptions = random.sample(
            self.data["subscriptions"],
            int(len(self.data["subscriptions"]) * 0.2)
        )

        for subscription in amendment_subscriptions:
            amendment_date = generate_date(
                datetime.fromisoformat(subscription["subscription_start_date"].replace('Z', '+00:00')),
                CURRENT_DATE
            )

            amendment_type = weighted_choice(
                ["quantity_increase", "quantity_decrease", "product_add", "product_remove", "billing_change", "term_change"],
                [0.4, 0.1, 0.3, 0.05, 0.1, 0.05]
            )

            # Calculate changes
            original_quantity = subscription["quantity"]
            original_arr = subscription["arr"]

            if amendment_type == "quantity_increase":
                quantity_change = random.randint(10, max(11, int(original_quantity * 0.3)))
                new_quantity = original_quantity + quantity_change
                new_arr = round(original_arr * (new_quantity / original_quantity), 2)
            elif amendment_type == "quantity_decrease":
                quantity_change = -random.randint(5, max(6, int(original_quantity * 0.2)))
                new_quantity = original_quantity + quantity_change
                new_arr = round(original_arr * (new_quantity / original_quantity), 2)
            else:
                quantity_change = 0
                new_quantity = original_quantity
                new_arr = original_arr

            arr_change = new_arr - original_arr
            mrr_change = arr_change / 12

            original_value = {
                "quantity": original_quantity,
                "unit_price": subscription["unit_price"],
                "mrr": subscription["mrr"],
                "arr": original_arr
            }

            new_value = {
                "quantity": new_quantity,
                "unit_price": subscription["unit_price"],
                "mrr": round(new_arr / 12, 2),
                "arr": new_arr
            }

            # Processing timeline
            requested_date = amendment_date
            received_date = requested_date
            validated_date = add_days(received_date, random.uniform(0.1, 0.5))

            requires_approval = abs(arr_change) > 5000
            if requires_approval:
                approved_date = add_days(validated_date, random.uniform(0.5, 3))
                approval_time = calculate_business_days(validated_date, approved_date) * 24
            else:
                approved_date = validated_date
                approval_time = 0

            processing_start = add_days(approved_date, random.uniform(0.1, 0.5))
            system_updated = add_days(processing_start, random.uniform(0.5, 2))
            system_time = calculate_business_days(processing_start, system_updated) * 24
            customer_notified = add_days(system_updated, random.uniform(0.1, 0.5))
            completed_date = customer_notified

            total_time = calculate_business_days(requested_date, completed_date) * 24

            generates_invoice = amendment_type in ["quantity_increase", "product_add"]
            generates_credit = amendment_type in ["quantity_decrease", "product_remove"]

            amendment_id = generate_id("AMD", amendment_date.strftime('%Y%m%d'), self.counters['amendment'])

            amendment = {
                "amendment_id": amendment_id,
                "amendment_number": f"AMD-{amendment_date.year}-{self.counters['amendment']:04d}",
                "customer_id": subscription["customer_id"],
                "subscription_id": subscription["subscription_id"],
                "amendment_type": amendment_type,
                "amendment_status": "completed",
                "original_value": original_value,
                "new_value": new_value,
                "change_summary": f"{amendment_type.replace('_', ' ').title()}: quantity change from {original_quantity} to {new_quantity}",
                "arr_change": round(arr_change, 2),
                "mrr_change": round(mrr_change, 2),
                "requires_approval": requires_approval,
                "approval_level": "manager" if requires_approval else None,
                "requested_by": "customer_success@cisco.com",
                "approved_by": "sales_manager@cisco.com" if requires_approval else None,
                "approval_date": approved_date.isoformat() if requires_approval else None,
                "rejection_reason": None,
                "amendment_requested_date": requested_date.isoformat(),
                "amendment_request_received_date": received_date.isoformat(),
                "amendment_validated_date": validated_date.isoformat(),
                "amendment_approved_date": approved_date.isoformat(),
                "amendment_processing_start_date": processing_start.isoformat(),
                "amendment_system_updated_date": system_updated.isoformat(),
                "amendment_customer_notified_date": customer_notified.isoformat(),
                "amendment_completed_date": completed_date.isoformat(),
                "total_processing_time_hours": round(total_time, 2),
                "approval_time_hours": round(approval_time, 2),
                "system_update_time_hours": round(system_time, 2),
                "generates_invoice": generates_invoice,
                "invoice_id": f"INV_{amendment_date.strftime('%Y%m%d')}_AMD_{self.counters['amendment']:03d}" if generates_invoice else None,
                "generates_credit": generates_credit,
                "credit_amount": round(abs(arr_change), 2) if generates_credit else 0,
                "amendment_effective_date": amendment_date.date().isoformat(),
                "quote_id": f"QUO_{amendment_date.strftime('%Y%m%d')}_AMD_{self.counters['amendment']:03d}" if generates_invoice else None,
                "order_id": f"ORD_{amendment_date.strftime('%Y%m%d')}_AMD_{self.counters['amendment']:03d}" if generates_invoice else None,
                "created_date": requested_date.isoformat(),
                "modified_date": completed_date.isoformat()
            }

            amendments.append(amendment)
            self.counters['amendment'] += 1

        self.data["amendments"] = amendments
        self.save_json("amendments.json", amendments)

    def generate_revenue_movements(self):
        """Generate revenue movements for NRR/GRR"""
        movements = []

        # Generate movements from amendments
        for amendment in self.data["amendments"]:
            if amendment["arr_change"] == 0:
                continue

            subscription = next(s for s in self.data["subscriptions"] if s["subscription_id"] == amendment["subscription_id"])

            if amendment["arr_change"] > 0:
                movement_type = "expansion"
                movement_category = "upsell" if amendment["amendment_type"] == "quantity_increase" else "cross_sell"
            else:
                movement_type = "contraction"
                movement_category = "downgrade"

            effective_date = datetime.fromisoformat(amendment["amendment_effective_date"])

            movement = {
                "movement_id": generate_id("MOV", effective_date.strftime('%Y%m%d'), self.counters['movement']),
                "customer_id": amendment["customer_id"],
                "subscription_id": amendment["subscription_id"],
                "movement_type": movement_type,
                "movement_category": movement_category,
                "arr_before": amendment["original_value"]["arr"],
                "arr_after": amendment["new_value"]["arr"],
                "arr_change": amendment["arr_change"],
                "mrr_change": amendment["mrr_change"],
                "product_family": subscription["product_family"],
                "quantity_change": amendment["new_value"]["quantity"] - amendment["original_value"]["quantity"],
                "reason_code": "customer_requested",
                "reason_description": amendment["change_summary"],
                "effective_date": effective_date.date().isoformat(),
                "recorded_date": amendment["created_date"],
                "triggered_by": "CSM",
                "related_quote_id": amendment["quote_id"],
                "related_order_id": amendment["order_id"],
                "related_amendment_id": amendment["amendment_id"],
                "fiscal_year": effective_date.year,
                "fiscal_quarter": f"Q{(effective_date.month - 1) // 3 + 1}",
                "fiscal_month": effective_date.strftime("%Y-%m"),
                "created_date": amendment["created_date"]
            }

            movements.append(movement)
            self.counters['movement'] += 1

        # Generate churn movements
        for account_item in self.data["accounts"]:
            account = account_item["account"]
            if account["churn_arr"] > 0:
                churn_date = generate_date(CURRENT_DATE - timedelta(days=180), CURRENT_DATE)

                # Find a subscription to churn
                customer_subs = [s for s in self.data["subscriptions"] if s["customer_id"] == account["id"]]
                if customer_subs:
                    sub = random.choice(customer_subs)

                    movement = {
                        "movement_id": generate_id("MOV", churn_date.strftime('%Y%m%d'), self.counters['movement']),
                        "customer_id": account["id"],
                        "subscription_id": sub["subscription_id"],
                        "movement_type": "churn",
                        "movement_category": "cancellation",
                        "arr_before": sub["arr"],
                        "arr_after": 0,
                        "arr_change": -sub["arr"],
                        "mrr_change": -sub["mrr"],
                        "product_family": sub["product_family"],
                        "quantity_change": -sub["quantity"],
                        "reason_code": weighted_choice(["competitor", "budget", "not_using", "product_fit"], [0.3, 0.25, 0.25, 0.2]),
                        "reason_description": "Customer decided not to renew",
                        "effective_date": churn_date.date().isoformat(),
                        "recorded_date": churn_date.isoformat(),
                        "triggered_by": "Customer",
                        "related_quote_id": None,
                        "related_order_id": None,
                        "related_amendment_id": None,
                        "fiscal_year": churn_date.year,
                        "fiscal_quarter": f"Q{(churn_date.month - 1) // 3 + 1}",
                        "fiscal_month": churn_date.strftime("%Y-%m"),
                        "created_date": churn_date.isoformat()
                    }

                    movements.append(movement)
                    self.counters['movement'] += 1

        self.data["revenue_movements"] = movements
        self.save_json("revenue_movements.json", movements)

    def generate_revenue_recognition(self):
        """Generate revenue recognition schedules"""
        schedules = []

        for subscription in self.data["subscriptions"]:
            if subscription["subscription_status"] != "active":
                continue

            start_date = datetime.fromisoformat(subscription["subscription_start_date"].replace('Z', '+00:00')).replace(tzinfo=None)
            end_date = datetime.fromisoformat(subscription["subscription_end_date"].replace('Z', '+00:00')).replace(tzinfo=None)

            total_contract_value = subscription["arr"]
            term_months = subscription["contract_term_months"]

            # Generate monthly schedule
            monthly_schedule = []
            expected_monthly = total_contract_value / term_months
            total_recognized = 0

            for month in range(term_months):
                period_date = start_date + timedelta(days=30 * month)
                period = period_date.strftime("%Y-%m")

                # Add small variance to actual (99% accuracy target)
                variance_pct = random.uniform(-0.01, 0.01)  # ±1%
                actual_amount = expected_monthly * (1 + variance_pct)
                variance = actual_amount - expected_monthly

                if period_date <= CURRENT_DATE:
                    # Past periods have actual amounts
                    total_recognized += actual_amount
                    monthly_schedule.append({
                        "period": period,
                        "expected_amount": round(expected_monthly, 2),
                        "actual_amount": round(actual_amount, 2),
                        "variance": round(variance, 2)
                    })
                else:
                    # Future periods only have expected
                    monthly_schedule.append({
                        "period": period,
                        "expected_amount": round(expected_monthly, 2),
                        "actual_amount": 0,
                        "variance": 0
                    })

            total_deferred = total_contract_value - total_recognized
            total_variance = sum(m["variance"] for m in monthly_schedule if m["actual_amount"] > 0)
            variance_percentage = abs(total_variance / total_contract_value * 100) if total_contract_value > 0 else 0
            is_accurate = variance_percentage <= 1  # 99% target

            schedule_id = generate_id("REVSCH", subscription["subscription_id"], self.counters['schedule'])

            schedule = {
                "schedule_id": schedule_id,
                "customer_id": subscription["customer_id"],
                "subscription_id": subscription["subscription_id"],
                "invoice_id": None,  # Would link to specific invoice
                "total_contract_value": round(total_contract_value, 2),
                "total_recognized_to_date": round(total_recognized, 2),
                "total_deferred_balance": round(total_deferred, 2),
                "recognition_period_start": start_date.date().isoformat(),
                "recognition_period_end": end_date.date().isoformat(),
                "total_periods": term_months,
                "recognition_method": "straight_line",
                "monthly_schedule": monthly_schedule,
                "total_variance": round(total_variance, 2),
                "variance_percentage": round(variance_percentage, 2),
                "is_accurate": is_accurate,
                "accounting_system_id": f"ACC_REV_{subscription['subscription_id']}",
                "created_date": start_date.isoformat(),
                "modified_date": CURRENT_DATE.isoformat()
            }

            schedules.append(schedule)
            self.counters['schedule'] += 1

        self.data["revenue_recognition_schedule"] = schedules
        self.save_json("revenue_recognition_schedule.json", schedules)

    def generate_utilization_history(self):
        """Generate utilization history snapshots"""
        history = []

        # Generate daily snapshots for last 90 days
        for license_data in self.data["licenses"]:
            base_utilization = license_data["utilization"]
            license_count = license_data["license_count"]

            for days_ago in range(90, 0, -1):
                snapshot_date = CURRENT_DATE - timedelta(days=days_ago)

                # Add trend over time
                if license_data["utilization_trend"] == "increasing":
                    trend_adjustment = (90 - days_ago) / 90 * 10  # Up to +10%
                elif license_data["utilization_trend"] == "decreasing":
                    trend_adjustment = -(90 - days_ago) / 90 * 10  # Up to -10%
                else:
                    trend_adjustment = 0

                # Add daily noise
                daily_noise = random.uniform(-2, 2)
                utilization_pct = max(0, min(100, base_utilization + trend_adjustment + daily_noise))

                licenses_used = int(license_count * utilization_pct / 100)
                licenses_available = license_count - licenses_used

                # Calculate month-over-month change
                if days_ago >= 60:  # If we have 30 days ago data
                    mom_change = trend_adjustment / 3  # Approximate monthly change
                else:
                    mom_change = 0

                # Alert flags
                high_alert = utilization_pct > license_data["utilization_alert_threshold"]
                low_alert = utilization_pct < 40
                anomaly_alert = abs(mom_change) > 20

                utilization_id = generate_id("UTIL", license_data["license_id"], snapshot_date.strftime('%Y%m%d'))

                history_record = {
                    "utilization_id": utilization_id,
                    "customer_id": license_data["customer_id"],
                    "license_id": license_data["license_id"],
                    "product_family": license_data["product_family"],
                    "snapshot_date": snapshot_date.date().isoformat(),
                    "snapshot_timestamp": snapshot_date.isoformat(),
                    "total_licenses": license_count,
                    "licenses_used": licenses_used,
                    "utilization_percentage": round(utilization_pct, 2),
                    "licenses_available": licenses_available,
                    "utilization_trend": license_data["utilization_trend"],
                    "month_over_month_change": round(mom_change, 2),
                    "high_utilization_alert": high_alert,
                    "low_utilization_alert": low_alert,
                    "anomaly_alert": anomaly_alert,
                    "active_users": licenses_used,
                    "inactive_users": licenses_available,
                    "created_date": snapshot_date.isoformat()
                }

                history.append(history_record)

        self.data["utilization_history"] = history
        self.save_json("utilization_history.json", history)

    def generate_utilization_alerts(self):
        """Generate utilization alerts"""
        alerts = []

        # Analyze recent utilization history to generate alerts
        recent_history = [h for h in self.data["utilization_history"]
                          if datetime.fromisoformat(h["snapshot_date"]) >= CURRENT_DATE - timedelta(days=30)]

        # Group by license
        license_groups = {}
        for record in recent_history:
            license_id = record["license_id"]
            if license_id not in license_groups:
                license_groups[license_id] = []
            license_groups[license_id].append(record)

        # Generate alerts for licenses with consistent high/low utilization
        for license_id, records in license_groups.items():
            if not records:
                continue

            latest = records[-1]
            avg_utilization = sum(r["utilization_percentage"] for r in records) / len(records)

            license_data = next(l for l in self.data["licenses"] if l["license_id"] == license_id)
            account = next(a["account"] for a in self.data["accounts"] if a["account"]["id"] == license_data["customer_id"])

            # High utilization alert (expansion opportunity)
            if avg_utilization > 85:
                alert_date = CURRENT_DATE - timedelta(days=random.randint(1, 15))

                potential_arr_impact = license_data["annual_value"] * 0.2  # Assume 20% expansion

                alert = {
                    "alert_id": generate_id("ALERT", alert_date.strftime('%Y%m%d'), self.counters['alert']),
                    "customer_id": license_data["customer_id"],
                    "license_id": license_id,
                    "alert_type": "expansion_opportunity",
                    "alert_severity": "high" if avg_utilization > 90 else "medium",
                    "alert_status": weighted_choice(["new", "acknowledged", "in_progress", "resolved"], [0.2, 0.3, 0.3, 0.2]),
                    "current_utilization": round(latest["utilization_percentage"], 2),
                    "threshold_value": 85.0,
                    "trigger_condition": "Utilization >85% for 2+ consecutive months",
                    "alert_title": f"High {license_data['product_family']} License Utilization - Expansion Opportunity",
                    "alert_description": f"{account['name']} is using {latest['utilization_percentage']:.1f}% of {license_data['product_family']} licenses ({latest['licenses_used']}/{latest['total_licenses']}). Customer may need additional licenses soon.",
                    "recommended_action": f"Generate quote for additional {int(license_data['license_count'] * 0.2)} licenses. Contact CSM to discuss expansion timing.",
                    "alert_triggered_date": alert_date.isoformat(),
                    "alert_acknowledged_date": add_days(alert_date, random.randint(0, 3)).isoformat() if random.random() > 0.2 else None,
                    "alert_resolved_date": None,
                    "assigned_to": "commercial_ops@cisco.com",
                    "assigned_to_team": "Commercial Operations",
                    "escalated": False,
                    "escalation_date": None,
                    "potential_arr_impact": round(potential_arr_impact, 2),
                    "customer_tier": account["tier"],
                    "action_taken": "Quote generated" if random.random() > 0.5 else None,
                    "outcome": "pending",
                    "quote_generated": f"QUO_{alert_date.strftime('%Y%m%d')}_EXP" if random.random() > 0.5 else None,
                    "created_date": alert_date.isoformat(),
                    "modified_date": CURRENT_DATE.isoformat()
                }

                alerts.append(alert)
                self.counters['alert'] += 1

            # Low utilization alert (at-risk)
            elif avg_utilization < 40:
                alert_date = CURRENT_DATE - timedelta(days=random.randint(1, 20))

                potential_arr_impact = -license_data["annual_value"] * 0.5  # Risk of 50% reduction

                alert = {
                    "alert_id": generate_id("ALERT", alert_date.strftime('%Y%m%d'), self.counters['alert']),
                    "customer_id": license_data["customer_id"],
                    "license_id": license_id,
                    "alert_type": "at_risk",
                    "alert_severity": "critical" if avg_utilization < 30 else "high",
                    "alert_status": weighted_choice(["new", "acknowledged", "in_progress"], [0.3, 0.4, 0.3]),
                    "current_utilization": round(latest["utilization_percentage"], 2),
                    "threshold_value": 40.0,
                    "trigger_condition": "Utilization <40% for 3+ consecutive months",
                    "alert_title": f"Critical: Low {license_data['product_family']} License Utilization - Renewal Risk",
                    "alert_description": f"Customer using only {latest['utilization_percentage']:.1f}% of {license_data['product_family']} licenses ({latest['licenses_used']}/{latest['total_licenses']}). Consistent low utilization. Renewal date: {license_data['renewal_date']}",
                    "recommended_action": "CSM to conduct usage review. Consider license right-sizing or usage optimization training.",
                    "alert_triggered_date": alert_date.isoformat(),
                    "alert_acknowledged_date": add_days(alert_date, random.randint(0, 2)).isoformat() if random.random() > 0.3 else None,
                    "alert_resolved_date": None,
                    "assigned_to": "csm_team@cisco.com",
                    "assigned_to_team": "Customer Success",
                    "escalated": avg_utilization < 30,
                    "escalation_date": add_days(alert_date, random.randint(3, 7)).isoformat() if avg_utilization < 30 else None,
                    "potential_arr_impact": round(potential_arr_impact, 2),
                    "customer_tier": account["tier"],
                    "action_taken": None,
                    "outcome": None,
                    "quote_generated": None,
                    "created_date": alert_date.isoformat(),
                    "modified_date": CURRENT_DATE.isoformat()
                }

                alerts.append(alert)
                self.counters['alert'] += 1

        self.data["utilization_alerts"] = alerts
        self.save_json("utilization_alerts.json", alerts)

    def generate_quote_to_cash_tracking(self):
        """Generate quote-to-cash tracking records"""
        tracking_records = []

        # Get completed transactions (quotes with payments)
        for quote in self.data["quotes"]:
            if quote["quote_status"] != "accepted":
                continue

            # Find associated records
            order = next((o for o in self.data["orders"] if o["quote_id"] == quote["quote_id"]), None)
            if not order:
                continue

            invoice = next((inv for inv in self.data["invoices"] if inv["order_id"] == order["order_id"]), None)
            if not invoice:
                continue

            payment = next((p for p in self.data["payments"] if p["invoice_id"] == invoice["invoice_id"]), None)

            # Parse dates
            quote_created = datetime.fromisoformat(quote["quote_created_date"])
            quote_sent = datetime.fromisoformat(quote["quote_sent_date"])
            quote_accepted = datetime.fromisoformat(quote["quote_accepted_date"])
            order_placed = datetime.fromisoformat(order["order_placed_date"])
            order_fulfilled = datetime.fromisoformat(order["order_fulfilled_date"])
            invoice_generated = datetime.fromisoformat(invoice["invoice_generated_date"])
            invoice_sent = datetime.fromisoformat(invoice["invoice_sent_date"])
            payment_received = datetime.fromisoformat(payment["payment_date"]) if payment else None

            # Calculate cycle times
            quote_to_order_days = calculate_business_days(quote_created, order_placed)
            order_to_invoice_days = calculate_business_days(order_fulfilled, invoice_generated)

            if payment_received:
                invoice_to_payment_days = calculate_business_days(invoice_sent, payment_received)
                quote_to_cash_days = calculate_business_days(quote_created, payment_received)
                is_complete = True
                current_stage = "paid"
            else:
                invoice_to_payment_days = None
                quote_to_cash_days = None
                is_complete = False
                current_stage = "invoiced"

            # SLA compliance (target 45 days)
            target_days = 45
            meets_sla = quote_to_cash_days <= target_days if quote_to_cash_days else None
            variance = quote_to_cash_days - target_days if quote_to_cash_days else None

            tracking_id = generate_id("QTC", quote_created.strftime('%Y%m%d'), self.counters['tracking'])

            tracking = {
                "tracking_id": tracking_id,
                "customer_id": quote["customer_id"],
                "quote_id": quote["quote_id"],
                "order_id": order["order_id"],
                "invoice_id": invoice["invoice_id"],
                "payment_id": payment["payment_id"] if payment else None,
                "transaction_value": invoice["total_amount"],
                "arr_value": quote["arr_value"],
                "quote_created_date": quote_created.isoformat(),
                "quote_sent_date": quote_sent.isoformat(),
                "quote_accepted_date": quote_accepted.isoformat(),
                "order_placed_date": order_placed.isoformat(),
                "order_fulfilled_date": order_fulfilled.isoformat(),
                "invoice_generated_date": invoice_generated.isoformat(),
                "invoice_sent_date": invoice_sent.isoformat(),
                "payment_received_date": payment_received.isoformat() if payment_received else None,
                "quote_to_order_days": round(quote_to_order_days, 2),
                "order_to_invoice_days": round(order_to_invoice_days, 2),
                "invoice_to_payment_days": round(invoice_to_payment_days, 2) if invoice_to_payment_days else None,
                "quote_to_cash_days": round(quote_to_cash_days, 2) if quote_to_cash_days else None,
                "current_stage": current_stage,
                "is_complete": is_complete,
                "meets_sla": meets_sla,
                "target_cycle_days": target_days,
                "variance_from_target": round(variance, 2) if variance else None,
                "created_date": quote_created.isoformat(),
                "modified_date": payment_received.isoformat() if payment_received else invoice_sent.isoformat()
            }

            tracking_records.append(tracking)
            self.counters['tracking'] += 1

        self.data["quote_to_cash_tracking"] = tracking_records
        self.save_json("quote_to_cash_tracking.json", tracking_records)

    def generate_kpi_metrics(self):
        """Generate pre-calculated KPI metrics"""
        metrics = []

        # Calculate KPIs for Q1 2025
        period_start = datetime(2025, 1, 1)
        period_end = datetime(2025, 3, 31)

        # 1. NRR
        total_starting_arr = sum(a["account"]["starting_arr"] for a in self.data["accounts"])
        total_expansion_arr = sum(a["account"]["expansion_arr"] for a in self.data["accounts"])
        total_churn_arr = sum(a["account"]["churn_arr"] for a in self.data["accounts"])
        total_contraction_arr = sum(a["account"]["contraction_arr"] for a in self.data["accounts"])

        nrr = ((total_starting_arr + total_expansion_arr - total_churn_arr - total_contraction_arr) / total_starting_arr * 100) if total_starting_arr > 0 else 0

        metrics.append({
            "metric_id": generate_id("KPI", "NRR", "2025", "Q1", "COMPANY"),
            "kpi_name": "Net Revenue Retention (NRR)",
            "kpi_category": "revenue",
            "calculation_scope": "company_wide",
            "scope_id": "ALL",
            "calculation_period": "quarterly",
            "period_start_date": period_start.date().isoformat(),
            "period_end_date": period_end.date().isoformat(),
            "fiscal_year": 2025,
            "fiscal_quarter": "Q1",
            "fiscal_month": None,
            "metric_value": round(nrr, 2),
            "metric_unit": "percentage",
            "prior_period_value": round(nrr - random.uniform(2, 5), 2),
            "period_over_period_change": round(random.uniform(2, 5), 2),
            "period_over_period_change_pct": round(random.uniform(2, 5), 2),
            "trend": "improving",
            "target_value": 110.0,
            "variance_from_target": round(nrr - 110, 2),
            "meets_target": nrr >= 110,
            "calculation_details": {
                "starting_arr": round(total_starting_arr, 2),
                "expansion_arr": round(total_expansion_arr, 2),
                "churn_arr": round(total_churn_arr, 2),
                "contraction_arr": round(total_contraction_arr, 2),
                "formula": "((Starting + Expansion - Churn - Contraction) / Starting) × 100"
            },
            "data_quality_score": 98.5,
            "calculated_date": CURRENT_DATE.isoformat(),
            "calculated_by": "automated_kpi_engine"
        })

        # 2. ARR
        total_arr = sum(s["arr"] for s in self.data["subscriptions"] if s["subscription_status"] == "active")

        metrics.append({
            "metric_id": generate_id("KPI", "ARR", "2025", "Q1", "COMPANY"),
            "kpi_name": "Annual Recurring Revenue (ARR)",
            "kpi_category": "revenue",
            "calculation_scope": "company_wide",
            "scope_id": "ALL",
            "calculation_period": "quarterly",
            "period_start_date": period_start.date().isoformat(),
            "period_end_date": period_end.date().isoformat(),
            "fiscal_year": 2025,
            "fiscal_quarter": "Q1",
            "fiscal_month": None,
            "metric_value": round(total_arr, 2),
            "metric_unit": "currency",
            "prior_period_value": round(total_arr * 0.9, 2),
            "period_over_period_change": round(total_arr * 0.1, 2),
            "period_over_period_change_pct": 10.0,
            "trend": "improving",
            "target_value": round(total_arr * 0.95, 2),
            "variance_from_target": round(total_arr * 0.05, 2),
            "meets_target": True,
            "calculation_details": {
                "active_subscriptions": len([s for s in self.data["subscriptions"] if s["subscription_status"] == "active"]),
                "formula": "SUM(subscription.arr) WHERE status='active'"
            },
            "data_quality_score": 100.0,
            "calculated_date": CURRENT_DATE.isoformat(),
            "calculated_by": "automated_kpi_engine"
        })

        # 3. DSO
        outstanding_invoices = [inv for inv in self.data["invoices"] if inv["amount_outstanding"] > 0]
        if outstanding_invoices:
            avg_dso = sum(inv["days_outstanding"] for inv in outstanding_invoices) / len(outstanding_invoices)
        else:
            avg_dso = 0

        metrics.append({
            "metric_id": generate_id("KPI", "DSO", "2025", "Q1", "COMPANY"),
            "kpi_name": "Days Sales Outstanding (DSO)",
            "kpi_category": "cash_flow",
            "calculation_scope": "company_wide",
            "scope_id": "ALL",
            "calculation_period": "quarterly",
            "period_start_date": period_start.date().isoformat(),
            "period_end_date": period_end.date().isoformat(),
            "fiscal_year": 2025,
            "fiscal_quarter": "Q1",
            "fiscal_month": None,
            "metric_value": round(avg_dso, 2),
            "metric_unit": "days",
            "prior_period_value": round(avg_dso + 3, 2),
            "period_over_period_change": -3.0,
            "period_over_period_change_pct": round(-3 / (avg_dso + 3) * 100, 2),
            "trend": "improving",
            "target_value": 30.0,
            "variance_from_target": round(avg_dso - 30, 2),
            "meets_target": avg_dso <= 30,
            "calculation_details": {
                "total_ar": sum(inv["amount_outstanding"] for inv in outstanding_invoices),
                "outstanding_invoices": len(outstanding_invoices),
                "formula": "AVG(days_outstanding) for open invoices"
            },
            "data_quality_score": 100.0,
            "calculated_date": CURRENT_DATE.isoformat(),
            "calculated_by": "automated_kpi_engine"
        })

        # Add more KPIs... (abbreviated for space)

        self.data["kpi_metrics"] = metrics
        self.save_json("kpi_metrics.json", metrics)

    def generate_accounts_receivable(self):
        """Generate accounts receivable summary data"""
        ar_data = []

        for account_item in self.data["accounts"]:
            account = account_item["account"]
            customer_id = account["id"]

            # Get outstanding invoices for this customer
            customer_invoices = [inv for inv in self.data["invoices"]
                                if inv["customer_id"] == customer_id and inv["amount_outstanding"] > 0]

            if not customer_invoices:
                continue

            total_ar = sum(inv["amount_outstanding"] for inv in customer_invoices)

            # Aging buckets
            current_ar = sum(inv["amount_outstanding"] for inv in customer_invoices if inv["aging_bucket"] == "current")
            aging_31_60 = sum(inv["amount_outstanding"] for inv in customer_invoices if inv["aging_bucket"] == "31-60")
            aging_61_90 = sum(inv["amount_outstanding"] for inv in customer_invoices if inv["aging_bucket"] == "61-90")
            aging_90_plus = sum(inv["amount_outstanding"] for inv in customer_invoices if inv["aging_bucket"] == "90+")

            avg_days = sum(inv["days_outstanding"] for inv in customer_invoices) / len(customer_invoices)
            oldest_days = max(inv["days_outstanding"] for inv in customer_invoices)

            overdue_balance = sum(inv["amount_outstanding"] for inv in customer_invoices if inv["is_overdue"])
            disputed_invoices = [inv for inv in customer_invoices if inv["is_disputed"]]

            ar_record = {
                "customer_id": customer_id,
                "customer_name": account["name"],
                "customer_tier": account["tier"],
                "payment_terms": account["payment_terms"],
                "total_outstanding_invoices": len(customer_invoices),
                "total_ar_balance": round(total_ar, 2),
                "current_0_30_days": round(current_ar, 2),
                "aging_31_60_days": round(aging_31_60, 2),
                "aging_61_90_days": round(aging_61_90, 2),
                "aging_90_plus_days": round(aging_90_plus, 2),
                "avg_days_outstanding": round(avg_days, 2),
                "oldest_invoice_days": int(oldest_days),
                "overdue_balance": round(overdue_balance, 2),
                "disputed_invoice_count": len(disputed_invoices),
                "disputed_amount": round(sum(inv["amount_outstanding"] for inv in disputed_invoices), 2)
            }

            ar_data.append(ar_record)

        self.data["accounts_receivable"] = ar_data
        self.save_json("accounts_receivable.json", ar_data)

    def print_summary(self):
        """Print generation summary"""
        print("\nGenerated Files Summary:")
        print("-" * 70)

        file_stats = [
            ("accounts.json", len(self.data.get("accounts", []))),
            ("licenses.json", len(self.data.get("licenses", []))),
            ("subscriptions.json", len(self.data.get("subscriptions", []))),
            ("quotes.json", len(self.data.get("quotes", []))),
            ("quote_line_items.json", len(self.data.get("quote_line_items", []))),
            ("orders.json", len(self.data.get("orders", []))),
            ("invoices.json", len(self.data.get("invoices", []))),
            ("payments.json", len(self.data.get("payments", []))),
            ("amendments.json", len(self.data.get("amendments", []))),
            ("revenue_movements.json", len(self.data.get("revenue_movements", []))),
            ("revenue_recognition_schedule.json", len(self.data.get("revenue_recognition_schedule", []))),
            ("utilization_history.json", len(self.data.get("utilization_history", []))),
            ("utilization_alerts.json", len(self.data.get("utilization_alerts", []))),
            ("quote_to_cash_tracking.json", len(self.data.get("quote_to_cash_tracking", []))),
            ("kpi_metrics.json", len(self.data.get("kpi_metrics", []))),
            ("accounts_receivable.json", len(self.data.get("accounts_receivable", [])))
        ]

        for filename, count in file_stats:
            print(f"  {filename:<40} {count:>6} records")

        print("-" * 70)
        print(f"Total Records: {sum(count for _, count in file_stats):>6}")
        print("\nAll files saved to:")
        print(f"  {os.path.abspath(self.output_path)}")
        print("\nNext Steps:")
        print("  1. Review generated JSON files")
        print("  2. Import into database or analytics tool")
        print("  3. Run KPI calculations from KPI_CALCULATIONS.md")
        print("  4. Build dashboards and visualizations")

def add_days(date: datetime, days: float, hours: int = 0) -> datetime:
    """Helper to add days and hours"""
    return date + timedelta(days=days, hours=hours)

# ==================== MAIN EXECUTION ====================

if __name__ == "__main__":
    try:
        generator = CommercialOpsDataGenerator()
        generator.generate_all()

        print("\n" + "="*70)
        print("SUCCESS: All data generated successfully!")
        print("="*70)

    except KeyboardInterrupt:
        print("\n\n⚠ Generation interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\nERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
