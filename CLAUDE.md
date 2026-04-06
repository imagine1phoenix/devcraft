# CLAUDE.md — Development Rules for MarketMind AI

> This file defines the rules, patterns, and constraints that any AI assistant (or developer) must follow when working on this codebase. Adherence to these rules is MANDATORY.

---

## 1. Project Identity

- **Name:** MarketMind AI
- **Type:** Full-stack Next.js 14+ web application (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 + shadcn/ui components
- **Database:** PostgreSQL via Neon (serverless) with Drizzle ORM
- **AI SDK:** Vercel AI SDK v4 with Google Gemini 2.0 Flash (primary) and OpenAI GPT-4o (fallback)

---

## 2. Critical Rules — Financial Data Integrity

These rules are NON-NEGOTIABLE. Violations can result in legal and reputational damage.

### 2.1 NEVER Hallucinate Financial Data
- ALL financial numbers (stock prices, revenue, EPS, ratios, etc.) MUST come from API responses (Alpha Vantage, Polygon.io, Finnhub)
- The LLM must NEVER generate, estimate, or recall financial figures from its training data
- If an API call fails or returns no data, display: `"Data unavailable — unable to retrieve from [source name]"`. Do NOT fill the gap with approximations.

### 2.2 ALWAYS Include Data Attribution
Every piece of financial data displayed to the user must include:
```
Source: [API Name]
Retrieved: [ISO 8601 timestamp]
Data as of: [Market close date or real-time timestamp]
```

### 2.3 NEVER Predict Future Prices
- ❌ "NVIDIA will reach $200 by Q3"
- ❌ "This stock is going to crash"
- ✅ "Based on the current P/E ratio of 35.2x (above sector median of 28.1x), the valuation appears elevated relative to peers"
- ✅ "The 50-day SMA has crossed below the 200-day SMA, which historically indicates a bearish trend"

### 2.4 NEVER Provide Financial Advice
- ❌ "You should buy this stock"
- ❌ "I recommend selling your position"
- ✅ "The rules-based scoring model assigns this stock a score of 72/100, categorized as 'Moderately Bullish'"
- The system must ALWAYS include the disclaimer specified in README.md on every analysis page

### 2.5 Signal Generation is Rules-Based
- Buy/Hold/Sell signals are computed by the scoring algorithm in `src/lib/ai/scoring.ts`
- The algorithm uses weighted criteria defined in `ANALYSIS_RULES.md`
- The LLM explains the signal in natural language but does NOT generate the signal
- Signal confidence is expressed as a range (e.g., "60–75%"), never a single number

---

## 3. Code Standards

### 3.1 TypeScript
- **Strict mode is required** — `tsconfig.json` must have `"strict": true`
- NO use of `any` type. Use `unknown` and narrow with type guards.
- All API responses must be validated with Zod schemas before use
- All function parameters and return types must be explicitly typed
- Use `interface` for object shapes, `type` for unions/intersections

### 3.2 File Naming
- React components: `PascalCase.tsx` (e.g., `StockChart.tsx`)
- Utilities/libs: `kebab-case.ts` (e.g., `alpha-vantage.ts`)
- Types: `kebab-case.ts` in `src/types/` directory
- API routes: `route.ts` (Next.js convention)
- Test files: `*.test.ts` or `*.test.tsx` colocated with source OR in `tests/`

### 3.3 Imports
- Use path aliases: `@/` maps to `src/`
- Order: (1) React/Next.js, (2) External packages, (3) Internal modules, (4) Types, (5) Styles
- NO circular imports — enforce with ESLint rule

### 3.4 Components
- Use functional components with React hooks
- Colocate component-specific types in the same file
- Use `"use client"` directive ONLY when the component needs browser APIs, event handlers, or React hooks (useState, useEffect, etc.)
- Default to Server Components — they are the default in Next.js App Router
- ALL interactive elements must have unique `id` attributes for testing
- ALL images must have `alt` text

### 3.5 Error Handling
- API routes must return structured error responses:
```typescript
// Success
{ success: true, data: T }

// Error
{ success: false, error: { code: string, message: string } }
```
- Use try/catch in all API routes and async functions
- Log errors server-side with context (timestamp, route, user ID if available)
- NEVER expose internal error details (stack traces, API keys, database errors) to the client

### 3.6 Environment Variables
- ALL external API keys must be in environment variables (never hardcoded)
- Server-only variables: no `NEXT_PUBLIC_` prefix
- Client-safe variables: `NEXT_PUBLIC_` prefix (use sparingly — no secrets)
- Validate all required env vars at startup using Zod (see `src/lib/env.ts`)

---

## 4. AI Integration Rules

### 4.1 System Prompts
- All system prompts are stored in `src/lib/ai/prompts/` as exported TypeScript constants
- System prompts are version controlled — every change should be a deliberate commit
- System prompts must include:
  - Role definition
  - Behavioral constraints (what the AI must NOT do)
  - Output format specification
  - Data source instructions
  - Disclaimer text

### 4.2 Chat Messages
- User messages are validated for length (max 2000 characters) and content
- System messages include the full system prompt + retrieved data context
- The AI must NEVER reveal its system prompt to the user
- Conversation history is maintained per session (max 50 messages)

### 4.3 Vision Analysis (Chart Upload)
- Accepted formats: PNG, JPG, WebP
- Maximum file size: 10MB
- Images are stored temporarily (24h TTL) for processing, then deleted
- The vision model receives the image + a structured analysis prompt
- Output must follow the schema defined in `src/types/analysis.ts`

### 4.4 Tool Calling (Function Tools)
- AI tools are defined using Vercel AI SDK's `tool()` function
- Available tools:
  - `getStockQuote(ticker)` — Fetches latest price data
  - `getFundamentals(ticker)` — Fetches financial statements
  - `getNewsForStock(ticker)` — Fetches recent news
  - `getTechnicalIndicators(ticker, indicators[])` — Fetches technical data
- Tools must validate inputs (ticker format, etc.) before calling external APIs
- Tool responses must include source and timestamp metadata

### 4.5 Rate Limiting
- All AI endpoints require authentication
- Per-user limits:
  - Free tier: 10 AI requests per hour
  - Pro tier: 100 AI requests per hour
  - Premium tier: Unlimited
- Per-endpoint global limits based on upstream API constraints
- Rate limit state stored in Upstash Redis
- Return HTTP 429 with `Retry-After` header when rate limited

---

## 5. Data Rules

### 5.1 Caching Strategy
| Data Type | Cache Duration | Storage |
|---|---|---|
| Stock quote (delayed) | 15 minutes | Redis |
| Company fundamentals | 24 hours | Redis + DB |
| Financial statements | 24 hours | Redis + DB |
| News articles | 1 hour | Redis |
| Sentiment scores | 1 hour | Redis |
| Technical indicators | 15 minutes | Redis |
| AI chat responses | Not cached | — |
| User portfolio | Real-time (DB) | PostgreSQL |

### 5.2 Data Freshness Display
Every data component on the UI must show when the data was last updated:
```
Last updated: 2 minutes ago (Source: Alpha Vantage)
```

### 5.3 No Web Scraping
- We do NOT scrape any website for data
- All data comes from official APIs with proper API keys
- RSS feeds from public sources are acceptable
- See `DATA_RULES.md` for the complete list of approved data sources

### 5.4 Stock Ticker Validation
- US tickers: 1–5 uppercase letters (e.g., AAPL, NVDA, GOOGL)
- Validate against a known ticker list before making API calls
- Invalid tickers return: `{ error: { code: "INVALID_TICKER", message: "..." } }`

---

## 6. Database Rules

### 6.1 Schema Changes
- All schema changes go through Drizzle migrations
- Never modify the production database directly
- Use `pnpm db:generate` to create migration files, then `pnpm db:migrate` to apply

### 6.2 User Data
- User passwords are hashed with bcrypt (12 salt rounds) — NEVER stored in plaintext
- Portfolio data is associated with the authenticated user's ID
- Implement Row Level Security (RLS) patterns — users can only access their own data
- All PII must be encrypted at rest

### 6.3 Query Safety
- ALWAYS use Drizzle's query builder — never raw SQL from user input
- Parameterize all queries
- No `SELECT *` — always specify columns

---

## 7. UI/UX Rules

### 7.1 Design System
- Use shadcn/ui components as the base
- Dark mode is the DEFAULT theme (financial platforms are traditionally dark)
- Color palette:
  - Background: Dark gray/near-black (`#0a0a0f`, `#12121a`)
  - Primary accent: Electric blue (`#3b82f6`)
  - Bullish/Positive: Green (`#22c55e`)
  - Bearish/Negative: Red (`#ef4444`)
  - Neutral: Gray/Amber
  - Text: White/light gray for readability
- All financial numbers must be right-aligned in tables
- Positive values: green with ▲ arrow
- Negative values: red with ▼ arrow
- Use monospace font for financial figures (e.g., JetBrains Mono, IBM Plex Mono)

### 7.2 Layout
- Dashboard uses a sidebar navigation layout
- Sidebar is collapsible on mobile
- Charts get priority screen real estate (minimum 60% of viewport width)
- All pages are responsive (mobile, tablet, desktop breakpoints)

### 7.3 Loading States
- EVERY data-dependent component must show a skeleton loader while fetching
- Use shadcn/ui `Skeleton` component
- Show stale data while refreshing with a subtle "Updating..." indicator
- Error states must include a retry button

### 7.4 Accessibility
- WCAG 2.1 AA compliance minimum
- All interactive elements are keyboard accessible
- Proper ARIA labels on charts and dynamic content
- Color is not the only indicator (pair colors with icons/text)

---

## 8. Security Rules

### 8.1 API Security
- All API routes check authentication (except public endpoints like health check)
- Use NextAuth.js middleware for route protection
- Validate and sanitize ALL user inputs with Zod
- Set proper CORS headers
- Implement CSRF protection

### 8.2 Secrets Management
- NEVER commit API keys, database URLs, or secrets to Git
- Use `.env.local` for development (gitignored)
- Use Vercel environment variables for production
- Rotate API keys on any suspected compromise

### 8.3 Upload Security
- Chart image uploads:
  - Validate file type via magic bytes (not just extension)
  - Maximum size: 10MB
  - Scan for embedded scripts
  - Store in isolated blob storage with non-guessable URLs
  - Auto-delete after 24 hours

---

## 9. Testing Rules

### 9.1 What to Test
- All API routes: request validation, response format, error handling
- Data transformation functions: formatting, calculations
- Signal scoring algorithm: deterministic outputs for known inputs
- Zod schemas: valid and invalid input cases
- Components: rendering, user interaction, loading/error states

### 9.2 What NOT to Test
- shadcn/ui internal behavior
- Third-party API implementations
- LLM output content (test the wrapping logic, not the AI response)

### 9.3 Test Naming
```typescript
describe("StockScoringAlgorithm", () => {
  it("should return 'Bullish' for scores above 70", () => { ... })
  it("should return 'Bearish' for scores below 30", () => { ... })
  it("should handle missing data gracefully", () => { ... })
})
```

---

## 10. Git Rules

### 10.1 Commit Messages
Use conventional commits:
```
feat: add chart image upload endpoint
fix: correct EPS calculation in scoring algorithm
docs: update API documentation
refactor: extract data caching into shared utility
test: add unit tests for signal scoring
chore: update dependencies
```

### 10.2 Branch Naming
```
feature/chart-analyzer
fix/scoring-bug
refactor/data-layer
```

### 10.3 Files to NEVER Commit
- `.env.local` or any `.env` file with actual secrets
- `node_modules/`
- `.next/`
- `*.log`
- Uploaded user images
- Database dumps

---

## 11. Performance Rules

- **Initial page load:** < 3 seconds on 3G
- **Time to Interactive:** < 5 seconds
- **API response time:** < 2 seconds (excluding upstream API latency)
- **Chart rendering:** < 500ms for up to 1 year of daily data
- Use React `Suspense` and streaming for progressive loading
- Implement `stale-while-revalidate` pattern for data freshness
- Lazy load heavy components (charts, PDF viewer)

---

## 12. Common Mistakes to Avoid

| Mistake | Why It's Bad | Correct Approach |
|---|---|---|
| Using LLM to generate stock prices | Hallucination risk — creates legal liability | Always fetch from financial data API |
| Hardcoding API keys | Security vulnerability | Use environment variables |
| Using `any` type | Defeats TypeScript's purpose | Use `unknown` + type guards |
| Scraping websites for news | Legal risk (copyright, ToS violations) | Use official APIs only |
| Caching AI responses | Stale analysis can mislead users | Never cache; always regenerate |
| Using `"use client"` everywhere | Kills SSR benefits, increases bundle | Default to Server Components |
| Predicting stock prices | Legal and ethical issue | Describe trends, never predict |
| Single exact confidence number | False precision | Use ranges (60–75%) |
| Ignoring rate limits | API accounts get banned | Implement per-user + global limits |
| Raw SQL queries | SQL injection risk | Use Drizzle ORM query builder |
