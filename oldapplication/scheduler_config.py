# Scheduler Configuration for Automated Analysis

# Analysis interval in hours (how often to run analysis for all companies)
ANALYSIS_INTERVAL_HOURS = 6

# Daily analysis time (24-hour format, e.g., "02:00" for 2 AM)
DAILY_ANALYSIS_TIME = "02:00"

# Enable/disable scheduler
SCHEDULER_ENABLED = True

# Delay between analyzing different companies (seconds) to avoid rate limits
COMPANY_ANALYSIS_DELAY = 5

# Historical data retention (days)
HISTORY_RETENTION_DAYS = 90

# Companies to analyze (leave empty to analyze all companies in database)
# Format: [{"company_id": "tesla", "keywords": ["Tesla", "Elon Musk"]}, ...]
COMPANIES_TO_ANALYZE = []

# Enable historical data collection for XAI insights
COLLECT_HISTORICAL_DATA = True
