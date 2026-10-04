# AUREMONT MASTER ROADMAP

**Current Milestone**: STAGE 0 — PUBLIC APPLICATION & NAVIGATION  
**Authorized Status Labels Only**: `NOT STARTED`, `IN PROGRESS`, `BUILT`, `VISUALLY APPROVED`, `PRODUCTION CONNECTED`  
**Governing Rule**: *Nothing may be marked `VISUALLY APPROVED` without explicit owner review and visual approval. Build success and file existence are not visual approval.*

---

## Roadmap Milestones & Statuses

| Stage / Milestone | Description & Scope | Status | Notes |
| :--- | :--- | :--- | :--- |
| **STAGE 0 — PUBLIC APPLICATION & NAVIGATION** | Canonical public routes (`/`, `/buy`, `/rent`, `/lease`, `/search`, `/cars`, `/explore`, `/about`, `/login`, `/register`, `/provider`), property and car detail views, designed 404 page, complete navigation audit (desktop and mobile), expanded multi-city inventory across 8 hubs, frozen Concierge naming/claims, factual brand copy, and language selector persistence. | **BUILT** | Awaiting owner visual inspection and screenshot approval. No automated visual approval permitted. |
| **STAGE 1 — PUBLIC PRODUCT REDESIGN** | Screen-by-screen visual and aesthetic redesign of all public surfaces (`/`, `/buy`, `/rent`, `/lease`, `/search`, `/cars`, `/explore`, `/about`, detail views). Conducted in sequence after Stage 0 functional approval. | **NOT STARTED** | Explicitly deferred until Stage 0 completes and visual review occurs. |
| **STAGE 2 — TRANSACTION ARCHITECTURE & CONSUMER WORKFLOWS** | Direct inquiry transmission, viewing scheduling flow, mock consumer bookings ledger, checkout UI, and transaction status monitoring. | **BUILT** | Implemented as mock workflows; visual approval pending. |
| **STAGE 3 — PROVIDER PLATFORM (AGENT & LANDLORD WORKSPACES)** | Provider onboarding, inventory management, listing creation wizard, lead review, tenancy request handling, and viewing calendar. | **BUILT** | Implemented with role-based switching; visual approval pending. |
| **STAGE 4 — ADMINISTRATIVE & OPERATIONS OVERSIGHT** | Central operations console, listing moderation, commission ledger audits, and provider verification management. | **BUILT** | Internal admin tooling implemented; visual approval pending. |
| **STAGE 5 — CONCIERGE & ASSISTANCE LAYER ("ASK AUREMONT")** | Conversational listing discovery prototype, multi-lingual query interpretation, quick prompt exploration, and direct link generation. Frozen prototype. | **BUILT** | Frozen in Stage 0 under approved naming "Auremont Concierge" / "Ask Auremont". |
| **STAGE 6 — PRODUCTION BACKEND & RELATIONAL DATABASE** | Persistent database infrastructure (PostgreSQL/Cloud SQL), authentication backend, REST/GraphQL API services, migrations, and ORM integration. | **NOT STARTED** | Phase-based development stopped per owner mandate. |
| **STAGE 7 — PRODUCTION PAYMENTS & VERIFIED ESCROW** | Production Stripe/banking rails, verified escrow integration, invoice generation, and financial compliance. | **NOT STARTED** | Deferred to production architecture phases. |
| **STAGE 8 — PRODUCTION SECURITY, COMPLIANCE & PERFORMANCE** | Strict RBAC enforcement, cryptographic sessions, GDPR/CCPA data compliance, rate limiting, and bundle optimization. | **NOT STARTED** | Deferred to production architecture phases. |
| **STAGE 9 — PRODUCTION LAUNCH READINESS & AVAILABILITY** | Production cloud hosting, custom domain configuration, CDN caching, SSL hardening, and continuous monitoring. | **NOT STARTED** | Deferred to launch readiness. |

---

## Stage Status Rules & Constraints
1. **Status vocabulary**: Strictly limited to `NOT STARTED`, `IN PROGRESS`, `BUILT`, `VISUALLY APPROVED`, and `PRODUCTION CONNECTED`.
2. **Visual approval gate**: No milestone or route may transition to `VISUALLY APPROVED` without direct owner sign-off on visual presentation, typography, alignment, and responsiveness.
3. **No premature backend development**: Backend, payments, database, or additional AI capabilities remain `NOT STARTED` until public product experience passes visual review.
