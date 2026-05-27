import redis
from typing import Optional
from app.config import get_settings

settings = get_settings()

# Redis client used for OTP, rate limiting, and caching
redis_client = redis.from_url(
    settings.REDIS_URL,
    decode_responses=True,
)


def store_otp(user_id: int, encrypted_otp: str) -> None:
    """Store encrypted OTP with expiration."""
    redis_client.setex(
        name=f"otp:{user_id}",
        time=settings.OTP_EXPIRE_SECONDS,
        value=encrypted_otp,
    )


def get_otp(user_id: int) -> Optional[str]:
    """Retrieve stored OTP."""
    return redis_client.get(f"otp:{user_id}")


def delete_otp(user_id: int) -> None:
    """Delete OTP after verification."""
    redis_client.delete(f"otp:{user_id}")


def is_rate_limited(key: str, max_requests: int = 10, window_seconds: int = 60) -> bool:
    """Simple Redis-based rate limiter."""
    current = redis_client.get(key)

    if current is None:
        redis_client.setex(key, window_seconds, 1)
        return False

    if int(current) >= max_requests:
        return True

    redis_client.incr(key)
    return False


def cache_set(key: str, value: str, expire_seconds: int = 300) -> None:
    """Cache value with expiration."""
    redis_client.setex(key, expire_seconds, value)


def cache_get(key: str) -> Optional[str]:
    """Retrieve cached value."""
    return redis_client.get(key)
