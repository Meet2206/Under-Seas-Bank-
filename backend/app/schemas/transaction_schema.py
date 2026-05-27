from decimal import Decimal

from pydantic import BaseModel, Field


class DepositRequest(BaseModel):
    account_id: int
    amount: Decimal = Field(gt=0)


class WithdrawRequest(BaseModel):
    account_id: int
    amount: Decimal = Field(gt=0)


class TransferRequest(BaseModel):
    from_account_id: int
    to_account_id: int
    amount: Decimal = Field(gt=0)
