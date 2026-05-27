from decimal import Decimal
from typing import Literal

from pydantic import BaseModel


class CreateAccountRequest(BaseModel):
    account_type: Literal["Savings", "Current", "Salary"]


class AccountResponse(BaseModel):
    id: int
    account_number: str
    account_type: str
    balance: Decimal
