from sqlalchemy import Column, Integer, Numeric, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database import Base
from app.utils.encryption import EncryptedString


class CreditCard(Base):

    __tablename__ = "credit_cards"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))
    account_id = Column(Integer, ForeignKey("accounts.id"))

    card_number = Column(EncryptedString(512), nullable=False)
    card_number_hash = Column(String(64), unique=True, index=True, nullable=False)

    credit_limit = Column(Numeric(14, 2), default=50000)

    used_credit = Column(Numeric(14, 2), default=0)

    available_credit = Column(Numeric(14, 2), default=50000)

    status = Column(String, default="active")

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")
