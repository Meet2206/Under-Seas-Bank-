from decimal import Decimal


def calculate_emi(principal: Decimal, annual_rate: Decimal, months: int):
    """
    Calculate EMI using standard formula
    """

    monthly_rate = annual_rate / Decimal("1200")

    emi = (
        principal
        * monthly_rate
        * (1 + monthly_rate) ** months
        / ((1 + monthly_rate) ** months - 1)
    )

    return emi.quantize(Decimal("0.01"))
