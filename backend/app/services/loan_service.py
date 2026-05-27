from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.account_model import Account
from app.models.loan_model import Loan
from app.utils.emi_calculator import calculate_emi


def apply_loan(data, user_id: int, db: Session):
    account = db.query(Account).filter(
        Account.id == data.account_id,
        Account.user_id == user_id,
    ).first()
    if not account:
        raise HTTPException(status_code=403, detail="Unauthorized account access")

    emi = calculate_emi(
        data.loan_amount,
        data.interest_rate,
        data.tenure_months
    )

    loan = Loan(
        user_id=user_id,
        account_id=data.account_id,
        loan_amount=data.loan_amount,
        interest_rate=data.interest_rate,
        tenure_months=data.tenure_months,
        emi_amount=emi,
        remaining_balance=data.loan_amount
    )

    db.add(loan)
    db.commit()
    db.refresh(loan)

    return loan


def get_user_loans(user_id: int, db: Session):

    return db.query(Loan).filter(
        Loan.user_id == user_id
    ).all()


def pay_emi(loan_id: int, amount: float, user_id: int, db: Session):

    loan = db.query(Loan).filter(
        Loan.id == loan_id,
        Loan.user_id == user_id,
    ).first()

    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")

    loan.remaining_balance -= amount

    if loan.remaining_balance <= 0:
        loan.status = "closed"
        loan.remaining_balance = 0

    db.commit()
    db.refresh(loan)

    return loan
