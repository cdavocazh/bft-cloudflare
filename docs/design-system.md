# BFT Design System — Knowledge & Experimentation Log

A working document that captures what was evaluated, what was chosen, and what was learned applying Material Design 3 to the BFT Workout Tracker. Lives alongside the code so the next session (human or AI) can pick up without re-deriving the reasoning.

---

## 1. Why this document exists

The BFT app started as vanilla HTML/CSS/JS with a hand-rolled visual language. As the feature surface grew (5 pages, multi-step forms, charts, modals, image cards), inconsistencies accumulated — different button shapes, inconsistent spacing, ad-hoc colors. Rather than continue patching, we evaluated mature design systems that could give the app a coherent, opinionated foundation. This doc records that evaluation and the implementation experiment that followed.

---

## 2. Reference: Design framework landscape

The five frameworks we considered, summarized from the source post that triggered this evaluation. These descriptions are the canonical reference for what each framework offers — we did not edit them.

### Material Design

- Google's design system. It gives you a full UI language: color roles, typography scale, spacing, elevation, grids, states, and component behavior.
- Why the post likes it: it is opinionated and complete, so AI has a strong structure to imitate instead of inventing random UI choices.
- Best for: app/product UIs where you want consistency, accessibility defaults, and a system that already "thinks" through buttons, forms, nav, dialogs, etc.
- Practical use with Claude Design: pull the Figma kit or docs, extract the token logic and component patterns, then tell Claude to generate in that style rather than "make me a nice app."

### Fluent Design

- Microsoft's design system, mainly associated with Windows and Microsoft 365 style products.
- Similar appeal: mature components, clear interaction patterns, enterprise-friendly UI conventions.
- Best for: dashboards, internal tools, productivity software, enterprise apps.
- Why it matters: same logic as Material Design, but with a more desktop/productivity feel.

### Preline UI

- A Tailwind-based component library.
- Useful because Claude-generated web code often maps more cleanly to Tailwind than to abstract design tokens.
- Best for: landing pages, SaaS dashboards, web app shells, fast prototyping.
- Why it's practical: you can lift patterns/components almost directly into code-oriented AI workflows.

### TailGrids

- Another Tailwind UI kit.
- Same value proposition as Preline: ready-made, web-oriented blocks that Claude can mirror with less translation loss.
- Good when you want speed and decent-looking web UI without building a full design system first.

### Untitled UI

- Mentioned for layout patterns in a hybrid workflow.
- The idea is not "copy Untitled UI wholesale," but borrow its structure and information architecture, then swap in your own brand layer.

---

## 3. BFT-specific evaluation

Two filters narrowed the field hard:

### Filter A — App profile

| Constraint | Implication |
|---|---|
| Mobile-first, touch-driven | Need 44px+ targets, gesture-friendly patterns |
| No build step (vanilla HTML/CSS/JS) | Tailwind-tooling kits cost a build pipeline to adopt cleanly |
| Form-dense (dropdowns, multi-checkbox, number steppers) | Need a system that thinks through form components |
| Card + modal + chart layout | Need elevation, corner-radius, scrim conventions |
| Personal fitness logger | Aesthetic should feel athletic, not corporate |

### Filter B — Free tier only

| Framework | Free tier | Verdict |
|---|---|---|
| **Material Design** | 100% free, Apache 2.0. Full spec, tokens, Figma kit, Web Components — no gating. | Strongest |
| **Fluent Design** | 100% free, MIT. Full kit free. | Wrong category (corporate) |
| **Preline UI** | ~800 components free. Pro = templates + Figma. | Strong free tier, but requires Tailwind |
| **TailGrids** | ~150 components free. Pro = 600+. | Free tier too thin |
| **Untitled UI** | ~250 Figma components free. Pro = polished templates ($349). | Free is reference-only (Figma, no code) |

### Final pick — Material Design 3

Reasoning, in order of weight:

1. **Mobile-first DNA** matches the BFT use case directly.
2. **Form patterns** (outlined text fields, chips for multi-select, dialogs, FAB) map 1:1 onto BFT's existing form needs.
3. **Token system** plugs cleanly into the existing `:root` CSS custom properties — no architecture change needed.
4. **No build step required** to adopt as a design language. Material Web Components are CDN-loadable if we ever want drop-ins.
5. **Truly free, no Pro wall.** Important for a personal project.
6. **Accessibility defaults** (contrast, focus rings, motion tokens) come for free.

