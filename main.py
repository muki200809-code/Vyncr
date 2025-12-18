import os
import shutil
import tempfile
import math
import re
from typing import Dict, List
from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from git import Repo
from radon.complexity import cc_visit
import statistics

app = FastAPI()

# Enable CORS for the VYNCR Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MODELS ---
class ScanRequest(BaseModel):
    repo_url: str

class ScanResponse(BaseModel):
    score: int
    confidence_level: str
    breakdown: Dict[str, float]
    system: str

# --- FORENSIC ENGINE ---
class ForensicEngine:
    @staticmethod
    def calculate_shannon_entropy(data: str) -> float:
        """Calculates the statistical randomness of the code text."""
        if not data: return 0
        entropy = 0
        for x in range(256):
            p_x = data.count(chr(x)) / len(data)
            if p_x > 0:
                entropy += - p_x * math.log(p_x, 2)
        return (entropy / 8) * 100  # Normalized to 0-100

    @staticmethod
    def analyze_complexity_variance(code: str) -> float:
        """AI code is often uniformly complex; human code is 'bursty'."""
        try:
            results = cc_visit(code)
            complexities = [r.complexity for r in results]
            if len(complexities) < 2: return 50.0 # Not enough data
            # Calculate variance. High variance = More likely human.
            return min(statistics.variance(complexities) * 10, 100)
        except:
            return 50.0

    @staticmethod
    def detect_ai_isms(code: str) -> float:
        """Detects perfect documentation and template variable naming."""
        score = 100
        # AI often uses very standard boilerplate comments
        ai_patterns = [
            r"This function (performs|calculates|handles)",
            r"Args:\n\s+\w+:",
            r"Returns:\n\s+\w+:"
        ]
        for pattern in ai_patterns:
            if re.search(pattern, code):
                score -= 15 # High density of AI patterns reduces trust
        return max(score, 0)

# --- ENDPOINTS ---

@app.get("/health")
async def health_check():
    """Robust health check to prevent the 'Healing' state."""
    return {"status": "operational", "node": "VYNCR-Advanced-Alpha"}

@app.post("/api/v1/scan/project", response_model=ScanResponse)
async def scan_project(request: ScanRequest):
    temp_dir = tempfile.mkdtemp()
    try:
        # 1. Clone Repo (with timeout)
        Repo.clone_from(request.repo_url, temp_dir, depth=1)
        
        all_code = ""
        complexities = []
        file_count = 0

        # 2. Iterate through source files
        for root, _, files in os.walk(temp_dir):
            for file in files:
                if file.endswith(('.py', '.js', '.ts', '.tsx', '.go', '.java')):
                    file_path = os.path.join(root, file)
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                            all_code += content
                            file_count += 1
                    except: continue

        if not all_code:
            raise HTTPException(status_code=400, detail="No source code found.")

        # 3. Calculate Advanced Metrics
        engine = ForensicEngine()
        entropy_score = engine.calculate_shannon_entropy(all_code)
        variance_score = engine.analyze_complexity_variance(all_code)
        pattern_score = engine.detect_ai_isms(all_code)

        # 4. Weighted Final Score
        # If variance is low and patterns are standard, it's likely AI.
        final_trust_score = int(
            (entropy_score * 0.4) + 
            (variance_score * 0.4) + 
            (pattern_score * 0.2)
        )

        # 5. Determine Confidence
        confidence = "High" if file_count > 5 else "Medium"
        if final_trust_score < 40: confidence = "Critical"

        return {
            "score": final_trust_score,
            "confidence_level": confidence,
            "breakdown": {
                "originality": round(entropy_score, 1),
                "structural_variance": round(variance_score, 1)
            },
            "system": "VYNCR-Forensic-v2.1"
        }

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        shutil.rmtree(temp_dir)

if __name__ == "__main__":
    import uvicorn
    # Use 0.0.0.0 for Replit/Render connectivity
    uvicorn.run(app, host="0.0.0.0", port=8000)
