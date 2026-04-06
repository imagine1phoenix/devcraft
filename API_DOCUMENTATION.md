# API_DOCUMENTATION.md

# AI Stock Market Analyzer - API Reference

## Base URL
```
http://localhost:8000
```

## API Documentation (Interactive)
```
http://localhost:8000/docs    (Swagger UI)
http://localhost:8000/redoc   (ReDoc)
```

---

## Endpoints

### 1. Health Check
```
GET /health
```

**Description**: Check if API is running and models are loaded

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.123456",
  "models": {
    "sentiment": "loaded",
    "vision": "loaded",
    "synthesis": "loaded",
    "finnhub": "connected"
  }
}
```

---

### 2. Sentiment Analysis (Single Text)
```
POST /analyze/sentiment
```

**Description**: Analyze sentiment of financial text (news, tweet, etc.)

**Request Body**:
```json
{
  "text": "Apple stock surges after beating earnings expectations"
}
```

**Response**:
```json
{
  "text": "Apple stock surges after beating earnings expectations",
  "label": "positive",
  "confidence": 0.92,
  "probabilities": {
    "positive": 0.92,
    "neutral": 0.05,
    "negative": 0.03
  }
}
```

**Labels**:
- `positive`: Bullish signal
- `neutral`: Mixed/no clear signal
- `negative`: Bearish signal

**Confidence**: 0-1 scale, higher = more confident

---

### 3. Batch Sentiment Analysis
```
POST /analyze/sentiment/batch
```

**Description**: Analyze sentiment for multiple texts efficiently

**Request Body**:
```json
{
  "texts": [
    "Apple beats earnings expectations",
    "Microsoft faces antitrust challenges",
    "Tesla announces record deliveries"
  ]
}
```

**Response**:
```json
{
  "count": 3,
  "results": [
    {
      "text": "Apple beats earnings expectations",
      "label": "positive",
      "confidence": 0.87,
      ...
    },
    ...
  ]
}
```

---

### 4. Chart Pattern Detection
```
POST /analyze/chart
```

**Description**: Upload chart image to detect candlestick patterns

**Request**: File upload (multipart/form-data)

**Response**:
```json
{
  "image": "/path/to/image.png",
  "pattern": "flag",
  "confidence": 0.85,
  "signal": {
    "direction": "continuation",
    "strength": "medium"
  },
  "probabilities": {
    "flag": 0.85,
    "breakout": 0.08,
    "consolidation": 0.04,
    ...
  }
}
```

**Patterns Detected**:
- `flag`: Continuation pattern
- `double_top`: Reversal pattern (bearish)
- `double_bottom`: Reversal pattern (bullish)
- `head_shoulders`: Reversal pattern (bearish)
- `triangle`: Breakout pattern
- `wedge_rising`: Reversal (bearish)
- `wedge_falling`: Reversal (bullish)
- `cup_handle`: Continuation (bullish)
- `breakout`: Strong move expected
- `consolidation`: Waiting for direction

---

### 5. Technical Analysis
```
GET /analyze/technical/{symbol}
```

**Description**: Calculate technical indicators for a stock

**Parameters**:
- `symbol` (string, required): Stock symbol (e.g., AAPL)
- `period` (integer, optional): Days of data (default: 100, range: 10-365)

**Example**:
```
GET /analyze/technical/AAPL?period=100
```

**Response**:
```json
{
  "symbol": "AAPL",
  "technical_indicators": {
    "rsi": 65,
    "macd": {
      "macd": 2.45,
      "signal": 2.10,
      "histogram": 0.35,
      "status": "bullish_crossover"
    },
    "moving_average_50": 170.50,
    "moving_average_200": 165.30,
    "current_price": 175.25,
    "high_52week": 189.95,
    "low_52week": 142.50
  },
  "timestamp": "2024-01-15T10:30:00"
}
```

**Indicators**:
- `rsi`: 0-100, >70 overbought, <30 oversold
- `macd`: Momentum indicator with signal line
- `moving_average`: Trend indicators
- `current_price`: Current stock price
- `52week_high/low`: Price range over last year

---

### 6. Fundamental Analysis
```
GET /analyze/fundamental/{symbol}
```

**Description**: Get fundamental metrics for a company

**Parameters**:
- `symbol` (string, required): Stock symbol

**Example**:
```
GET /analyze/fundamental/MSFT
```

**Response**:
```json
{
  "symbol": "MSFT",
  "fundamentals": {
    "company_name": "Microsoft Corporation",
    "industry": "Software—Infrastructure",
    "market_cap": 2500000000000,
    "current_price": 375.50,
    "pe_ratio": 32.5,
    "dividend_yield": 0.85,
    "employees": 220000,
    "website": "https://www.microsoft.com",
    "exchange": "NASDAQ"
  },
  "timestamp": "2024-01-15T10:30:00"
}
```

---

### 7. News Sentiment Analysis
```
GET /analyze/sentiment/news/{symbol}
```

**Description**: Analyze sentiment of recent news articles about a stock

**Parameters**:
- `symbol` (string, required): Stock symbol
- `days` (integer, optional): Days to look back (default: 7, range: 1-30)

**Example**:
```
GET /analyze/sentiment/news/TSLA?days=14
```

**Response**:
```json
{
  "symbol": "TSLA",
  "news_count": 25,
  "sentiment_summary": {
    "positive": 12,
    "negative": 8,
    "neutral": 5,
    "positive_ratio": 0.48
  },
  "recent_headlines": [
    {
      "headline": "Tesla Q4 deliveries exceed expectations",
      "sentiment": "positive",
      "confidence": 0.89
    },
    {
      "headline": "Tesla faces manufacturing challenges",
      "sentiment": "negative",
      "confidence": 0.76
    },
    ...
  ],
  "timestamp": "2024-01-15T10:30:00"
}
```

---

### 8. Comprehensive Analysis (MAIN ENDPOINT)
```
POST /analyze/comprehensive/{symbol}
```

**Description**: Complete analysis combining sentiment, technical, fundamental, and AI recommendations

**Parameters**:
- `symbol` (string, required): Stock symbol

**Example**:
```
POST /analyze/comprehensive/AAPL
```

**Response**:
```json
{
  "symbol": "AAPL",
  "timestamp": "2024-01-15T10:30:00.123456",
  
  "sentiment_analysis": "Overall positive sentiment driven by strong earnings beat and iPhone sales momentum. Some concerns about antitrust issues. 65% of recent news is bullish.",
  
  "technical_analysis": "Stock showing bullish breakout pattern with strong momentum. RSI at 72 indicates some overbought conditions. Moving averages aligned bullishly (50 > 200). Price near 52-week highs.",
  
  "fundamental_analysis": "Trading at 28x P/E (above historical average). Strong revenue growth of 3-5%. Solid balance sheet with manageable debt. Dividend yield of 0.4%.",
  
  "recommendation": {
    "symbol": "AAPL",
    "recommendation": "BUY",
    "confidence_score": 0.78,
    "price_target_upside": "15%",
    "price_target_downside": "-8%",
    "investment_thesis": "Strong fundamentals combined with positive sentiment and technical breakout. Multiple expansion likely on AI initiatives.",
    "key_risks": [
      "Antitrust regulatory concerns",
      "iPhone market saturation",
      "US-China tensions"
    ],
    "key_catalysts": [
      "New AI features launch",
      "Services growth acceleration",
      "Earnings beats"
    ],
    "position_sizing": "medium",
    "time_horizon": "medium-term",
    "next_review_date": "2024-02-15"
  },
  
  "data_quality": {
    "sentiment_samples": 25,
    "technical_complete": true,
    "fundamental_complete": true
  }
}
```

---

## Error Responses

### 400 - Bad Request
```json
{
  "detail": "Invalid input or processing error"
}
```

### 404 - Not Found
```json
{
  "detail": "Stock symbol not found or no data available"
}
```

### 500 - Server Error
```json
{
  "detail": "Internal server error. Check logs."
}
```

---

## Usage Examples

### Python (requests library)

```python
import requests

