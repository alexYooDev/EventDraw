from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    Uses Pydantic Settings to validate and load configuration from .env file.
    """

    # Database
    DATABASE_URL: str

    # Application
    ENVIRONMENT: str = "development"
    PROJECT_NAME: str = "Luck of a Draw Roulette"
    API_V1_PREFIX: str = "/api/v1"

    # CORS - Frontend URLs allowed to access the API
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173", # Default Vite port
        "http://localhost:3000" # Alternative port for Vite
        ]
    
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,
        extra="ignore"
    )

# Singleton: Create a single instance to be imported throughout the app
settings = Settings()