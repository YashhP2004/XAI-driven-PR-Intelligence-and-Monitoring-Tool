# Automated Analysis Scheduler - Setup Guide

## Overview

The automated scheduler runs analysis for all companies at regular intervals to build historical data for XAI insights and trend analysis.

## Features

✅ **Automatic periodic analysis** - Runs every 6 hours by default  
✅ **Historical data collection** - Stores timestamped sentiment, keywords, mentions  
✅ **Trend analysis** - Calculate risk trends from historical data  
✅ **Manual triggers** - API endpoint to run analysis on-demand  
✅ **Background processing** - Non-blocking execution  

## Configuration

Edit `scheduler_config.py` to customize:

```python
# Analysis interval in hours
ANALYSIS_INTERVAL_HOURS = 6

# Daily analysis time (24-hour format)
DAILY_ANALYSIS_TIME = "02:00"

# Enable/disable scheduler
SCHEDULER_ENABLED = True

# Historical data retention (days)
HISTORY_RETENTION_DAYS = 90
```

## Installation

Install required dependency:

```bash
pip install schedule
```

## Usage

### Automatic Mode

The scheduler starts automatically when the API server starts:

```bash
cd oldapplication
python -m uvicorn simple_api:app --reload --port 8000
```

You'll see:
```
✅ Connected to MongoDB: brand_analyzer
✅ Scheduler started (runs every 6 hours)
```

### Manual Trigger

Trigger analysis for a specific company via API:

```bash
# Using curl
curl -X POST http://localhost:8000/api/analyze/tesla

# Using Python
import requests
response = requests.post("http://localhost:8000/api/analyze/tesla")
print(response.json())
```

Response:
```json
{
  "status": "started",
  "company_id": "tesla",
  "keywords": ["Tesla", "Elon Musk"],
  "message": "Analysis started in background"
}
```

### Check Scheduler Status

```bash
curl http://localhost:8000/api/scheduler/status
```

Response:
```json
{
  "available": true,
  "enabled": true,
  "running": true,
  "interval_hours": 6
}
```

### Get Historical Data

Retrieve sentiment history for trend analysis:

```bash
curl http://localhost:8000/api/sentiment/history/tesla?days=30
```

Response:
```json
[
  {
    "company_id": "tesla",
    "timestamp": "2026-02-01T10:00:00",
    "positive": 45,
    "neutral": 30,
    "negative": 25
  },
  {
    "company_id": "tesla",
    "timestamp": "2026-02-01T16:00:00",
    "positive": 50,
    "neutral": 28,
    "negative": 22
  }
]
```

## How It Works

### 1. Scheduled Execution

```
Every 6 hours:
  ├─ Fetch all companies from database
  ├─ For each company:
  │   ├─ Run scraping (News, Reddit, Twitter)
  │   ├─ Analyze sentiment
  │   ├─ Extract keywords
  │   ├─ Store results with timestamp
  │   └─ Update company.last_analysis
  └─ Wait for next interval
```

### 2. Historical Data Storage

Data is stored in separate collections for trend analysis:

- `sentiment_history` - Timestamped sentiment scores
- `keyword_history` - Keyword trends over time
- `companies.last_analysis` - Last analysis timestamp

### 3. XAI Insights

Historical data enables:

- **Trend detection** - "Sentiment declining over 7 days"
- **Anomaly detection** - "Spike in negative mentions"
- **Feature importance** - "Negative keywords increased 40%"
- **Confidence scores** - Based on data volume and consistency

## Database Collections

### sentiment_history
```json
{
  "company_id": "tesla",
  "timestamp": "2026-02-01T10:00:00Z",
  "positive": 45,
  "neutral": 30,
  "negative": 25
}
```

### keyword_history
```json
{
  "company_id": "tesla",
  "timestamp": "2026-02-01T10:00:00Z",
  "keyword": "electric vehicle",
  "count": 127
}
```

### companies (updated fields)
```json
{
  "company_id": "tesla",
  "last_analysis": "2026-02-01T10:00:00Z",
  "analysis_count": 42
}
```

## Troubleshooting

### Scheduler not starting

Check logs for:
```
⚠️  Scheduler not available (missing dependencies)
```

Solution:
```bash
pip install schedule
```

### Analysis failing

Check logs for error messages. Common issues:
- API rate limits (adjust `COMPANY_ANALYSIS_DELAY`)
- Missing API keys in `.env`
- MongoDB connection issues

### Disable scheduler temporarily

Edit `scheduler_config.py`:
```python
SCHEDULER_ENABLED = False
```

Then restart the API server.

## Benefits for XAI

With historical data, the system can:

1. **Show trends** - "Negative sentiment increased 40% this week"
2. **Detect patterns** - "Mentions spike every Monday"
3. **Calculate confidence** - More data = higher confidence
4. **Explain changes** - "Alert triggered because negative keywords doubled"
5. **Predict risks** - "Based on 30-day trend, risk is increasing"

## Next Steps

1. ✅ Scheduler is configured and ready
2. ✅ Historical data will accumulate automatically
3. ✅ XAI insights will improve over time
4. 🔄 Monitor `/api/scheduler/status` to verify it's running
5. 🔄 Check MongoDB collections to see historical data growing

---

**Note:** The first run will have limited historical data. After a few cycles (24-48 hours), you'll have enough data for meaningful trend analysis and XAI insights.
