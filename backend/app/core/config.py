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
    # For production, you can pass comma-separated URLs as env var
    # Example: CORS_ORIGINS="https://your-app.vercel.app,https://custom-domain.com"
    CORS_ORIGINS: list[str] = [
        "https://event-draw-ashy.vercel.app/", # custom-domain.com
        "http://localhost:5173",  # Default Vite port
        "http://localhost:3000"   # Alternative port for Vite
    ]
    
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,
        extra="ignore"
    )

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Parse CORS_ORIGINS if it's a comma-separated string from env var
        if isinstance(self.CORS_ORIGINS, str):
            self.CORS_ORIGINS = [origin.strip() for origin in self.CORS_ORIGINS.split(',')]

# Singleton: Create a single instance to be imported throughout the app
settings = Settings()