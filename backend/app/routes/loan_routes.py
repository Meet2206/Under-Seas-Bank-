from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.loan_schema import (
    LoanApplyRequest,
    LoanPaymentRequest,
    LoanResponse
)
from app.services.loan_service import (
    apply_loan,
    get_user_loans,
    pay_emi
)
from app.middleware.auth_middleware import get_current_user


router = APIRouter(prefix="/loans")


@router.post("/apply", response_model=LoanResponse)
def apply_for_loan(
    data: LoanApplyRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    return apply_loan(data, current_user.id, db)


@router.get("/my")
def my_loans(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    return get_user_loans(current_user.id, db)


@router.post("/pay")
def pay_loan_emi(
    data: LoanPaymentRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    return pay_emi(data.loan_id, data.amount, current_user.id, db)
