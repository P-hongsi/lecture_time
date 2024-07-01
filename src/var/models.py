"""
데이터베이스 테이블에 매핑될 모델 정의(ORM Model)
"""
from sqlalchemy import Column, String, DateTime, func
from var.session import Base

class TimeTable(Base):
    __tablename__ = "TimeTable"

    user_id = Column(String, primary_key=True)
    user_password = Column(String(128), nullable=False)  # null 값 허용안함
    data = Column(String, nullable=True)
    create_date = Column(DateTime(timezone=True), nullable=False)