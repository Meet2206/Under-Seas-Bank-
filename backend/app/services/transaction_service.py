from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.account_model import Account
from app.models.transaction_model import Transaction


def deposit(account_id: int, amount: float, db: Session):

    if amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")

    account = db.query(Account).filter(Account.id == account_id).first()

    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    try:
        account.balance += amount

        transaction = Transaction(
            to_account_id=account.id,
            amount=amount,
            transaction_type="deposit",
        )

        db.add(transaction)
        db.commit()
        db.refresh(transaction)

    except:
        db.rollback()
        raise HTTPException(status_code=500, detail="Deposit failed")

    return transaction


def withdraw(account_id: int, amount: float, db: Session):

    if amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")

    account = db.query(Account).filter(Account.id == account_id).first()

    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    if account.balance < amount:
        raise HTTPException(status_code=400, detail="Insufficient balance")

    try:
        account.balance -= amount

        transaction = Transaction(
            from_account_id=account.id,
            amount=amount,
            transaction_type="withdraw",
        )

        db.add(transaction)
        db.commit()
        db.refresh(transaction)

    except:
        db.rollback()
        raise HTTPException(status_code=500, detail="Withdrawal failed")

    return transaction


def transfer(from_account_id: int, to_account_id: int, amount: float, db: Session):

    if amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")
    if from_account_id == to_account_id:
        raise HTTPException(status_code=400, detail="Source and destination accounts must differ")

    from_account = db.query(Account).filter(Account.id == from_account_id).first()
    to_account = db.query(Account).filter(Account.id == to_account_id).first()

    if not from_account or not to_account:
        raise HTTPException(status_code=404, detail="Account not found")

    if from_account.balance < amount:
        raise HTTPException(status_code=400, detail="Insufficient balance")

    try:
        from_account.balance -= amount
        to_account.balance += amount

        transaction = Transaction(
            from_account_id=from_account.id,
            to_account_id=to_account.id,
            amount=amount,
            transaction_type="transfer",
        )

        db.add(transaction)

        db.commit()
        db.refresh(transaction)

    except:
        db.rollback()
        raise HTTPException(status_code=500, detail="Transfer failed")

    return transaction


def get_transactions(account_id: int, db: Session):

    return db.query(Transaction).filter(
        (Transaction.from_account_id == account_id) |
        (Transaction.to_account_id == account_id)
    ).all()
