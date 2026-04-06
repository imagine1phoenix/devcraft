import os
import yfinance as yf
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class StockRequest(BaseModel):
    ticker: str
    stock_data: str
    headlines: list[str]

def fetch_live_data(ticker: str) -> str:
    try:
        stock = yf.Ticker(ticker)
        data = stock.history(period="1d")
        if data.empty:
            return f"No recent market data found for {ticker}."
        
        current_price = data['Close'].iloc[-1]
        volume = data['Volume'].iloc[-1]
        info = stock.info
        
        high_52 = info.get('fiftyTwoWeekHigh', 'N/A')
        low_52 = info.get('fiftyTwoWeekLow', 'N/A')
        market_cap = info.get('marketCap', 'N/A')
        
        return f"""
LIVE MARKET DATA FOR {ticker}:
Current Price: ${current_price:.2f}
24h Volume: {volume:,}
52-Week High: ${high_52}
52-Week Low: ${low_52}
Market Cap: {market_cap}
        """
    except Exception as e:
        return f"Could not fetch live data for {ticker}. Error: {str(e)}"

def full_stockai_analysis(ticker: str, arg2: str, stock_data: str, headlines: list[str]) -> str:
    # First, gather actual live data from Yahoo Finance
    live_data = fetch_live_data(ticker)
    
    prompt = f"""
You are a highly intelligent financial analyst. The user has requested an analysis for the ticker {ticker}.
Here is the LIVE, real-time market data fetched right now:
{live_data}

Please write a comprehensive investment analysis that is highly specific to this live data. 
Do NOT hallucinate. Do not use generic filler phrases like "Market conditions suggest" unless you are specifying exactly why based on the numbers.
Provide a quick technical breakdown based on the current price relative to 52-week highs/lows.
Conclude with a final BUY, SELL, or HOLD rating and briefly explain why. Use beautiful markdown formatting.
"""

    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a professional financial AI analyst. Be analytical, reference the real-time numbers provided in the context, and format your response cleanly."
                },
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.3,
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        return f"Error communicating with AI: {str(e)}"

@app.post('/analyze')
def analyze(req: StockRequest):
    return full_stockai_analysis(req.ticker, '', req.stock_data, req.headlines)

@app.get('/health')
def health():
    return {"status": "ok"}
