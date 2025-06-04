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
    LLM_API_URL: str
    LLM_API_KEY: str
    LLM_MODEL: str
    
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


import logging

log_level = logging.DEBUG if settings.DEBUG else logging.INFO


logging_config = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "()": "uvicorn.logging.DefaultFormatter",
            "fmt": "%(levelprefix)s %(asctime)s %(message)s",
            "datefmt": "%Y-%m-%d %H:%M:%S",
        },
    },
    "handlers": {
        "console": {
            "formatter": "default",
            "class": "logging.StreamHandler",
            "stream": "ext://sys.stderr",
        },
        "file": {
            "formatter": "default",
            "class": "logging.handlers.RotatingFileHandler",
            "filename": "app.log",
            "maxBytes": 10485760,
            "backupCount": 5,
        },
    },
    "loggers": {
        "fastapi": {"handlers": ["console", "file"], "level": log_level},
        "uvicorn": {"handlers": ["console", "file"], "level": log_level},
        "uvicorn.access": {
            "handlers": ["console", "file"],
            "level": log_level,
            "propagate": False,
        },
    },
    "root": {"handlers": ["console", "file"], "level": log_level},
}
