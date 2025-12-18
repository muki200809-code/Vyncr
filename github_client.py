import httpx
from app.core.resilience import healing_request
from datetime import datetime

class GitHubClient:
    @staticmethod
    @healing_request # Applies self-healing logic automatically
    async def fetch_commits(repo_url: str):
        # Extract owner/repo from URL
        # Mocking the actual call for this snippet to ensure it runs without an API key immediately
        # In production, use: https://api.github.com/repos/{owner}/{repo}/commits
        
        # SIMULATED RESPONSE (To make this code runnable instantly)
        return [
            {"timestamp": datetime(2023, 10, 1, 10, 0), "message": "Initial commit"},
            {"timestamp": datetime(2023, 10, 1, 14, 30), "message": "Fix login bug"},
            {"timestamp": datetime(2023, 10, 2, 9, 15), "message": "Add dashboard"},
            {"timestamp": datetime(2023, 10, 5, 16, 0), "message": "Refactor API"},
            {"timestamp": datetime(2023, 10, 12, 11, 20), "message": "Update README"},
        ]
