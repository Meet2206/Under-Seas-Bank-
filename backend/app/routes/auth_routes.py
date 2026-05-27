from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.auth_schema import (
    RegisterRequest,
    LoginRequest,
    AuthResponse,
    SendPhoneOTPRequest,
    VerifyPhoneOTPRequest,
    SendEmailOTPRequest,
    VerifyEmailOTPRequest,
)
from app.services.auth_service import register_user, login_user
from app.services.otp_service import send_phone_otp, send_email_otp, verify_otp
from app.services.email_service import get_email_status
from app.middleware.auth_middleware import get_current_user
from app.models.user_model import User


router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=AuthResponse)
def register(data: RegisterRequest, db: Session = Depends(get_db)):

    result = register_user(data, db)

    return result


@router.post("/login", response_model=AuthResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    """
    Login using phone number and MPIN.
    Locks account after 5 failed attempts.
    """

    return login_user(data, db)


@router.get("/me")
def get_me(current_user=Depends(get_current_user)):
    """
    Get details of currently authenticated user.
    """

    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "phone_number": current_user.phone_number,
        "is_email_verified": current_user.is_email_verified,
        "is_phone_verified": current_user.is_phone_verified,
    }


@router.get("/email-status")
def email_status():
    """Return safe SMTP configuration status for setup checks."""
    return get_email_status()


# ═══════════════════════════════════
#  PHONE OTP
# ═══════════════════════════════════

@router.post("/send-phone-otp")
def send_phone_otp_endpoint(data: SendPhoneOTPRequest):
    """Send OTP to phone number (logged to console — plug in SMS provider later)."""

    otp = send_phone_otp(data.phone_number)

    return {"message": "OTP sent to phone number", "status": "sent"}


@router.post("/verify-phone")
def verify_phone_endpoint(
    data: VerifyPhoneOTPRequest,
    db: Session = Depends(get_db),
):
    """Verify phone OTP and update user verification status."""

    if not verify_otp(data.phone_number, data.otp):
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    # Update user's phone verification status
    user = db.query(User).filter(
        User.phone_number == data.phone_number
    ).first()

    if user:
        user.is_phone_verified = True
        db.commit()

    return {"message": "Phone number verified successfully", "verified": True}


# ═══════════════════════════════════
#  EMAIL OTP
# ═══════════════════════════════════

@router.post("/send-email-otp")
def send_email_otp_endpoint(
    data: SendEmailOTPRequest,
    db: Session = Depends(get_db),
):
    """Send OTP to email address."""
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Registered email not found")

    send_email_otp(data.email)

    return {"message": "OTP sent to email", "status": "sent"}


@router.post("/verify-email")
def verify_email_endpoint(
    data: VerifyEmailOTPRequest,
    db: Session = Depends(get_db),
):
    """Verify email OTP and update user verification status."""

    if not verify_otp(data.email, data.otp):
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    # Update user's email verification status
    user = db.query(User).filter(User.email == data.email).first()

    if user:
        user.is_email_verified = True
        db.commit()

    return {"message": "Email verified successfully", "verified": True}
