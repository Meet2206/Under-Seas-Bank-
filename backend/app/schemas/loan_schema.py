from decimal import Decimal

from pydantic import BaseModel, Field


class LoanApplyRequest(BaseModel):

    account_id: int
    loan_amount: Decimal = Field(gt=0)
    interest_rate: Decimal = Field(gt=0)
    tenure_months: int = Field(gt=0)


class LoanPaymentRequest(BaseModel):

    loan_id: int
    amount: Decimal = Field(gt=0)


class LoanResponse(BaseModel):

    id: int
    loan_amount: Decimal
    interest_rate: Decimal
    tenure_months: int
    emi_amount: Decimal
    remaining_balance: Decimal
    status: str

    class Config:
        from_attributes = True
