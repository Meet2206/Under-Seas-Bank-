from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func

from app.database import Base


class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone_number = Column(String, unique=True, index=True, nullable=False)

    mpin_hash = Column(String, nullable=False)

    failed_attempts = Column(Integer, default=0)
    is_locked = Column(Boolean, default=False)

    is_email_verified = Column(Boolean, default=False)
    is_phone_verified = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())