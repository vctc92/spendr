# Spendr — Build Plan and Agent Prompts

How to go from "tokens installed" to a working Phase 0–1 app, one task at a time, with an AI coding agent following `AGENTS.md`.

---

## 1. Before the first task (you do this once)

1. **Check the foundation runs.** `npx expo run:android`, then `npm run check`. Fix anything red before involving the agent.
2. **Add the docs to the repo:** `docs/PRD.md` (the Spendr PRD), `AGENTS.md` and `CLAUDE.md` (containing `@AGENTS.md`) at the root, plus the pointer files for any other tool (see `SETUP.md` §10).
3. **Put the design agent's output into `docs/design/`:**

```
docs/design/
├─ design.md                 # the global design file from the design agent
├─ components/               # component sheet .png and .html
└─ screens/
   ├─ 01-onboarding/         # all .png and .html for this screen
   ├─ 02-quick-add/
   ├─ 03-ledger/
   ├─ 04-home/
   ├─ 05-reports/
   ├─ 06-settings/
   ├─ 07-wealth/  08-projection/  09-fire/   # Phase 2
```

Keep the files the design agent gave you as they are; just place each screen's `.png` and `.html` files in its numbered folder. Name images so the state is obvious if possible (`light.png`, `dark.png`, `empty.png`), but the agent is told to open every file in the folder either way. If you have a Figma link, add it in a `link.txt`.

4. **Optional: connect Figma directly.** If your Figma plan gives you Dev Mode, enable Figma's MCP server and connect it to your agent so it can read exact layers and spacing. The PNG exports are the zero-cost path and are enough on their own.

5. **Commit:** `git add . && git commit -m "docs: add PRD, agent rules and designs"`.

---

## 2. The loop for every task

1. Create a branch: `git checkout -b feat/<task-name>`.
2. Start a **fresh agent session** (fresh context means it re-reads the rules).
3. Paste the **session kickoff prompt** (§3), then the **task prompt** (§5).
4. The agent replies with a **plan only**. Review it: correct component mapping? nothing out of scope? Reply "Approved" or with corrections.
5. The agent builds. Then **you test** on your phone in light and dark mode against the design images.
6. Ask for fixes in the same session until it matches.
7. Run `npm run check`, commit, open a PR, merge to `main`.
8. Tick the task in §4. Next task, new session.

Never let one session do two tasks.

---

## 3. Session kickoff prompt (paste first, every session)

```text
You are working on Spendr, an open-source Expo app. Before doing anything:

1. Read AGENTS.md fully, then docs/DECISIONS.md (never undo a decision listed there). Every rule there is mandatory, especially section 1 (golden rules), section 5 (styling), section 6 (components), section 14 (Definition of Done) and section 16 (working from Figma designs).
2. Read the PRD sections named in the task below (docs/PRD.md).
3. Look at the existing code in components/, features/, engine/, lib/ and theme/ so you reuse what exists.
4. Read docs/design/design.md once, then open EVERY .png and .html file in the design folder named in the task. Follow AGENTS.md section 16: PNG is the visual truth, HTML gives exact text and structure, design.md gives intent, and our tokens and the PRD always win over all of them. Never copy HTML or web CSS into the app; rebuild it with our components and token classes.

Work in two steps:
STEP 1 — PLAN ONLY. Reply with:
  a) what you understood the task to be, in 2–3 sentences;
  b) the components you see in the design, each mapped to an existing component or marked NEW (with proposed props and states);
  c) files you will create or change;
  d) data/hooks/migrations needed;
  e) questions or assumptions.
  Then STOP and wait for my approval. Do not write code yet.
STEP 2 — after I approve, implement exactly the plan, run `npm run check`, compare against the design images in light and dark, and finish with the report format from AGENTS.md section 15 plus a "Design deviations" list.

Do only this one task. Do not start other screens or refactor unrelated code.
```

---

## 4. Task order

| #   | Task                                                        | Phase | Depends on | Done |
| --- | ----------------------------------------------------------- | ----- | ---------- | ---- |
| DS0 | Compare design.md and mockups with our tokens (report only) | 0     | —          | [ ]  |
| T0  | Foundation check + dev gallery                              | 0     | DS0        | [ ]  |
| T1  | Primitive and finance components from the component sheet   | 0     | T0         | [ ]  |
| T2  | Database schema, RLS, seed (Phase 0 tables)                 | 0     | T0         | [ ]  |
| T3  | Supabase client, auth, onboarding and household             | 0     | T1, T2     | [ ]  |
| T4  | Tab layout and FAB                                          | 0     | T1         | [ ]  |
| T5  | Quick add sheet with offline queue                          | 0     | T3, T4     | [ ]  |
| T6  | Ledger with filters                                         | 0     | T5         | [ ]  |
| T7  | Engine: money, months, reports                              | 1     | T2         | [ ]  |
| T8  | Home                                                        | 1     | T6, T7     | [ ]  |
| T9  | Reports                                                     | 1     | T7         | [ ]  |
| T10 | Saved views, budgets, recurring entries                     | 1     | T6         | [ ]  |
| T11 | Settings                                                    | 1     | T3         | [ ]  |
| T12 | Wealth                                                      | 2     | T11        | [ ]  |
| T13 | Engine: projections and FIRE                                | 2     | T7         | [ ]  |
| T14 | Projection screen                                           | 2     | T12, T13   | [ ]  |
| T15 | FIRE screen                                                 | 2     | T13        | [ ]  |

