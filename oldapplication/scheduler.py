"""
Automated Scheduler for Periodic Brand Analysis
Runs analysis at specified intervals to build historical data for XAI insights
"""

import schedule
import time
import threading
from datetime import datetime
from typing import List
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class AnalysisScheduler:
    """Manages scheduled analysis tasks for companies"""
    
    def __init__(self, db):
        self.db = db
        self.running = False
        self.thread = None
        
    def run_analysis_for_company(self, company_id: str, keywords: List[str]):
        """Run analysis for a single company and store results with timestamp"""
        try:
            logger.info(f"Starting scheduled analysis for {company_id}")
            
            # Import analysis function
            from main import run_analysis
            
            # Run the analysis
            run_analysis(company_id, keywords)
            
            # Store analysis timestamp
            self.db.companies.update_one(
                {"company_id": company_id},
                {
                    "$set": {
                        "last_analysis": datetime.utcnow(),
                        "analysis_count": {"$inc": 1}
                    }
                },
                upsert=True
            )
            
            logger.info(f"Completed scheduled analysis for {company_id}")
            
        except Exception as e:
            logger.error(f"Error running analysis for {company_id}: {e}")
    
    def run_all_companies(self):
        """Run analysis for all companies in the database"""
        try:
            companies = list(self.db.companies.find({}))
            
            if not companies:
                logger.warning("No companies found in database")
                return
            
            logger.info(f"Running analysis for {len(companies)} companies")
            
            for company in companies:
                company_id = company.get("company_id")
                keywords = company.get("keywords", [])
                
                if not keywords:
                    # Use company name as default keyword
                    keywords = [company_id.replace("_", " ")]
                
                self.run_analysis_for_company(company_id, keywords)
                
                # Small delay between companies to avoid rate limits
                time.sleep(5)
                
        except Exception as e:
            logger.error(f"Error in run_all_companies: {e}")
    
    def schedule_jobs(self, interval_hours: int = 6):
        """
        Schedule periodic analysis jobs
        
        Args:
            interval_hours: Hours between each analysis run (default: 6)
        """
        # Schedule analysis every N hours
        schedule.every(interval_hours).hours.do(self.run_all_companies)
        
        # Also schedule daily at specific time (optional)
        schedule.every().day.at("02:00").do(self.run_all_companies)
        
        logger.info(f"Scheduled analysis every {interval_hours} hours and daily at 2:00 AM")
    
    def run_scheduler(self):
        """Run the scheduler loop"""
        self.running = True
        logger.info("Scheduler started")
        
        while self.running:
            schedule.run_pending()
            time.sleep(60)  # Check every minute
    
    def start(self, interval_hours: int = 6):
        """Start the scheduler in a background thread"""
        if self.running:
            logger.warning("Scheduler already running")
            return
        
        self.schedule_jobs(interval_hours)
        
        # Run in background thread
        self.thread = threading.Thread(target=self.run_scheduler, daemon=True)
        self.thread.start()
        
        logger.info("Scheduler thread started")
    
    def stop(self):
        """Stop the scheduler"""
        self.running = False
        if self.thread:
            self.thread.join(timeout=5)
        logger.info("Scheduler stopped")


# Historical data tracking functions
def store_sentiment_history(db, company_id: str, sentiment_data: dict):
    """Store sentiment data with timestamp for historical tracking"""
    db.sentiment_history.insert_one({
        "company_id": company_id,
        "timestamp": datetime.utcnow(),
        "positive": sentiment_data.get("positive", 0),
        "neutral": sentiment_data.get("neutral", 0),
        "negative": sentiment_data.get("negative", 0),
    })


def store_keyword_history(db, company_id: str, keywords: List[dict]):
    """Store keyword trends with timestamp"""
    for keyword in keywords:
        db.keyword_history.insert_one({
            "company_id": company_id,
            "timestamp": datetime.utcnow(),
            "keyword": keyword.get("keyword"),
            "count": keyword.get("count", 0),
        })


def get_sentiment_trend(db, company_id: str, days: int = 30):
    """Get sentiment trend over time for XAI insights"""
    from datetime import timedelta
    
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    history = list(db.sentiment_history.find({
        "company_id": company_id,
        "timestamp": {"$gte": cutoff_date}
    }).sort("timestamp", 1))
    
    return history


def calculate_risk_trend(db, company_id: str):
    """Calculate risk trend from historical data"""
    history = get_sentiment_trend(db, company_id, days=7)
    
    if len(history) < 2:
        return "stable"
    
    # Compare recent vs older data
    recent = history[-3:]  # Last 3 data points
    older = history[:3]    # First 3 data points
    
    recent_negative = sum(h.get("negative", 0) for h in recent) / len(recent)
    older_negative = sum(h.get("negative", 0) for h in older) / len(older)
    
    if recent_negative > older_negative * 1.2:
        return "increasing"
    elif recent_negative < older_negative * 0.8:
        return "decreasing"
    else:
        return "stable"
