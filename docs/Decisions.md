# Spendr — Decision Log

Every important decision, newest at the bottom. Agents read this at the start of every session and must not undo a decision listed here. To change one, add a new entry that replaces it (don't edit or delete old entries).

**When to add an entry:** choosing or rejecting a library, changing a token or design rule, a data-model or schema choice, changing scope or phases, resolving a design-vs-PRD conflict, or any assumption the owner approved.

**Format:**

```
## D-XXX: Short title
- Date: YYYY-MM-DD
- Status: Accepted | Replaced by D-YYY
- Decision: what we chose, in one or two sentences.
- Why: the main reason.
- Rejected: alternatives considered (optional).
```

---

## D-001: Product name

- Date: 2026-10-14
- Status: Accepted
- Decision: The app is called Spendr, tagline "Spend smart, together."
- Why: Short, modern, easy to remember.

## D-002: Zero cost and open source

- Date: 2026-10-14
- Status: Accepted
- Decision: MIT licence; free tiers only for every service; each household self-hosts its own copy.
- Why: Owner requirement: no money spent, useful to anyone.

## D-003: App framework

- Date: 2026-10-14
- Status: Accepted
- Decision: Expo (React Native) with Expo Router and TypeScript. Android APK via GitHub Releases now; web build or iOS later.
- Why: Both users are on Android today and may move to iPhone; one codebase covers Android, iOS and web.
- Rejected: Plain PWA (no SMS access later), Flutter.

## D-004: UI libraries

- Date: 2026-10-14
- Status: Accepted
- Decision: NativeWind for styling and NativeWindUI for components, free components only. Anything that is Pro in NativeWindUI is built in-house in components/ui.
- Why: Native feel, Tailwind-style tokens; Pro code can't go in a free public repo.
- Rejected: React Native Reusables, React Native Paper, Tamagui, gluestack.

## D-005: Backend

- Date: 2026-10-14
- Status: Accepted
- Decision: Supabase free tier (Postgres, Auth, Realtime, Edge Functions). No custom API server for now.
- Why: Free, no servers to run, live sync built in.

## D-006: Data layer keeps Supabase swappable

- Date: 2026-10-14
- Status: Accepted
- Decision: Only files in data/supabase/ use Supabase. The app calls plain functions from data/index.ts with our own types.
- Why: Lets us change backend later by replacing one folder.

## D-007: Money as integers

- Date: 2026-10-14
- Status: Accepted
- Decision: All amounts are stored and calculated as integers in minor units (paise/cents), column amount_minor.
- Why: Floating-point maths causes rounding errors in totals.

## D-008: Reconciliation moved to Phase 4

- Date: 2026-10-14
- Status: Accepted
- Decision: SMS/email reading and bank matching are built after public launch. No bank_events, matches or devices tables before Phase 4.
- Why: Owner wants daily tracking, reports, tags and need levels first.

## D-009: Need levels and tags

- Date: 2026-10-14
- Status: Accepted
- Decision: Every expense has one need level (Must-have, Necessary, Nice-to-have, Avoidable) and optional free tags.
- Why: Lets the owner see what was really needed each month.

## D-010: FIRE profiles

- Date: 2026-10-14
- Status: Accepted (meaning to be confirmed by owner)
- Decision: Very strict / Conservative / Liberal describe how cautious the assumptions are: multiplier 1.25/1.0/1.0, withdrawal rate 3.0%/3.5%/4.0%, real return 4%/5%/6%.
- Why: Interpretation of the owner's request; PRD open question still asks whether lifestyle levels were meant instead.

## D-011: Spacing base

- Date: 2026-10-14
- Status: Accepted
- Decision: NativeWind inlineRem is 16 (metro.config.js), so Tailwind spacing follows a 4-pt grid (p-4 = 16px).
- Why: NativeWind's default of 14 breaks the 4-pt grid.

## D-012: Design source priority

- Date: 2026-10-14
- Status: Accepted
- Decision: When sources disagree: AGENTS.md and token files > PRD > screen PNG > screen HTML > design.md.
- Why: Keeps the token system intact while following the designs.
