# 기본적으로 추가
from typing import Annotated, Optional
from fastapi import APIRouter, Depends, Response, Request
from core.type import ResultType
from core.status import Status, SU, ER
import logging

# (db 세션 관련)이후 삭제 예정
from sqlalchemy.ext.asyncio import AsyncSession
from var.session import get_db

# 호출할 모듈 추가
from api.v1.time import time_service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/time", tags=["time"])

@router.post(
    "/",
    summary="시간표 데이터 저장",
    description="- 강의명, 요일, 시작시간, 마치는 시간, 메모",
    responses=Status.docs(SU.SUCCESS, ER.INVALID_REQUEST)
)
async def post_time(user_id: str, data: str, db: AsyncSession = Depends(get_db)):
    logger.info("----------시간표 데이터 저장----------")
    await time_service.post_time_data(user_id, data, db)
    logger.info("데이터 저장 성공")
    return SU.CREATED

@router.get(
    "/",
    summary="시간표 데이터 가져오기",
    description="- 유저 id",
    responses=Status.docs(SU.SUCCESS, ER.INVALID_REQUEST)
)
async def post_time(user_id: str, db: AsyncSession = Depends(get_db)):
    logger.info("----------시간표 데이터 가져오기----------")
    result = await time_service.get_time_data(user_id, db)
    logger.info("데이터 가져오기 성공")
    return result