### What we ruled out and why

- **Fluent** — wrong aesthetic for a fitness app; too corporate.
- **Preline** — solid runner-up. Lost only because adopting Tailwind violates the no-build-step principle. Would re-evaluate if a build pipeline ever lands.
- **TailGrids** — Preline's free tier is meaningfully larger; no reason to pick TailGrids free over Preline free.
- **Untitled UI** — at the free tier it's a Figma kit only. Useful as inspiration; not a code path.

---

## 4. Implementation experimentation

A separate branch (`material-design-revamp`) was used so the existing design stayed intact. The key implementation decisions and their outcomes are below.

### 4.1 Architectural decision — overlay stylesheet, not rewrite

The existing `style.css` is ~3,200 lines. Two paths were available:

- **(A)** Rewrite `style.css` from scratch in M3 idiom.
- **(B)** Keep `style.css` and add a `material.css` that loads after it, overriding tokens + components.

We chose (B). Reasoning:

- Lower blast radius — original CSS still fully functional if `material.css` is removed.
- Easy A/B comparison — toggle a single `<link>` tag to switch designs.
- Cheaper in tokens/time — ~700 lines of overrides vs. ~3,200 lines rewritten.
- Forces discipline — the override layer must use M3 tokens consistently or nothing flows through.

Trade-off: every override needs `!important` to win specificity wars. Acceptable cost; documented in the file header.

### 4.2 Color seed

- Source brand color: `#64B5F6` (sky blue).
- New seed: `#1B5EFA` (electric blue).
- Why changed: the original sky blue felt soft for a fitness app. M3 expressive palettes work best when seeded from a richer, more saturated hue. The athletic-blue seed produced more energetic primary-container and tertiary-container roles without feeling corporate.

### 4.3 Tokens implemented

A complete M3 token set lives at the top of `public/css/material.css`:

- **Color roles** — primary, secondary, tertiary, error, success (plus container + on-* variants for each)
- **Surface tones** — surface-container-lowest through highest (5 levels)
- **Shape** — xs/sm/md/lg/xl/full corner radii
- **Elevation** — 5-level shadow system with both ambient + directional shadow stacks
- **Motion** — standard, emphasized, decel easing curves; short/medium/long durations
- **Type scale** — applied via h1-h4 and label rules using Roboto

Legacy variables (`--primary-color`, `--bg-color`, etc.) are remapped to point at the M3 tokens, so any deep code in `style.css` that references them automatically picks up the new values.

### 4.4 Components restyled

| Component | Class(es) | M3 pattern applied |
|---|---|---|
| Top app bar | `.navbar`, `.nav-link` | Surface-container background, pill-shaped nav links with secondary-container active state |
| Cards | `.card` | Surface-container-lowest with elev-1, elev-2 on hover, 16px radius |
| Buttons | `.btn-primary/-secondary/-outline/-success/-danger` | Filled / filled-tonal / outlined / colored variants on full-pill shape |
| Text fields | `input`, `textarea`, `select` | M3 outlined style with 2px focus border that compensates padding |
| Chips | `.category-checkbox` (filter chip behavior) | Outlined → filled-tonal on selection, with checkmark prefix |
| Dialog | `.modal-content` | 28px corners, scrim with blur, headline-style title, icon close button |
| FAB | `.md-fab`, `.md-fab-extended` | Primary-container fill, elev-3, fixed bottom-right with safe-area inset |
| Snackbar | `.toast` | Inverse-surface dark pill with intent variants |
| Stat tiles | `.stat-item` | Primary-container surface with display-style numeric value |
| List items | `.workout-item-expandable` | Surface-container-low with hover elevation shift |

### 4.5 Components added (not in original)

- **Material Symbols icons** — `.material-symbols-rounded` helper class with proper font-feature-settings for ligature resolution. Used in the FAB ("add" icon).
- **Extended FAB** — placed on Library page for the "+ New Exercise" action. Future-eligible: Plan page (add station), Progress page (log selected exercise).
- **Dark mode** — full M3 dark palette via `@media (prefers-color-scheme: dark)`.

