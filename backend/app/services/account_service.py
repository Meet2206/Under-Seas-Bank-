import secrets
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.account_model import Account
from app.models.transaction_model import Transaction
from app.utils.lookup_hash import build_lookup_hash


def generate_account_number(db: Session):

    while True:
        account_number = "".join(str(secrets.randbelow(10)) for _ in range(10))

        existing = db.query(Account).filter(
            Account.account_number_hash == build_lookup_hash(account_number)
        ).first()

        if not existing:
            return account_number


def create_account(user_id: int, account_type: str, db: Session):
    account_number = generate_account_number(db)

    account = Account(
        account_number=account_number,
        account_number_hash=build_lookup_hash(account_number),
        account_type=account_type,
        balance=0,
        user_id=user_id,
    )

    db.add(account)
    db.commit()
    db.refresh(account)

    return account

def get_account_statement(account_id: int, db):

    account = db.query(Account).filter(Account.id == account_id).first()

    if not account:
        raise Exception("Account not found")

    transactions = db.query(Transaction).filter(
        (Transaction.from_account_id == account_id) |
        (Transaction.to_account_id == account_id)
    ).order_by(Transaction.id.asc()).all()

    running_balance = 0
    statement = []

    for t in transactions:

        if t.transaction_type == "deposit":
            running_balance += t.amount

        elif t.transaction_type == "withdraw":
            running_balance -= t.amount

        elif t.transaction_type == "transfer":

            if t.from_account_id == account_id:
                running_balance -= t.amount
            else:
                running_balance += t.amount

        statement.append({
            "transaction_id": t.id,
            "type": t.transaction_type,
            "amount": t.amount,
            "balance_after_transaction": running_balance
        })

    return {
        "account_number": account.account_number,
        "current_balance": account.balance,
        "statement": statement
    }

def get_passbook(account_id: int, db):

    account = db.query(Account).filter(Account.id == account_id).first()

    if not account:
        raise Exception("Account not found")

    transactions = db.query(Transaction).filter(
        (Transaction.from_account_id == account_id) |
        (Transaction.to_account_id == account_id)
    ).order_by(Transaction.created_at.asc()).all()

    balance = 0
    passbook = []

    for t in transactions:

        if t.transaction_type == "deposit":
            balance += t.amount

        elif t.transaction_type == "withdraw":
            balance -= t.amount

        elif t.transaction_type == "transfer":

            if t.from_account_id == account_id:
                balance -= t.amount
            else:
                balance += t.amount

        passbook.append({
            "date": t.created_at,
            "type": t.transaction_type,
            "amount": t.amount,
            "balance": balance
        })

    return {
        "account_number": account.account_number,
        "passbook": passbook
    }   

def get_user_accounts(user_id: int, db: Session):

    return db.query(Account).filter(
        Account.user_id == user_id
    ).all()
