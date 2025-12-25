# AGENTS.md — UI Guardrails (Tablet-first Medical System)

## Mission
Generate and modify UI code that is:
- Touch-first (doctor workflow)
- Tablet-safe (portrait & landscape)
- Cross-browser stable
- Maintainable (Tailwind + CSS tokens, not utility soup)

Primary users: doctors working on tablets under time pressure.

---

## Styling Rules (Tailwind + CSS Tokens)

### Card System (REQUIRED)
Define a reusable `.card` in `components.css` using design tokens:
- border
- radius
- background
- shadow
- spacing

Optional state variants:
- `.card--selected`
- `.card--disabled`

Example responsibility:
- Cards must NOT be rebuilt with long Tailwind chains.
- Use semantic classes instead.

### Avoid
- Repeating `bg-white border rounded shadow` across components
- Tailwind class chains longer than **10 utilities**
- Styling logic embedded in component files when reusable

---

## Treatment Selection UX (REQUIRED BEHAVIOR)

We support **two selection modes**:

### 1) Search (Name / Code)
- Fast filtering
- Keyboard + touch safe

### 2) Quick Grid Presets
- Favorites + Category Tabs
- NOT a full list

Rules:
- **8–16 items max per category**
- Buttons show **Code + short name (2 lines max)**
- Large tap targets (≥44px, prefer 56px)
- Avoid ambiguity and mis-taps

### Selection Feedback
- Selected item MUST show a clear **"Selected preview"**
- CTA is **disabled** until:
  - required tooth selected
  - surface constraints satisfied

### Memory Aids
- Recent list: **last 6**
- Favorites: **top 8–12**

---

## Responsiveness Guidelines (NON-NEGOTIABLE)

### Layout Modes
- Desktop:
  - Sidebar + Topbar + Main content

- Tablet Landscape (1024–1279):
  - Split workspace
  - Left fixed: **380–420px**
  - Right: flexible

- Tablet Portrait (768–1023):
  - Step-based flow
  - One task at a time
  - Sticky bottom action bar
  - NO desktop shrink layouts

### Rules
- Do NOT hardcode pixel values everywhere
- Use layout helpers from `layout.css`
- Tablet portrait must feel **action-first**, not informational

---

## Cross-Browser Hardening (ALWAYS APPLY)

### Viewport Units
- DO NOT rely on `100vh`
- Use `100dvh` for full-height layouts
- Tailwind: `min-h-[100dvh]`

### Flex / Grid Safety
- Any flex child that can overflow MUST use `min-w-0`
- Grid columns use `minmax(0,1fr)`

### Overflow & Sticky
- Avoid `position: sticky` inside overflow containers
- If sticky breaks (Safari), replace with fixed layout
- No horizontal scroll on tablet portrait

### Fonts
- Single global font stack
- Deterministic sizing
- Avoid layout shifts caused by fallback fonts

---

## Mock Data & Placeholders

Use mock data from:
- `src/data/patients`
- `src/data/treatments`
- `src/data/diagnosis`

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

---

## PR Checklist (Self-Review REQUIRED)

- [ ] Tap targets ≥ 44–48px
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

---

## What NOT To Do

- Do NOT rewrite the design system unless explicitly asked
- Do NOT introduce new UI libraries without approval
- Do NOT dump large CSS blocks inside component files
- Do NOT over-animate (subtle transitions only)
- Do NOT copy desktop UI patterns into tablet portrait

---

END.
