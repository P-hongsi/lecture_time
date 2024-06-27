from sqlalchemy import update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from var.models import TimeTable

async def post_time_data(user_id: str, data: str, db: AsyncSession) -> None:
    stmt = (update(TimeTable).where(TimeTable.user_id == user_id).values(data=data))
    await db.execute(stmt)
    await db.commit()

async def get_time_data(user_id: str, db: AsyncSession):
    stmt = select(TimeTable.data).where(TimeTable.user_id == user_id)
    result = await db.execute(stmt)
    data = result.scalar_one_or_none()
    return data