from decimal import Decimal

from pydantic import BaseModel, Field


class FDCreateRequest(BaseModel):

    account_id: int
    principal_amount: Decimal = Field(gt=0)
    interest_rate: Decimal = Field(gt=0)
    duration_months: int = Field(gt=0)


class FDResponse(BaseModel):

    id: int
    principal_amount: Decimal
    interest_rate: Decimal
    duration_months: int
    maturity_amount: Decimal
    status: str

    class Config:
        from_attributes = True
