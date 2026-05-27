from fastapi import HTTPException
from decimal import Decimal

from sqlalchemy.orm import Session

from app.models.account_model import Account
from app.models.fixeddeposit_model import FixedDeposit


def calculate_maturity(principal, rate, months):

    years = Decimal(months) / Decimal("12")

    maturity = principal * (Decimal("1") + (rate / Decimal("100")) * years)

    return maturity.quantize(Decimal("0.01"))


def create_fd(data, user_id: int, db: Session):
    account = db.query(Account).filter(
        Account.id == data.account_id,
        Account.user_id == user_id,
    ).first()
    if not account:
        raise HTTPException(status_code=403, detail="Unauthorized account access")

    maturity = calculate_maturity(
        data.principal_amount,
        data.interest_rate,
        data.duration_months
    )

    fd = FixedDeposit(
        user_id=user_id,
        account_id=data.account_id,
        principal_amount=data.principal_amount,
        interest_rate=data.interest_rate,
        duration_months=data.duration_months,
        maturity_amount=maturity
    )

    db.add(fd)
    db.commit()
    db.refresh(fd)

    return fd


def get_user_fds(user_id: int, db: Session):

    return db.query(FixedDeposit).filter(
        FixedDeposit.user_id == user_id
    ).all()


def close_fd(fd_id: int, user_id: int, db: Session):

    fd = db.query(FixedDeposit).filter(
        FixedDeposit.id == fd_id,
        FixedDeposit.user_id == user_id,
    ).first()

    if not fd:
        raise HTTPException(status_code=404, detail="FD not found")

    fd.status = "closed"

    db.commit()
    db.refresh(fd)

    return fd
