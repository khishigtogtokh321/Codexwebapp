## Styling rules (Tailwind + CSS tokens)

Define `.card` in `components.css` using tokens:
- borders, radius, shadow, background
- state variants like `.card--selected` if needed

Avoid:
- Extremely long Tailwind class chains for every component
- Duplicating the same `bg-white border rounded shadow` in many files


## Treatment selection UX (required behavior)

We support two selection modes:
- Search by name/code
- Quick Grid presets (Favorites + Tabs)

Rules:
- Quick Grid is NOT a full list. Keep it to **8–16** top actions per category.
- Quick Grid buttons should display **Code + short name (2 lines)** to reduce mistakes.
- Selecting an item shows a clear **"Selected"** preview.
- CTA is **disabled** until valid (tooth/surface constraints met).
- Provide "Recent" list (last 6) and "Favorites" (top 8–12).


## Responsiveness guidelines

- Desktop: sidebar + topbar + main content
- Tablet landscape: split workspace (fixed left 380–420px, right fill)
- Tablet portrait: step flow (one task at a time) + sticky bottom action bar

Do not hardcode pixel values everywhere. Use layout helpers in `layout.css`.


## Mock data & placeholders

Use mock data from `src/data/*`:
- patients
- treatments
- diagnosis list

No external API calls unless explicitly requested.
Images should be optional placeholders (avoid heavy assets).


## Output expectations for Codex agent

When asked to build a feature:
- Add/modify components in the correct folder
- Update store logic in Pinia if required
- Add/adjust CSS in `tokens.css` / `components.css` / `layout.css` instead of repeating Tailwind
- Keep UI consistent with touch-first and guardrails
- Provide runnable code (no missing imports)


## PR checklist (self-review)

- [ ] Tap targets are **44–48px** minimum
- [ ] No hover-only critical actions
- [ ] Primary CTA is singular and clear
- [ ] Guardrails exist for required tooth/surface
- [ ] Tailwind used only for simple utilities
- [ ] Complex style moved to CSS classes
- [ ] No long Tailwind class chains (>10) without reason
- [ ] Store contains business logic; components mostly presentational
- [ ] Desktop + tablet landscape + portrait considered


## What NOT to do

- Do not rewrite the entire design system unless asked.
- Do not introduce new UI libraries without approval.
- Do not put large CSS in each component file.
- Do not over-animate; keep subtle transitions only.

END.
