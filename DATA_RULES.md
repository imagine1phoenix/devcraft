# DATA_RULES.md — Data Sourcing, Caching & Freshness Rules

> This document defines exactly where data comes from, how it's cached, how stale data is handled, and what is strictly prohibited.

---

## 1. Approved Data Sources

### Tier 1 — Primary (Phase 1)

| Source | Data Type | Auth | Rate Limit (Free) | Cost (Paid) |
|---|---|---|---|---|
| **Alpha Vantage** | Stock quotes, fundamentals, technicals, news | API Key | 25 requests/day, 5 req/min | $49.99/mo (75 req/min) |
| **Finnhub** | Company news, earnings, SEC filings | API Key | 60 requests/min | $0 (free tier sufficient) |
| **SEC EDGAR** | 10-K, 10-Q, 8-K filings | None (public) | 10 requests/sec | Free |
| **Google Gemini API** | AI text/vision analysis | API Key | 15 RPM, 1500 RPD | Pay-per-use |
| **OpenAI API** (fallback) | AI text/vision analysis | API Key | Varies by plan | Pay-per-use |

### Tier 2 — Expansion (Phase 2+)

| Source | Data Type | Auth | Cost |
|---|---|---|---|
| **Polygon.io** | Real-time quotes, WebSocket, historical | API Key | $29/mo (Starter) – $199/mo (Business) |
| **NewsAPI.org** | General financial news | API Key | Free (dev), $449/mo (prod) |
| **Twitter/X API** | Social sentiment | OAuth 2.0 | $100/mo (Basic) – $5000/mo (Pro) |
| **HuggingFace Inference** | FinBERT sentiment model | API Token | Free (rate limited) or $0.06/hr (dedicated) |

### Tier 3 — Future Consideration

| Source | Data Type | Notes |
|---|---|---|
| **Yahoo Finance API** (unofficial) | Quotes, fundamentals | Unstable, may break. NOT recommended for production. |
| **IEX Cloud** | US stock data | Good quality, tiered pricing |
| **Quandl (Nasdaq Data Link)** | Alternative data | Premium datasets |
| **Bloomberg B-PIPE** | Professional data | Enterprise pricing only |

---

## 2. PROHIBITED Data Sources & Methods

The following are **strictly prohibited** and must NEVER be used:

### 2.1 No Web Scraping

| ❌ Prohibited | Why |
|---|---|
| Scraping CNBC.com | Copyright violation, ToS breach |
| Scraping Bloomberg.com | Copyright violation, ToS breach, potential legal action |
| Scraping India Today | Copyright violation, ToS breach |
| Scraping Reuters.com | Copyright violation, requires licensing |
| Scraping TradingView.com | ToS breach, data not licensed for redistribution |
| Scraping any financial website | Legal and ethical violations |

**The ONLY acceptable web data collection methods are:**
1. Official REST APIs with valid API keys
2. Public RSS/Atom feeds
3. Publicly available government data (SEC EDGAR, Federal Reserve FRED)
4. Properly licensed data feeds

### 2.2 No LLM-Generated Financial Data

| ❌ Prohibited | ✅ Required Instead |
|---|---|
| "NVIDIA's revenue was approximately $60B" (from LLM memory) | Fetch from Alpha Vantage `INCOME_STATEMENT` endpoint |
| "The stock is currently trading around $900" (from LLM estimate) | Fetch from `GLOBAL_QUOTE` endpoint |
| "EPS is expected to be $5.50" (from LLM training data) | Fetch from `EARNINGS` endpoint |
| "The P/E ratio is typically around 30" (from general knowledge) | Calculate from fetched price / fetched EPS |

**Rule:** If the data API is down or returns an error, display "Data unavailable" — NEVER substitute with LLM-generated numbers.

### 2.3 No Unauthorized Redistribution

- We CANNOT redistribute raw data feeds from Alpha Vantage, Polygon, etc. to third parties
- We CAN display derived analysis (our scoring, our AI summaries) that references the data
- All data displayed must include source attribution

---

## 3. API Client Implementation Rules

### 3.1 Base Client Pattern

Every external API client must follow this pattern:

