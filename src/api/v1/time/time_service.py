# 호출할 모듈 추가
from api.v1.time import time_dao

# (db 세션 관련)이후 삭제 예정
from sqlalchemy.ext.asyncio import AsyncSession

async def post_time_data(user_id: str, data: str, db: AsyncSession) -> None:
    await time_dao.post_time_data(user_id, data, db)

async def get_time_data(user_id: str, db: AsyncSession) -> None:
    result = await time_dao.get_time_data(user_id, db)
    return result