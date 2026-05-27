import hashlib
import hmac

from app.config import get_settings


def build_lookup_hash(value: str) -> str:
    """Create a stable keyed hash for exact-match lookups on encrypted fields."""
    key = get_settings().FIELD_ENCRYPTION_KEY.encode()
    return hmac.new(key, value.encode(), hashlib.sha256).hexdigest()
