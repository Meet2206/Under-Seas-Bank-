from decimal import Decimal

from pydantic import BaseModel, Field


class CreditCardApplyRequest(BaseModel):

    account_id: int
    credit_limit: Decimal = Field(gt=0)


class CreditPurchaseRequest(BaseModel):

    card_id: int
    amount: Decimal = Field(gt=0)


class CreditPaymentRequest(BaseModel):

    card_id: int
    amount: Decimal = Field(gt=0)


class CreditCardResponse(BaseModel):

    id: int
    card_number: str
    credit_limit: Decimal
    used_credit: Decimal
    available_credit: Decimal
    status: str

    class Config:
        from_attributes = True
