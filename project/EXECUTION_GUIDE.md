# COMPLETE EXECUTION GUIDE
# AI Stock Market Analyzer - Ready to Deploy

## TIMELINE: You can have everything running by 11:00 AM

### PART 1: LOCAL SETUP (30 minutes)
### PART 2: DATA COLLECTION & LABELING (1 hour)
### PART 3: GOOGLE COLAB TRAINING (2-3 hours, runs in background)
### PART 4: BACKEND DEPLOYMENT (30 minutes)

============================================================================
## PART 1: LOCAL SETUP (Mac)
============================================================================

### Step 1.1: Navigate to project
```bash
cd ~/projects/ai-stock-analyzer
```

### Step 1.2: Run setup script (automated installation)
```bash
chmod +x setup.sh
./setup.sh
```

This will:
- Create virtual environment
- Install all Python dependencies
- Create directory structure
- Download public datasets (FinPhraseBank)
- Create .env file

### Step 1.3: Activate virtual environment (do this in every terminal session)
```bash
source venv/bin/activate
```

### Step 1.4: Get API Keys (fill in .env file)
```bash
nano .env
```

Add your keys:
- FINNHUB_API_KEY: Get free from https://finnhub.io (signup takes 2 min)
- NEWS_API_KEY: Get free from https://newsapi.org (signup takes 2 min)
- ANTHROPIC_API_KEY: Get from https://console.anthropic.com (paid but cheap)
- MONGO_URI: Use local or Atlas (optional for MVP)

Example .env:
```
FINNHUB_API_KEY=your_finnhub_key_here
NEWS_API_KEY=your_newsapi_key_here
ANTHROPIC_API_KEY=sk-ant-your_key_here
MONGO_URI=mongodb://localhost:27017/stock_analyzer
FLASK_ENV=development
DEBUG=True
```

### Step 1.5: Verify installation
```bash
python3 -c "import torch; print(f'PyTorch: {torch.__version__}')"
python3 -c "from transformers import AutoTokenizer; print('Transformers: OK')"
python3 -c "import anthropic; print('Anthropic: OK')"
```

============================================================================
## PART 2: DATA COLLECTION & LABELING (1 hour)
============================================================================

### Step 2.1: Collect financial news sentiment data
```bash
# Terminal 1: Activate venv
source venv/bin/activate

# Collect news and sentiment data
python3 << 'EOF'
from src.data_collection.sentiment_collector import SentimentCollector

collector = SentimentCollector()

# Step 1: Collect financial news
print("Collecting financial news...")
news_df = collector.collect_financial_news(
    stocks=["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA"],
    days_back=7
)

# Step 2: Load FinPhraseBank (already downloaded)
print("Loading FinPhraseBank...")
fpb_df = collector.load_finphrasebank()

# Step 3: Combine all sources
print("Combining all sources...")
combined = collector.combine_sentiment_sources()

print(f"\n✓ Collected {len(combined)} sentiment samples")
EOF
```

Output: `data/raw/sentiment/combined_sentiment.csv`

### Step 2.2: Manually label sentiment data (INTERACTIVE)
```bash
# Start interactive labeling tool
python3 src/data_collection/data_labeler.py

# You'll see:
# "Record 1/100"
# "TEXT: Apple stock surges after beating earnings"
# 
# Label options:
# [P] Positive  [N] Negative  [U] Neutral  [S] Skip  [Q] Quit
#
# Type: P (for positive)
# Status: ✓ Labeled as: positive
#
# Continue through ~50-100 samples (takes ~30 minutes)
# Progress saves automatically every 10 labels
```

Output: `data/raw/sentiment/combined_sentiment_labeled.csv`

Note: The system will fall back to pre-labeled FinPhraseBank if you skip this.

============================================================================
## PART 3: GOOGLE COLAB TRAINING (2-3 hours)
============================================================================

### Step 3.1: Upload to Google Drive
```bash
# Download 01_Sentiment_Training_Colab.py and 02_Vision_Training_Colab.py
# Upload to Google Drive: /ai-stock-analyzer/
```

### Step 3.2: Create Google Colab Notebook - Sentiment Training
```
Go to: https://colab.research.google.com
1. New notebook
2. Upload: notebooks/01_Sentiment_Training_Colab.py
3. Copy-paste code into Colab cells
4. Run sequentially (Shift+Enter)
```

Colab Execution (with GPU):
```python
# CELL 1: Setup
from google.colab import drive
drive.mount('/content/drive')
!pip install -q transformers datasets torch scikit-learn pandas numpy loguru tqdm

# CELL 2-11: Run training script
# Takes ~1.5 hours on free GPU
# Model saves to: /content/drive/MyDrive/ai-stock-analyzer/models/sentiment/finbert_finetuned
```

