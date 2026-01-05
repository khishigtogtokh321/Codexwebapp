# AGENTS.md — UI Guardrails (Tablet-first Medical System)

## Mission
Generate/modify UI code that is:
- **Touch-first** (doctor workflow, fast + low error)
- **Tablet-safe** (portrait & landscape, iPad + Android)
- **Cross-browser stable** (Safari/iOS included)
- **Maintainable** (Tailwind for small utilities + CSS tokens/classes, not utility soup)
- **Human-readable** (next dev can understand quickly; clarity > cleverness)

Primary users: doctors working on tablets under time pressure.

---

## Codex Operating Contract (TL;DR — MUST FOLLOW)
### Tablet + Safety
- MUST NOT introduce **horizontal scroll** in tablet portrait (768–1023).
- MUST keep CTAs visible: **no clipped CTAs**, no “desktop shrink”.
- MUST keep tap targets **≥ 44px** (prefer **48–56px** for primary flows).
- MUST ensure **scroll is intentional**: exactly **one** intended scroll area (lists/grids), never accidental whole-card scroll.
- MUST be **iOS Safari safe**: avoid `100vh`-only, avoid sticky inside overflow containers, avoid `min-height` + `height:100%` trap.

### Maintainability
- MUST use Tailwind for **layout glue** only (grid/flex/gap/spacing).
- MUST extract reusable patterns into `src/assets/styles/components.css` as semantic `.ui-*` classes.
- If a Tailwind chain exceeds **10 utilities** OR repeats in **2+ places** → MUST extract to `components.css`.

### Human-readable code
- MUST prefer clarity over brevity; no “clever” one-liners for complex logic.
- MUST keep functions/handlers small (target **≤ 25 lines**) and single-purpose.
- MUST avoid nested ternaries and long chained expressions.
- MUST use predictable naming (`is/has/can`, `onX`, `filteredX`, `selectedX`).
- MUST end work with a short **Self-check** (see Output Requirements).

---

## Non-negotiables (Golden Rules)
1) **No layout breakage** on tablet portrait (768–1023):
   - no horizontal scroll
   - no clipped CTAs
   - no “desktop shrink” layouts
2) **Tap targets ≥ 44px** (prefer 48–56px for critical actions).
3) **Scroll is intentional**: only the intended area scrolls (never accidental whole-card scroll).
4) **Safari/iOS must work**: avoid patterns known to break on iOS (vh, sticky+overflow, min-height+100%).

---

## Human-Readable Code Rules (REQUIRED)

### Readability (Clarity > Cleverness)
- Prefer explicit code over clever shortcuts.
- No nested ternaries. No long chained expressions for core logic.
- Keep handlers/helpers small (aim **≤ 25 lines**) and single-responsibility.
- Avoid magic numbers; use tokens/vars/clamp() with safe fallbacks.

### Naming Conventions (Predictable)
- booleans: `isLoading`, `hasSelection`, `canSave`
- handlers/events: `onSave()`, `onSelectTooth()`, `onOpenDrawer()`
- computed/derived: `filteredTreatments`, `selectedPreview`, `canSubmit`

### Vue SFC Structure (script setup order)
1) imports
2) props / emits
3) constants (config/enums)
4) state (ref/reactive)
5) computed
6) handlers/methods (`onX`)
7) watchers (minimize)
8) lifecycle hooks

### Template Rules (Keep template “dumb”)
- Move complex conditions/formatting into computed/helpers.
- No inline anonymous handlers (e.g. `@click="() => ..."`). Use named handlers.
- Always include clear loading/empty/disabled UI states.

---

## Styling Rules (Tailwind + CSS Tokens)

### Card System (REQUIRED)
Define reusable `.card` in `components.css` using tokens:
- border, radius, bg, shadow, spacing
- optional variants:
  - `.card--selected`
  - `.card--disabled`
  - `.card--dense`

**Rule:** Cards must **NOT** be rebuilt with long Tailwind chains. Use semantic classes.

### CSS Placement Strategy (Hybrid 80/20) — Maintainability Rule
**Goal:** Next developers can modify UI safely without hunting styles across random files.

**Rule of thumb**
- **80%**: Use Tailwind utilities + **shared semantic classes** in `src/assets/styles/components.css`
- **20%**: Use **component-local CSS** only for truly component-specific needs

#### Put in `components.css` (REQUIRED)
Use `components.css` for **reusable UI patterns** used in 2+ places:
- cards, toolbars, tables, rows, inputs, buttons, pills/badges
- repeated typography helpers (primary/secondary/caption)
- shared interaction states (hover/selected/disabled/focus ring)

