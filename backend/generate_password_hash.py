"""
Helper script to generate password hash for admin authentication.

Usage:
    python generate_password_hash.py <your-password>
    
The output should be set as ADMIN_PASSWORD_HASH environment variable in Railway.
"""
import sys
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python generate_password_hash.py <password>")
        sys.exit(1)
    
    password = sys.argv[1]
    hashed = pwd_context.hash(password)
    
    print("\nGenerated password hash:")
    print(hashed)
    print("\nAdd this to your Railway environment variables:")
    print(f"ADMIN_PASSWORD_HASH={hashed}")
    print("\nOr add to backend/.env for local development:")
    print(f"ADMIN_PASSWORD_HASH=\"{hashed}\"")
