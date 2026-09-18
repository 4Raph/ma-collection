from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import create_async_engine
from sqlmodel.ext.asyncio.session import AsyncSession


DATABASE_URL = "sqlite+aiosqlite:///./collection.db"

engine = create_async_engine(
    DATABASE_URL,
    echo=True,
)


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSession(engine) as session:
        yield session