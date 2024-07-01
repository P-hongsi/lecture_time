"""
메인 서버 모듈
"""
from fastapi import FastAPI
from core.cors import setup_cors  # CORS 설정 함수 import
from core.event import app_lifespan  # 애플리케이션 생명주기 이벤트 설정 함수 import
from core.error import setup_error_handling  # 에러 핸들링 설정 함수 import
from api.v1 import router as v1_router  # API v1 라우터 import
from var.session import engine, Base  # 데이터베이스 엔진 및 베이스 클래스 import

# FastAPI 애플리케이션 인스턴스 생성
app = FastAPI(
    title="Lecture_time",  # 애플리케이션 제목
    version="0.1",  # 애플리케이션 버전
    description="API 서버",  # 애플리케이션 설명
    lifespan=app_lifespan  # 생명주기 이벤트 설정
)

# CORS 설정
setup_cors(app)

# 에러 핸들링 설정
setup_error_handling(app)

# API v1 라우터 추가
app.include_router(v1_router, prefix="/api/v1")