BASE_URL = "http://localhost:8000"

# 1. Check health
response = requests.get(f"{BASE_URL}/health")
print(response.json())

# 2. Single sentiment
response = requests.post(
    f"{BASE_URL}/analyze/sentiment",
    json={"text": "Apple beats earnings"}
)
print(response.json())

# 3. Batch sentiment
response = requests.post(
    f"{BASE_URL}/analyze/sentiment/batch",
    json={"texts": ["Text 1", "Text 2", "Text 3"]}
)
print(response.json())

# 4. Technical analysis
response = requests.get(
    f"{BASE_URL}/analyze/technical/AAPL",
    params={"period": 100}
)
print(response.json())

# 5. Comprehensive analysis
response = requests.post(
    f"{BASE_URL}/analyze/comprehensive/AAPL"
)
recommendation = response.json()
print(f"Recommendation: {recommendation['recommendation']['recommendation']}")
print(f"Confidence: {recommendation['recommendation']['confidence_score']:.0%}")
```

### cURL

```bash
# Health check
curl http://localhost:8000/health

# Sentiment
curl -X POST http://localhost:8000/analyze/sentiment \
  -H "Content-Type: application/json" \
  -d '{"text":"Apple stock surges"}'

# Technical analysis
curl http://localhost:8000/analyze/technical/MSFT?period=100

# Comprehensive analysis
curl -X POST http://localhost:8000/analyze/comprehensive/TSLA
```

### JavaScript (fetch)

```javascript
const BASE_URL = "http://localhost:8000";

// Comprehensive analysis
async function analyzeStock(symbol) {
    const response = await fetch(
        `${BASE_URL}/analyze/comprehensive/${symbol}`,
        { method: 'POST' }
    );
    const data = await response.json();
    
    console.log(`Symbol: ${data.symbol}`);
    console.log(`Recommendation: ${data.recommendation.recommendation}`);
    console.log(`Confidence: ${(data.recommendation.confidence_score * 100).toFixed(0)}%`);
    console.log(`Thesis: ${data.recommendation.investment_thesis}`);
}

analyzeStock('AAPL');
```

---

## Rate Limiting

No explicit rate limits on local API, but:
- Finnhub API: 60 calls/min (free tier)
- NewsAPI: 100 calls/day (free tier)
- Anthropic API: Billed per token (see pricing)

For production, implement:
- Token bucket rate limiting
- Request queuing
- Caching layer (Redis)

---

## Data Quality Notes

- **Sentiment**: Based on news headlines and articles (limited to headlines)
- **Technical**: Calculated from 100+ days of historical OHLC data
- **Fundamental**: From Finnhub API (updated daily)
- **Recommendations**: Generated by Claude Sonnet (contextual)

---

## Support

For issues:
1. Check API logs: `tail -f backend/app.log`
2. Verify API keys in `.env`
3. Ensure models are loaded: `GET /health`
4. Review code at `backend/app.py`
