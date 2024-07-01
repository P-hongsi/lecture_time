from sqlalchemy import Result, ScalarResult, select, update, insert, delete  # SQLAlchemy 쿼리 관련 모듈 import
from sqlalchemy.orm import joinedload, query  # SQLAlchemy ORM 관련 모듈 import
from var.models import TimeTable  # 타임 테이블 모델 import
from api.v1.login.login_dto import CreateUserInfo  # 로그인 DTO 모듈에서 CreateUserInfo import
from var.session import get_db  # 데이터베이스 세션 가져오기 함수 import
from fastapi import Depends  # FastAPI 종속성 관련 모듈 import
from sqlalchemy.orm import Session  # SQLAlchemy 세션 import
from sqlalchemy.ext.asyncio import AsyncSession  # 비동기 SQLAlchemy 세션 import

from passlib.context import CryptContext  # 비밀번호 암호화 관련 모듈 import

# PassLib를 사용하여 bcrypt로 비밀번호 해시화 설정
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 주어진 사용자 email과 비밀번호를 확인하는 함수
async def verify(user_id: str, user_password: str, db: AsyncSession) -> bool:
    try:
        # 데이터베이스에서 사용자 정보를 조회
        result = await db.execute(select(TimeTable).where(TimeTable.user_id == user_id))
        user = result.scalar_one()
        # 비밀번호가 일치하는지 확인
        return pwd_context.verify(user_password, user.user_password)    # True이면 로그인 성공, False이면 로그인 실패
    except:
        return False     # 아이디가 존재하지 않을 경우

# 사용자를 생성하여 데이터베이스에 저장하는 함수
async def post_signup(login_info: CreateUserInfo, db: AsyncSession) -> None:
    # 비밀번호를 해시화
    hashed_password = pwd_context.hash(login_info.user_password)
    # 사용자 데이터를 딕셔너리로 변환
    user_data = login_info.model_dump()
    # 해시화된 비밀번호로 업데이트
    user_data['user_password'] = hashed_password
    # 삽입 명령문 생성
    stmt = insert(TimeTable).values(**user_data)
    # 데이터베이스에 명령문 실행
    await db.execute(stmt)
    # 트랜잭션 커밋
    await db.commit()

# 사용자가 존재하는지 확인하는 함수
async def is_user(user_id: str, db: AsyncSession) -> bool:
    # 사용자 정보를 조회하는 선택 명령문 생성
    stmt = select(TimeTable).where(TimeTable.user_id == user_id)
    # 데이터베이스에서 명령문 실행
    result = await db.execute(stmt)
    # 사용자가 존재하는지 확인
    user_exists = result.scalars().first() is not None
    return user_exists