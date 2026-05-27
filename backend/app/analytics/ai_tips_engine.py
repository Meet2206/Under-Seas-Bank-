def generate_financial_tips(expense_summary):

    tips = []

    withdrawals = expense_summary.get("withdrawals", 0)
    transfers = expense_summary.get("transfers", 0)

    if withdrawals > 10000:
        tips.append("Your cash withdrawals are high. Consider digital payments.")

    if transfers > 20000:
        tips.append("You transfer a lot of money. Track where it goes.")

    if not tips:
        tips.append("Your spending pattern looks healthy.")

    return tips