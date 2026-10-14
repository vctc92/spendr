# AGENTS.md — Rules for AI coding agents working on Spendr

You are contributing to **Spendr** ("Spend smart, together."), a free, open-source (MIT) household expense, wealth and FIRE tracker built with Expo. These rules are mandatory. If a request conflicts with them, stop and say so instead of guessing.

- Product spec: `docs/PRD.md` (read the relevant section before building a feature).
- Decision log: `docs/DECISIONS.md` (read it every session; never undo a listed decision).
- Setup: `SETUP.md`.
- Designs: `docs/design/`.

---

## 1. Golden rules (never break these)

1. **Zero cost.** Never add a paid service, paid API, paid component or anything that needs a credit card. Free tiers only.
2. **No NativeWindUI Pro code.** Use only free NativeWindUI components. If a Pro component would help, build an equivalent in `components/ui/` instead.
3. **No new dependencies without asking.** Use the locked stack in section 2. If something is truly missing, propose the package, its licence, size and why, then wait for approval.
4. **Design tokens only.** No hex codes, `rgb()`, named colours or magic pixel values in components or screens. Use NativeWind classes mapped to tokens.
5. **Money is integers.** Store and compute amounts in minor units (paise / cents) as integers. Never use floating point for money.
6. **Security.** Never commit secrets. Only `EXPO_PUBLIC_SUPABASE_URL` and the anon/publishable key may reach the app. Never use the service-role key in client code. Every table has Row-Level Security.
7. **Privacy.** Never log amounts, notes, account numbers, emails or message text. Never send user data to third-party services.
8. **Supabase stays in `data/`.** Only files inside `data/` may import Supabase. Screens, components, hooks and `engine/` never do (see section 7.1).
9. **Record decisions.** When the owner approves a decision or an assumption, add an entry to `docs/DECISIONS.md` in the same task (see section 15). Never contradict an existing entry; propose a replacement entry instead.
10. **Stay in scope.** Build only what the task and PRD describe. Don't add features, screens, settings or "improvements" nobody asked for. Don't refactor unrelated code.
11. **Leave it green.** `npm run check` (typecheck, lint, tests) must pass before you finish.
12. **Ask when unsure.** If requirements are ambiguous, ask one clear question, or make the simplest choice and list it under "Assumptions" in your summary.

---

## 2. Locked tech stack

| Concern             | Use                                                                                                | Do not use                                                                      |
| ------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Framework           | Expo (managed, dev client) + TypeScript (strict)                                                   | Bare React Native CLI, JavaScript files                                         |
| Routing             | Expo Router (file-based, `app/`)                                                                   | React Navigation directly                                                       |
| Styling             | NativeWind (`className`) + `cn()` + `class-variance-authority`                                     | `StyleSheet.create` for visual styling, styled-components, inline colour styles |
| Components          | Free NativeWindUI → `components/nativewindui/`; in-house → `components/ui/`, `components/finance/` | React Native Paper, Tamagui, gluestack, UI Kitten, any other kit                |
| Icons               | `lucide-react-native`                                                                              | Other icon packs, emoji as icons                                                |
| Charts              | `react-native-gifted-charts`                                                                       | Victory, chart.js, D3 in the app                                                |
| Lists               | `@shopify/flash-list`                                                                              | `FlatList`/`ScrollView` + `map` for long lists                                  |
| Server state        | `@tanstack/react-query` (+ persister)                                                              | Redux, MobX, fetching in `useEffect`                                            |
| Local UI state      | `useState` / `useReducer` / React context                                                          | Global stores unless approved                                                   |
| Offline queue       | `expo-sqlite`                                                                                      | AsyncStorage for queued writes                                                  |
| Backend             | Supabase (`@supabase/supabase-js`): Postgres, Auth, Realtime, Edge Functions                       | Firebase, custom servers                                                        |
| Forms               | `react-hook-form` + `zod`                                                                          | Formik, manual validation                                                       |
| Dates               | `date-fns`                                                                                         | moment, dayjs                                                                   |
| Number/money format | `Intl.NumberFormat` via `lib/format.ts`                                                            | Hand-rolled formatting                                                          |
| Animation / haptics | `react-native-reanimated`, `expo-haptics`                                                          | Animated API for new code                                                       |
| Tests               | `jest-expo`, `@testing-library/react-native`                                                       | —                                                                               |

