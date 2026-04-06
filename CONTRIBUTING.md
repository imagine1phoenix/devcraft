# CONTRIBUTING.md — Contribution Guidelines for MarketMind AI

## Code of Conduct

Be respectful, inclusive, and constructive. Financial tools carry responsibility — treat every contribution with the care that other people's financial decisions deserve.

---

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone <your-fork-url>`
3. Install dependencies: `pnpm install`
4. Copy environment variables: `cp .env.example .env.local`
5. Fill in required API keys (minimum: `GOOGLE_GENERATIVE_AI_API_KEY`, `ALPHA_VANTAGE_API_KEY`, `DATABASE_URL`)
6. Run development server: `pnpm dev`

---

## Branch Naming

```
feature/short-description    # New features
fix/short-description        # Bug fixes
refactor/short-description   # Code refactoring
docs/short-description       # Documentation changes
test/short-description       # Test additions/changes
```

---

## Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add RSI indicator to technical analysis
fix: correct EPS growth calculation for negative prior EPS
docs: update API documentation for news endpoint
refactor: extract data caching into shared utility
test: add unit tests for signal scoring algorithm
chore: update dependencies
```

---

## Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Code compiles without errors: `pnpm type-check`
- [ ] Linting passes: `pnpm lint`
- [ ] ALL financial numbers come from API data, not hardcoded or LLM-generated
- [ ] Zod schemas validate all external data inputs
- [ ] No `any` types used
- [ ] No secrets or API keys in the code
- [ ] Data freshness timestamps are displayed for all financial data
- [ ] Disclaimers are present on all analysis features
- [ ] New components have unique `id` attributes for testing
- [ ] Mobile responsiveness is maintained
- [ ] Tests added for new functionality

---

## Critical Rules for Contributors

### Financial Data Integrity

1. **NEVER hardcode financial data** — all numbers must come from API responses
2. **NEVER let the LLM generate financial figures** — it MUST use tool/API data
3. **ALWAYS include data source and timestamp** with displayed financial data
4. **NEVER phrase anything as financial advice** — educational/informational only
5. **Signal generation is rules-based** — defined in `ANALYSIS_RULES.md`, not LLM opinion

### Code Quality

1. Read `CLAUDE.md` before writing any code
2. Read `DATA_RULES.md` before touching data layer
3. Read `AI_PROMPTS.md` before modifying any AI prompt
4. Read `ANALYSIS_RULES.md` before changing signal generation logic
5. Follow the existing patterns — consistency matters more than personal preference

---

## Reporting Issues

When reporting bugs, include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (for UI issues)
- Browser and OS information
- Any error messages from the console

For data accuracy issues, also include:
- The stock ticker involved
- The data point that appears incorrect
- The expected value (with source)
- The timestamp when you observed the issue
