from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from models import User
from schemas.auth import (
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    UserResponse,
)


async def register_user(
    session: AsyncSession,
    data: RegisterRequest,
) -> UserResponse:
    existing = await session.exec(
        select(User).where(User.email == str(data.email))
    )

    if existing.first() is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cette adresse email est déjà utilisée",
        )

    user = User(
        email=str(data.email),
        password_hash=hash_password(data.password),
    )
    session.add(user)

    try:
        await session.commit()
        await session.refresh(user)
    except IntegrityError:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cette adresse email est déjà utilisée",
        )

    return UserResponse(id=user.id, email=user.email)


async def login_user(
    session: AsyncSession,
    data: LoginRequest,
) -> TokenResponse:
    result = await session.exec(
        select(User).where(User.email == str(data.email))
    )
    user = result.first()

    if user is None or not verify_password(
        data.password,
        user.password_hash,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token(user.id)

    return TokenResponse(access_token=token)


async def get_current_user_info(user: User) -> UserResponse:
    return UserResponse(id=user.id, email=user.email)