from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth_middleware import get_current_user
from app.models.beneficiary_model import Beneficiary


router = APIRouter(prefix="/beneficiaries")


@router.post("/add")
def add_beneficiary(data: dict,
                    db: Session = Depends(get_db),
                    current_user=Depends(get_current_user)):

    beneficiary = Beneficiary(
        user_id=current_user.id,
        name=data["name"],
        account_number=data["account_number"],
        bank_name=data["bank_name"]
    )

    db.add(beneficiary)
    db.commit()
    db.refresh(beneficiary)

    return beneficiary


@router.get("/my")
def get_beneficiaries(db: Session = Depends(get_db),
                      current_user=Depends(get_current_user)):

    return db.query(Beneficiary).filter(
        Beneficiary.user_id == current_user.id
    ).all()