✅ Example semantic classes:
- `.ui-card`, `.ui-card--dense`, `.ui-card--selected`
- `.ui-toolbar`
- `.ui-input`
- `.ui-btn`, `.ui-btn--primary`, `.ui-btn--secondary`
- `.ui-table`, `.ui-th`, `.ui-tr`, `.ui-td`
- `.ui-row-selectable`, `.ui-row-selected`
- `.ui-badge`, `.ui-pill`

**DO NOT** rebuild these with long Tailwind chains in each component.

#### Put in component SFC `<style scoped>` (ALLOWED, but limited)
Use component-local CSS ONLY for:
- one-off layout fixes unique to that component
- complex positioning (e.g., SVG / ToothChart specifics)
- component-specific keyframes/animations (not reused)
- isolated third-party overrides

**Do NOT** put these in local CSS:
- button/input/card/table base styling
- repeated colors/radius/shadows (must come from tokens + shared classes)

#### Enforce consistency
- If a Tailwind chain exceeds **10 utilities** OR repeats across components → extract a semantic class into `components.css`.
- Prefer `@layer components` + `@apply` to keep styles searchable and consistent.

### Avoid
- repeating `bg-white border rounded shadow` across components
- Tailwind chains longer than **10 utilities**
- large style logic inside Vue SFC when reusable
- Any styling repeated in **2+ components** must be extracted to `components.css` as a semantic `.ui-*` class.

### Preferred Pattern
- Tailwind = layout glue (grid/flex/gap), small utilities
- CSS classes = component styling + repeated patterns
- CSS variables (tokens) = sizing & consistency

---

## Cross-Browser Hardening (ALWAYS APPLY)

### Viewport Units (iOS-safe)
- DO NOT rely on `100vh` alone.
- Use `100dvh` with fallback:
  - CSS: `max-height: 90vh; max-height: 90dvh;`
  - Tailwind: add both if needed via custom CSS or arbitrary values.

### Flex/Grid Safety (prevents overflow bugs)
- Any flex/grid child that can overflow MUST have:
  - `min-w-0` (for horizontal)
  - `min-h-0` (for vertical scroll containers)
- Grid columns must use `minmax(0,1fr)` (or Tailwind equivalent).

### Overflow & Sticky
- Avoid `position: sticky` inside containers with `overflow: auto/hidden`.
- If sticky breaks on Safari: use a fixed footer/action bar layout instead.

### Height + 100% Trap (IMPORTANT)
**Never combine these without a fixed parent height:**
- parent uses `min-height`
- child uses `height: 100%`

This breaks vertical centering and sizing on iOS Safari.

**Fix patterns:**
- use `height` (fixed) instead of `min-height` when child needs `height:100%`, OR
- remove `height:100%` and center with flex + padding.

### Fonts & Line-height (Safari rendering)
- Use a single global font stack.
- Avoid `line-height: 1` on pills/buttons for Mongolian text; prefer `1.1–1.2` to prevent baseline “lifting” on iPad.

---

## Layout Modes (REQUIRED)

### Desktop
- Sidebar + Topbar + Main content

### Tablet Landscape (1024–1279)
- Split workspace
- Left fixed: **380–420px**
- Right: flexible
- **No cramped desktop shrink**: prioritize readability + tap space

### Tablet Portrait (768–1023)
- Step-based flow (one task at a time)
- Sticky/fixed bottom action bar
- Avoid multi-column dense layouts
- No horizontal scroll, ever

### Rules
- Do NOT hardcode pixel values everywhere
- Use layout helpers from `layout.css`
- Prefer `clamp()`/tokens for sizes

---

## Sizing & Tokens (CSS Variables)

### Clamp Rules
Use `clamp(MIN, PREFERRED, MAX)` for responsive sizing.
- MIN: touch-safe minimum (≥ 44px for critical controls)
- PREFERRED: container-aware sizing (`cqw`) or viewport (`dvh`)
- MAX: prevent oversized UI on large screens

### Container Query Units (cqw)
If using `cqw`, ensure the parent has:
- `container-type: inline-size;`

### Variable Safety (NO undefined vars)
Any `var(--x)` used inside `clamp()` MUST exist or have fallback:
- ✅ `var(--tw-touch, 2.75rem)`
- ❌ `var(--tw-visual)` (undefined) — causes invalid clamp and unpredictable sizing.

---

## Treatment Selection UX (REQUIRED BEHAVIOR)

We support **two selection modes**:

