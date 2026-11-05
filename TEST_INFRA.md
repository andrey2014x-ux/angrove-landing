# Test Infrastructure & Methodology — angrove-landing

## 1. Overview & Architecture

The testing framework for **angrove-landing** is built on an opaque-box, requirement-driven, zero-dependency architecture that tests observable browser behaviors, HTTP network contracts, and build integrity without modifying application source code.

### Tech Stack & Tooling:
- **Runner**: Node.js v26 native test runner (`node:test`, `node:assert/strict`) — zero extra `node_modules` overhead, native TAP/spec reporting.
- **Browser Automation**: Direct Chrome DevTools Protocol (CDP) client over native WebSocket (`tests/e2e/helpers/browser.mjs`) controlling headless Google Chrome (installed on host OS). Supports real viewport emulation, DOM interaction, network observation, and screenshot capture.
- **Mock Webhook Server**: Node.js HTTP server (`tests/e2e/helpers/mockWebhook.mjs`) supporting multiple simulation modes (`success`, `error_500`, `malformed`, `slow_hang`, `empty_json`).
- **Static Test Server**: Lightweight HTTP server (`tests/e2e/helpers/staticServer.mjs`) serving production bundles with SPA routing fallback.

---

## 2. Directory Layout

```
tests/e2e/
├── helpers/
│   ├── browser.mjs          # Headless Chrome manager with CDP client, viewport control & events
│   ├── staticServer.mjs     # Lightweight HTTP server for dist/ with SPA fallback
│   └── mockWebhook.mjs      # Configurable mock AI webhook server (modes: 200, 500, timeout, malformed)
├── tier1-features.test.mjs   # Tier 1: Feature Coverage (25 test cases across F1–F5)
├── tier2-boundaries.test.mjs # Tier 2: Boundary & Corner Cases (20 test cases across B1–B4)
├── tier3-cross-feature.test.mjs # Tier 3: Cross-Feature Combinations (5 pairwise interaction tests)
├── tier4-scenarios.test.mjs  # Tier 4: Real-World Application Scenarios (5 complete user journeys)
└── run_all.mjs              # Master test runner aggregating results into formatted summary
```

---

## 3. The 4-Tier Test Structure

| Tier | Focus | Test Cases | Scope |
|------|-------|------------|-------|
| **Tier 1** | Feature Coverage | 25 | F1 Cases Before/After (5), F2 Visual Polish (5), F3 Simulators (5), F4 AI Webhook (5), F5 Build & Typecheck (5) |
| **Tier 2** | Boundary & Corner Cases | 20 | B1 Chat Input Boundaries (5), B2 Webhook Edge Cases (5), B3 Audio Visualizer Boundaries (5), B4 Viewport Limits (5) |
| **Tier 3** | Cross-Feature Interactions | 5 | Tab switching while typing, Cases CTA deep links, Wheel/Lenis scroll isolation, Audio state isolation, Parser background execution |
| **Tier 4** | Real-World Application Scenarios | 5 | Scenario A: Mobile Owner Journey, Scenario B: Pricing Lead Inquiry, Scenario C: Full Build & CSP Audit, Scenario D: Inbound Call Workflow, Scenario E: B2B Lead Extraction |
| **Total**| **Complete Opaque-Box Suite** | **55** | **100% Comprehensive End-to-End Coverage** |

---

## 4. Requirements & Acceptance Criteria Mapping

| Requirement / AC | Tested By | Verification Mechanism |
|---|---|---|
| **R1. Cases Before/After** | Tier 1 (F1.1–F1.5), Tier 3 (X2), Tier 4 (Scenario A) | DOM mounting of `#cases`, 3-tab switching (Salons, E-com, B2B), Before losses vs After automation, solid metrics, Telegram CTA |
| **R1. Visual Audit / Polish** | Tier 1 (F2.1–F2.5) | Sentence case tags, absence of AI-glow blobs, 30-day warranty consistency, #cases nav anchor, button accessibility |
| **R1 / R3. Simulators** | Tier 1 (F3.1–F3.5), Tier 2 (B1, B3), Tier 3 (X1, X4, X5), Tier 4 (B, D, E) | Telegram Chat (greeting, input, quick chips), Voice Call (audio, visualizer, transcript), Parser (scrape, 152-ФЗ), n8n data bus |
| **R2. AI Webhook & Fallback** | Tier 1 (F4.1–F4.5), Tier 2 (B2.1–B2.5), Tier 4 (Scenario B) | Webhook payload contract, instant fallback on unset URL, fallback on 500, 5s timeout abort on slow network, malformed JSON recovery |
| **R3. Performance & Mobile** | Tier 2 (B4.1–B4.5), Tier 3 (X3), Tier 4 (Scenario A) | 320px narrow mobile (zero overflow leak), 375px mobile touch targets (>=44px), 768px tablet, 1440px desktop, Retina scaling |
| **AC. Build & Quality** | Tier 1 (F5.1–F5.5), Tier 4 (Scenario C) | `tsc --noEmit` (0 errors), `npm run build` (exit 0), `dist/index.html` CSP headers, `dist/404.html`, `dist/sitemap.xml` |

---

## 5. Execution Commands

### Run Full Test Suite:
```bash
node tests/e2e/run_all.mjs
```

### Run Individual Tiers:
```bash
node --test tests/e2e/tier1-features.test.mjs
node --test tests/e2e/tier2-boundaries.test.mjs
node --test tests/e2e/tier3-cross-feature.test.mjs
node --test tests/e2e/tier4-scenarios.test.mjs
```
