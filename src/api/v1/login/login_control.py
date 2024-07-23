from typing import Annotated, Optional  # 타입 힌트를 위한 모듈 import
from fastapi import APIRouter, Depends, Response, Request, HTTPException  # FastAPI 관련 모듈 import
from core.type import ResultType  # 커스텀 타입 import
from core.status import Status, SU, ER  # 상태 및 응답 관련 모듈 import
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer  # OAuth2 관련 모듈 import
import logging  # 로깅 모듈 import

from sqlalchemy.ext.asyncio import AsyncSession  # 비동기 세션 모듈 import
from var.session import get_db  # 데이터베이스 세션 가져오기 함수 import

from api.v1.login import login_service  # 로그인 서비스 모듈 import
from api.v1.login.login_dto import CreateUserInfo, LoginForm  # 로그인 DTO import
from datetime import timedelta  # 시간 관련 모듈 import

# 로거 설정
logger = logging.getLogger(__name__)

# API 라우터 생성 및 설정
router = APIRouter(prefix="/login", tags=["login"])

# 로그인 엔드포인트
@router.post(
    "/",
    summary="로그인",  # API 요약
    description="- 아이디, 비번",  # API 설명
    responses=Status.docs(SU.SUCCESS, ER.UNAUTHORIZED)  # 응답 문서화
)
async def post_login(response: Response, login_form: LoginForm, db: AsyncSession = Depends(get_db)):
    logger.info("----------로그인----------")  # 로그 출력
    verify = await login_service.verify(login_form.username, login_form.password, db)  # 로그인 서비스 호출하여 인증 확인
    if not verify:
        logger.warning("로그인 실패: 잘못된 사용자명 또는 비밀번호")  # 로그 출력
        raise HTTPException(status_code=401, detail="잘못된 사용자명 또는 비밀번호")

    logger.info("로그인 성공")  # 로그 출력
    return {"detail": "Success"}  # 성공 응답 반환

# 회원가입 엔드포인트
@router.post(
    "/signup",
    summary="회원가입",  # API 요약
    description="- 아이디(8자 이상), 비번(8자 이상, 숫자 포함)",  # API 설명
    responses=Status.docs(SU.CREATED, ER.DUPLICATE_RECORD),  # 응답 문서화
)
async def post_signup(login_info: Optional[CreateUserInfo], db: AsyncSession = Depends(get_db)):
    logger.info("----------회원가입----------")  # 로그 출력
    
     # 요청 본문에서 유저 정보가 제공되지 않은 경우 예외 처리
    if login_info is None:
        logger.warning("회원가입 요청에 유저 정보가 없음.")  # 로그 출력
        raise HTTPException(status_code=400, detail="User information is required.")

    # 유저 존재 여부 확인
    if await login_service.is_user(login_info.user_id, db):
        logger.warning("이미 존재하는 유저.")  # 로그 출력
        raise HTTPException(status_code=409, detail="User already exists.")  # 중복 레코드 응답 반환

    # 회원가입 서비스 호출
    await login_service.post_signup(login_info, db)
    logger.info("회원가입 성공.")  # 로그 출력
    return {"detail": "User created successfully."}  # 성공 응답 반환
    return SU.CREATED  # 성공 응답 반환
