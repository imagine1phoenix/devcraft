from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Add CORS so the React frontend (port 5173) can communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class StockRequest(BaseModel):
    ticker: str
    stock_data: str
    headlines: list[str]

# Mock implementation since we don't have the real one in this repository yet
def full_stockai_analysis(ticker: str, arg2: str, stock_data: str, headlines: list[str]) -> str:
    return f"AI Analysis for {ticker}: 🚀 Looking strong! Note: This is connected to your FastAPI backend, but you need to replace this mock response with your real `full_stockai_analysis` function."

@app.post('/analyze')
def analyze(req: StockRequest):
    # Calls your custom AI analysis logic
    return full_stockai_analysis(req.ticker, '', req.stock_data, req.headlines)

@app.get('/health')
def health():
    return {"status": "ok"}