### 1) Search (Name/Code)
- Fast filtering
- Keyboard + touch safe
- Clear empty state
- Debounce is optional; keep it responsive

### 2) Quick Grid Presets
- Favorites + Category tabs
- NOT full list

Rules:
- **8–16 items max per category**
- Each button shows **Code + short name (2 lines max)**
- Tap targets ≥ 44px (prefer 56px for primary flows)
- Prevent mis-taps: spacing and clear selected state

### Selection Feedback
- Selected item MUST show a clear **Selected Preview** (code + name)
- Primary CTA disabled until:
  - tooth selected (required)
  - surface constraints satisfied
  - at least 1 code selected (if required)

### Memory Aids
- Recent list: last **6**
- Favorites: top **8–12**

---

## Wizard / Step Panels (Hard Rules)

### Step 1 vs Step 2 Height Strategy
- **Step 1 (selection/inputs):** height should be **content-driven**.
  - Avoid forcing height via `aspect-ratio` (creates empty space).
- **Step 2 (grid lists):** allow a **fixed panel height** and make ONLY the list/grid scroll.

### Scroll Strategy (Only one scroll area)
When you need header + footer fixed, and content scrolls:
- Panel: `display:flex; flex-direction:column; overflow:hidden;`
- Body: `flex:1; min-h-0; overflow:hidden;`
- Scroll area (grid/list): `flex:1; min-h-0; overflow:auto;`
- Bottom action bar: fixed/absolute within panel, avoid fighting the scroll.

**Never** make the whole panel body scroll if footer is absolute—use padding on scroll area.

---

## Controls (Buttons/Inputs) — Touch & Centering

### Tap Target Rule
- Primary/secondary buttons: min height ≥ 44px
- Prefer 48–56px for high-frequency actions

### Vertical Centering Rule (iOS-safe)
Prefer:
- button uses `height: var(--control-h)` and no `height:100%` dependency
- center text with flex
- use `line-height: 1.1–1.2` for Mongolian text

Avoid:
- parent `min-height` + child `height:100%`

---

## Mock Data & Placeholders
Use mock data from:
- `src/data/patients`
- `src/data/treatments`
- `src/data/diagnoses`

Rules:
- No external API calls unless explicitly requested
- Images are optional placeholders
- Avoid heavy assets

---

## Output Expectations for Codex Agent

When implementing a feature:
- Add/modify components in correct folders
- Update Pinia store ONLY for business logic
- Keep components mostly presentational
- Move reusable styles to:
  - `tokens.css`
  - `components.css`
  - `layout.css`
- Do NOT repeat complex Tailwind in components
- Ensure code is runnable (no missing imports)
- When using `clamp()` + `var()` ensure variables exist or have fallbacks

### Required Self-check (append in final output)
- Readability: small functions, predictable naming, templates stay simple
- Tablet portrait: no horizontal scroll, CTA visible
- Scroll: exactly one intended scroll area
- iOS Safari: no `100vh`-only, no sticky+overflow traps, no `min-height` + `height:100%` trap

---

## Tablet Test Matrix (Minimum)
Must visually sanity-check these:
- **iPad Mini / iPad (Safari)**
  - 768×1024 (portrait)
  - 1024×768 (landscape)
  - Split view ~ 507×768 (portrait/landscape)
- **Android tablet (Chrome)**
  - 800×1280
  - 1280×800
- Check: no horizontal scroll, CTAs visible, scroll areas correct, text not clipped.

---

## PR Checklist (Self-Review REQUIRED)
- [ ] Tap targets ≥ 44–48px (prefer 56px for primary)
- [ ] No hover-only critical actions
- [ ] Exactly ONE primary CTA per screen
- [ ] Guardrails for required tooth/surface exist
- [ ] Tailwind used only for simple utilities
- [ ] Complex styles moved to CSS classes
- [ ] No Tailwind chains > 10 utilities without reason
- [ ] Store contains business logic only
- [ ] Desktop + tablet landscape + portrait considered
- [ ] No horizontal scroll on tablet portrait
- [ ] Safari / iOS Safari behavior considered
- [ ] No undefined CSS vars inside clamp()
- [ ] No `min-height` + `height:100%` trap in controls

---

## What NOT To Do
- Do NOT rewrite the design system unless explicitly asked
- Do NOT introduce new UI libraries without approval
- Do NOT dump large CSS blocks inside component files
- Do NOT over-animate (subtle transitions only)
- Do NOT copy desktop UI patterns into tablet portrait
- Do NOT force panel heights using `aspect-ratio` on content-driven steps

---

END.
