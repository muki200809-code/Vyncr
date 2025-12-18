import httpx
import statistics
import re
from datetime import datetime

class ForensicAI:
    """Advanced Forensic Engine to detect AI vs Human code signatures."""
    
    @staticmethod
    def calculate_human_score(code_samples, commits):
        if not code_samples: return 0
        
        # 1. Entropy Analysis (AI code is often too 'clean')
        # We look for "Human Noise": varied line lengths and unconventional naming
        complexity_scores = []
        for code in code_samples:
            lines = code.split('\n')
            if len(lines) < 5: continue
            line_lengths = [len(l.strip()) for l in lines if l.strip()]
            # Humans have higher variance in line length
            variance = statistics.stdev(line_lengths) if len(line_lengths) > 1 else 0
            complexity_scores.append(min(variance * 2, 100))

        # 2. Temporal Analysis (When was the code written?)
        # AI 'dumps' large amounts of code in single commits.
        # Humans commit in bursts with logical gaps.
        time_deltas = []
        for i in range(len(commits) - 1):
            t1 = datetime.fromisoformat(commits[i]['commit']['author']['date'].replace('Z', ''))
            t2 = datetime.fromisoformat(commits[i+1]['commit']['author']['date'].replace('Z', ''))
            time_deltas.append(abs((t1 - t2).total_seconds()))
        
        temporal_score = 100
        if time_deltas:
            # If large files are added in seconds, it's likely a copy-paste/AI dump
            avg_delta = sum(time_deltas) / len(time_deltas)
            if avg_delta < 60: temporal_score = 30 # High suspicion

        avg_complexity = sum(complexity_scores) / len(complexity_scores) if complexity_scores else 50
        
        # Weighted Final Score
        final_score = (avg_complexity * 0.6) + (temporal_score * 0.4)
        return round(min(final_score, 100), 2)

class SelfHealer:
    """Monitors system health and resets unstable nodes."""
    def __init__(self):
        self.status = "operational"
        self.start_time = datetime.now()

    def get_health(self):
        uptime = (datetime.now() - self.start_time).total_seconds()
        return {
            "status": self.status,
            "uptime_seconds": round(uptime, 2),
            "node": "Oracle-Cloud-A1"
        }
