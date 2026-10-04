# AUREMONT — Responsive Quality Assurance Audit Matrix

**Project**: AUREMONT  
**Development Stage**: Phase 4.5 — Responsive & Visual Stabilization  
**Date**: October 4, 2026  
**Auditor**: Antigravity Assistant  
**Target Viewports**:  
* Mobile Small: `320×568` (iPhone SE)
* Mobile Standard: `375×812` (iPhone Mini / X)
* Mobile Modern: `390×844` (iPhone 12/13/14/15)
* Mobile Plus: `414×896` (iPhone Plus / Pro Max)
* Tablet Portrait: `768×1024` (iPad Air / Mini)
* Tablet Landscape: `1024×768` (iPad Landscape)
* Short Laptop: `1280×720` (720p Laptop)
* Standard Laptop: `1366×768` (WXGA Notebook)
* Desktop Modern: `1440×900` (MacBook Pro)
* Desktop Widescreen: `1536×864` (Full HD Scaling)
* Desktop Large: `1920×1080` (1080p Monitor)

---

## 1. Automated Visual Tooling Status & Honest Verification Disclosure

* **Automated Browser Driver (Playwright)**: **UNAVAILABLE**
  * *Reason*: The automated browser agent failed during runtime context creation because Playwright driver binaries returned HTTP `404 Not Found` from the upstream Microsoft Azure CDN (`https://playwright.azureedge.net/builds/driver/playwright-1.57.0-win32_x64.zip`).
* **Honest QA Reporting Principle**:
  * In strict compliance with instructions (**"Never fabricate PASS entries. If browser tooling is unavailable, use STRUCTURALLY REMEDIATED — MANUAL VISUAL QA REQUIRED"**), no viewport is marked `PASS` unless a human or working visual renderer has inspected the pixel output.
  * All 18 screens have received comprehensive CSS architecture remediation (eliminating fixed widths, fixed heights, 100vh traps, non-wrapping flex containers, rigid grids, un-scrollable modals, and clipped sticky sidebars).
  * Dev server is operational at `http://localhost:5173/` for local human visual inspection.

---

## 2. Comprehensive Responsive QA Matrix

| Screen / View | Route | 320×568 | 390×844 | 768×1024 | 1024×768 | 1280×720 | 1366×768 | 1440×900 | 1920×1080 | Remediation Status |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **Home** | `/` | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | STRUCTURALLY REMEDIATED — MANUAL VISUAL QA REQUIRED |
| **Search** | `/search` | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | STRUCTURALLY REMEDIATED — MANUAL VISUAL QA REQUIRED |
| **Property Detail** | `/property/:id` | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | STRUCTURALLY REMEDIATED — MANUAL VISUAL QA REQUIRED |
| **Cars** | `/cars` | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | STRUCTURALLY REMEDIATED — MANUAL VISUAL QA REQUIRED |
| **Car Detail** | `/cars/:slug` | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | STRUCTURALLY REMEDIATED — MANUAL VISUAL QA REQUIRED |
| **Login** | `/login` | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | STRUCTURALLY REMEDIATED — MANUAL VISUAL QA REQUIRED |
| **Register** | `/register` | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | STRUCTURALLY REMEDIATED — MANUAL VISUAL QA REQUIRED |
| **Checkout** | `/checkout` | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | STRUCTURALLY REMEDIATED — MANUAL VISUAL QA REQUIRED |
| **Account Overview**| `/account` | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | STRUCTURALLY REMEDIATED — MANUAL VISUAL QA REQUIRED |
| **Account Favorites**| `/account/favorites`| NEEDS REVIEW| NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | STRUCTURALLY REMEDIATED — MANUAL VISUAL QA REQUIRED |
| **Account Messages** | `/account/messages` | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | STRUCTURALLY REMEDIATED (Placeholder View) |
| **Account Transactions**|`/account/transactions`|NEEDS REVIEW|NEEDS REVIEW|NEEDS REVIEW|NEEDS REVIEW|NEEDS REVIEW|NEEDS REVIEW|NEEDS REVIEW|NEEDS REVIEW| STRUCTURALLY REMEDIATED — MANUAL VISUAL QA REQUIRED |
| **Provider Overview**| `/provider` | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | STRUCTURALLY REMEDIATED — MANUAL VISUAL QA REQUIRED |
| **Provider Properties**|`/provider/properties`|NEEDS REVIEW|NEEDS REVIEW|NEEDS REVIEW|NEEDS REVIEW|NEEDS REVIEW|NEEDS REVIEW|NEEDS REVIEW|NEEDS REVIEW| STRUCTURALLY REMEDIATED — MANUAL VISUAL QA REQUIRED |
| **Add Property** | `/provider/properties/new`|NEEDS REVIEW|NEEDS REVIEW|NEEDS REVIEW|NEEDS REVIEW|NEEDS REVIEW|NEEDS REVIEW|NEEDS REVIEW|NEEDS REVIEW| STRUCTURALLY REMEDIATED — MANUAL VISUAL QA REQUIRED |
| **Provider Messages**|`/provider/messages`| NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | STRUCTURALLY REMEDIATED — MANUAL VISUAL QA REQUIRED |
| **Provider Transactions**|`/provider/transactions`|NEEDS REVIEW|NEEDS REVIEW|NEEDS REVIEW|NEEDS REVIEW|NEEDS REVIEW|NEEDS REVIEW|NEEDS REVIEW|NEEDS REVIEW| STRUCTURALLY REMEDIATED — MANUAL VISUAL QA REQUIRED |
| **Provider Earnings**| `/provider/earnings`| NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | STRUCTURALLY REMEDIATED — MANUAL VISUAL QA REQUIRED |

