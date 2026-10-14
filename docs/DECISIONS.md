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

## D-013: Design colours map to existing tokens

- Date: 2026-10-14
- Status: Accepted
- Decision: Every colour in the design HTML (Material palette) is mapped to our tokens as listed in docs/design/RECONCILIATION.md §1.2. Need-level dots always use `bg-need-*` (`needLevelClass`), ignoring the dot colours in the Home and Ledger mockups.
- Why: Mockups use a different palette and are inconsistent with each other; tokens are the source of truth (D-012).
- Rejected: Adding the Material tonal palette as tokens.

## D-014: Header and profile menu replace the design's top app bar

- Date: 2026-10-14
- Status: Accepted
- Decision: No logo or "household name" bar. Each screen has a slim header with its title and a profile avatar button. The button opens a dropdown with a Settings (cog icon) link and Log out. PRD §3.5 to be updated to say this.
- Why: The PRD has no entry point to Settings; the mockup header used another product's logo.
- Rejected: Settings as a sixth tab.

## D-015: TransactionRow follows the design layout

- Date: 2026-10-14
- Status: Accepted
- Decision: Row uses a 40 px member avatar with the need-level dot on its corner (design), not the PRD §8 category-icon circle. Avatars show initials only, no photos.
- Why: Owner chose the design layout; no photo storage or image-picker dependency exists.
- Assumption: "Follow design" does not include photo avatars. PRD §3.4/§8 text to be updated.

## D-016: DeltaBadge uses only the PRD colour rule

- Date: 2026-10-14
- Status: Accepted
- Decision: Any spend increase is `debit`, any decrease `credit` (flipped for income and savings), equal is neutral. No threshold for "small" changes.
- Why: A threshold would be an undocumented product rule.
- Rejected: Neutral grey below roughly 10% as seen in the Reports mockup.

## D-017: Reports comparison toggle

- Date: 2026-10-14
- Status: Accepted
- Decision: One "vs previous month" toggle, on by default, labelled like the design ("vs September"). Month-to-date pacing is automatic for the current month only. Hero caption uses the design text ("Paced comparison up to 13 Sep (₹38,150)").
- Why: Follows PRD T5/T6; the mockup merged two controls into one.

## D-018: Text-safe colour tokens and scrim token

- Date: 2026-10-14
- Status: Accepted (token values to be proposed and approved when added in T0)
- Decision: Add tokens for text-safe semantic colours (working names `credit-text`, `warning-text`, darker in light mode, equal to the existing value in dark) and a `scrim` token (40% light / 70% dark). Tinted badges use `foreground` text plus an arrow or sign. Existing token values are not changed.
- Why: In light mode `credit` (3.30:1), `warning` (3.19:1) and tinted badge text fail WCAG AA; AGENTS §10 requires AA. Sheets need a scrim and raw rgba is forbidden.

## D-019: Day total is spend only

- Date: 2026-10-14
- Status: Accepted
- Decision: DaySectionHeader total = expenses for that day. Income and transfers are excluded. To be added to the PRD.
- Why: Matches the design and "transfers never count as spend".

## D-020: Typography mapping without new variants

- Date: 2026-10-14
- Status: Accepted
- Decision: Design text styles map to our six variants as in RECONCILIATION.md §2: 13 px secondary text uses `label` + muted, 11 px labels use `caption`, section headers use `heading`, screen titles use `title`, hero numbers `display`. No letter-spacing, and uppercase section labels become sentence case. Revisit only if it looks wrong on device.
- Why: Keeps the type scale to the PRD's six tokens.

## D-021: CompareBarChart built from ProgressBar rows

- Date: 2026-10-14
- Status: Accepted
- Decision: Category comparison is plain paired bars (this month `bg-foreground`, last month `bg-border`), not a chart library. react-native-gifted-charts stays for Wealth and Projection.
- Why: The design has no axes; simpler and more accessible.

## D-022: Design elements dropped as out of scope

- Date: 2026-10-14
- Status: Accepted
- Decision: Not built: reconciliation footer and `verified` icons (Phase 4), Household/Personal switcher, sticky "Showing N entries" bar, FIRE milestone strip, "On Track" badge, Profile Comparison card, receipt attach button, "Swipe filters", "Quick switch", progress/pace bars with undefined meaning. Re-add only with a PRD entry.
- Why: AGENTS golden rule 9 and D-008.

## D-023: Date and image pickers deferred

- Date: 2026-10-14
- Status: Accepted
- Decision: Receipt and photo features wait for E5. For the date field, propose a package (licence, size) or build a small in-house sheet at T5, and ask then.
- Why: Neither is in the locked stack (AGENTS golden rule 3).

## D-024: No shadows or blur except sheets and FAB

