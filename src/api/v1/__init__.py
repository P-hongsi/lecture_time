from fastapi import APIRouter
from .login.login_control import router as login_router
from .time.time_control import router as time_router

router = APIRouter()
router.include_router(login_router)
router.include_router(time_router)