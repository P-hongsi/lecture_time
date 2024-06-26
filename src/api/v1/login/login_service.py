# 호출할 모듈 추가
from api.v1.login import login_dao
from api.v1.login.login_dto import CreateUserInfo

# (db 세션 관련)이후 삭제 예정
from sqlalchemy.ext.asyncio import AsyncSession

# 사용자를 인증하는 서비스 함수
async def verify(user_id: str, user_password: str, db: AsyncSession) -> bool:
    # 데이터 접근 객체(DAO)를 사용하여 사용자 인증 확인
    verify = await login_dao.verify(user_id, user_password, db)
    return verify

# 사용자가 존재하는지 확인하는 서비스 함수
async def is_user(user_id: str, db: AsyncSession) -> bool:
    # 데이터 접근 객체(DAO)를 사용하여 사용자 존재 여부 확인
    is_user = await login_dao.is_user(user_id, db)
    return is_user

# 사용자를 생성하는 서비스 함수
async def post_signup(login_info: CreateUserInfo, db: AsyncSession) -> None:
    # 데이터 접근 객체(DAO)를 사용하여 사용자 생성
    await login_dao.post_signup(login_info, db)