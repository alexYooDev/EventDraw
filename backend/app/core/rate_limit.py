"""
Rate limiting configuration using SlowAPI.

Prevents abuse by limiting the number of requests per time period.
"""
from slowapi import Limiter
from slowapi.util import get_remote_address


# Initialize rate limiter with remote address as the key
limiter = Limiter(key_func=get_remote_address)