```typescript
// src/lib/data/[provider].ts

import { z } from "zod";

// 1. Define response schema for validation
const QuoteResponseSchema = z.object({
  symbol: z.string(),
  price: z.number(),
  change: z.number(),
  changePercent: z.number(),
  volume: z.number(),
  latestTradingDay: z.string(),
});

type QuoteResponse = z.infer<typeof QuoteResponseSchema>;

// 2. API client class with error handling
class AlphaVantageClient {
  private baseUrl = "https://www.alphavantage.co/query";
  private apiKey: string;

  constructor() {
    const key = process.env.ALPHA_VANTAGE_API_KEY;
    if (!key) throw new Error("ALPHA_VANTAGE_API_KEY is not set");
    this.apiKey = key;
  }

  async getQuote(ticker: string): Promise<{
    data: QuoteResponse | null;
    error: string | null;
    source: string;
    retrievedAt: string;
  }> {
    const retrievedAt = new Date().toISOString();

    try {
      const res = await fetch(
        `${this.baseUrl}?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${this.apiKey}`
      );

      if (!res.ok) {
        return { data: null, error: `HTTP ${res.status}`, source: "Alpha Vantage", retrievedAt };
      }

      const raw = await res.json();

      // Alpha Vantage returns rate limit messages in JSON body
      if (raw["Note"] || raw["Information"]) {
        return { data: null, error: "Rate limited", source: "Alpha Vantage", retrievedAt };
      }

      // 3. Validate with Zod BEFORE using
      const parsed = QuoteResponseSchema.safeParse(transformRawQuote(raw));

      if (!parsed.success) {
        return { data: null, error: "Invalid response format", source: "Alpha Vantage", retrievedAt };
      }

      return { data: parsed.data, error: null, source: "Alpha Vantage", retrievedAt };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : "Unknown error",
        source: "Alpha Vantage",
        retrievedAt,
      };
    }
  }
}
```

### 3.2 Key Requirements for ALL API Clients

1. **Zod validation on ALL API responses** — never trust external data shapes
2. **Always return `source` and `retrievedAt` metadata** — for data attribution
3. **Handle rate limiting gracefully** — detect limit responses, return clean error
4. **Timeout all requests** — maximum 10 seconds, configurable
5. **Never throw exceptions to the caller** — return `{ data, error }` pattern
6. **Log all API errors server-side** with timestamp, endpoint, and status code
7. **Never log API keys or sensitive data** in error messages

---

## 4. Caching Strategy

### 4.1 Cache Implementation

Use Upstash Redis for all data caching.

```typescript
// src/lib/data/cache.ts

interface CachedData<T> {
  data: T;
  source: string;
  cachedAt: string;    // When we cached it
  retrievedAt: string; // When it was fetched from source
  expiresAt: string;   // When cache expires
}

// Cache-aside pattern
async function getWithCache<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<{ data: T | null; error: string | null; source: string; retrievedAt: string }>
): Promise<CachedData<T> | null> {
  // 1. Check cache first
  const cached = await redis.get<CachedData<T>>(key);
  if (cached) return cached;

  // 2. Fetch from source
  const result = await fetcher();
  if (!result.data) return null;

  // 3. Cache the result
  const cachedData: CachedData<T> = {
    data: result.data,
    source: result.source,
    cachedAt: new Date().toISOString(),
    retrievedAt: result.retrievedAt,
    expiresAt: new Date(Date.now() + ttlSeconds * 1000).toISOString(),
  };

  await redis.setex(key, ttlSeconds, cachedData);
  return cachedData;
}
```

### 4.2 TTL (Time-to-Live) Rules

| Data Type | Cache Key Pattern | TTL | Rationale |
|---|---|---|---|
| **Stock Quote (delayed)** | `quote:{ticker}` | 15 minutes | Matches data delay |
| **Company Overview** | `overview:{ticker}` | 24 hours | Rarely changes |
| **Income Statement** | `income:{ticker}` | 24 hours | Quarterly updates |
| **Balance Sheet** | `balance:{ticker}` | 24 hours | Quarterly updates |
| **Cash Flow Statement** | `cashflow:{ticker}` | 24 hours | Quarterly updates |
| **Technical Indicators** | `technical:{ticker}:{indicator}` | 15 minutes | Matches quote delay |
| **News Articles** | `news:{ticker}` | 1 hour | Fresh news matters |
| **Sentiment Scores** | `sentiment:{ticker}` | 1 hour | Derived from news |
| **Sector Medians** | `sector:{sectorName}` | 7 days | Updated quarterly |
| **AI Chat Responses** | NOT CACHED | N/A | Always regenerate |
| **AI Signal Scores** | `signal:{ticker}` | 15 minutes | Depends on inputs |
| **Search/Autocomplete** | `search:{query}` | 24 hours | Ticker list is stable |

### 4.3 Cache Invalidation

- Cache entries expire naturally by TTL
- Manual invalidation via admin API (not exposed to users)
- On API error, serve stale cached data with a warning banner: "Using cached data from [time]. Live data temporarily unavailable."
- NEVER silently serve stale data without indicating its age

---

## 5. Data Freshness Display Rules

### 5.1 UI Requirements

Every component that displays financial data MUST show freshness metadata:

```
✅ Required:
"NVDA $892.45  |  Source: Alpha Vantage  |  As of: Apr 6, 2026 4:00 PM ET  |  Updated 3 min ago"

❌ NOT acceptable:
"NVDA $892.45"  (no source, no timestamp)
```

### 5.2 Freshness Status Indicators

| Status | Condition | UI Treatment |
|---|---|---|
| 🟢 **Fresh** | Data is within TTL and < 30 min old | Normal display |
| 🟡 **Stale** | Data has expired TTL but < 24 hours old | Yellow warning: "Data may be outdated" |
| 🔴 **Unavailable** | API error and no cached data | Red banner: "Unable to load data. Please try again." |
| ⚪ **Cached** | Serving from cache while refreshing | Subtle indicator: "Updating..." |

