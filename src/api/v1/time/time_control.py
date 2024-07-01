from typing import Annotated, Optional  # 타입 힌트를 위한 모듈 import
from fastapi import APIRouter, Depends, Response, Request  # FastAPI 관련 모듈 import
from core.type import ResultType  # 커스텀 타입 import
from core.status import Status, SU, ER  # 상태 및 응답 관련 모듈 import
import logging  # 로깅 모듈 import
from sqlalchemy.ext.asyncio import AsyncSession  # 비동기 세션 모듈 import
from var.session import get_db  # 데이터베이스 세션 가져오기 함수 import
from api.v1.time import time_service  # 시간 관련 서비스 모듈 import

# 로거 설정
logger = logging.getLogger(__name__)

# API 라우터 생성 및 설정
router = APIRouter(prefix="/time", tags=["time"])

# 시간표 데이터 저장 엔드포인트
@router.post(
    "/",
    summary="시간표 데이터 저장",  # API 요약
    description="- 강의명, 요일, 시작시간, 마치는 시간, 메모",  # API 설명
    responses=Status.docs(SU.SUCCESS, ER.INVALID_REQUEST)  # 응답 문서화
)
async def post_time(user_id: str, data: str, db: AsyncSession = Depends(get_db)):
    logger.info("----------시간표 데이터 저장----------")  # 로그 출력
    await time_service.post_time_data(user_id, data, db)  # 시간표 데이터 저장 서비스 호출
    logger.info("데이터 저장 성공")  # 로그 출력
    return SU.CREATED  # 성공 응답 반환

# 시간표 데이터 가져오기 엔드포인트
@router.get(
    "/",
    summary="시간표 데이터 가져오기",  # API 요약
    description="- 유저 id",  # API 설명
    responses=Status.docs(SU.SUCCESS, ER.INVALID_REQUEST)  # 응답 문서화
)
async def get_time(user_id: str, db: AsyncSession = Depends(get_db)):
    logger.info("----------시간표 데이터 가져오기----------")  # 로그 출력
    result = await time_service.get_time_data(user_id, db)  # 시간표 데이터 가져오기 서비스 호출
    logger.info("데이터 가져오기 성공")  # 로그 출력
    return result  # 결과 반환
