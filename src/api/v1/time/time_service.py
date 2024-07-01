from api.v1.time import time_dao  # time_dao 모듈 import
from sqlalchemy.ext.asyncio import AsyncSession  # 비동기 세션 모듈 import

# 시간표 데이터 저장 함수
async def post_time_data(user_id: str, data: str, db: AsyncSession) -> None:
    await time_dao.post_time_data(user_id, data, db)  # DAO의 데이터 저장 함수 호출

# 시간표 데이터 가져오기 함수
async def get_time_data(user_id: str, db: AsyncSession) -> None:
    result = await time_dao.get_time_data(user_id, db)  # DAO의 데이터 가져오기 함수 호출
    return result  # 결과 반환