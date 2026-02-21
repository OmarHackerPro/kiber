import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "avild.news")
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    HOST: str = os.getenv("HOST", "127.0.0.1")
    PORT: int = int(os.getenv("PORT", "8000"))

    # PostgreSQL — local or cloud (Supabase, Neon, RDS, etc.)
    # Format: postgresql+asyncpg://user:password@host:port/dbname
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")


settings = Settings()
