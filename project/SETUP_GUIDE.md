# AI Stock Market Analyzer - Complete Setup Guide

## Project Structure
```
ai-stock-analyzer/
├── setup.sh                          # Installation script
├── requirements.txt                  # Python dependencies
├── requirements-colab.txt            # Google Colab specific
├── config/
│   └── config.yaml                   # Configuration file
├── data/
│   ├── raw/
│   │   ├── sentiment/               # Raw sentiment data
│   │   ├── charts/                  # Chart images
│   │   └── fundamentals/            # Financial data
│   ├── processed/
│   │   ├── sentiment_labeled.csv    # Labeled sentiment
│   │   ├── chart_patterns.json      # Chart labels
│   │   └── fundamentals.json        # Fundamental data
│   └── datasets/
│       ├── finphrasebank/           # Public dataset
│       └── candlestick_patterns/    # Public dataset
├── models/
│   ├── sentiment/
│   │   ├── finbert_finetuned/       # Fine-tuned FinBERT
│   │   └── config.json
│   ├── vision/
│   │   ├── vit_patterns/            # Fine-tuned ViT
│   │   └── checkpoints/
│   └── notebooks/
│       ├── 01_sentiment_training.ipynb
│       ├── 02_vision_training.ipynb
│       └── 03_synthesis_testing.ipynb
├── src/
│   ├── __init__.py
│   ├── data_collection/
│   │   ├── __init__.py
│   │   ├── sentiment_collector.py   # News + tweet collection
│   │   ├── chart_downloader.py      # Chart image collection
│   │   ├── fundamental_fetcher.py   # API data fetching
│   │   └── data_labeler.py          # Interactive labeling tool
│   ├── models/
│   │   ├── __init__.py
│   │   ├── sentiment_analyzer.py    # FinBERT wrapper
│   │   ├── pattern_detector.py      # Vision model wrapper
│   │   ├── technical_analyzer.py    # ta-lib wrapper
│   │   └── synthesis_engine.py      # Claude integration
│   ├── database/
│   │   ├── __init__.py
│   │   ├── mongo_client.py          # MongoDB wrapper
│   │   └── schema.py                # Database schemas
│   ├── api/
│   │   ├── __init__.py
│   │   ├── finnhub_client.py        # Finnhub wrapper
│   │   ├── news_client.py           # News API wrapper
│   │   └── claude_client.py         # Claude API wrapper
│   └── utils/
│       ├── __init__.py
│       ├── logger.py
│       ├── validators.py
│       └── helpers.py
├── backend/
│   ├── app.py                       # FastAPI app
│   ├── routes/
│   │   ├── stocks.py
│   │   ├── analysis.py
│   │   └── portfolio.py
│   └── services/
│       ├── analysis_service.py
│       └── cache_service.py
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── dashboard.js
│   └── components/
│       ├── chart.html
│       ├── report.html
│       └── portfolio.html
├── tests/
│   ├── test_sentiment.py
│   ├── test_vision.py
│   ├── test_synthesis.py
│   └── test_api.py
├── scripts/
│   ├── download_datasets.py         # Download public datasets
│   ├── label_data.py                # Interactive labeling
│   ├── train_sentiment.py           # Training script
│   ├── train_vision.py              # Training script
│   ├── evaluate_models.py           # Model evaluation
│   └── backtest.py                  # Backtesting framework
├── docker/
│   └── Dockerfile
├── notebooks/
│   ├── 01_EDA.ipynb
│   ├── 02_Sentiment_Finetuning.ipynb
│   ├── 03_Vision_Finetuning.ipynb
│   └── 04_Integration_Test.ipynb
└── README.md
```

## Installation Steps (Mac)

### Step 1: Prerequisites
```bash
# Check Python version
python3 --version  # Should be 3.9+

# Check if Homebrew is installed
brew --version

# If not installed:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Step 2: Clone/Create Project
```bash
# Create project directory
mkdir ~/projects/ai-stock-analyzer
cd ~/projects/ai-stock-analyzer

# Initialize git (optional)
git init
```

### Step 3: Virtual Environment Setup
```bash
# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip setuptools wheel
```

### Step 4: Install Dependencies (Mac)
```bash
# Install system dependencies
brew install mongodb-community  # For local MongoDB (optional)
brew install libsndfile         # For audio processing
brew install openblas           # For numerical computing

# Install Python dependencies
pip install -r requirements.txt
```

### Step 5: API Keys Setup
```bash
# Create .env file
cat > .env << 'EOF'
# Finnhub API (Free tier available)
FINNHUB_API_KEY=your_key_here

# NewsAPI
NEWS_API_KEY=your_key_here

# Claude API
ANTHROPIC_API_KEY=your_key_here

# MongoDB (if using local)
MONGO_URI=mongodb://localhost:27017/stock_analyzer

# Flask/FastAPI
FLASK_ENV=development
DEBUG=True
EOF

# Get API Keys:
# 1. Finnhub: https://finnhub.io (free tier: 60 calls/min)
# 2. NewsAPI: https://newsapi.org (free tier: 100 calls/day)
# 3. Claude API: https://console.anthropic.com (paid, ~$0.003/1K tokens)
# 4. MongoDB Atlas: https://www.mongodb.com/cloud/atlas (free tier: 512MB)
```

## Google Colab Setup (For GPU Training)

### Create Colab Notebook Structure
1. Go to https://colab.research.google.com
2. Create new notebook: `01_Sentiment_Training_Colab.ipynb`
3. First cell (setup):
```python
# Mount Google Drive
from google.colab import drive
drive.mount('/content/drive')

# Clone repo (if using GitHub)
!git clone https://github.com/yourusername/ai-stock-analyzer.git
%cd ai-stock-analyzer

# Install dependencies
!pip install -q transformers datasets torch scikit-learn pandas numpy

# Create data directories
!mkdir -p data/raw/sentiment data/processed models/sentiment
```

## Dataset Download Links

### Public Datasets to Download Automatically

1. **FinPhraseBank** (Sentiment)
   - Source: https://huggingface.co/datasets/oliverguhr/financial-phrase-bank
   - Size: 4,840 sentences
   - Format: CSV with text and sentiment labels

2. **SemEval-2017 Task 5 Finance** (Sentiment)
   - Source: https://alt.qcri.org/semeval2017/task5/
   - Size: ~1,000 tweets
   - Format: XML

3. **Fin-SoMe-v2** (Sentiment)
   - Source: https://github.com/mbutt/fin-some
   - Size: 1,600+ tweets
   - Format: CSV

4. **Candlestick Pattern Dataset** (Vision)
   - Source: Kaggle (need account)
   - Search: "candlestick pattern"
   - We'll generate synthetic ones

5. **Yahoo Finance Historical Data** (Fundamentals)
   - Source: API (yfinance library)
   - Covers: All public stocks

## Next Steps
1. Run `setup.sh` to automate installation
2. Follow Google Colab notebooks for training
3. Run backend API
4. Access frontend at http://localhost:5000