### 5.3 Market Hours Context

Display market status alongside data:

| Market State | Display |
|---|---|
| **Pre-market** (4:00 AM – 9:30 AM ET) | "Pre-Market — Data shows previous close" |
| **Market Open** (9:30 AM – 4:00 PM ET) | "Market Open — Prices delayed 15 min" (or "Real-time" in Phase 2) |
| **After Hours** (4:00 PM – 8:00 PM ET) | "After Hours — Data shows closing price" |
| **Market Closed** (weekends/holidays) | "Market Closed — Data as of [last trading day]" |

---

## 6. Ticker Validation Rules

### 6.1 Format Validation

```typescript
// src/lib/validators/stock.ts
import { z } from "zod";

export const TickerSchema = z
  .string()
  .min(1, "Ticker is required")
  .max(5, "Ticker must be 1–5 characters")
  .regex(/^[A-Z]{1,5}$/, "Ticker must be 1–5 uppercase letters")
  .transform(val => val.toUpperCase());

// Extended for future multi-market support
export const TickerWithExchangeSchema = z.object({
  ticker: TickerSchema,
  exchange: z.enum(["NYSE", "NASDAQ", "NSE", "BSE"]).optional().default("NYSE"),
});
```

### 6.2 Known Ticker Validation

Before making any API call:
1. Validate format with Zod schema
2. (Optional) Check against a local ticker list for fast rejection of invalid tickers
3. If the API returns "no data found", cache that result for 1 hour to avoid repeated calls

### 6.3 Invalid Ticker Response

```json
{
  "success": false,
  "error": {
    "code": "INVALID_TICKER",
    "message": "No data found for ticker 'ABCXYZ'. Please check the symbol and try again."
  }
}
```

---

## 7. Data Transformation Rules

### 7.1 Numeric Formatting

| Data Type | Format | Example |
|---|---|---|
| **Stock Price** | 2 decimal places, $ prefix | `$892.45` |
| **Market Cap** | Abbreviated with suffix | `$2.24T`, `$543.2B`, `$12.5M` |
| **Revenue / Earnings** | Abbreviated with suffix | `$60.9B`, `$14.2B` |
| **Percentage** | 2 decimal places, % suffix | `+12.45%`, `-3.21%` |
| **Ratio (P/E, P/B)** | 1 decimal place, x suffix | `35.2x`, `8.1x` |
| **Volume** | Abbreviated with suffix | `45.2M`, `1.2B` |
| **EPS** | 2 decimal places, $ prefix | `$5.52`, `-$0.23` |

### 7.2 Color Coding

| Value | Color | Symbol |
|---|---|---|
| Positive change | `#22c55e` (green) | ▲ |
| Negative change | `#ef4444` (red) | ▼ |
| Zero / unchanged | `#9ca3af` (gray) | — |

### 7.3 Null/Missing Data

```
Display: "—" (em dash)
Tooltip: "Data not available from [source]"
Never display: "0", "null", "undefined", "N/A" (use "—" consistently)
```

---

## 8. Error Handling Matrix

| Scenario | HTTP Status | User Message | Fallback |
|---|---|---|---|
| API key missing | 500 | "Service configuration error" | Log error, alert ops |
| API rate limited | 429 | "Too many requests. Please wait and try again." | Serve cached if available |
| API timeout (>10s) | 504 | "Data source is slow to respond. Retrying..." | Auto-retry once, then cache fallback |
| Invalid API response | 502 | "Received unexpected data format" | Log raw response, serve cached |
| Ticker not found | 404 | "Stock symbol not found" | Suggest similar tickers |
| Network error | 503 | "Unable to connect to data source" | Serve cached with stale warning |
| User not authenticated | 401 | "Please sign in to continue" | Redirect to login |
| User rate limited | 429 | "You've reached your daily limit. Upgrade for more." | Show upgrade CTA |

---

## 9. Data Privacy Rules

### 9.1 What We Store

| Data | Storage | Encryption | Retention |
|---|---|---|---|
| User account info | PostgreSQL | At rest (Neon default) | Until account deletion |
| User portfolio | PostgreSQL | At rest | Until account deletion |
| Chat history | PostgreSQL | At rest | 90 days, then auto-delete |
| Uploaded chart images | Blob storage | At rest | 24 hours, then auto-delete |
| API response cache | Redis | In transit (TLS) | Per TTL (max 7 days) |
| Usage analytics | PostgreSQL | At rest | 12 months |

### 9.2 What We NEVER Store

- ❌ Brokerage credentials or tokens
- ❌ Real names or addresses (unless user provides voluntarily)
- ❌ Social Security / Aadhaar / PAN numbers
- ❌ Raw API keys in any user-accessible storage
- ❌ Third-party financial data beyond cache TTL (license compliance)

### 9.3 Data Deletion

- Users can delete their account and all associated data via settings
- Deletion is permanent and irreversible
- Cached data expires naturally and is not tied to user identity
