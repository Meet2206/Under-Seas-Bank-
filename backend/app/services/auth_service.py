from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.models.user_model import User
from app.utils.password_hash import hash_password, verify_password
from app.utils.jwt_handler import create_access_token
from app.services.email_service import send_welcome_email
from app.services.otp_service import send_email_otp


def register_user(data, db: Session):

    existing_user = db.query(User).filter(
        (User.email == data.email) | (User.phone_number == data.phone_number)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="User already exists with this email or phone number"
        )

    mpin_hash = hash_password(data.mpin)

    user = User(
        name=data.name,
        email=data.email,
        phone_number=data.phone_number,
        mpin_hash=mpin_hash
    )

    db.add(user)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="User already exists with this email or phone number"
        )

    db.refresh(user)

    # Send welcome email and required email OTP for new-user verification.
    send_welcome_email(user.email, user.name)
    send_email_otp(user.email)

    token = create_access_token({"user_id": user.id})

    return {
        "access_token": token,
        "token_type": "bearer",
        "verification_required": True,
        "verification_channel": "email",
        "verification_target": user.email,
    }



def login_user(data, db: Session):

    user = db.query(User).filter(
        User.phone_number == data.phone_number
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid phone number or MPIN"
        )

    if user.is_locked:
        raise HTTPException(
            status_code=403,
            detail="Account locked due to multiple failed login attempts."
        )

    if not verify_password(data.mpin, user.mpin_hash):

        user.failed_attempts += 1

        if user.failed_attempts >= 5:
            user.is_locked = True

        db.commit()

        raise HTTPException(
            status_code=401,
            detail="Invalid phone number or MPIN"
        )

    user.failed_attempts = 0
    db.commit()

    token = create_access_token({"user_id": user.id})

    if not user.is_email_verified:
        send_email_otp(user.email)
        return {
            "access_token": token,
            "token_type": "bearer",
            "verification_required": True,
            "verification_channel": "email",
            "verification_target": user.email,
        }

    return {
        "access_token": token,
        "token_type": "bearer"
    }