---

## 3. Project structure

```
app/                  Routes only. A route file renders a screen; no business logic or queries inside.
components/
  nativewindui/       Free NativeWindUI primitives. Don't edit unless fixing a bug; never add Pro code.
  ui/                 In-house primitives (Card, ListRow, Chip, Badge, Skeleton, …).
  finance/            Domain components (AmountText, DeltaBadge, TransactionRow, …).
features/<feature>/
  hooks/              React Query hooks that call the data layer (useTransactions, useMonthlyReport, …).
  components/         Components used only by this feature.
  schema.ts           zod schemas for this feature's forms and payloads.
engine/               Pure TypeScript domain logic: money, reports, projections, FIRE, matching.
                      No React, no React Native, no Supabase imports. 100% unit tested.
data/                 The ONLY place that talks to the backend (see section 7.1).
  index.ts            Simple functions the app calls: getTransactions, addTransaction, signIn, …
  types.ts            Our own data types (Transaction, Household, …), not Supabase's.
  supabase/           Supabase client and all Supabase code. Swap this folder to change backend.
lib/                  query-client.ts, cn.ts, format.ts, env.ts.
theme/                tokens.ts and NativeWindUI theme files.
types/database.ts     Generated by `npm run db:types`. Never edit by hand.
supabase/migrations/  SQL migrations. Never edit an applied migration; add a new one.
```

Dependency direction: `app → features → components/finance → components/ui|nativewindui → theme`. `features/*/hooks` call `data/`. `engine` and `lib` can be imported by anything; they import nothing from the UI layers or `data/`.

---

## 4. TypeScript and code style

- `strict: true`. No `any`, no `@ts-ignore`, no non-null `!` unless commented with a reason.
- Named exports only (except route files, which Expo Router requires as default exports).
- Files: `PascalCase.tsx` for components, `camelCase.ts` for everything else, `kebab-case` for route segments.
- Components are function components with a typed `Props` type. Keep them under ~200 lines; split otherwise.
- Imports use the `@/` alias, never long `../../..` chains.
- Prefer small pure functions. No commented-out code, no `console.log` left behind.
- Comments explain _why_, not _what_.
- Prettier formats everything (with the Tailwind plugin sorting classes). Don't hand-format.

---

## 5. Styling and design system

- Every visual style uses NativeWind classes backed by tokens in `global.css` / `tailwind.config.js`. Values are listed in `docs/PRD.md` section 3.3.
- Allowed colour classes: `background`, `card`, `foreground`, `muted`, `muted-foreground`, `border`, `primary`, `primary-foreground`, `destructive`, `credit`, `debit`, `warning`, `need-must`, `need-necessary`, `need-nice`, `need-avoidable`. Need a new colour? Add a token and ask first.
- Spacing on the 4-pt grid (`p-4`, `gap-3`, …). Radius: `rounded-lg` (8) inputs and chips, `rounded-xl` (12) cards, `rounded-2xl` (16) sheets, `rounded-full` pills.
- Cards: `bg-card border border-border rounded-xl`, **no shadow**. Shadows only on sheets and the FAB.
- Text always through the design-system `Text` component with a variant (`display`, `title`, `heading`, `body`, `label`, `caption`). Never import `Text` from `react-native` in screens.
- Amounts always through `AmountText` (tabular figures, locale grouping, sign, tone).
- Red/green only for meaning; `DeltaBadge` decides colour for changes. Screens never pick red or green themselves.
- Every screen must work in **light and dark** mode and at 200% font scale.
- Variants use `cva`; merge classes with `cn()`. Don't build class strings with template literals and conditionals.
- `style={}` is allowed only for dynamic values that classes can't express (chart sizes, animated values).
- Icons: lucide, 20 in rows, 24 in tab bar, `strokeWidth={1.75}`, colour from text tokens.