- Date: 2026-10-14
- Status: Accepted
- Decision: Cards use `border-border`, no shadow. No backdrop blur, no coloured FAB glow. Header and tab bar get a 1 px border. Toast is `bg-foreground text-background`.
- Why: AGENTS §5 and PRD §3.3.

## D-025: Missing designs to be commissioned

- Date: 2026-10-14
- Status: Replaced by D-029
- Decision: Ask the design agent for onboarding, Filter sheet, Settings, component sheet, light and dark for every screen, and the missing states (RECONCILIATION.md §5). Wealth and Projection can wait until T12/T14. T0 and T2 need no design.
- Why: Only five light-mode default screens were delivered.

## D-026: FIRE screen details

- Date: 2026-10-14
- Status: Accepted
- Decision: ProgressRing gets a neutral (primary) tone for FIRE. The disclaimer is exactly "Illustrative only. Not investment advice." Assumptions are read-only until T15 with a design for editing. `lib/format.ts` gets compact ₹ L/Cr formatting in T1.
- Why: AGENTS §8, PRD §6.2/6.4.

## D-027: Category icon column

- Date: 2026-10-14
- Status: Accepted
- Decision: `categories` gets an `icon` (text, lucide name) column in T2, seeded for default categories. Ledger search covers note, category and tags.
- Why: Categories are user-editable, so icons cannot be hardcoded in the app.

## D-028: File and folder naming

- Date: 2026-10-14
- Status: Accepted
- Decision: Rename `Decisions.md` and `setup.md` to `DECISIONS.md` and `SETUP.md`, move `DESIGN.md` to `docs/design/design.md`, and name screen folders `01-onboarding` … `09-fire` as designs arrive.
- Why: AGENTS.md and BUILD-PLAN refer to these names; case matters on Linux and CI.
- Note: Done 2026-10-14. Screen folders are 02-quick-add, 03-ledger, 04-home, 05-reports, 09-fire; `screen.png` renamed to `light.png` (all mockups are light only).

## D-029: Missing designs are built from tokens, not commissioned

- Date: 2026-10-14
- Status: Accepted
- Decision: Onboarding, Filter sheet, Settings, Wealth, Projection, dark mode and all missing states are built from the PRD, tokens, existing components and the five delivered screens as style reference. Each plan lists them under "no design, built from tokens", and each report lists them under "Design deviations". The component sheet is replaced by the PRD §3.4 tables and `app/dev/gallery.tsx`.
- Why: Owner decision; avoids waiting on the design agent.
- Replaces: D-025.

## D-030: Text-safe tokens and scrim added in T0

- Date: 2026-10-14
- Status: Accepted
- Decision: Added `credit-text` (light #15803D, dark #4ADE80), `warning-text` (light #B45309, dark #FBBF24) and `scrim` (black at 40% light / 70% dark). All text-safe values are at least 4.5:1 on background, card and muted. The `Text` tones `credit` and `warning` now use them. Existing token values are unchanged.
- Why: Implements D-018; `credit` and `warning` fail WCAG AA as text in light mode.

## D-031: i18n from day 0 without a library

- Date: 2026-10-14
- Status: Accepted
- Decision: All user-facing strings go through `t(key)` from `lib/i18n.ts`, with English in `locales/en.json` and typed keys. Locale detection and switching are added later (Settings).
- Why: Owner wants the app translatable from the start for open-source use; no dependency needed yet.

## D-032: Test tooling

- Date: 2026-10-14
- Status: Accepted
- Decision: Dev dependencies `jest`, `jest-expo` (~56, matching the SDK) and `@testing-library/react-native`. Tests import `describe/it/expect` from `@jest/globals`; `@types/jest` is not used. RNTL v14 `render` is async, so tests `await` it.
- Why: Needed for `npm run check`; `jest-expo@57` targets RN 0.86 and does not install on SDK 56.

## D-033: In-house primitives, not NativeWindUI Button

- Date: 2026-10-14
- Status: Accepted
- Decision: `components/ui/Button` is built in-house (primary, secondary, ghost, destructive; loading; disabled). NativeWindUI's `Button` stays untouched and unused by screens. `components/ui/Icon` wraps lucide icons (stroke 1.75, colour from a text-token class). `Toast` ships with a `ToastProvider`/`useToast` that is mounted only in the dev gallery until T5.
- Why: NativeWindUI's Button uses `rounded-full`, raw pixel sizes and hex ripple colours, and has no destructive or loading variant (AGENTS §1.4, §5).

## D-034: Jest setup for native modules

- Date: 2026-10-14
- Status: Accepted
- Decision: `jest.setup.ts` mocks Reanimated, Worklets and safe-area-context and loads the gesture-handler setup. `package.json` maps `lucide-react-native` to its CJS build, because the preset cannot transform its `.mjs` files.
- Why: Component render tests need these under Jest.
