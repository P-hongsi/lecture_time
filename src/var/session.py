"""
RDB 세션 모듈 : 데이터베이스 연결 및 세션 설정
"""
from sqlalchemy.ext.asyncio import create_async_engine, AsyncEngine, AsyncSession  # 비동기 데이터베이스 엔진 및 세션 import
from sqlalchemy import create_engine  # 동기 데이터베이스 엔진 import
from sqlalchemy.ext.declarative import declarative_base  # 베이스 클래스 선언을 위한 함수 import
from sqlalchemy.orm import sessionmaker  # 세션 메이커 함수 import
from core.config import settings  # 설정 값 import

# 설정 파일에서 데이터베이스 URL 가져오기
DATABASE_URL = settings.DATABASE_URL

# 비동기 엔진 생성
engine = create_async_engine(
    DATABASE_URL,  # 데이터베이스 URL
    echo=True,  # SQLAlchemy가 생성하는 모든 SQL을 출력
    future=True,  # SQLAlchemy 2.0 스타일 사용
)

# 비동기 세션 메이커 생성
SessionLocal = sessionmaker(
    autocommit=False,  # 자동 커밋 비활성화
    autoflush=False,  # 자동 플러시 비활성화
    bind=engine,  # 엔진 바인딩
    class_=AsyncSession,  # 비동기 세션 클래스 사용
    expire_on_commit=False  # 커밋 시 객체 만료 비활성화
)

# 베이스 클래스 생성 (모든 모델이 이 클래스를 상속)
Base = declarative_base()

# 데이터베이스 세션 생성 및 반환하는 종속성 함수
async def get_db():
    async with SessionLocal() as session:  # 비동기 세션 열기
        yield session  # 세션 반환