def calculate_financial_health(balance, expenses, income):

    if income == 0:
        return 0

    savings_rate = (income - expenses) / income

    if savings_rate > 0.4:
        return "Excellent"

    elif savings_rate > 0.2:
        return "Good"

    elif savings_rate > 0:
        return "Average"

    else:
        return "Poor"