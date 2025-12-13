""" 
Simple script to test database connection
Run this to verify your PostgreSQL connection works
"""
from sqlalchemy import text
from app.core.database import engine

try:
    with engine.connect() as connection:
        result = connection.execute(text("SELECT version()"))
        version = result.fetchone()
        print("Database connection successful")
        print(f"PostgreSQL version: {version[0]}")

except Exception as e:
    print(f"Database connection failed: {e}")