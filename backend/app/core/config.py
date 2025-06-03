from typing import Optional
from pydantic_settings import BaseSettings
from pydantic import PostgresDsn, validator

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Content Generator"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: PostgresDsn
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # OpenAI
    OPENAI_API_KEY: str
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True
    
    # CORS
    FRONTEND_URL: str = "http://localhost:3000"
    
    class Config:
        extra = "ignore"
        case_sensitive = True
        env_file = ".env"

settings = Settings() 