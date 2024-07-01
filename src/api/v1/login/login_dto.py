from datetime import datetime, timezone
from typing import Optional, Annotated
from fastapi import Depends, Form, Path, HTTPException
from pydantic import Field, validator
from var.dto import BaseDTO

# 사용자 생성 정보 데이터 전송 객체 (DTO)
class CreateUserInfo(BaseDTO):
    user_id: Annotated[str, Field(description="유저 아이디")]
    user_password: Annotated[str, Field(description="유저 비밀번호")]
    
    # 가입 일자를 자동으로 현재 시간으로 설정
    create_date: Annotated[datetime, Depends(lambda: datetime.now(timezone.utc))] = Field(
        default_factory=lambda: datetime.now(timezone.utc), 
        description="가입 일자"
    )
    
    # 필수 필드가 빈 문자열이나 공백이 아닌지 확인하는 유효성 검사기
    @validator('user_id', 'user_password')
    def check_empty(cls, v):
        if not v or v.isspace():
            raise HTTPException(status_code=422, detail="필수 항목을 입력해주세요.")
        return v
    
    # 비밀번호 유효성을 검사하는 함수
    @validator('user_password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise HTTPException(status_code=422, detail="비밀번호는 8자리 이상 영문과 숫자를 포함하여 작성해 주세요.")
        if not any(char.isdigit() for char in v):
            raise HTTPException(status_code=422, detail="비밀번호는 8자리 이상 영문과 숫자를 포함하여 작성해 주세요.")
        if not any(char.isalpha() for char in v):
            raise HTTPException(status_code=422, detail="비밀번호는 8자리 이상 영문과 숫자를 포함하여 작성해 주세요.")
        return v
    @validator('user_id')
    def validate_id(cls, v):
        if len(v) < 8:
            raise HTTPException(status_code=422, detail="아이디는 8자리 이상으로 작성해 주세요.")
        return v

class LoginForm(BaseDTO):
    username: Annotated[str, Field(description="유저 아이디")]
    password: Annotated[str, Field(description="유저 비밀번호")]
