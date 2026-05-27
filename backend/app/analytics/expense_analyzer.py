from collections import defaultdict
from decimal import Decimal


def analyze_expenses(transactions):

    summary = defaultdict(Decimal)

    for txn in transactions:

        if txn.transaction_type == "deposit":
            summary["Deposits"] += txn.amount

        elif txn.transaction_type == "withdraw":
            summary["Withdrawals"] += txn.amount

        elif txn.transaction_type == "transfer":
            summary["Transfers"] += txn.amount

    return dict(summary)