Building components (T1) and the schema (T2) before screens means every screen task is mostly assembly, which is where agents make the fewest mistakes.

---

## 5. Task prompts (paste after the kickoff prompt)

### DS0 — Reconcile the design files with our tokens (report only, no code)

```text
TASK DS0: Compare the design agent's output with our design system. Do NOT change any code or token values.
Read: docs/design/design.md, docs/design/components/ (all .png and .html), and skim every folder in docs/design/screens/.
Compare against: global.css, tailwind.config.js, theme/tokens.ts, PRD section 3 (design system) and AGENTS.md sections 5, 6, 16.
Produce docs/design/RECONCILIATION.md with:
1. Colours: every colour used in design.md and the HTML, mapped to our token, or "NO MATCH" with the nearest token.
2. Typography: sizes, weights and fonts used, mapped to our text variants (display, title, heading, body, label, caption).
3. Spacing and radius values used, mapped to our 4-pt scale and radius tokens.
4. Components seen in the designs, mapped to PRD section 3.4 components, or "NEW" with a one-line description.
5. Screens and states found per folder, and states the PRD requires that have no design.
6. Conflicts between the designs and the PRD (features, data, navigation).
7. Your recommendation for each mismatch: "use existing token", "add token" or "change design".
Then stop. I will decide what to change before any screen work starts. After I reply with my decisions, record each one in docs/DECISIONS.md.
```

### T0 — Foundation check and dev gallery

```text
TASK T0: Verify the design-token foundation and create the component gallery.
PRD: section 3.3 and 3.4. AGENTS.md: sections 5 and 6.
- Confirm global.css, tailwind.config.js, theme/tokens.ts, lib/cn.ts, components/ui/Text.tsx and app/_layout.tsx are consistent (same values in CSS and tokens.ts). Report any mismatch; do not change token values.
- Create app/dev/gallery.tsx: a scrollable screen showing every Text variant and tone, a swatch for every colour token with its name, the four need-level dots, and a light/dark toggle using nativewind's setColorScheme.
- The gallery route must only be reachable in development (__DEV__).
- Add a render test for Text variants.
```

### T1 — Components

```text
TASK T1: Build the component library from the design component sheet.
Design: docs/design/components/ (light.png, dark.png; Figma link in link.txt).
PRD: section 3.4 (component tables). AGENTS.md: sections 5, 6, 16.
- Primitives in components/ui (use free NativeWindUI components from components/nativewindui where one fits; otherwise build in-house): Button (primary, secondary, ghost, destructive; sizes; loading; disabled), IconButton, TextField, Card, ListRow, Chip, Badge, Avatar, ProgressBar, Skeleton, SegmentedControl, Sheet, Toast.
- Finance components in components/finance: AmountText, DeltaBadge, StatCard, CategoryChip, NeedLevelChip, TagChip, TransactionRow, DaySectionHeader, EmptyState, ConfirmSheet. (Charts, MoneyKeypad, FilterBar, MonthPicker, ProgressRing come in later tasks.)
- AmountText takes amountMinor (integer) and currency; formatting goes through lib/format.ts (create it, with unit tests for INR grouping ₹1,23,456, USD, negative and credit "+" sign).
- DeltaBadge owns the red/green rule (spend up = debit, spend down = credit; flipped for income).
- Add every component and every state to app/dev/gallery.tsx. Render test per component.
If this is too large for one pass, propose splitting it into T1a (primitives) and T1b (finance) in your plan.
```

### T2 — Database

```text
TASK T2: Create the Phase 0–1 database schema in Supabase.
PRD: section 4.2 (data model), 2.2 (need levels, tags), 2.3 (sharing), 7.1 (security). AGENTS.md: sections 7, 8, 9.
- Tables now: households, members, accounts, categories (with default_need_level), transactions (amount_minor bigint, need_level enum, tags text[], client-generated uuid id), saved_views. Do NOT create bank_events, matches or devices (Phase 4).
- Enums for member role, account type and visibility, transaction type, need level.
- RLS on every table: members of a household only; private accounts and their transactions visible only to the owner.
- A function to create a household and add the creator as owner in one transaction; default categories with default need levels inserted on creation.
- supabase/seed.sql with the sample household from the design prompts (Arjun, Meera, sample entries) for local testing only.
- Create app.current_user_id() and use it in RLS policies instead of auth.uid().
- Regenerate types/database.ts (used only inside data/supabase/). Write SQL tests or a short manual test script proving another user cannot read the household.
```

