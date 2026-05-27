from sqlalchemy import Column, Integer, Numeric, String, ForeignKey, DateTime
from sqlalchemy.sql import func

from app.database import Base


class Transaction(Base):

    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)

    from_account_id = Column(Integer, ForeignKey("accounts.id"), nullable=True)

    to_account_id = Column(Integer, ForeignKey("accounts.id"), nullable=True)

    amount = Column(Numeric(14, 2))

    transaction_type = Column(String)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
