"""User signup and login APIs backed by MongoDB with JWT session tokens."""

from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr, Field

from app.core.config import Settings

router = APIRouter(prefix="/api/auth", tags=["auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)


class RegisterIn(BaseModel):
    name: str = Field(min_length=1, max_length=80)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class LoginIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class AuthOut(BaseModel):
    user_id: str
    name: str
    email: str
    token: str


class PublicUser(BaseModel):
    user_id: str
    name: str
    email: str


def _hash(password: str) -> str:
    return pwd_context.hash(password)


def _verify(password: str, hashed: str) -> bool:
    return pwd_context.verify(password, hashed)


def _create_token(settings: Settings, user_id: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.jwt_expire_minutes)
    payload = {"sub": user_id, "exp": expire}
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def _settings(request: Request) -> Settings:
    return request.app.state.settings


def _users_collection(request: Request):
    return request.app.state.mongo_database["users"]


async def get_current_user(
    request: Request,
    token: Annotated[str | None, Depends(oauth2_scheme)],
) -> PublicUser | None:
    if not token:
        return None
    settings = _settings(request)
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
        user_id = payload.get("sub")
    except JWTError:
        return None
    if not user_id:
        return None
    doc = await _users_collection(request).find_one({"_id": user_id}, {"password_hash": 0})
    if not doc:
        return None
    return PublicUser(user_id=str(doc["_id"]), name=doc["name"], email=doc["email"])


def require_user(user: Annotated[PublicUser | None, Depends(get_current_user)]) -> PublicUser:
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


@router.post("/register", response_model=AuthOut, status_code=status.HTTP_201_CREATED)
async def register(body: RegisterIn, request: Request):
    users = _users_collection(request)
    existing = await users.find_one({"email": body.email.lower()})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )
    user_id = body.email.lower()
    doc = {
        "_id": user_id,
        "name": body.name,
        "email": body.email.lower(),
        "password_hash": _hash(body.password),
        "created_at": datetime.now(timezone.utc),
    }
    await users.insert_one(doc)
    settings = _settings(request)
    token = _create_token(settings, user_id)
    return AuthOut(user_id=user_id, name=body.name, email=body.email.lower(), token=token)


@router.post("/login", response_model=AuthOut)
async def login(body: LoginIn, request: Request):
    users = _users_collection(request)
    doc = await users.find_one({"email": body.email.lower()})
    if not doc or not _verify(body.password, doc.get("password_hash", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    settings = _settings(request)
    token = _create_token(settings, str(doc["_id"]))
    return AuthOut(
        user_id=str(doc["_id"]),
        name=doc["name"],
        email=doc["email"],
        token=token,
    )


@router.get("/me", response_model=PublicUser)
async def me(user: Annotated[PublicUser, Depends(require_user)]):
    return user