---

## 3. Structural Breakdown of Applied Engineering Fixes

### A. Global Shell & Navigation
* **Navigation Desktop**: Replaced fixed 32px gaps with `gap: clamp(12px, 1.8vw, 28px)` and `flex-shrink: 0` on brand mark to completely prevent menu item collisions on 1024px–1366px screens.
* **Navigation Mobile**: Built a dedicated, purpose-built mobile navigation drawer surface activated by the hamburger button, complete with body scroll locking, backdrop filter, route-change auto-closing, and `Escape` key listeners.
* **Dropdown Menus**: Positioned with `z-index: 150`, proper card shadows, and focus-visible outlines.
* **Footer**: Bottom copyright and language selector converted to responsive column-reverse flow on mobile (<768px).

### B. Marketplace & Discovery
* **Home Hero**: Removed fixed `85vh` requirement; established fluid vertical padding `padding-top: clamp(96px, 13vh, 140px)` and `padding-bottom: clamp(40px, 6vh, 72px)` to prevent headline/navigation collisions on short laptop screens (1280×720, 1366×768).
* **Search Composer**: Implemented horizontal scrolling for search mode tabs, fluid padding, and stacked full-width button inputs on small mobile viewports.
* **Signature Section**: Eliminated rigid `min-height: 700px` hazard; replaced with fluid content-based height `clamp(460px, 55vh, 640px)`.
* **Search Grid**: Changed rigid `minmax(300px, 1fr)` to `minmax(min(100%, 280px), 1fr)`, preventing horizontal blowout on 320px screens.
* **Split-Map View**: Reconfigured so that on viewports ≤1024px, the map pane stacks vertically below results or toggles cleanly instead of trapping mobile users in a crushed 50% split pane.
* **Filter Drawer**: Bound to `width: min(440px, 100vw)` with safe-area padding.

### C. Detail Pages & Mobility
* **Property Detail Specs Strip**: Converted to `flex-wrap: wrap; gap: clamp(12px, 2.5vw, 28px); min-width: 90px;` so metrics wrap cleanly without clipping on 320px devices.
* **Sticky Action Panel**: Added `max-height: calc(100vh - 120px); overflow-y: auto;` to prevent the booking sidebar from being clipped on 720p/768p laptop displays.
* **Mobile Action Bar**: Added `padding-bottom: calc(var(--space-3) + env(safe-area-inset-bottom, 0px))` and container clearance of 100px+ to ensure fixed bottom bar never obscures content or footer.
* **Amenities Grid**: Replaced rigid 2-column grid with `repeat(auto-fill, minmax(min(100%, 220px), 1fr))`.
* **Contact Dialog**: Constrained to `width: min(480px, calc(100vw - 32px)); max-height: calc(100vh - 40px); overflow-y: auto;`.
* **Cars Fleet Discovery**: Fixed card grid `minmax(min(100%, 300px), 1fr)` and car specs row to prevent horizontal overflow.

### D. Transactional & Account
* **Auth**: Full width forms on mobile with 1-column layout for First/Last name on ≤480px screens.
* **Checkout Split**: Stacks cleanly with sidebar first (`flex-direction: column-reverse`) on ≤1024px.
* **Account Shell**: Switched to mobile horizontal subnavigation at ≤1024px with horizontal scroll and safe gutters.

### E. Provider Platform & 10-Step Listing Wizard
* **Provider Sidebar**: Hides on ≤1024px in favor of a clean mobile provider header and tab scroll bar.
* **Listing Wizard**:
  * Step indicator allows smooth scrolling with enlarged touch targets (`16px`).
  * 2-column form grids collapse to 1 column on ≤768px.
  * Form action buttons maintain full touch height (48px) and accessible wrapping.
  * Media upload items include tactile Move Up, Move Down, Set Cover, and Remove buttons for mobile/touch users in addition to drag-and-drop.
* **Provider Tables**: Wrapped in `.table-responsive` with `-webkit-overflow-scrolling: touch` and thin custom scrollbars.

---

## 4. Manual QA Verification Checklist for User

Users testing locally on `http://localhost:5173/` should open Chrome DevTools (F12) > Device Toolbar (Ctrl+Shift+M) and verify:
1. `320×568` (iPhone SE): Verify that no horizontal scrollbar appears on `/`, `/search`, `/cars`, `/property/paris-lux-1`, and `/provider/properties/new`.
2. `390×844` (iPhone 12/13/14): Open hamburger menu in navigation; confirm all routes appear and backdrop dismisses cleanly.
3. `768×1024` (iPad Air): Confirm provider and consumer layouts transition gracefully to horizontal tab bars rather than squeezed sidebars.
4. `1280×720` (720p Laptop): On `/property/paris-lux-1`, verify that the sticky sidebar doesn't overlap the navigation or get clipped at the bottom.
5. `1920×1080` (1080p Monitor): Confirm max-width 1440px container centers gracefully without runaway text line lengths.
