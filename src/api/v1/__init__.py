from fastapi import APIRouter
from .login.login_control import router as login_router

router = APIRouter()
router.include_router(login_router)