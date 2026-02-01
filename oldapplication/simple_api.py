"""
Simplified API Server for PR Command Center
Serves data directly from MongoDB without requiring scraping modules
"""

from typing import List, Dict, Any, Optional
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import scheduler
try:
    from scheduler import AnalysisScheduler
    from scheduler_config import SCHEDULER_ENABLED, ANALYSIS_INTERVAL_HOURS
    SCHEDULER_AVAILABLE = True
except ImportError:
    SCHEDULER_AVAILABLE = False
    print("⚠️  Scheduler not available (missing dependencies)")

app = FastAPI(title="PR Command Center API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGODB_URI = os.getenv("MONGODB_URI")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "brand_analyzer")

client = None
db = None
scheduler = None

def get_db():
    global client, db
    if client is None:
        client = MongoClient(MONGODB_URI)
        db = client[MONGODB_DB_NAME]
        print(f"✅ Connected to MongoDB: {MONGODB_DB_NAME}")
        
        # Start scheduler if enabled
        global scheduler
        if SCHEDULER_AVAILABLE and SCHEDULER_ENABLED and scheduler is None:
            scheduler = AnalysisScheduler(db)
            scheduler.start(interval_hours=ANALYSIS_INTERVAL_HOURS)
            print(f"✅ Scheduler started (runs every {ANALYSIS_INTERVAL_HOURS} hours)")
    
    return db

@app.on_event("shutdown")
def shutdown_event():
    """Cleanup on shutdown"""
    global scheduler
    if scheduler:
        scheduler.stop()
        print("✅ Scheduler stopped")

@app.get("/")
async def root():
    return {"message": "PR Command Center API", "status": "running"}

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    try:
        db = get_db()
        # Ping the database
        db.command('ping')
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}

@app.get("/api/companies")
async def get_companies():
    """Get list of all companies"""
    try:
        db = get_db()
        companies = list(db.companies.find({}, {"_id": 0, "company_id": 1, "display_name": 1}))
        
        # If no display_name, use company_id
        for company in companies:
            if "display_name" not in company:
                company["display_name"] = company["company_id"].replace("_", " ").title()
            if "id" not in company:
                company["id"] = company["company_id"]
        
        return companies
    except Exception as e:
        print(f"Error fetching companies: {e}")
        return []

@app.get("/api/sentiment/{company_id}")
async def get_sentiment(company_id: str):
    """Get sentiment data for a company"""
    try:
        db = get_db()
        
        # Try to find sentiment data
        sentiment = db.sentiments.find_one({"company_id": company_id})
        
        if sentiment:
            return {
                "positive": sentiment.get("positive", 0),
                "neutral": sentiment.get("neutral", 0),
                "negative": sentiment.get("negative", 0),
            }
        
        # Fallback: calculate from mentions
        mentions = list(db.mentions.find({"company_id": company_id}))
        
        if not mentions:
            return {"positive": 0, "neutral": 0, "negative": 0}
        
        positive = sum(1 for m in mentions if m.get("sentiment", "").lower() == "positive")
        negative = sum(1 for m in mentions if m.get("sentiment", "").lower() == "negative")
        neutral = len(mentions) - positive - negative
        
        return {
            "positive": positive,
            "neutral": neutral,
            "negative": negative,
        }
    except Exception as e:
        print(f"Error fetching sentiment: {e}")
        return {"positive": 0, "neutral": 0, "negative": 0}

@app.get("/api/keywords/{company_id}")
async def get_keywords(company_id: str):
    """Get top keywords for a company"""
    try:
        db = get_db()
        keywords = list(db.keywords.find(
            {"company_id": company_id},
            {"_id": 0, "keyword": 1, "count": 1}
        ).sort("count", -1).limit(20))
        
        return keywords
    except Exception as e:
        print(f"Error fetching keywords: {e}")
        return []