### T3 — Auth, onboarding, household

```text
TASK T3: Implement sign-in, onboarding and household creation/joining.
Design: docs/design/screens/01-onboarding/.
PRD: sections 2.3 (H1), 3.6 (Settings, household), 7.1. AGENTS.md: sections 7, 9, 16.
- data/supabase/client.ts with session stored in expo-secure-store; lib/env.ts validating env vars with zod.
- Auth functions in data/index.ts (signInWithEmail, signOut, getCurrentUser, onAuthChange) with our own User type; no Supabase types outside data/.
- Email magic link sign-in (Google sign-in can be a follow-up; say if you defer it).
- Onboarding: sign in → create or join household (join via invite link/code) → quick setup (currency default INR, first account, choose default categories).
- Auth gate in the root layout: signed-out users see onboarding; signed-in users without a household see step 2; others go to tabs.
- features/auth and features/households hooks calling data/ (AGENTS.md section 7.1).
```

### T4 — Tabs and FAB

```text
TASK T4: Create the bottom tab layout and the floating add button.
Design: any screen in docs/design/screens/ showing the tab bar (e.g. 04-home/light.png).
PRD: section 3.5. AGENTS.md: sections 5, 6, 16.
- app/(tabs)/_layout.tsx with five tabs: Home, Ledger, Reports, Wealth, FIRE; lucide icons home, list, bar-chart-3, wallet, flame; colours from tokens.
- Each tab screen is an empty placeholder showing only its title via EmptyState (clearly temporary; later tasks replace them).
- FAB: 56 px, primary colour, bottom-right above the tab bar, on every tab, opening the route app/add.tsx as a modal (create it as an empty sheet for now).
- Lists must get bottom padding so the FAB never covers the last row; expose a shared constant for this.
```

### T5 — Quick add

```text
TASK T5: Build the Quick add sheet with offline support.
Design: docs/design/screens/02-quick-add/.
PRD: sections 2.1 (E1, E2, E8), 2.2 (T1, T2), 3.6 item 2. AGENTS.md: sections 7 (offline), 8, 16.
- MoneyKeypad component (add to gallery). Amount kept as integer minor units while typing.
- Fields: type segmented control, amount, category chips (last-used first), need-level chips pre-selected from the category's default, tags (autocomplete from existing tags, normalised per AGENTS.md §8), account, date, note.
- Form with react-hook-form + zod schema in features/transactions/schema.ts.
- Save writes to the expo-sqlite queue with a client uuid, then syncs to Supabase (idempotent upsert). Show toast "Saved" or "Saved · syncs when online". Light haptic on save.
- Transfers require from/to accounts and never get a category or need level.
- Unit tests for the schema and the sync queue (mock the api layer).
```

### T6 — Ledger

```text
TASK T6: Build the Ledger screen with filters and search.
Design: docs/design/screens/03-ledger/.
PRD: sections 2.2 (T3), 2.3 (H2), 3.6 item 3. AGENTS.md: sections 6, 7, 16.
- FlashList of transactions grouped by DaySectionHeader with day totals (transfers excluded from totals).
- TransactionRow shows member avatar, need-level dot and a not-synced icon for queued items.
- FilterBar component plus Filter sheet: date range, member, account, category, need level, tags, amount range; text search on note/category.
- Filtering runs in Postgres (query params or RPC), not by downloading everything.
- Realtime: new entries from the partner appear without refresh.
- Tap a row → edit in the Quick add sheet; delete via ConfirmSheet.
- States: loading skeleton, empty, no results for filters.
```

### T7 — Engine: money, months, reports

```text
TASK T7: Write the reporting engine (pure TypeScript, no UI).
PRD: sections 2.2 (T5–T9), 6 intro. AGENTS.md: sections 3 (engine), 8, 11.
- engine/money.ts: add, subtract, percentage change, safe for integer minor units.
- engine/months.ts: month boundaries in a given time zone (default Asia/Kolkata), month-to-date window, "same day last month" clamped to month length.
- engine/reports.ts: given transactions, produce totals by category, need level, member and tag for a month and the comparison month, with ₹ and % change; month-to-date pacing; monthly essentials (3-month average of must_have + necessary); insights (top movers, >20% above 3-month average).
- Transfers excluded everywhere. Handle empty months and zero baselines (no divide-by-zero).
- 100% unit-test coverage for engine/, including month ends, 31st vs 30-day months, February, leap years.
- Also a Postgres view or RPC for monthly aggregates so the app doesn't fetch raw rows for reports; the engine can work on aggregated rows.
```

