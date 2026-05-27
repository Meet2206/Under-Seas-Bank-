# app/routes/analytics_routes.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth_middleware import get_current_user
from app.models.transaction_model import Transaction
from app.models.account_model import Account
from app.analytics.expense_analyzer import analyze_expenses


router = APIRouter(prefix="/analytics")


@router.get("/expenses")
def expense_pie_chart(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    account_ids = [
        account.id
        for account in db.query(Account).filter(Account.user_id == current_user.id).all()
    ]
    transactions = db.query(Transaction).filter(
        (Transaction.from_account_id.in_(account_ids)) |
        (Transaction.to_account_id.in_(account_ids))
    ).all()

    summary = analyze_expenses(transactions)

    return summary
