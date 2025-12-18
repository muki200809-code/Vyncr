import logging
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
import httpx

logger = logging.getLogger("proven.resilience")

class ServiceUnavailable(Exception):
    pass

# Self-Healing Decorator: Retries 3 times with growing wait periods
def healing_request(func):
    @retry(
        stop=stop_after_attempt(3), 
        wait=wait_exponential(multiplier=1, min=2, max=10),
        retry=retry_if_exception_type((httpx.ConnectTimeout, httpx.ConnectError))
    )
    async def wrapper(*args, **kwargs):
        try:
            return await func(*args, **kwargs)
        except Exception as e:
            logger.error(f"Self-Healing Mechanism Triggered: {str(e)}")
            raise e
    return wrapper
