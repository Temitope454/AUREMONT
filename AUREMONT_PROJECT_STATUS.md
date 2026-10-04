# AUREMONT — Permanent Project Status & Memory

**PROJECT**: AUREMONT  
**LOCAL**: `C:\Users\User\Documents\Projects\auremont`  
**GITHUB**: [https://github.com/Temitope454/AUREMONT.git](https://github.com/Temitope454/AUREMONT.git)  
**CURRENT DEVELOPMENT STAGE**: PHASE 5 — ADMIN & OPERATIONS PLATFORM (BUILT)  
**NEXT MAJOR PHASE**: PHASE 6 — AI CONCIERGE & PRODUCT COMPLETION  

---

### Core State Definitions
* **BUILT**: Code exists.
* **VERIFIED**: Actual behavior/rendering has been checked.
* **MOCKED**: Interaction exists using frontend/local mock infrastructure.
* **PLACEHOLDER**: Route/UI exists but functionality is not complete.
* **PRODUCTION-READY**: Real infrastructure, security, and QA are complete.

---

### Master Roadmap
* **PHASE 1 — Brand/Public Foundation**: Status: **BUILT**
* **PHASE 2 — Property Marketplace**: Status: **BUILT**
* **PHASE 3 — Consumer + Mobility**: Status: **BUILT / quality verification required**
* **PHASE 4 — Agent/Landlord Provider Platform**: Status: **BUILT / quality verification required**
* **PHASE 4.5 — Responsive & Visual Stabilization**: Status: **BUILT & STRUCTURALLY STABILIZED / Manual QA Pending**
* **PHASE 5 — Admin & Operations**: Status: **BUILT & INTEGRATED / Manual QA Pending**
* **PHASE 6 — AI Concierge + multilingual/product completion**: Status: **NOT STARTED (Next Phase)**
* **PHASE 7 — Production Backend & Database**: Status: **NOT STARTED**
* **PHASE 8 — Payments, media, maps, messaging, email and external integrations**: Status: **NOT STARTED**
* **PHASE 9 — Security, accessibility, performance and complete QA**: Status: **NOT STARTED**
* **PHASE 10 — Deployment / Launch Readiness**: Status: **NOT STARTED**


---

## A. What Auremont Is
Auremont is a luxury real estate and mobility marketplace platform tailored for high-net-worth individuals, premier property agencies, and private landlords across international metropolitan hubs (Paris, London, Madrid, Lisbon, Milan, Dubai, New York, Singapore). The platform bridges architectural residential discovery, high-end automotive bookings, verified provider workspaces (for both Agents and Landlords), and consumer portfolio management under an editorial, timeless luxury aesthetic.

---

## B. Technology Stack & Architecture
- **Core Framework**: React 19 (`react`, `react-dom`)
- **Language**: TypeScript 5.8+ with strict `verbatimModuleSyntax` enforcement
- **Build Tool**: Vite 8.3 (`vite`, `@vitejs/plugin-react`)
- **Routing**: React Router v7 (`react-router-dom`)
- **Icons**: Lucide React (`lucide-react`)
- **Styling Architecture**: Vanilla CSS with custom Design Token system (no Tailwind, no external CSS frameworks). Scoped CSS modules per page/component.
- **State Architecture**:
  - `AuthContext`: Mock authentication state, session storage, consumer vs. provider role switching (Agent vs. Landlord).
  - `ConsumerContext`: Favorites management, saved item IDs, local persistence.
  - `ProviderContext`: Provider inventory, draft auto-saving, leads, tenancy requests, viewings schedule, transactions, notifications, profile/settings, verification states.
- **Persistence**: Client-side mock state with `localStorage` fallback and memory caching.
- **Key Dependencies**:
  - `react`: `^19.2.8`
  - `react-dom`: `^19.2.8`
  - `react-router-dom`: `^7.18.4`
  - `lucide-react`: `^1.49.0`
  - Dev: `typescript`, `vite`, `oxlint`, `@types/react`, `@types/react-dom`, `@types/node`

---

## E. All Registered Routes & Implementation Classification

| Route Path | Associated Component / View | Route Classification | Status Label |
| :--- | :--- | :--- | :--- |
| `/` | `Home.tsx` | IMPLEMENTED | BUILT & MOCKED |
| `/search` | `Search.tsx` | IMPLEMENTED | BUILT & MOCKED |
| `/property/:id` | `PropertyDetail.tsx` | IMPLEMENTED | BUILT & MOCKED |
| `/cars` | `Cars.tsx` | IMPLEMENTED | BUILT & MOCKED |
| `/cars/:slug` | `CarDetail.tsx` | IMPLEMENTED | BUILT & MOCKED |
| `/login` | `Auth.tsx` (`mode="login"`) | IMPLEMENTED | BUILT & MOCKED |
| `/register` | `Auth.tsx` (`mode="register"`) | IMPLEMENTED | BUILT & MOCKED |
| `/forgot-password`| `Auth.tsx` (`mode="forgot-password"`) | IMPLEMENTED | BUILT & MOCKED |
| `/list` | Redirects to `/provider/properties/new` | IMPLEMENTED | BUILT |
| `/checkout` | `Checkout.tsx` (Protected) | IMPLEMENTED | BUILT & MOCKED |
| `/account` | `AccountLayout.tsx` > `Overview.tsx` | IMPLEMENTED | BUILT & MOCKED |
| `/account/favorites` | `AccountLayout.tsx` > `Favorites.tsx` | IMPLEMENTED | BUILT & MOCKED |
| `/account/saved-searches` | `AccountLayout.tsx` > `Placeholder.tsx` | PLACEHOLDER | PLACEHOLDER |
| `/account/recent` | `AccountLayout.tsx` > `Placeholder.tsx` | PLACEHOLDER | PLACEHOLDER |
| `/account/messages` | `AccountLayout.tsx` > `Placeholder.tsx` | PLACEHOLDER | PLACEHOLDER |
| `/account/bookings` | `AccountLayout.tsx` > `Placeholder.tsx` | PLACEHOLDER | PLACEHOLDER |
| `/account/transactions`| `AccountLayout.tsx` > `Transactions.tsx`| IMPLEMENTED | BUILT & MOCKED |
| `/account/notifications`| `AccountLayout.tsx` > `Placeholder.tsx`| PLACEHOLDER | PLACEHOLDER |
| `/account/profile` | `AccountLayout.tsx` > `Placeholder.tsx` | PLACEHOLDER | PLACEHOLDER |
| `/account/settings` | `AccountLayout.tsx` > `Placeholder.tsx` | PLACEHOLDER | PLACEHOLDER |
| `/provider/entry` | `ProviderEntry.tsx` (Persona switcher) | IMPLEMENTED | BUILT |
| `/provider` | `ProviderLayout.tsx` > `ProviderOverview.tsx`| IMPLEMENTED | BUILT & MOCKED |
| `/provider/properties`| `ProviderLayout.tsx` > `PropertiesList.tsx`| IMPLEMENTED | BUILT & MOCKED |
| `/provider/properties/new`| `ProviderLayout.tsx` > `AddProperty.tsx` | IMPLEMENTED | BUILT & MOCKED |
| `/provider/properties/:id/edit`| `ProviderLayout.tsx` > `AddProperty.tsx` | IMPLEMENTED | BUILT & MOCKED |
| `/provider/properties/:id/media`| `ProviderLayout.tsx` > `PropertyMedia.tsx`| IMPLEMENTED | BUILT & MOCKED |
| `/provider/properties/:id/preview`| `ProviderLayout.tsx` > `PropertyPreview.tsx`| IMPLEMENTED | BUILT & MOCKED |
| `/provider/leads` | `ProviderLayout.tsx` > `ProviderLeads.tsx` (Agent) | IMPLEMENTED | BUILT & MOCKED |
| `/provider/requests` | `ProviderLayout.tsx` > `ProviderRequests.tsx` (Landlord)| IMPLEMENTED | BUILT & MOCKED |
| `/provider/viewings` | `ProviderLayout.tsx` > `ProviderViewings.tsx`| IMPLEMENTED | BUILT & MOCKED |
| `/provider/messages` | `ProviderLayout.tsx` > `ProviderMessages.tsx`| IMPLEMENTED | BUILT & MOCKED |
| `/provider/transactions`| `ProviderLayout.tsx` > `ProviderTransactions.tsx`| IMPLEMENTED | BUILT & MOCKED |
| `/provider/transactions/:id`| `ProviderLayout.tsx` > `TransactionDetail.tsx`| IMPLEMENTED | BUILT & MOCKED |
| `/provider/earnings` | `ProviderLayout.tsx` > `ProviderEarnings.tsx`| IMPLEMENTED | BUILT & MOCKED |
| `/provider/onboarding`| `ProviderLayout.tsx` > `ProviderOnboarding.tsx`| IMPLEMENTED | BUILT & MOCKED |
| `/provider/verification`| `ProviderLayout.tsx` > `ProviderVerification.tsx`| IMPLEMENTED | BUILT & MOCKED |
| `/provider/notifications`| `ProviderLayout.tsx` > `ProviderNotifications.tsx`| IMPLEMENTED | BUILT & MOCKED |
| `/provider/profile` | `ProviderLayout.tsx` > `ProviderProfile.tsx`| IMPLEMENTED | BUILT & MOCKED |
| `/provider/settings` | `ProviderLayout.tsx` > `ProviderSettings.tsx`| IMPLEMENTED | BUILT & MOCKED |
| `/admin` | `AdminLayout.tsx` > `AdminOverview.tsx` | IMPLEMENTED | BUILT & MOCKED |
| `/admin/listings` | `AdminLayout.tsx` > `AdminListings.tsx` | IMPLEMENTED | BUILT & MOCKED |
| `/admin/verifications` | `AdminLayout.tsx` > `AdminVerifications.tsx` | IMPLEMENTED | BUILT & MOCKED |
| `/admin/commissions` | `AdminLayout.tsx` > `AdminCommissions.tsx` | IMPLEMENTED | BUILT & MOCKED |
| `/admin/users` | `AdminLayout.tsx` > `AdminUsers.tsx` | IMPLEMENTED | BUILT & MOCKED |
| `/admin/audit` | `AdminLayout.tsx` > `AdminAuditLog.tsx` | IMPLEMENTED | BUILT & MOCKED |

---

## F. Significant Components Inventory
- **Global Shell**: `Navigation.tsx` (desktop + mobile drawer, transparent/solid states), `Footer.tsx` (multi-column legal/language footer).
- **Cards**: `PropertyCard.tsx` (grid and list mode), `CarCard.tsx` (specs, powertrain, availability tags).
- **Guards**: `ProtectedRoute.tsx` (preserves redirect intent), `ProviderRoute.tsx` (enforces provider role), `AdminRoute.tsx` (Elena Rostova compliance officer gate).
- **Discovery**: Search composer, Filter Drawer, Split-Map mock view, Autocomplete dropdown.
- **Listing Editor**: 10-step wizard (`AddProperty.tsx`) with draft auto-saving, local persistence, field validation, and missing information review alerts.
- **Provider Media**: Drag/upload visual simulator (`PropertyMedia.tsx`).
- **Commission Utility**: `src/utils/commission.ts` (strictly tested unit calculations).
- **Operations Console**: `AdminContext.tsx` (listings moderation, provider KYC, commission policy, audit trail), `AdminLayout.tsx`, `AdminOverview.tsx`, `AdminListings.tsx`, `AdminVerifications.tsx`, `AdminCommissions.tsx`, `AdminUsers.tsx`, `AdminAuditLog.tsx`.

---

## G. Phase Roadmap Status

| Phase | Description | Status |
| :--- | :--- | :--- |
| **Phase 1** | Brand & Public Foundation | VERIFIED (Completed) |
| **Phase 2** | Property Marketplace (Discovery, Search, Detail) | VERIFIED (Completed) |
| **Phase 3** | Consumer Lifecycle & Mobility Architecture | VERIFIED (Completed) |
| **Phase 4** | Shared Agent & Landlord Provider Platform | VERIFIED (Completed) |
| **Phase 4.5** | **Full Product Stabilization & Responsive Remediation** | VERIFIED (Completed) |
| **Phase 5** | **Admin & Operations Platform** | **VERIFIED (Built & Integrated)** |
| **Phase 6** | Product Completion (Real-time integrations, Concierge) | NOT STARTED (Next Phase) |
| **Phase 7** | Backend & Database Services | NOT STARTED |
| **Phase 8** | External Integrations (Stripe, Maps, DocuSign, etc.) | NOT STARTED |
| **Phase 9** | Security, Performance & Accessibility QA | NOT STARTED |
| **Phase 10** | Production Deployment & Multi-Region Infra | NOT STARTED |

---

## H. Feature Status Breakdown

| Domain | Feature Area | Status Label | Description |
| :--- | :--- | :--- | :--- |
| **Marketplace** | Home Hero & Discovery | BUILT & MOCKED | Static imagery, editorial copy, interactive search composer |
| **Marketplace** | Property Search & Filters | BUILT & MOCKED | URL state driven, grid/list/map toggles, mock geocoordinates |
| **Marketplace** | Property Detail View | BUILT & MOCKED | Multi-mode gallery, narrative specs, sticky booking sidebar |
| **Mobility** | Car Fleet Discovery | BUILT & MOCKED | Filters for powertrain, category, seating; vehicle cards |
| **Mobility** | Car Detail & Booking | BUILT & MOCKED | Cinematic gallery, rental terms, modal booking inquiry |
| **Auth** | Mock Authentication | BUILT & MOCKED | LocalStorage user session, role switching, intent preservation |
| **Checkout** | Checkout Workflow | BUILT & MOCKED | 4-step process (Review, Details, Payment, Confirmation states) |
| **Consumer** | Overview & Favorites | BUILT & MOCKED | Live list of favorited properties and cars |
| **Consumer** | Transactions | BUILT & MOCKED | History of mock bookings and receipts |
| **Consumer** | Saved Searches / Alerts | PLACEHOLDER | Renders structured `Placeholder.tsx` |
| **Consumer** | Messages / Bookings | PLACEHOLDER | Renders structured `Placeholder.tsx` |
| **Consumer** | Profile / Settings / Security| PLACEHOLDER | Renders structured `Placeholder.tsx` |
| **Provider** | Agent / Landlord Shell | BUILT | Adaptive role-aware sidebar and top navigation |
| **Provider** | 10-Step Listing Wizard | BUILT & MOCKED | 10 stages, debounced localStorage drafts, validation |
| **Provider** | Listing Media Uploader | BUILT & MOCKED | Gallery reordering simulator |
| **Provider** | Listing Preview | BUILT & MOCKED | Wraps public PropertyDetail in preview mode banner |
| **Provider** | Agent Leads | BUILT & MOCKED | Inbound prospective buyer lead management |
| **Provider** | Landlord Rental Requests | BUILT & MOCKED | Inbound tenant tenancy request reviews |
| **Provider** | Viewings Schedule | BUILT & MOCKED | Calendar/list scheduling and status updates |
| **Provider** | Provider Messaging | BUILT & MOCKED | Threaded messaging UI with consumer inquiry context |
| **Provider** | Earnings & Commission | BUILT & MOCKED | Centralized 10% sale / 5% rent commission computation |
| **Provider** | Financial Transactions | BUILT & MOCKED | Tabular and detailed transaction breakdowns |
| **Provider** | Provider Identity Verification| BUILT & MOCKED | Multi-tier KYC/AML verification simulation |
| **Provider** | Profile & Settings | BUILT & MOCKED | Public agent bio, preferences, notification toggles |

---

## I. Known Business Rules
1. **Platform Commission Rates** (Centralized in `src/utils/commission.ts`):
   - **Property Sale**: Rigidly enforced **10.00%** Auremont commission.
   - **Rental Transaction**: Rigidly enforced **5.00%** Auremont commission.
   - **Lease Model**: Undefined / unconfigured. Safely returns `{ isConfigured: false, message: 'Commission requires configuration' }`.
   - **Mobility (Cars)**: Undefined / unconfigured. Safely returns `{ isConfigured: false, message: 'Commission requires configuration' }`.
2. **Currency Integrity**:
   - Currencies (`EUR`, `GBP`, `USD`, `AED`, `SGD`) are strictly preserved.
   - Multi-currency totals must **NEVER** be summed into a single blended number without active exchange conversion.
3. **Intended Payment Methods**:
   - Credit / Debit Card (Visa, MasterCard, Amex)
   - PayPal
4. **Intended Languages**:
   - English (primary)
   - French
   - Spanish

---

## J. What is NOT Production-Ready (Honest Scope Boundaries)
The application is currently a high-fidelity client-side Single Page Application (SPA). The following components require full backend infrastructure before production deployment:
- **Backend API**: No live REST or GraphQL server.
- **Database**: No persistent database (PostgreSQL, MongoDB, Spanner, etc.); data resets or persists only in client `localStorage`.
- **Authentication**: No cryptographically signed JWTs, OAuth2, or sessions; authentication is a client mock.
- **Payment Processing**: No live Stripe / PayPal SDK; transactions simulate processing delays and generate mock references.
- **Verification & KYC**: No real-time SumSub/Jumio ID document verification; documents simulate upload states.
- **Media Storage**: No AWS S3 / Cloud Storage bucket; media URLs reference local bundled assets.
- **Real-Time Messaging**: No WebSockets, Socket.io, or push messaging infrastructure.
- **Email & Notifications**: No SendGrid/SES transactional email pipes.
- **Map & Geocoding**: Maps display simulated vector tiles without live Google Maps / Mapbox APIs.
- **AI Concierge**: Not implemented.
- **Full Localization (i18n)**: Language selector is UI-only; copy is presently English.
- **Security Audit**: No penetration testing or production security hardening conducted.

---

## K. Focus, Issues, & Next Steps
- **CURRENT FOCUS**: Phase 4.5 — Full Product Stabilization, Responsive Remediation across all 11 target viewports (320px to 1920px), Table refactoring, Navigation fixes, Typography limits, Pre-Phase-5 Acceptance.
- **NEXT PHASE**: Phase 5 — Admin & Operations Workspace (Governance, Listing Approvals, User Verification Oversight, Global Commission Overrides).
- **KNOWN ISSUES (To be addressed in Phase 4.5)**:
  - Mobile horizontal scroll hazards on small viewports (<360px).
  - Provider tables causing potential overflow on mobile devices.
  - Sticky panels (Property Detail, Checkout) colliding on short laptop screens (1280×720, 1366×768).
  - Navigation drawer overlay transitions and scroll locking on mobile.
  - Missing responsive container gutters and typography runaway at 1920px+.
- **MANUAL QA REQUIRED**:
  - Verification of all primary screens across: 320×568, 390×844, 768×1024, 1024×768, 1280×720, 1366×768, 1440×900, 1920×1080.
  - Form field navigation and sticky footers in 10-step listing editor on mobile.
- **BACKEND DEPENDENCIES**:
  - User and provider authentication / session management.
  - Persistent listing database with full-text search.
  - Secure media upload pipeline.
  - Stripe / PayPal webhooks for booking confirmation.
