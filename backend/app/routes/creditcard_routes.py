from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.creditcard_schema import (
    CreditCardApplyRequest,
    CreditPurchaseRequest,
    CreditPaymentRequest
)

from app.services.creditcard_service import (
    apply_credit_card,
    get_user_cards,
    make_purchase,
    pay_bill
)

from app.middleware.auth_middleware import get_current_user


router = APIRouter(prefix="/credit-card")


@router.post("/apply")
def apply_card(
    data: CreditCardApplyRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    return apply_credit_card(data, current_user.id, db)


@router.get("/my")
def my_cards(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    return get_user_cards(current_user.id, db)


@router.post("/purchase")
def purchase(
    data: CreditPurchaseRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    return make_purchase(data.card_id, data.amount, current_user.id, db)


@router.post("/pay")
def pay_credit_bill(
    data: CreditPaymentRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    return pay_bill(data.card_id, data.amount, current_user.id, db)
