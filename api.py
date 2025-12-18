from fastapi import APIRouter, Depends, HTTPException
from app.schemas.models import RepoRequest, TrustScoreResponse
from app.services.github_client import GitHubClient
from app.services.trust_engine import TrustEngine
from app.core.security import oauth2_scheme

router = APIRouter()

@router.post("/scan/project", response_model=TrustScoreResponse)
async def scan_project(request: RepoRequest):
    """
    Core Endpoint: Receives a GitHub URL, fetches data, runs heuristics, returns score.
    """
    try:
        # 1. Fetch Data (Self-Healing Client)
        commits = await GitHubClient.fetch_commits(str(request.repo_url))
        
        # 2. Analyze Data (Trust Engine)
        result = TrustEngine.calculate_score(commits)
        
        return {
            "score": result["score"],
            "confidence_level": result["confidence"],
            "breakdown": result["breakdown"],
            "generated_at": datetime.now()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis Failed: {str(e)}")

@router.get("/mobile/manifest.json")
async def get_manifest():
    """
    PWA Support: Allows the site to be installed as an app.
    """
    return {
        "name": "Proven - Trust Marketplace",
        "short_name": "Proven",
        "start_url": "/",
        "display": "standalone",
        "background_color": "#ffffff",
        "theme_color": "#000000",
        "icons": [
            {"src": "/icon-192.png", "sizes": "192x192", "type": "image/png"},
            {"src": "/icon-512.png", "sizes": "512x512", "type": "image/png"}
        ]
    }
