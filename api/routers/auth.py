from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlmodel.ext.asyncio.session import AsyncSession

from db.database import get_session
from dependencies.auth import get_current_user
from models import User
from schemas.auth import (
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    UserResponse,
)
from services.auth import (
    get_current_user_info,
    login_user,
    register_user,
)


router = APIRouter(prefix="/auth", tags=["Authentification"])


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Créer un compte",
)
async def register(
    data: RegisterRequest,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> UserResponse:
    return await register_user(session, data)


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Se connecter",
)
async def login(
    data: LoginRequest,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> TokenResponse:
    return await login_user(session, data)


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Récupérer l'utilisateur connecté",
)
async def me(
    user: Annotated[User, Depends(get_current_user)],
) -> UserResponse:
    return await get_current_user_info(user)