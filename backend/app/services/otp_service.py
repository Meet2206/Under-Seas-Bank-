"""
OTP Service — Generate, store (in-memory with TTL), and verify OTPs.
Uses in-memory storage by default. Redis is optional (falls back gracefully).
"""

import secrets
import time
import logging
import threading
from typing import Optional

logger = logging.getLogger(__name__)

# ── In-memory OTP store ──
# Format: { "identifier": {"otp": "123456", "expires_at": timestamp} }
_otp_store: dict = {}
_store_lock = threading.Lock()


def _cleanup_expired():
    """Remove expired OTPs from memory."""
    now = time.time()
    with _store_lock:
        expired = [k for k, v in _otp_store.items() if v["expires_at"] < now]
        for k in expired:
            del _otp_store[k]


def generate_otp(length: int = 6) -> str:
    """Generate a random numeric OTP."""
    return "".join(str(secrets.randbelow(10)) for _ in range(length))


def store_otp(identifier: str, otp: str, expire_seconds: int = 300):
    """
    Store OTP for an identifier (email or phone number).
    Tries Redis first, falls back to in-memory dict.
    """

    # Try Redis
    try:
        from app.redis_client import redis_client
        redis_client.setex(f"otp:{identifier}", expire_seconds, otp)
        logger.info(f"OTP stored in Redis for {identifier}")
        return
    except Exception as e:
        logger.warning(f"Redis unavailable, using in-memory store: {e}")

    # Fallback: in-memory
    with _store_lock:
        _otp_store[identifier] = {
            "otp": otp,
            "expires_at": time.time() + expire_seconds,
        }


def get_stored_otp(identifier: str) -> Optional[str]:
    """Retrieve stored OTP for an identifier."""

    # Try Redis
    try:
        from app.redis_client import redis_client
        stored = redis_client.get(f"otp:{identifier}")
        if stored:
            return stored
    except Exception:
        pass

    # Fallback: in-memory
    _cleanup_expired()
    with _store_lock:
        entry = _otp_store.get(identifier)
        if entry and entry["expires_at"] > time.time():
            return entry["otp"]
    return None


def verify_otp(identifier: str, otp: str) -> bool:
    """
    Verify OTP and delete it after successful verification.
    Returns True if valid, False otherwise.
    """

    stored = get_stored_otp(identifier)

    if not stored or stored != otp:
        return False

    # Delete after successful verification
    try:
        from app.redis_client import redis_client
        redis_client.delete(f"otp:{identifier}")
    except Exception:
        pass

    with _store_lock:
        _otp_store.pop(identifier, None)

    return True


def send_phone_otp(phone_number: str) -> str:
    """
    Generate OTP for phone number and 'send' it.
    Currently logs to console — plug in Twilio/MSG91/Fast2SMS later.
    """

    otp = generate_otp()
    store_otp(phone_number, otp)

    # ─── PLACEHOLDER: Replace with real SMS API ───
    print(f"📱 [SMS OTP] To: {phone_number} | OTP: {otp}")
    print(f"   (Plug in Twilio/MSG91 in send_phone_otp() for real SMS)")
    # ──────────────────────────────────────────────

    return otp


def send_email_otp(email: str) -> str:
    """Generate OTP and send it via email."""

    otp = generate_otp()
    store_otp(email, otp)

    from app.config import get_settings
    from app.services.email_service import email_is_configured, send_otp_email

    settings = get_settings()
    if settings.DEBUG or not email_is_configured():
        print(f" Here is your OTP: 📧 [EMAIL OTP] To: {email} | OTP: {otp}")
    send_otp_email(email, otp)

    return otp
