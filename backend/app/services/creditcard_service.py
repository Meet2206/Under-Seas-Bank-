import secrets
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.account_model import Account
from app.models.creditcard_model import CreditCard
from app.utils.lookup_hash import build_lookup_hash


def generate_card_number(db: Session):
    while True:
        card_number = "4" + "".join(str(secrets.randbelow(10)) for _ in range(15))
        existing = db.query(CreditCard).filter(
            CreditCard.card_number_hash == build_lookup_hash(card_number)
        ).first()
        if not existing:
            return card_number


def apply_credit_card(data, user_id: int, db: Session):
    account = db.query(Account).filter(
        Account.id == data.account_id,
        Account.user_id == user_id,
    ).first()
    if not account:
        raise HTTPException(status_code=403, detail="Unauthorized account access")

    card_number = generate_card_number(db)
    card = CreditCard(
        user_id=user_id,
        account_id=data.account_id,
        card_number=card_number,
        card_number_hash=build_lookup_hash(card_number),
        credit_limit=data.credit_limit,
        available_credit=data.credit_limit
    )

    db.add(card)
    db.commit()
    db.refresh(card)

    return card


def get_user_cards(user_id: int, db: Session):

    return db.query(CreditCard).filter(
        CreditCard.user_id == user_id
    ).all()


def make_purchase(card_id: int, amount: float, user_id: int, db: Session):

    card = db.query(CreditCard).filter(
        CreditCard.id == card_id,
        CreditCard.user_id == user_id,
    ).first()

    if not card:
        raise HTTPException(status_code=404, detail="Card not found")

    if card.available_credit < amount:
        raise HTTPException(status_code=400, detail="Credit limit exceeded")

    card.used_credit += amount
    card.available_credit -= amount

    db.commit()
    db.refresh(card)

    return card


def pay_bill(card_id: int, amount: float, user_id: int, db: Session):

    card = db.query(CreditCard).filter(
        CreditCard.id == card_id,
        CreditCard.user_id == user_id,
    ).first()

    if not card:
        raise HTTPException(status_code=404, detail="Card not found")

    card.used_credit -= amount

    if card.used_credit < 0:
        card.used_credit = 0
    card.available_credit = card.credit_limit - card.used_credit

    db.commit()
    db.refresh(card)

    return card
