"""
데이터베이스 테이블에 매핑될 모델 정의(ORM Model)
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, Float, JSON, ForeignKey
from var.session import Base

class TimeTable(Base):
    __tablename__ = "TimeTable"

    user_id = Column(String, primary_key=True)
    user_password = Column(String(128), nullable=False)  # null 값 허용안함
    lecture = Column(String, nullable=True)
    day = Column(String(30), nullable=True)
    start_time = Column(String(30), nullable=True)
    finish_time = Column(String(30), nullable=True)
    memo = finish_time = Column(String, nullable=True)
    create_date = Column(DateTime(timezone=True))