---

## 6. Component rules

- **Reuse first.** Before creating a component, search `components/` for an existing one. The planned set is in PRD section 3.4.
- Primitives (`components/ui`) know nothing about money or the domain. Finance components (`components/finance`) know the domain but never fetch data. Feature components may use hooks.
- Every new or changed component must:
  - support all states in PRD section 3.4 (loading skeleton, empty, error, disabled, as relevant);
  - be added to `app/dev/gallery.tsx` in every variant;
  - have `accessibilityRole` and `accessibilityLabel` on anything pressable;
  - keep touch targets at least 44 × 44.
- Lists with more than ~20 possible rows use `FlashList`.
- Bottom sheets use the shared `Sheet` primitive; confirmations of destructive actions use `ConfirmSheet`.

---

## 7. Data, Supabase and offline

### 7.1 The data layer (keep Supabase swappable)

- All backend code lives in `data/`. Only files in `data/supabase/` import `@supabase/supabase-js` or use the Supabase client.
- `data/index.ts` exports plain functions with our own types, e.g. `getTransactions(householdId, filter)`, `addTransaction(input)`, `deleteTransaction(id)`, `onTransactionsChange(householdId, callback)`, `signInWithEmail(email)`. Nothing Supabase-specific (rows, errors, channels, generated types) leaks out of `data/`.
- Hooks in `features/*/hooks/` call these functions through React Query. Screens and components use the hooks, never `data/` directly.
- `data/types.ts` defines app types; `data/supabase/` maps database rows to them.
- To change backend later, only `data/supabase/` is replaced; nothing else in the app should need to change. If a task would make other code depend on Supabase, stop and ask.

### 7.2 Where logic lives

- **Database (Postgres):** rules that must always hold — RLS, constraints (e.g. transfers have no category), household creation, report aggregate views. Use our own `app.current_user_id()` SQL function instead of calling `auth.uid()` everywhere.
- **`engine/` (on the phone):** calculations on data the user can already see — reports, pacing, projections, FIRE.
- **Edge Functions:** only work that needs secrets, schedules or runs while the app is closed. Keep them thin; logic goes in `engine/`.

### 7.3 Data rules

- React Query keys are arrays starting with the entity: `['transactions', householdId, filters]`, `['report', householdId, month]`. Invalidate precisely after mutations.
- Use generated types from `types/database.ts`. Parse untrusted input (forms, deep links, ingest payloads) with `zod`.
- Every new table:
  - has `household_id` (or links to one) and RLS policies that allow access only to household members; private-account rows only to their owner;
  - has `created_at` / `updated_at` (`timestamptz`, default `now()`);
  - is created in a new migration file with a descriptive name;
  - is followed by `npm run db:types`.
- Prefer Postgres views or RPC functions for reports and aggregates over pulling raw rows to the client.
- **Offline:** creating or editing a transaction must work offline. Writes go to the `expo-sqlite` queue with a client-generated UUID, show a "not yet synced" indicator, and sync when online. Sync must be idempotent (upsert by id).
- Realtime subscriptions only for the shared ledger; unsubscribe on unmount.

---

## 8. Domain rules (from the PRD — do not change without updating the PRD)