### Step 3.3: Create Google Colab Notebook - Vision Training  
```
Go to: https://colab.research.google.com
1. New notebook
2. Upload: notebooks/02_Vision_Training_Colab.py
3. Run sequentially
```

Colab Execution:
```python
# CELL 1: Setup
from google.colab import drive
drive.mount('/content/drive')

# CELL 2-10: Run training
# Takes ~2 hours on free GPU
# Generates 1000 synthetic candlestick patterns
# Model saves to: /content/drive/MyDrive/ai-stock-analyzer/models/vision/vit_patterns
```

### Step 3.4: Download Trained Models
```bash
# After Colab training completes:
# 1. Download from Google Drive:
#    - /ai-stock-analyzer/models/sentiment/finbert_finetuned/
#    - /ai-stock-analyzer/models/vision/vit_patterns/
#
# 2. Extract to local:
mkdir -p models/sentiment/finbert_finetuned
mkdir -p models/vision/vit_patterns
# Copy downloaded files here
```

============================================================================
## PART 4: BACKEND DEPLOYMENT (30 minutes)
============================================================================

### Step 4.1: Test individual models locally
```bash
source venv/bin/activate

# Test sentiment analyzer
python3 src/models/sentiment_analyzer.py

# Expected output:
# === Sentiment Analyzer Test ===
# 
# Analyzing: Apple reported record earnings...
# Result: {
#   "text": "Apple reported record earnings exceeding all...",
#   "label": "positive",
#   "confidence": 0.92,
#   ...
# }

# Test pattern detector
python3 src/models/pattern_detector.py

# Test Finnhub API
python3 src/api/finnhub_client.py

# Test synthesis engine
python3 src/models/synthesis_engine.py
```

### Step 4.2: Start FastAPI backend
```bash
source venv/bin/activate

# Terminal 1: Start backend server
python3 backend/app.py

# Expected output:
# INFO:     Started server process [12345]
# INFO:     Uvicorn running on http://0.0.0.0:8000
# INFO:     Application startup complete
```

### Step 4.3: Test API endpoints
```bash
# Terminal 2: Test health check
curl http://localhost:8000/health

# Expected response:
# {
#   "status": "healthy",
#   "timestamp": "2024-01-15T10:30:00",
#   "models": {...}
# }
```

### Step 4.4: Test sentiment endpoint
```bash
curl -X POST http://localhost:8000/analyze/sentiment \
  -H "Content-Type: application/json" \
  -d '{"text": "Apple stock surges after beating earnings"}'

# Expected response:
# {
#   "text": "Apple stock surges after beating earnings",
#   "label": "positive",
#   "confidence": 0.92,
#   "probabilities": {
#     "negative": 0.05,
#     "neutral": 0.03,
#     "positive": 0.92
#   }
# }
```

### Step 4.5: Test comprehensive analysis endpoint
```bash
curl -X POST http://localhost:8000/analyze/comprehensive/AAPL

# Expected response:
# {
#   "symbol": "AAPL",
#   "timestamp": "2024-01-15T10:30:00",
#   "sentiment_analysis": "Overall positive sentiment with strong earnings beat...",
#   "technical_analysis": "Stock showing bullish momentum with breakout pattern...",
#   "fundamental_analysis": "Trading at reasonable valuation with strong growth...",
#   "recommendation": {
#     "recommendation": "BUY",
#     "confidence_score": 0.78,
#     "investment_thesis": "Strong fundamentals combined with positive sentiment...",
#     ...
#   }
# }
```

### Step 4.6: Access API documentation
```
Visit: http://localhost:8000/docs
# Interactive API documentation with test forms
```

============================================================================
## PART 5: FRONTEND (Optional, for Web Interface)
============================================================================

### Step 5.1: Create HTML dashboard
```bash
# Create frontend/index.html (see template below)
```

### Step 5.2: Serve with Flask
```bash
source venv/bin/activate

# Terminal 1: FastAPI backend still running
python3 backend/app.py

# Terminal 2: Flask frontend
python3 -m http.server 5000 --directory frontend

# Visit: http://localhost:5000
```

============================================================================
## TESTING CHECKLIST (15 minutes)
============================================================================

Test all endpoints:

