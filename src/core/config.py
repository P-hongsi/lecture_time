import os  # OS 모듈 import
import logging  # 로깅 모듈 import
import logging.config  # 로깅 설정 모듈 import
from dotenv import load_dotenv  # dotenv 모듈에서 load_dotenv 함수 import

# .env 파일 로드하여 환경 변수 설정
load_dotenv()

# 설정 클래스 정의
class Settings:
    DB_PROTOCAL: str = os.getenv("DB_PROTOCAL")  # 데이터베이스 프로토콜
    DB_USERNAME: str = os.getenv("DB_USERNAME")  # 데이터베이스 사용자 이름
    DB_PASSWORD: str = os.getenv("DB_PASSWORD")  # 데이터베이스 비밀번호
    DB_HOST: str = os.getenv("DB_HOST")  # 데이터베이스 호스트
    DB_PORT: str = os.getenv("DB_PORT")  # 데이터베이스 포트
    DB_NAME: str = os.getenv("DB_NAME")  # 데이터베이스 이름

    # 데이터베이스 URL 구성
    DATABASE_URL = f"{DB_PROTOCAL}://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# 설정 인스턴스 생성
settings = Settings()

# 로깅 설정
LOGGING_CONFIG = {
    "version": 1,  # 로깅 설정 버전
    "disable_existing_loggers": False,  # 기존 로거 비활성화 안 함
    "formatters": {
        "default": {
            "format": "[%(asctime)s] %(levelname)s in %(module)s: %(message)s",  # 기본 포맷 설정
        },
        "detailed": {
            "format": "[%(asctime)s] %(levelname)s [%(name)s:%(lineno)s] %(message)s",  # 상세 포맷 설정
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",  # 콘솔 핸들러 설정
            "formatter": "default",  # 기본 포맷 사용
        },
        "file": {
            "class": "logging.FileHandler",  # 파일 핸들러 설정
            "filename": "app.log",  # 로그 파일 이름 설정
            "formatter": "detailed",  # 상세 포맷 사용
        },
    },
    "root": {
        "level": "DEBUG",  # 루트 로거 레벨 설정
        "handlers": ["console", "file"],  # 루트 로거에 콘솔 및 파일 핸들러 추가
    },
    "loggers": {
        "uvicorn": {
            "level": "DEBUG",  # uvicorn 로거 레벨 설정
            "handlers": ["console"],  # uvicorn 로거에 콘솔 핸들러 추가
            "propagate": False,  # 상위 로거로 로그 전파 안 함
        },
    },
}

# 로깅 설정 함수 정의
def setup_logging():
    logging.config.dictConfig(LOGGING_CONFIG)  # 로깅 설정 적용
