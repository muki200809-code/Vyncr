from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://user:pass@localhost/db"
    SECRET_KEY: str = "dev_secret"
    ALGORITHM: str = "HS256"
    
    class Config:
        env_file = ".env"

settings = Settings()