### T8 — Home

```text
TASK T8: Build the Home screen.
Design: docs/design/screens/04-home/.
PRD: sections 3.6 item 1, 2.2 (T6, T9), 2.4 (A4). AGENTS.md: sections 6, 16.
- Hero StatCard: month-to-date spend with DeltaBadge vs same day last month (engine/months + engine/reports).
- Two small StatCards: monthly essentials, savings rate.
- SavedViewPills row (render only if saved views exist; tapping opens Ledger with that filter).
- Recent: last 5 TransactionRows + "See all".
- States: loading, first-launch empty (EmptyState with "Add your first expense" opening Quick add).
```

### T9 — Reports

```text
TASK T9: Build the Reports screen.
Design: docs/design/screens/05-reports/.
PRD: sections 2.2 (T5–T8), 3.6 item 4. AGENTS.md: sections 6, 16.
- MonthPicker component with "vs previous month" toggle.
- Hero total with DeltaBadge and the pacing caption ("Compared up to 13 Sep") only for the current month.
- CompareBarChart (react-native-gifted-charts, colours from theme/tokens.ts), NeedLevelSplitBar with legend, by-member rows, tag table, insights list.
- Tapping a category bar, need level, member or tag opens Ledger filtered to that slice and month.
- States: loading, past full month, not enough data (first month).
- Add the new chart components to the gallery.
```

### T10 — Saved views, budgets, recurring

```text
TASK T10: Saved views, category budgets and recurring entries.
PRD: sections 2.1 (E4, E6), 2.2 (T4). AGENTS.md: sections 7, 8.
- Save the current Ledger filter as a named view; pin/unpin to Home; rename/delete in Settings.
- Monthly budget per category; ProgressRing/ProgressBar states at 80% (warning) and 100% (debit) shown on Reports category rows.
- Recurring entries: schedule (monthly on day N / weekly), created by a scheduled Supabase function or on app open (choose the free option and explain).
- Migrations for any new columns/tables with RLS; types regenerated.
```

### T11 — Settings

```text
TASK T11: Build Settings.
Design: docs/design/screens/06-settings/.
PRD: sections 2.3, 3.6 item 9, 7.1. AGENTS.md: sections 6, 9, 16.
- Household members with roles, invite sheet (email + role), remove member (owner only).
- Accounts (shared/private), categories with default need level, tags (rename/merge), saved views.
- Appearance: System / Light / Dark (persisted), using nativewind setColorScheme.
- Data: export all transactions as CSV (share sheet).
- Danger zone: "Delete everything" with ConfirmSheet requiring the household name; actually deletes data.
- No SMS/email settings (Phase 4).
```

### T12–T15 — Phase 2 (wealth, projections, FIRE)

Use the same pattern:

```text
TASK T<N>: <screen or engine name>.
Design: docs/design/screens/<folder>/.
PRD: sections <numbers>. AGENTS.md: sections <numbers>.
- <bullet list of exactly what to build, taken from the PRD requirement IDs>
- States: <from the design folder>.
- Engine maths only in engine/, with unit tests matching the worked examples in PRD section 6.2 and 6.4.
```

Key checks for these: projections and FIRE numbers must match PRD §6.2 (₹10 L → ₹31.1 L / ₹96.5 L / ₹28.9 Cr) and §6.4 (₹12 L expense → ₹5.0 Cr / ₹3.43 Cr / ₹3.0 Cr) in unit tests, and the "Illustrative only. Not investment advice." caption must appear.

---

## 6. Your review checklist after each task

- [ ] Plan was approved before code was written.
- [ ] Screen matches the design in light and dark; deviations are listed and acceptable.
- [ ] No hex colours or new dependencies in the diff (`git diff main | grep -E "#[0-9A-Fa-f]{3,6}"` should only hit token files).
- [ ] New components appear in the dev gallery.
- [ ] Amounts are integer minor units end to end.
- [ ] Works offline where required (turn on airplane mode and try).
- [ ] Your wife's account sees the change (household sharing) where relevant.
- [ ] `npm run check` passes; PR is one task only.

## 7. When the agent goes wrong

- **Did too much:** "Revert everything outside the task scope. Only <task> was requested (AGENTS.md rule 10)."
- **Hardcoded colours or values:** "Replace all raw values with tokens per AGENTS.md section 5. List what you changed."
- **New library:** "Remove <package>. Use the locked stack in AGENTS.md section 2, or propose it with licence and reason and wait."
- **Skipped states:** "Add the missing states from docs/design/screens/<folder>/ and AGENTS.md section 6."
- **Context drift in a long session:** stop, commit what is good, and start a fresh session with the kickoff prompt.
