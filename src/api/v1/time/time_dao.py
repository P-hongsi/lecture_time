from sqlalchemy import update  # 업데이트 쿼리 생성 모듈 import
from sqlalchemy.ext.asyncio import AsyncSession  # 비동기 세션 모듈 import
from sqlalchemy.future import select  # 선택 쿼리 생성 모듈 import
from var.models import TimeTable  # 타임 테이블 모델 import

# 시간표 데이터 저장 함수
async def post_time_data(user_id: str, data: str, db: AsyncSession) -> None:
    # 업데이트 쿼리 생성
    stmt = (
        update(TimeTable)  # 타임 테이블 업데이트
        .where(TimeTable.user_id == user_id)  # 주어진 user_id와 일치하는 행 선택
        .values(data=data)  # 데이터 업데이트
    )
    await db.execute(stmt)  # 쿼리 실행
    await db.commit()  # 커밋하여 변경 사항 저장

# 시간표 데이터 가져오기 함수
async def get_time_data(user_id: str, db: AsyncSession):
    # 선택 쿼리 생성
    stmt = select(TimeTable.data).where(TimeTable.user_id == user_id)  # 주어진 user_id와 일치하는 데이터 선택
    result = await db.execute(stmt)  # 쿼리 실행
    data = result.scalar_one_or_none()  # 단일 결과 반환 또는 None 반환
    return data  # 데이터 반환
