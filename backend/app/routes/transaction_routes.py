from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.account_model import Account
from app.schemas.transaction_schema import (
    DepositRequest,
    WithdrawRequest,
    TransferRequest,
)
from app.services.transaction_service import (
    deposit,
    withdraw,
    transfer,
    get_transactions,
)
from app.middleware.auth_middleware import get_current_user


router = APIRouter(prefix="/transactions", tags=["Transactions"])


@router.post("/deposit")
def deposit_money(
    data: DepositRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):

    account = db.query(Account).filter(Account.id == data.account_id).first()

    if not account or account.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized account access")

    return deposit(data.account_id, data.amount, db)


@router.post("/withdraw")
def withdraw_money(
    data: WithdrawRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):

    account = db.query(Account).filter(Account.id == data.account_id).first()

    if not account or account.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized account access")

    return withdraw(data.account_id, data.amount, db)


@router.post("/transfer")
def transfer_money(
    data: TransferRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):

    from_account = db.query(Account).filter(Account.id == data.from_account_id).first()

    if not from_account or from_account.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized account access")

    return transfer(
        data.from_account_id,
        data.to_account_id,
        data.amount,
        db,
    )


@router.get("/history/{account_id}")
def transaction_history(
    account_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):

    account = db.query(Account).filter(Account.id == account_id).first()

    if not account or account.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized account access")

    return get_transactions(account_id, db)