# MarketMind AI — Intelligent Stock Market Analyzer

> An AI-powered stock market analysis platform designed as an affordable, intelligent alternative to professional terminals. Built for retail investors and modern traders.

---

## Table of Contents

- [Vision](#vision)
- [Platform Overview](#platform-overview)
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Data Sources & APIs](#data-sources--apis)
- [AI Models & Usage](#ai-models--usage)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Phased Roadmap](#phased-roadmap)
- [Legal & Compliance](#legal--compliance)
- [Contributing](#contributing)
- [License](#license)

---

## Vision

MarketMind AI unifies **technical analysis, fundamental evaluation, real-time news, and social sentiment** into one seamless AI-powered interface. The goal is to take users from raw data to intelligent decisions instantly — at a fraction of the cost of professional terminals.

**This is NOT a licensed financial advisory service.** All outputs are educational and informational. See [Legal & Compliance](#legal--compliance).

---

## Platform Overview

MarketMind AI is a **Next.js 14+ full-stack web application** with the following high-level modules:

| Module | Description |
|---|---|
| **AI Chat Interface** | Natural language queries about stocks, markets, and financial concepts |
| **Chart Vision Analyzer** | Upload stock chart images → receive AI-powered technical analysis |
| **Fundamental Dashboard** | Financial metrics, ratios, earnings, and balance sheet data |
| **Market Data Dashboard** | Live/delayed price data, watchlists, and interactive charts |
| **News & Sentiment Engine** | Aggregated news with AI-interpreted sentiment scoring |
| **Portfolio Tracker** | Manual portfolio entry with performance tracking |
| **AI Research Reports** | Auto-generated PDF summaries of stock analysis |

---

## Core Features

### 1. AI Chat Interface
- **Input:** Natural language text queries (e.g., "Analyze NVIDIA's growth prospects")
- **Output:** Structured analysis with cited data sources
- **AI Backend:** FastAPI service running `full_stockai_analysis()` — receives ticker, stock data, and headlines
- **Data Flow:** Next.js fetches financial data from APIs → sends it to FastAPI → FastAPI runs AI analysis → returns insights
- **Grounding:** All responses MUST be grounded via real financial data passed to the AI backend. The LLM must NEVER generate financial numbers from its training data alone.
- **Citation:** Every numerical claim must include the data source and retrieval timestamp

### 2. Chart Vision Analyzer
- **Input:** User-uploaded image of a stock chart (PNG, JPG, WebP — max 10MB)
- **Output:** Technical pattern identification, trend direction, support/resistance levels, momentum indicators
- **Model:** Google Gemini 2.0 Flash (vision) or OpenAI GPT-4o (vision)
- **Constraints:**
  - The AI must state what patterns it observes, not what it "believes"
  - Confidence levels must be expressed as ranges (e.g., "60–75%"), never as exact percentages
  - The AI must explicitly state limitations (e.g., "This chart does not show volume data, limiting momentum analysis")
  - Output must always include the disclaimer: "This is pattern recognition, not a prediction of future price movement"

### 3. Fundamental Analysis Dashboard
- **Data Source:** Alpha Vantage API (free tier: 25 requests/day) → Polygon.io (paid tier)
- **Metrics Displayed:**
  - Revenue & Revenue Growth (TTM and YoY)
  - EPS (Diluted) & EPS Growth
  - P/E Ratio, Forward P/E, PEG Ratio
  - P/S Ratio, P/B Ratio, EV/EBITDA
  - Debt-to-Equity, Current Ratio, Quick Ratio
  - Free Cash Flow, Operating Margin, Net Margin
  - ROE, ROA, ROIC
  - Dividend Yield & Payout Ratio
  - Institutional Ownership Percentage
  - Short Interest Ratio
- **AI Summary:** The LLM generates a plain-English summary of the above metrics. It must ONLY reference data fetched from the API, never hallucinated numbers.
- **Signal Generation:** Buy / Hold / Sell signals are derived from a **rules-based scoring system** (see `ANALYSIS_RULES.md`), NOT from LLM opinion.

### 4. Market Data Dashboard
- **Phase 1:** 15-minute delayed data via Alpha Vantage free API
- **Phase 2:** Real-time data via Polygon.io WebSocket (paid plan, $29/mo+)
- **Charting Library:** TradingView Lightweight Charts v4 (open-source, MIT license)
- **Supported Markets (Phase 1):** US Equities (NYSE, NASDAQ)
- **Supported Markets (Phase 2+):** Indian Equities (NSE/BSE), Crypto, Forex, Commodities
- **Features:** Candlestick charts, line charts, volume bars, moving averages (SMA 20/50/200, EMA 12/26), RSI, MACD, Bollinger Bands

### 5. News & Sentiment Engine
- **Sources (Phase 1 — RSS/API only, NO scraping):**
  - NewsAPI.org (free: 100 requests/day, $449/mo for production)
  - Alpha Vantage News Sentiment endpoint
  - Finnhub News API (free tier available)
  - RSS feeds from public financial news sources
- **Sources (Phase 2 — with proper licensing):**
  - Licensed feeds from major financial news providers
  - SEC EDGAR filings (public, free)
  - Social sentiment from Twitter/X API (paid tier)
- **Sentiment Scoring:** Each article receives a sentiment score from -1.0 (very bearish) to +1.0 (very bullish) using:
  - FinBERT model (open-source, HuggingFace) for classification
  - LLM-based summarization for context extraction
- **IMPORTANT:** We do NOT scrape websites. We use official APIs and RSS feeds only. See `DATA_RULES.md`.

### 6. Portfolio Tracker
- **Input Method:** Manual entry only (ticker, quantity, buy price, buy date)
- **NO brokerage API integration** in Phase 1 (liability and security concerns)
- **Features:** Total P&L, daily change, allocation pie chart, sector breakdown
- **Data Storage:** PostgreSQL (user's portfolio data is encrypted at rest)

### 7. AI Research Reports
- **Trigger:** User requests a full analysis report for a specific stock
- **Content:** Combines technical analysis, fundamental data, news sentiment, and peer comparison
- **Format:** On-screen display with PDF export option
- **Constraints:** Report header must include generation timestamp and data freshness timestamps for each section
- **Rate Limit:** Free tier: 2 reports/day, Pro tier: 20 reports/day

---

## Tech Stack

### Frontend + API Gateway (Next.js)

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Framework** | Next.js (App Router) | 14.x+ | Full-stack React framework with SSR |
| **Language** | TypeScript | 5.x | Type safety across the codebase |
| **Styling** | Tailwind CSS | 4.x | Utility-first CSS framework |
| **UI Components** | shadcn/ui | latest | Accessible, customizable component library |
| **Charts** | TradingView Lightweight Charts | 4.x | Financial charting library |
| **AI Streaming** | Vercel AI SDK | 4.x | Stream AI responses to the UI |
| **Database** | PostgreSQL (Neon) | 16.x | Serverless Postgres |
| **ORM** | Drizzle ORM | latest | Type-safe SQL queries |
| **Authentication** | NextAuth.js (Auth.js) | 5.x | OAuth + credentials auth |
| **Data API (Free)** | Alpha Vantage | — | Stock data, fundamentals, news |
| **Data API (Paid)** | Polygon.io | — | Real-time data, WebSocket |
| **News API** | NewsAPI.org / Finnhub | — | Financial news aggregation |
| **Hosting** | Vercel | — | Frontend + API routes |
| **Rate Limiting** | Upstash Redis | — | API rate limiting |
| **File Storage** | Vercel Blob / Cloudflare R2 | — | Chart image uploads |
| **PDF Generation** | @react-pdf/renderer | — | Research report export |
| **Validation** | Zod | 3.x | Runtime type validation |

### AI Backend (FastAPI)

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Framework** | FastAPI | latest | High-performance async Python API |
| **Language** | Python | 3.11+ | AI/ML ecosystem |
| **Validation** | Pydantic | 2.x | Request/response validation |
| **AI Analysis** | `full_stockai_analysis()` | — | Core AI analysis engine (stock data + headlines → insights) |
| **LLM Provider** | Configurable (Gemini / OpenAI) | — | Underlying LLM used by the analysis engine |
| **Sentiment Model** | FinBERT (HuggingFace) | — | Financial sentiment classification |
| **Hosting** | Railway / Modal / AWS Lambda | — | Python runtime for AI backend |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Client (Browser)                    │
│  Next.js App Router │ React │ TailwindCSS │ shadcn/ui   │
│  TradingView Lightweight Charts │ Vercel AI SDK (UI)    │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTPS
┌──────────────────────────▼──────────────────────────────┐
│                   Next.js API Routes                     │
│  /api/chat      → Proxies to FastAPI AI Backend         │
│  /api/analyze   → Proxies to FastAPI AI Backend         │
│  /api/stock     → Stock Data Proxy (Alpha Vantage)      │
│  /api/news      → News aggregation (NewsAPI + Finnhub)  │
│  /api/portfolio → Portfolio CRUD (Drizzle + Neon)       │
│  /api/report    → Proxies to FastAPI AI Backend         │
│  /api/auth      → Authentication (NextAuth.js v5)       │
└───────┬──────────┬──────────┬──────────┬────────────────┘
        │          │          │          │
   ┌────▼────────────┐ ┌───▼────┐ ┌──▼───┐ ┌───▼─────┐
   │  FastAPI (AI)   │ │ Alpha  │ │ Neon │ │ Upstash │
   │  /analyze       │ │Vantage │ │ PG   │ │ Redis   │
   │  full_stockai_  │ └────────┘ └──────┘ └─────────┘
   │  analysis()     │
   │  ┌────────────┐ │
   │  │ LLM (Gemini│ │
   │  │ / OpenAI)  │ │
   │  └────────────┘ │
   └─────────────────┘
```

### Data Flow: AI Analysis Request

```
1. User types query in chat UI (e.g., "Analyze NVIDIA")
2. Next.js /api/chat receives the request
3. Next.js fetches stock_data from Alpha Vantage + headlines from news APIs
4. Next.js POST to FastAPI /analyze with:
   {
     "ticker": "NVDA",
     "stock_data": "<serialized financial data>",
     "headlines": ["NVIDIA beats earnings...", ...]
   }
5. FastAPI runs full_stockai_analysis() → returns AI analysis
6. Next.js streams the response back to the browser
```

---

## Data Sources & APIs

### Financial Data

| API | Endpoint | Rate Limit (Free) | Data Type |
|---|---|---|---|
| **Alpha Vantage** | `TIME_SERIES_DAILY` | 25 req/day | Daily OHLCV |
| **Alpha Vantage** | `OVERVIEW` | 25 req/day | Company fundamentals |
| **Alpha Vantage** | `INCOME_STATEMENT` | 25 req/day | Annual/Quarterly income |
| **Alpha Vantage** | `BALANCE_SHEET` | 25 req/day | Balance sheet data |
| **Alpha Vantage** | `CASH_FLOW` | 25 req/day | Cash flow data |
| **Alpha Vantage** | `NEWS_SENTIMENT` | 25 req/day | News with sentiment |
| **Alpha Vantage** | `GLOBAL_QUOTE` | 25 req/day | Latest quote |
| **Polygon.io** (Phase 2) | WebSocket | Varies by plan | Real-time prices |

### News & Sentiment

| Source | Method | Cost | Notes |
|---|---|---|---|
| **Alpha Vantage News** | REST API | Included in free tier | Pre-scored sentiment |
| **Finnhub** | REST API | Free tier: 60 req/min | Company news, filings |
| **NewsAPI.org** | REST API | Free: 100 req/day | General financial news |
| **SEC EDGAR** | REST API | Free, public | SEC filings (10-K, 10-Q, 8-K) |

### PROHIBITED Data Sources
- ❌ No web scraping of any website (CNBC, India Today, Bloomberg, etc.)
- ❌ No unauthorized use of Twitter/X data without API access
- ❌ No use of copyrighted research reports without licensing
- ❌ No data from paid terminal APIs without proper subscription

---

## AI Models & Usage

### Gemini 2.0 Flash (Primary)

```
Use cases:
  - Text chat (stock analysis queries)
  - Chart image analysis (vision input)
  - News summarization
  - Research report generation

Rate limits (free tier):
  - 15 RPM (requests per minute)
  - 1M TPM (tokens per minute)
  - 1,500 RPD (requests per day)

Pricing (paid — pay-as-you-go):
  - Input: $0.10 per 1M tokens (text), $0.10 per 1M tokens (image)
  - Output: $0.40 per 1M tokens
```

### OpenAI GPT-4o (Fallback)

```
Use cases:
  - Fallback when Gemini is unavailable or rate-limited
  - Complex multi-step reasoning tasks

Pricing:
  - Input: $2.50 per 1M tokens
  - Output: $10.00 per 1M tokens
  - Image input: $3.613 per 1M tokens
```

### FinBERT (Self-hosted or HuggingFace Inference)

```
Use cases:
  - Financial sentiment classification of news headlines
  - Returns: positive / negative / neutral with confidence score

Deployment options:
  - HuggingFace Inference API (free tier: rate limited)
  - Self-hosted on Hugging Face Spaces or Modal
```

### AI Anti-Hallucination Rules

1. **NEVER generate financial numbers** (prices, revenue, EPS, etc.) from the LLM's training data. ALL numbers must come from API responses.
2. **ALWAYS include data freshness timestamps** — when was this data last fetched?
3. **ALWAYS include source attribution** — "Source: Alpha Vantage, fetched at 2026-04-06T10:00:00Z"
4. **NEVER predict future stock prices.** Use phrasing like "Based on current trends..." not "The stock will..."
5. **NEVER claim certainty.** Use confidence ranges: "60–75% confidence" not "90% confidence"
6. **ALWAYS state limitations** — missing data, limited timeframe, single-source analysis
7. **Signal generation is rules-based, NOT LLM-generated.** The LLM explains the signal; it does not decide it.
8. **If API data is unavailable, say so.** Never fill gaps with guesses.

---

## Project Structure

```
devcraft/
├── README.md                    # This file
├── CLAUDE.md                    # AI assistant development rules
├── ANALYSIS_RULES.md            # Rules-based signal generation logic
├── DATA_RULES.md                # Data sourcing, caching, and freshness rules
├── .env.example                 # Required environment variables
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── drizzle.config.ts
│
├── src/
│   ├── app/                     # Next.js App Router pages
│   │   ├── layout.tsx           # Root layout with providers
│   │   ├── page.tsx             # Landing / Home page
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx       # Dashboard layout with sidebar
│   │   │   ├── chat/page.tsx    # AI Chat Interface
│   │   │   ├── analyze/page.tsx # Chart Vision Analyzer
│   │   │   ├── market/page.tsx  # Market Data Dashboard
│   │   │   ├── stock/
│   │   │   │   └── [ticker]/page.tsx  # Individual stock page
│   │   │   ├── news/page.tsx    # News & Sentiment
│   │   │   ├── portfolio/page.tsx # Portfolio Tracker
│   │   │   └── reports/page.tsx # AI Research Reports
│   │   └── api/
│   │       ├── chat/route.ts    # AI Chat endpoint
│   │       ├── analyze/route.ts # Chart analysis endpoint
│   │       ├── stock/
│   │       │   ├── quote/route.ts
│   │       │   ├── fundamentals/route.ts
│   │       │   └── historical/route.ts
│   │       ├── news/route.ts    # News + sentiment
│   │       ├── portfolio/route.ts
│   │       ├── report/route.ts
│   │       └── auth/[...nextauth]/route.ts
│   │
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── chat/                # Chat interface components
│   │   ├── charts/              # Chart wrapper components
│   │   ├── dashboard/           # Dashboard layout components
│   │   ├── analysis/            # Analysis display components
│   │   ├── news/                # News feed components
│   │   └── portfolio/           # Portfolio components
│   │
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── providers.ts     # LLM provider configuration
│   │   │   ├── prompts/         # System prompts (version controlled)
│   │   │   │   ├── chat-system.ts
│   │   │   │   ├── chart-analysis.ts
│   │   │   │   ├── fundamental-summary.ts
│   │   │   │   ├── news-sentiment.ts
│   │   │   │   └── report-generation.ts
│   │   │   ├── tools/           # AI function tools
│   │   │   │   ├── stock-lookup.ts
│   │   │   │   ├── fundamental-data.ts
│   │   │   │   └── news-search.ts
│   │   │   └── scoring.ts       # Rules-based signal scoring
│   │   │
│   │   ├── data/
│   │   │   ├── alpha-vantage.ts # Alpha Vantage API client
│   │   │   ├── polygon.ts       # Polygon.io API client
│   │   │   ├── news-api.ts      # NewsAPI client
│   │   │   ├── finnhub.ts       # Finnhub API client
│   │   │   └── cache.ts         # Data caching layer (Redis)
│   │   │
│   │   ├── db/
│   │   │   ├── schema.ts        # Drizzle schema definitions
│   │   │   ├── migrations/      # Database migrations
│   │   │   └── index.ts         # Database connection
│   │   │
│   │   ├── auth/
│   │   │   └── config.ts        # NextAuth.js configuration
│   │   │
│   │   ├── validators/
│   │   │   ├── stock.ts         # Stock ticker validation (Zod)
│   │   │   ├── portfolio.ts     # Portfolio input validation
│   │   │   └── upload.ts        # File upload validation
│   │   │
│   │   └── utils/
│   │       ├── format.ts        # Number/date formatting
│   │       ├── constants.ts     # App-wide constants
│   │       └── rate-limit.ts    # Rate limiting utilities
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── use-stock-data.ts
│   │   ├── use-chat.ts
│   │   └── use-portfolio.ts
│   │
│   ├── types/                   # TypeScript type definitions
│   │   ├── stock.ts
│   │   ├── analysis.ts
│   │   ├── news.ts
│   │   └── portfolio.ts
│   │
│   └── styles/
│       └── globals.css          # Global styles + Tailwind directives
│
├── public/
│   ├── icons/
│   └── images/
│
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

---

## Environment Variables

```bash
# See .env.example for all required variables

# === Authentication ===
AUTH_SECRET=                    # NextAuth.js secret (generate with: openssl rand -hex 32)
AUTH_GOOGLE_ID=                 # Google OAuth client ID
AUTH_GOOGLE_SECRET=             # Google OAuth client secret

# === Database ===
DATABASE_URL=                   # Neon PostgreSQL connection string

# === AI Providers ===
GOOGLE_GENERATIVE_AI_API_KEY=   # Gemini API key (from Google AI Studio)
OPENAI_API_KEY=                 # OpenAI API key (fallback provider)

# === Financial Data APIs ===
ALPHA_VANTAGE_API_KEY=          # Alpha Vantage API key (free at alphavantage.co)
POLYGON_API_KEY=                # Polygon.io API key (Phase 2, paid)
FINNHUB_API_KEY=                # Finnhub API key (free tier available)
NEWS_API_KEY=                   # NewsAPI.org API key (free: 100 req/day)

# === Caching / Rate Limiting ===
UPSTASH_REDIS_REST_URL=         # Upstash Redis URL
UPSTASH_REDIS_REST_TOKEN=       # Upstash Redis token

# === File Storage ===
BLOB_READ_WRITE_TOKEN=          # Vercel Blob token (for chart uploads)
```

---

## Getting Started

### Prerequisites

- Node.js 20.x or later
- pnpm 9.x (preferred) or npm
- A Neon PostgreSQL database (free tier: https://neon.tech)
- API keys for: Gemini, Alpha Vantage (minimum)

### Installation

```bash
# Clone the repository
git clone <repo-url> devcraft
cd devcraft

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local
# Fill in all required API keys in .env.local

# Push database schema
pnpm db:push

# Start development server
pnpm dev
```

### Available Scripts

```bash
pnpm dev          # Start development server (localhost:3000)
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # Run TypeScript compiler check
pnpm db:push      # Push schema changes to database
pnpm db:studio    # Open Drizzle Studio (database GUI)
pnpm db:generate  # Generate migration files
pnpm db:migrate   # Run pending migrations
pnpm test         # Run unit tests
pnpm test:e2e     # Run end-to-end tests
```

---

## Phased Roadmap

### Phase 1 — MVP (Current)
- [ ] Project setup (Next.js, Tailwind, shadcn/ui)
- [ ] Authentication (NextAuth.js v5)
- [ ] AI Chat Interface with Gemini
- [ ] Chart Image Upload + Vision Analysis
- [ ] Basic fundamental data dashboard (Alpha Vantage)
- [ ] Stock quote display with Lightweight Charts
- [ ] Legal disclaimers on all pages

### Phase 2 — Growth
- [ ] News & Sentiment Engine (NewsAPI + FinBERT)
- [ ] Portfolio Tracker (manual entry)
- [ ] Watchlists & Price Alerts
- [ ] Mobile-responsive PWA
- [ ] User preferences & saved analyses

### Phase 3 — Monetization
- [ ] Real-time data (Polygon.io WebSocket)
- [ ] AI Research Reports with PDF export
- [ ] Pro/Premium subscription tiers (Stripe)
- [ ] API access for developers
- [ ] Advanced technical indicators

### Phase 4 — Scale
- [ ] Multi-market support (India NSE/BSE, Crypto, Forex)
- [ ] Social features (share analyses, community)
- [ ] Backtesting AI signals
- [ ] Custom AI models per user preference
- [ ] Mobile app (React Native)

---

## Legal & Compliance

### Disclaimer (MUST appear on every page with analysis)

> **Disclaimer:** MarketMind AI is an educational and informational tool. It does NOT provide financial, investment, or trading advice. All analysis, signals, and reports generated by this platform are for informational purposes only and should not be construed as a recommendation to buy, sell, or hold any security. Past performance does not guarantee future results. Always conduct your own research and consult a licensed financial advisor before making investment decisions. The creators and operators of MarketMind AI are not responsible for any financial losses incurred based on information provided by this platform.

### Regulatory Notes

- This platform is NOT registered with the SEC, FINRA, SEBI, or any financial regulatory body
- Buy/Hold/Sell signals are generated by rules-based algorithms, not human advisors
- No personalized investment advice is provided
- User portfolio data is stored encrypted and never shared with third parties
- We comply with GDPR and applicable data privacy laws

---

## Contributing

See `CONTRIBUTING.md` for guidelines.

---

## License

This project is proprietary. All rights reserved.