```bash
# Health
curl http://localhost:8000/health

# Sentiment
curl -X POST http://localhost:8000/analyze/sentiment \
  -H "Content-Type: application/json" \
  -d '{"text": "Microsoft exceeds analyst expectations"}'

# Batch sentiment
curl -X POST http://localhost:8000/analyze/sentiment/batch \
  -H "Content-Type: application/json" \
  -d '{"texts": ["Apple beats earnings", "Tesla faces challenges", "Google growing fast"]}'

# News sentiment for stock
curl http://localhost:8000/analyze/sentiment/news/AAPL

# Technical analysis
curl http://localhost:8000/analyze/technical/MSFT

# Fundamental analysis
curl http://localhost:8000/analyze/fundamental/GOOGL

# Comprehensive analysis (MAIN ENDPOINT)
curl -X POST http://localhost:8000/analyze/comprehensive/AAPL
```

============================================================================
## QUICK REFERENCE: COMMAND CHEATSHEET
============================================================================

```bash
# Project setup
cd ~/projects/ai-stock-analyzer
source venv/bin/activate

# Data collection
python3 src/data_collection/sentiment_collector.py  # Collect data
python3 src/data_collection/data_labeler.py         # Label data

# Model testing
python3 src/models/sentiment_analyzer.py            # Test sentiment
python3 src/models/pattern_detector.py              # Test vision
python3 src/api/finnhub_client.py                   # Test API

# Start backend
python3 backend/app.py

# In another terminal, test:
curl http://localhost:8000/health
curl -X POST http://localhost:8000/analyze/comprehensive/AAPL
```

============================================================================
## TROUBLESHOOTING
============================================================================

### Issue: ModuleNotFoundError
```bash
# Solution: Make sure you're in virtual environment
source venv/bin/activate
pip install -r requirements.txt
```

### Issue: FINNHUB_API_KEY error
```bash
# Solution: Add to .env file
nano .env
# Add: FINNHUB_API_KEY=your_key_here
```

### Issue: No GPU in Colab
```bash
# Solution: Enable GPU in Colab
# Runtime → Change runtime type → GPU
```

### Issue: Model files not found
```bash
# Solution: Download from Google Drive after training
# Create directories if missing
mkdir -p models/sentiment/finbert_finetuned
mkdir -p models/vision/vit_patterns
```

============================================================================
## NEXT STEPS (AFTER 11:00 AM)
============================================================================

1. **Improve Models**:
   - Collect more labeled sentiment data (100+ examples)
   - Fine-tune with additional financial datasets
   - Test on real trading data

2. **Enhance Features**:
   - Add portfolio tracking
   - Implement real-time streaming
   - Add alert system

3. **Scale Infrastructure**:
   - Deploy to cloud (AWS/GCP)
   - Set up MongoDB Atlas
   - Implement caching (Redis)

4. **Validate Performance**:
   - Backtest recommendations
   - Compare vs. analyst consensus
   - Track prediction accuracy

============================================================================
## DIRECTORY STRUCTURE (AFTER SETUP)
============================================================================

ai-stock-analyzer/
├── setup.sh                              ✓ Run this first
├── requirements.txt                      ✓ Dependencies
├── .env                                  ✓ API keys (fill manually)
├── venv/                                 ✓ Virtual environment
├── data/
│   ├── raw/
│   │   └── sentiment/                    ✓ Collected news/tweets
│   └── processed/
│       └── sentiment_labeled.csv         ✓ Labeled data
├── models/
│   ├── sentiment/
│   │   └── finbert_finetuned/            ✓ Trained model (from Colab)
│   └── vision/
│       └── vit_patterns/                 ✓ Trained model (from Colab)
├── src/
│   ├── data_collection/
│   │   ├── sentiment_collector.py        ✓ Data collection
│   │   └── data_labeler.py               ✓ Manual labeling
│   ├── models/
│   │   ├── sentiment_analyzer.py         ✓ Sentiment inference
│   │   ├── pattern_detector.py           ✓ Vision inference
│   │   └── synthesis_engine.py           ✓ Claude integration
│   └── api/
│       └── finnhub_client.py             ✓ Data API
├── backend/
│   └── app.py                            ✓ FastAPI server
├── frontend/
│   └── index.html                        ✓ Web dashboard (optional)
└── notebooks/
    ├── 01_Sentiment_Training_Colab.py    ✓ Colab notebook
    └── 02_Vision_Training_Colab.py       ✓ Colab notebook

============================================================================
## FILE EXECUTION ORDER
============================================================================

1. setup.sh                      → 30 min
2. sentiment_collector.py        → 10 min
3. data_labeler.py              → 30 min
4. Colab notebooks (both)       → 3 hours (background)
5. backend/app.py               → Start backend
6. Test endpoints               → 15 min

TOTAL: ~4 hours
Ready by: 11:00 AM + 4 hours = 3:00 PM

If you started at 9:00 AM, you can deploy by 1:00 PM.