### 4.6 Polish iterations

After initial render, four rough edges surfaced and were resolved:

| Issue | Root cause | Fix |
|---|---|---|
| Cropped reps/weight dropdowns | Global 48px min-height applied to small inline selects | Scoped exemption: `.variable-weight-select` and `.variable-rep-input` get 40px min-height + tight padding + smaller arrow asset |
| `adj` button looked off | Inheriting global `.btn` shape | Recast as M3 small text-button (transparent, primary color, 28px height) |
| `With cadence` toggle | Same — looked like an oversized button | Recast as M3 outlined chip with filled-tonal active state |
| Pagination + compact action buttons (`.btn-compact`, `.btn-page-nav`) | Same — over-styled | Small-variant pill buttons with intent-coded color (primary / tertiary / error) |

These polish rules are scoped narrowly so they don't undermine the global button pattern.

---

## 5. Lessons learned

Concrete, portable observations from the experimentation:

### Design-system-level

- **Picking a seed color matters more than picking a framework.** M3 generates an entire tonal palette from one input — get the seed wrong and every container surface feels off.
- **Token remapping is the cheapest migration.** Legacy variables like `--primary-color` mapped to new M3 tokens propagated 90% of the visual change without touching component CSS.
- **`!important` is acceptable in an overlay layer if the layer is the last load.** It's a code smell in a primary stylesheet; in an explicit override file with a header that documents the intent, it's a feature, not a bug.
- **Don't half-adopt M3.** The typography scale and elevation system carry most of the "this looks like a real app" feeling. Skipping them and just changing colors leaves the app looking unchanged.

### App-architecture-level

- **No build step is a real constraint.** It killed Tailwind-based options outright. If the app ever needs richer components than M3 can provide, accepting a minimal Tailwind CLI step is the realistic next move — but only when the cost is justified.
- **Mobile-first lets you skip a lot of complexity.** Many M3 patterns (FAB, bottom navigation, snackbars) only make sense on touch. The desktop view inherits gracefully because the system is responsive by default.

### Process-level

- **Branch-first, mock-first, polish-second.** Building the overlay on a branch with five pages of mockups before any "real" rework let us evaluate the design as a system, not a screen at a time. Every polish iteration was driven by something visible in a screenshot.
- **The "rough edges" list is essential.** Capturing what wasn't right immediately after the first render — even when it wasn't fixed yet — kept the polish pass focused. Without that list, the second pass would have drifted into bikeshedding.

---

## 6. State at time of writing

- **Branch:** `material-design-revamp` (local, uncommitted)
- **Files added:** `public/css/material.css` (~700 lines), `.claude/launch.json`
- **Files modified:** 5 HTML files (font links + theme color); `public/library.html` also gains the FAB markup
- **Files untouched:** `public/css/style.css` (original kept intact)
- **Server:** local Wrangler dev on port 8787
- **Verified pages:** all 5 (Log Workout, Plan, Library, Progress, All Workouts) — light mode and dark mode

### Open follow-ups, in priority order

1. Decide whether to commit the branch or iterate further on palette/spacing.
2. Self-host or `font-display: swap` the Google Fonts to remove the FOUT on slow connections.
3. Add FABs to Plan (add station) and Progress (quick-log selected exercise) for symmetry.
4. Replace remaining emoji and Unicode arrows with Material Symbols where it tightens the visual language (hamburger nav, chevron arrows in expand/collapse, etc.).
5. Wire up real M3 segmented buttons for the existing tab patterns (`.tab-btn` is already styled; just needs the segmented-button container shape).
6. Consider adopting Material Web Components selectively (e.g., real `<md-dialog>`) once the overlay approach has been proven at runtime.

---

## 7. References

- Material Design 3 spec — https://m3.material.io
- Material Symbols (Rounded) — https://fonts.google.com/icons
- Roboto font family — https://fonts.google.com/specimen/Roboto
- Source post that triggered this evaluation — see Section 2 (preserved verbatim)
- Implementation files — `public/css/material.css`, `.claude/launch.json`, all five page HTML heads