- **Money:** `amount_minor` is a `bigint` integer in minor units plus the household `base_currency`. Convert to display only in `lib/format.ts`. Rounding happens once, at display.
- **Transaction types:** `expense`, `income`, `transfer`. Transfers never count as spending or income in any report.
- **Need levels:** exactly `must_have`, `necessary`, `nice_to_have`, `avoidable` (display labels may be renamed by users). Each category has a default level; an entry can override it.
- **Tags:** lowercase, trimmed, no spaces (use `-`), stored without the `#`.
- **Dates:** store `timestamptz` in UTC. Month boundaries and "today" are computed in the household time zone (default `Asia/Kolkata`).
- **Month-to-date pacing:** compare this month up to day N with the previous month up to the same day N (clamped to that month's length).
- **Monthly essentials:** 3-month average of `must_have` + `necessary` expenses.
- **Projections and FIRE:** formulas in PRD section 6 live only in `engine/`. FIRE profiles: Very strict (m 1.25, w 3.0%, real 4%), Conservative (1.0, 3.5%, 5%), Liberal (1.0, 4.0%, 6%). Projection screens always show the "Illustrative only. Not investment advice." caption.
- **Phases:** Reconciliation (SMS/email, bank events, matching) is **Phase 4**. Don't build it, or tables for it, until a task explicitly says Phase 4.

---

## 9. Security and privacy

- Secrets live only in `.env` (git-ignored) and GitHub/EAS secrets. Read env vars through `lib/env.ts`, validated with zod.
- Auth tokens are stored with `expo-secure-store`, never plain AsyncStorage.
- No analytics, crash-reporting or tracking SDKs without approval.
- No logging of personal or financial data, even in development. Errors shown to users never include raw database messages.
- Delete flows (entry, member leaving, "delete everything") must actually delete the data, not just hide it.

---

## 10. Accessibility and localisation

- WCAG AA contrast in both themes. Never convey meaning by colour alone (pair with an arrow, sign or label).
- Respect OS font scaling and "reduce motion".
- Every user-facing string goes through the i18n helper (`t('key')`) from day one; English strings live in `locales/en.json`.
- Format numbers, currency and dates with the user's locale (Indian grouping ₹1,23,456 for `en-IN`).

---

## 11. Testing

- `engine/` functions: unit tests for every function, including edge cases (zero, negative, month ends, leap years, empty data, transfers excluded). Aim for 100% coverage there.
- `lib/format.ts`: tests for ₹ and $ formatting and sign handling.
- Finance components: at least one render test per variant.
- Bug fixes start with a failing test that reproduces the bug.
- Tests never call the real Supabase project; mock the functions in `data/index.ts`.

---

## 12. Git workflow

- Branches: `feat/<short-name>`, `fix/<short-name>`, `chore/<short-name>`, `docs/<short-name>`.
- Commits follow Conventional Commits: `feat(reports): add month-to-date pacing`.
- One concern per pull request; keep PRs small (ideally under ~400 changed lines).
- Never commit: `.env`, build outputs, APKs, `node_modules`, NativeWindUI Pro code, real bank messages or personal data (use anonymised fixtures).

---

## 13. Do not

- Do not install packages, change Expo SDK versions or edit `app.json` / `eas.json` without being asked.
- Do not edit `types/database.ts` by hand or modify an existing migration.
- Do not disable lint rules, TypeScript checks or tests to make things pass.
- Do not put business logic in route files or components; it belongs in `engine/`, `features/*/hooks` or the database (see section 7.2).
- Do not import Supabase anywhere outside `data/supabase/`.
- Do not hardcode user names, currencies, categories or sample data in production code (seed data goes in `supabase/seed.sql`).
- Do not use `setTimeout`/polling where Realtime or React Query refetching fits.
- Do not create placeholder or mock screens and present them as finished.
- Do not rewrite large parts of the codebase when a small change solves the task.

---

## 14. Definition of Done

Before you say a task is complete, confirm each item:

- [ ] Matches the PRD section and design for this feature; nothing extra added.
- [ ] Uses only locked-stack libraries and token-based styles (no hex, no new colours).
- [ ] Loading, empty, error and offline states handled where relevant.
- [ ] Works in light and dark mode, and at large font sizes.
- [ ] New or changed components added to the dev gallery.
- [ ] Domain logic in `engine/` with unit tests; money in integer minor units.
- [ ] New tables have RLS policies and a migration; types regenerated.
- [ ] No secrets, no personal-data logging, no Pro components.
- [ ] `npm run check` passes.
- [ ] Summary written: what changed, files touched, how to test, assumptions and open questions.

---

## 15. How to report your work

End every task with a short summary:

1. **What changed:** one or two sentences.
2. **Files:** list of files added or modified.
3. **How to test:** steps on the device or commands to run.
4. **Assumptions:** anything you decided without explicit instruction.
5. **Decisions logged:** entries added to `docs/DECISIONS.md` (or "none"). Add an entry for any approved decision about libraries, tokens, schema, scope, phases or design-vs-PRD conflicts.
6. **Follow-ups:** anything left out of scope.

---

## 16. Working from designs

Design files live in `docs/design/`:

```
docs/design/
├─ design.md                  # Global design notes from the design agent (principles, tokens, components)
├─ components/                # Component sheet: .png and .html
└─ screens/<NN-screen-name>/  # One folder per screen: .png images (light, dark, states) and .html mockups
```

### 16.1 What each file is for

| File                                | Use it for                                                                                                                                 | Never use it for                   |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------- |
| `.png`                              | The visual truth: layout, hierarchy, what is on screen in each state and theme                                                             | Measuring exact pixels             |
| `.html`                             | Exact text strings, structure and order of elements, spacing and sizes as hints, interaction states you can see by opening it in a browser | Copying markup or CSS into the app |
| `design.md`                         | Design intent: principles, component descriptions, behaviour notes                                                                         | Overriding our tokens or the PRD   |
| Figma link (`link.txt`, if present) | Extra detail via the Figma MCP server when connected                                                                                       | —                                  |

### 16.2 Which source wins

When sources disagree, follow this order and report the conflict:

1. `AGENTS.md` and the token files (`global.css`, `tailwind.config.js`, `theme/tokens.ts`) — how things are built and styled.
2. `docs/PRD.md` — behaviour, data, rules and scope.
3. The screen's `.png` images — visual layout.
4. The screen's `.html` — structure, copy and spacing details.
5. `docs/design/design.md` — general intent.

Example: if `design.md` or the HTML says the accent is `#5B4FE9` but `global.css` has `#4F46E5`, use the token (`bg-primary`) and list it under "Design deviations". Never edit token values unless the task explicitly says so.

### 16.3 Translating HTML mockups to React Native

The HTML is a web mockup. Rebuild it natively; don't port it.

- `div`/`section` → `View`; any text → our `Text` component with a variant; `button` → `Button`/`IconButton`; `input` → `TextField`; repeated rows → `FlashList` + the matching finance component.
- Translate web classes or CSS to **our** NativeWind token classes. A value that isn't a token maps to the nearest token (e.g. `padding: 14px` → `p-4`, `#666` → `text-muted-foreground`).
- Ignore web-only things: hover styles, `<link>` font imports, CSS grid tricks, box-shadows on cards, gradients, `position: fixed` hacks, inline SVG icons (use lucide icons with the same meaning).
- Copy visible text (titles, labels, button text, empty-state copy) exactly, through the i18n helper.
- Sample data in the HTML (names, amounts, merchants) is not app code. Use it only in `supabase/seed.sql` or tests.
- Never add any `.html` file, web CSS or design-tool output to `app/`, `components/` or `features/`.

### 16.4 How to work on a screen

- **Read before coding.** Open every `.png` and `.html` in the screen folder, plus the relevant parts of `design.md`. In your plan, list each visible element and map it to an existing component, or mark it NEW with proposed props and states.
- **Components beat one-offs.** If something looks like an existing component with small differences, use the component. If it is genuinely new, propose it in the plan before building.
- **Design vs PRD conflicts.** The PRD wins for behaviour and data; the design wins for layout and visual hierarchy. Report conflicts; never silently choose.
- **All states.** Build every state shown in the folder (empty, loading, error, offline). If the PRD needs a state with no image, build it from existing components (`EmptyState`, `Skeleton`) and mention it.
- **Real data path.** Screens read data through `features/*/hooks` (which call `data/`); nothing from the mockup is hardcoded.
- **One screen per task.** Don't start, refactor or "prepare" other screens.
- **Self-check.** Before finishing, compare your screen with every `.png` in light and dark and list what still differs under "Design deviations".
