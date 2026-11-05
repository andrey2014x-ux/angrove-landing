# Project: angrove-landing

## Architecture
- Tech stack: React 18.3.1, TypeScript 5.6.3, Vite 5.4.10, Tailwind CSS 3.4.14, Three.js 0.186.1, GSAP 3.15.0, Framer Motion 11.11.17, Lenis 1.3.27.
- Component architecture: Single Page Application with lazy-loaded WebGL reactor (`Global3DCanvas`), lazy-loaded simulator components (`TelegramChatSimulator`, `VoiceCallSimulator`, `ParserConsoleSimulator`, `BusinessMeshSimulator`), and modular presentation sections in `src/components/sections/`.
- Data flow: Local reactive state for UI interactions; deep linking via Telegram pre-filled messages; optional external AI webhook via `VITE_AI_WEBHOOK_URL` with guaranteed local fallback.

## Feature Inventory
Every feature from the Survey phase is mapped to an assigned milestone:
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Solid Cases Before/After | Implement & mount interactive 3-tab Before/After cases with real metrics (salons, e-com, B2B) between Services and Process | M1 | Survey (Explorer 1, 2) |
| 2 | Visual Audit Unslop & Polish | Polish typography, sentence case tags, remove AI-glow blobs, soften shadows, harmonize 30-day warranty, add #cases nav | M2 | Survey (Explorer 1, 2) |
| 3 | Live AI Webhook with Graceful Fallback | Ingest VITE_AI_WEBHOOK_URL, create src/lib/aiWebhook.ts with 5s timeout, CSP connect-src update, wire to TelegramChatSimulator | M3 | Survey (Explorer 1, 3) |
| 4 | Opaque-Box E2E Testing Suite | Comprehensive test suite covering Tiers 1-4 (Cases, Simulators, Mobile, Webhook Fallback, PageSpeed & Build) | M-TEST | Project Architecture |
| 5 | Final Integration, Regression & Hardening | 100% E2E test pass + Tier 5 Adversarial Coverage Hardening | M-FINAL | Project Architecture |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M-TEST | E2E Testing Suite | Build test infrastructure & Tiers 1-4 test cases (Cases, Simulators, AI Webhook fallback, Mobile UI, PageSpeed/Build) -> TEST_READY.md | none | DONE |
| M1 | Solid Cases Before/After | Redesign `src/components/sections/Cases.tsx` into 3-tab Before/After with real metrics and mount in `src/App.tsx` | none | DONE |
| M2 | Unslop & Visual Polish | Sentence case tags in Services/GuideForm, remove glow blobs, harmonize 30d warranty in AboutMe, refine Hero stats & nav | none | IN_PROGRESS |
| M3 | Live AI Webhook & Fallback | Implement `src/lib/aiWebhook.ts`, update `src/config.ts`, update `index.html` CSP, integrate into `TelegramChatSimulator.tsx` | none | PLANNED |
| M-FINAL | Final Verification & Hardening | Run 100% E2E test suite (Tiers 1-4), verify 4 simulators, verify mobile layout, Tier 5 hardening, audit verdict | M-TEST, M1, M2, M3 | PLANNED |

## Interface Contracts
### Cases Component ↔ App.tsx & Global3DCanvas
- `Cases` mounts between `<Services />` and `<Process />` with `id="cases"`.
- Uses section reveal data attributes compatible with `useSectionReveal`.
- Coordinates aligned with `Global3DCanvas` milestone `p: 0.28 -> 0.40`.

### aiWebhook.ts ↔ TelegramChatSimulator.tsx
- Function signature:
  `queryAiAssistant(query: string, history: ChatMessagePayload[], fallbackEngine: (query: string, history: any[]) => { reply: string; crmAction?: string }): Promise<AiResponseResult>`
- Returns: `{ reply: string; crmAction?: string; isLive: boolean }`.
- Under any error or unset URL, calls `fallbackEngine` and returns `{ ...localResult, isLive: false }`.

## Code Layout
- `src/components/sections/Cases.tsx`: Cases Before/After section (completed by Worker M1).
- `src/App.tsx`: Layout composition (mount Cases, nav targets).
- `src/components/sections/Services.tsx`: Tags to sentence case (owned by Worker M2).
- `src/components/sections/GuideForm.tsx`: Glow blob removal, sentence case tags (owned by Worker M2).
- `src/components/sections/AboutMe.tsx`: Warranty sync to 30 days (owned by Worker M2).
- `src/components/sections/Header.tsx`, `Footer.tsx`: Nav link #cases (owned by Worker M2).
- `src/components/sections/Hero.tsx`: Stats text refinement (owned by Worker M2).
- `src/lib/aiWebhook.ts`: New helper for external webhook querying (owned by Worker M3).
- `src/config.ts`: Add `aiWebhookUrl` (owned by Worker M3).
- `index.html`: Update CSP `connect-src` (owned by Worker M3).
- `src/components/ui/TelegramChatSimulator.tsx`: Webhook integration with typing delay (owned by Worker M3).
- `tests/e2e/`: E2E test harness and test cases (completed by M-TEST).