@app.get("/api/themes/{company_id}")
async def get_themes(company_id: str):
    """Get themes for a company"""
    try:
        db = get_db()
        themes = list(db.themes.find(
            {"company_id": company_id},
            {"_id": 0, "theme": 1}
        ).limit(10))
        
        return [t["theme"] for t in themes if "theme" in t]
    except Exception as e:
        print(f"Error fetching themes: {e}")
        return []

@app.get("/api/news/{company_id}")
async def get_news_mentions(company_id: str):
    """Get news mentions for a company"""
    try:
        db = get_db()
        mentions = list(db.mentions.find(
            {"company_id": company_id, "source": "news"},
            {"_id": 0}
        ).sort("date", -1).limit(50))
        
        return mentions
    except Exception as e:
        print(f"Error fetching news mentions: {e}")
        return []

@app.get("/api/reddit/{company_id}")
async def get_reddit_mentions(company_id: str):
    """Get Reddit mentions for a company"""
    try:
        db = get_db()
        mentions = list(db.mentions.find(
            {"company_id": company_id, "source": "reddit"},
            {"_id": 0}
        ).sort("date", -1).limit(50))
        
        return mentions
    except Exception as e:
        print(f"Error fetching reddit mentions: {e}")
        return []

@app.get("/api/twitter/{company_id}")
async def get_twitter_mentions(company_id: str):
    """Get Twitter mentions for a company"""
    try:
        db = get_db()
        mentions = list(db.mentions.find(
            {"company_id": company_id, "source": "twitter"},
            {"_id": 0}
        ).sort("date", -1).limit(50))
        
        return mentions
    except Exception as e:
        print(f"Error fetching twitter mentions: {e}")
        return []

@app.get("/api/mentions/{company_id}")
async def get_all_mentions(company_id: str, limit: int = 100):
    """Get all mentions for a company"""
    try:
        db = get_db()
        mentions = list(db.mentions.find(
            {"company_id": company_id},
            {"_id": 0}
        ).sort("date", -1).limit(limit))
        
        return mentions
    except Exception as e:
        print(f"Error fetching mentions: {e}")
        return []

@app.post("/api/analyze/{company_id}")
async def trigger_analysis(company_id: str, keywords: List[str] = None):
    """Manually trigger analysis for a company"""
    try:
        if not SCHEDULER_AVAILABLE:
            return {"error": "Scheduler not available"}
        
        db = get_db()
        
        # Get keywords from database if not provided
        if not keywords:
            company = db.companies.find_one({"company_id": company_id})
            if company:
                keywords = company.get("keywords", [company_id.replace("_", " ")])
            else:
                keywords = [company_id.replace("_", " ")]
        
        # Run analysis in background
        import threading
        thread = threading.Thread(
            target=scheduler.run_analysis_for_company,
            args=(company_id, keywords),
            daemon=True
        )
        thread.start()
        
        return {
            "status": "started",
            "company_id": company_id,
            "keywords": keywords,
            "message": "Analysis started in background"
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/scheduler/status")
async def get_scheduler_status():
    """Get scheduler status"""
    return {
        "available": SCHEDULER_AVAILABLE,
        "enabled": SCHEDULER_ENABLED if SCHEDULER_AVAILABLE else False,
        "running": scheduler.running if scheduler else False,
        "interval_hours": ANALYSIS_INTERVAL_HOURS if SCHEDULER_AVAILABLE else None,
    }

@app.get("/api/sentiment/history/{company_id}")
async def get_sentiment_history(company_id: str, days: int = 30):
    """Get historical sentiment data for trend analysis"""
    try:
        from datetime import datetime, timedelta
        db = get_db()
        
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        
        history = list(db.sentiment_history.find({
            "company_id": company_id,
            "timestamp": {"$gte": cutoff_date}
        }).sort("timestamp", 1))
        
        # Convert ObjectId to string and datetime to ISO format
        for item in history:
            item.pop("_id", None)
            if "timestamp" in item:
                item["timestamp"] = item["timestamp"].isoformat()
        
        return history
    except Exception as e:
        print(f"Error fetching sentiment history: {e}")
        return []

