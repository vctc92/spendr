# Design reconciliation (task DS0)

Report only. No code, token or PRD changes were made. Compares the design agent's output with our design system.

**Read:** `AGENTS.md`, `docs/Decisions.md`, `docs/BUILD-PLAN.md`, `docs/PRD.md` (§1–3, 4.2, 6.3–6.4, 8), `global.css`, `tailwind.config.js`, `theme/tokens.ts`, `components/ui/Text.tsx`, `docs/design/screens/calm_monastic_precision/DESIGN.md`, and every `.html` and `.png` in the five screen folders.

**Source order used** (AGENTS §16.2, D-012): AGENTS + token files > PRD > PNG > HTML > design.md.

> **Update 2026-10-14:** files and folders were renamed per BUILD-PLAN (`design/design.md`, `screens/02-quick-add`, `03-ledger`, `04-home`, `05-reports`, `09-fire`, `screen.png` → `light.png`, `DECISIONS.md`, `SETUP.md`). Q14 was changed: missing designs are built from tokens (D-029). Paths below are the old ones.

---

## 0. What was delivered vs what the plan expected

BUILD-PLAN §1 and PRD §8 asked for a different set of files than what exists.

| Expected | Found | Impact |
| --- | --- | --- |
| `docs/design/design.md` | `docs/design/screens/calm_monastic_precision/DESIGN.md` (no PNG/HTML) | Read as `design.md`. |
| `docs/design/components/` (component sheet, light + dark) | Missing | T1 has no visual source for components. |
| Numbered folders `01-onboarding` … `09-fire` | `spendr_home`, `spendr_ledger`, `spendr_quick_add_sheet`, `spendr_reports`, `spendr_fire_tracker` | Names differ from the BUILD-PLAN task prompts (`04-home` etc.). Prompts need updating or the folders renaming. |
| `light.png` + `dark.png` + state images per screen | One `screen.png` per screen, light mode only | **No dark-mode design exists.** Dark must be derived from tokens. |
| Screens: onboarding, quick add, ledger + filter sheet, home, reports, settings, wealth, projection, fire | Home, Ledger, Quick add, Reports, FIRE only | **Missing: Onboarding (T3), Filter sheet (T6), Settings (T11), Wealth (T12), Projection (T14), component sheet (T1).** |
| States per prompt (empty, loading, no results, past month, not enough data, Very strict frame, offline) | Default state only | See §5. |
| `docs/DECISIONS.md`, `docs/SETUP.md` | `docs/Decisions.md`, `docs/setup.md` | Case mismatch; matters on Linux/CI. BUILD-PLAN and AGENTS refer to the upper-case names. |

The designs ignore several rules in the PRD §8 prompt the designer was given: shadows on cards, backdrop blur, a web logo image, no dark versions, no component sheet.

---

## 1. Colours

### 1.1 How the design sources relate to our tokens

- **`DESIGN.md` prose** (Colors section) lists 13 light/dark pairs. All 13 match `global.css` and `theme/tokens.ts` exactly.
- **`DESIGN.md` front-matter `colors:`** is a different palette: a Material-3 tonal palette (`surface`, `surface-container-*`, `secondary`, `tertiary`, `error` …). **The HTML mockups use this palette, not our tokens.** Every colour in the HTML therefore needs mapping.
- Material roles are light-only, with no dark values.

### 1.2 Mapping (HTML/Material colour → our token)

| Design colour (hex) | Used for | Our token | Match |
| --- | --- | --- | --- |
| `surface` / `background` `#fbf8ff` | App canvas | `bg-background` (#FAFAFA) | Near. Design has a lavender tint, ours is neutral. Use token. |
| `surface-container-lowest` `#ffffff` | Cards, sheet, keypad keys | `bg-card` | Exact |
| `on-surface` `#1a1b22` | Primary text | `text-foreground` | Near |
| `on-surface-variant` `#464555` | Secondary text | `text-muted-foreground` (#71717A) | Near, but ours is lighter. See §1.4 for contrast. |
| `outline` `#777587` | Placeholder, quiet icons | `text-muted-foreground` | Near |
| `outline-variant` `#c7c4d8`, `surface-container-highest` `#e3e1ec`, `surface-variant` | Hairlines, "last month" bars, inactive tracks | `border-border` / `bg-border` | Near |
| `surface-container` `#eeedf7`, `-low` `#f4f2fd`, `-high` `#e8e7f1` | Chips, segmented track, inputs, recessed areas, bar tracks | `bg-muted` | Near. The design uses 3 tints, we have one. |
| `primary-container` `#4f46e5` | Button, FAB, active bars, toggle on | `bg-primary` | Exact (this is our primary) |
| `primary` `#3525cd` | Links, active tab label, "See all" | `text-primary` (#4F46E5) | **Different hex.** Use token. |
| `on-primary` `#ffffff` | Text on primary | `text-primary-foreground` | Exact |
| `primary-fixed` `#e2dfff` / `primary-fixed-dim` `#c3c0ff` | Selected need chip, Meera avatar, insight icon tile | `bg-primary/10` / `bg-primary/20` | Via opacity modifier (supported by our `rgb(var() / <alpha-value>)` setup) |
| `inverse-surface` `#2f3038` / `inverse-on-surface` | Arjun avatar, toast, active saved-view pill, scrim | `bg-foreground` / `text-background` | Near, and it flips correctly in dark |
| `secondary` `#006e2d` | Credit text, positive icons | `text-credit` (#16A34A) | **Near but much darker.** See §1.4. |
| `secondary-container` `#7cf994`, `secondary-fixed` | Mint badges ("Syncs live", "+3% vs Aug", "-4%"), insight icon | `bg-credit/15` + `text-credit` | Near |
| `error-container` `#ffdad6` / `on-error-container` `#93000a` | Spend-up DeltaBadge, "+38%", insight icon | `bg-debit/15` + `text-debit` | Near |
| `tertiary` `#97000c`, `tertiary-container` `#c20b17` | **Avoidable dot** (Home, Ledger), highlighted % in insights | `bg-need-avoidable` for dots; `text-debit` for insight text | **Design is inconsistent.** See §1.3. |
| `error` `#ba1a1a` | Defined, not seen on screen | `destructive` | n/a |
| Warning amber | Not used in any screen | `warning` | n/a |
| Backdrop `bg-inverse-surface/40` + blur | Sheet scrim | **NO MATCH**: no scrim token. DESIGN.md says rgba(0,0,0,0.4) light / 0.7 dark. | Nearest: none. Raw black/rgba is forbidden (AGENTS §1.4). Needs a token. |
| `rgba(79,70,229,0.35)` | FAB glow | **NO MATCH** (shadow colour) | Use the standard sheet/FAB shadow. No coloured glow. |

### 1.3 Need-level colours are used inconsistently in the designs

| Screen | Must-have | Necessary | Nice-to-have | Avoidable |
| --- | --- | --- | --- | --- |
| Our token (light) | #0F766E teal | #2563EB blue | #A16207 gold | #BE185D pink |
| Quick add, Reports (raw hex in HTML) | #0F766E ✓ | #2563EB ✓ | #A16207 ✓ | #BE185D ✓ |
| Home (dots) | `secondary` green | `primary` indigo | n/a | `tertiary-container` red ✗ |
| Ledger (dots) | `#007230` inline green | `secondary` **green** ✗ | `primary` **indigo** ✗ | `tertiary` red ✗ |

Home and Ledger give need-level dots the wrong colours, and the two screens disagree with each other. A raw hex also appears in the HTML (`#0F766E`, `#2563EB`, `#A16207`, `#BE185D`, `#007230`). **Recommendation:** ignore the HTML dot colours; always use `bg-need-*` via `needLevelClass`.

### 1.4 Contrast findings (light mode fails AA for some semantic text)

Calculated with the WCAG formula on our token values (`python3` script in the session scratchpad; numbers are mine, please spot-check).

| Pair (light) | Ratio | AA normal text (4.5) |
| --- | --- | --- |
| `credit` #16A34A on card | **3.30** | Fails (passes only for large text) |
| `warning` #D97706 on card | **3.19** | Fails |
| `credit` text on its own 15% tint | **2.78** | Fails |
| `debit` text on its own 15% tint | **3.81** | Fails |
| `muted-foreground` on `muted` | 4.40 | Just fails |
| `need-nice` on `muted` | 4.48 | Just fails |
| `debit`, `primary`, `muted-foreground` on card/background, other need colours on card | 4.6–6.3 | Pass |
| **All dark-mode pairs checked** (incl. 15% tints) | 4.78–11.6 | Pass |

The design avoided this by using a much darker green (`#006e2d`, 6.4:1) and dark red (`#93000a`) for text. Our tokens do not have those. AGENTS §10 requires WCAG AA in both themes. See decision **Q7**.

---

## 2. Typography

Font: Inter everywhere. Matches us (Inter 400/500/600 already loaded). Tabular figures are applied globally in the HTML; our `Text` has `numeric`.

| Design style | Spec | Where used | Our variant | Match / note |
| --- | --- | --- | --- | --- |
| `data-display` | 32/36, 600, -0.03em | Hero amounts (Home, Reports), Quick-add amount | `display` (32/40, 600) | Match, except line height 36 vs 40 |
| `headline-xl` | 32/40, 600, -0.02em | Defined, not seen | `display` | Match |
| `headline-lg` | 24/32, 600 | "Ledger" title, FIRE ring % | **NO MATCH** | Ledger title → `title`. Ring % → `display` (PRD: FIRE % is the headline number). |
| `headline-md` | 20/28, 600 | "Financial Overview", Reports section titles, FIRE stat values | `title` (20/28, 600) | Match for screen titles. Section titles → `heading` per PRD §3.3 ("section headers"). |
| `headline-sm` | 18/24, 500 | Sheet title, "Recent", day headers, "Assumptions" | `heading` (17/24, 600) | Near: size 18→17, weight 500→600 |
| `body-lg` | 16/24, 400 | Defined, not seen | `body` (15/22) | Near |
| `body-md` | 14/20, 400 (titles use 500) | Row titles, inputs, descriptions | `body` (15/22, 400) | Near. Medium weight on row titles is lost (no medium body variant). |
| `body-sm` | 13/18, 400 | Row subtitles, helper text | `label` (13/18, **500**) with `tone="muted"` | Size matches, weight 400→500. We have no 13/400. |
| `label-lg` | 14/20, 500 | Buttons | `label` (13/18, 500) | Near |
| `label-md` | 12/16, 500 | Chips, field labels, pills | `label` | Near |
| `label-sm` | 11/14, **600**, often UPPERCASE, +0.04em | Tab labels, badges, "DAY TOTAL", "MONTH TO DATE", "HOUSEHOLD" | `caption` (11/16, **400**) | Size matches, weight 600→400. Heavy use in the design. |
| `data-metric` | 16/20, 600, -0.01em | Row amounts, stat values, tag amounts | `AmountText` body size (15/22) rendered semibold | No exact variant. Needs a rule for `AmountText` weight. |

Not mappable and to be ignored: letter-spacing (we have no tracking token), `cv05` font feature, uppercase on section labels (PRD and §3.3 define no uppercase; DESIGN.md says "reserved for tiny meta badges" but the HTML uses it for ~8 section labels).

---

## 3. Spacing and radius

### 3.1 Spacing

| Design value | Our scale | Notes |
| --- | --- | --- |
| `margin`/`gutter`/`space-lg` 16, `space-xs` 4, `space-sm` 8, `space-md` 12, `space-xl` 24 | `p-4`, `p-1`, `p-2`, `p-3`, `p-6` | Exact. Matches `screenPadding` 16 and `cardGap` 12. |
| 2 (`py-0.5`) | `p-1` (4) | Round to nearest |
| 6 (`gap-1.5`, `px-1.5`) | `p-1` or `p-2` | Equidistant; pick by context |
| 10 (`px-2.5`) | `p-2` or `p-3` | Equidistant |
| 14 (`py-3.5`) | `p-4` | AGENTS §16.3 example |
| Heights: row 64, avatar 40, tab bar 64, header 56, chip 32, button 48 (`h-12`), input/touch 44, FAB 56 | `h-16`, `h-10`, `h-16`, `h-14`, `h-8`, `h-12`, `h-11`, `h-14` | All on the 4-pt grid |
| Keypad key `min-h-[46px]` | `h-11` (44) | **Off-grid.** Recommend 44 (meets the touch target, saves height in a crowded sheet). |
| Handle `w-10 h-1.5`, progress `h-1.5`/`h-2`, split bar `h-4`, FIRE ring `w-52` (208) | `h-1.5` is 6px | Handle and thin bars: `h-1`/`h-2`. Ring: 208 is on grid. |

Chips are 32 high and rounded icons 20–24 in the design. DESIGN.md allows a smaller visible box with a 44×44 hit area; use `hitSlop` on those.

### 3.2 Radius

| Design | Our token |
| --- | --- |
| Cards `rounded-xl` (12 in the HTML config) | `rounded-xl` (12) ✓ |
| Inputs, selects, need chips, keypad keys, buttons (`rounded-xl`, 12) | `rounded-lg` (8) per AGENTS §5 (inputs and chips). Keypad keys: `rounded-lg`. |
| Segmented inner `rounded-lg` (8) | `rounded-lg` ✓ |
| Pills, avatars, dots, FAB, progress bars | `rounded-full` ✓ |
| Sheet top `rounded-t-[28px]` | `rounded-t-2xl` (16) |
| Amount box in sheet `rounded-2xl` (16) | `rounded-xl` (it is a card-like panel, not a sheet) |
| Need badge (display) 12 radius, 24 high | `rounded-full` pill (DESIGN.md "pills"); confirm in Q9 |

Internal conflict: DESIGN.md **prose** says cards are 8px; DESIGN.md **yaml** and the HTML config scale radius differently (yaml: lg = 16, HTML: lg = 8); PRD §3.3 and our tokens say cards = 12. PRD wins: 12.

### 3.3 Elevation (conflict)

The HTML puts `shadow-sm` on every card and row group, `shadow-md` on the primary button and toast, a soft shadow on keypad keys, `shadow-2xl` on the sheet, a coloured glow on the FAB, header and tab-bar shadows, and `backdrop-blur` on header, tab bar and scrim. Cards also have **no border**, relying on the shadow.

AGENTS §5 and PRD §3.3: cards are `bg-card border border-border rounded-xl` with **no shadow**; shadows only on sheets and the FAB; no blur. DESIGN.md prose says the same. **Recommendation:** follow AGENTS; drop all other shadows and blur; give the header and tab bar a 1px `border-border` instead.

---

## 4. Components

Mapped to PRD §3.4. "Exists" means listed in PRD §3.4; none are built yet (only `Text`, and NativeWindUI Button/Icon/ThemeToggle).

| Seen in design | Screens | PRD §3.4 component | Notes |
| --- | --- | --- | --- |
| Tab bar (5 tabs) | all | Navigation §3.5 | Icons → lucide `house`, `list`, `chart-column`/`bar-chart-3`, `wallet`, `flame` at 24, not 22. Active = `text-primary`. Drop blur and shadow. |
| FAB (56, bottom-right) | all | §3.5 | Drop the coloured glow. |
| **Top app bar**: logo image, "HOUSEHOLD / Family Vault", profile button | all five | **NEW** `AppHeader` | Not in PRD. Logo is an external image of a different product ("OpenLedger"). See §6. |
| Greeting + household avatar stack | Home | Avatar (stack variant = **NEW**) | PRD §8 asks for this on Home only. |
| Hero stat card: label, month pill, amount, DeltaBadge, progress bar "68% of pace" | Home | StatCard + DeltaBadge | Progress bar and "68% of pace" are **not in PRD**. See §6. |
| Two mini stat cards (Essentials, Savings rate + "+3% vs Aug") | Home | StatCard | Needs a compact size. |
| Saved view pills (active = inverted dark pill with green dot) | Home | SavedViewPill | Active: `bg-foreground text-background`. Drop the green dot (colour must mean something). |
| Section header with trailing link ("Recent" / "See all") | Home, Reports | Text + Button ghost | Not a component in PRD. Suggest a small `SectionHeader`. |
| Transaction row: 40 initial avatar with need-level dot on its corner, title, tag chip, "Category · Account ••1234", amount, date or time label | Home, Ledger | TransactionRow | **PRD §8 describes a different layout** (36 category-icon circle, 20 member avatar, need dot). See §6. Ledger design uses photo avatars. |
| Pending-sync row (cloud-off glyph + "Pending sync" chip, slightly faded) | Ledger | TransactionRow pending-sync state | ✓ |
| Day section header "Today · 13 Oct … DAY TOTAL ₹4,346" | Ledger | DaySectionHeader | ✓ |
| Search icon button, collapsible search field | Ledger | IconButton + TextField | ✓ |
| "Household" switcher pill | Ledger | **NEW**, not in PRD | See §6. |
| Filter pills with avatar / need dot / "×", "+ Filter", "Save view" | Ledger | FilterBar | ✓ |
| Sticky "Showing 7 entries for Meera · Necessary · Reset" bar | Ledger | **NEW**, not in PRD | Duplicates FilterBar. See §6. |
| "October reconciled · All 7 matched to family vault" footer | Ledger | **NEW, Phase 4** | See §6. |
| Sheet: scrim, handle, title "Log Entry", close button | Quick add | Sheet | ✓ |
| "Syncs live" badge | Quick add | Badge (**NEW** sync-status variant) | Offline version not designed. |
| Segmented control Expense / Income / Transfer | Quick add | SegmentedControl | ✓ |
| Hero amount with caret and "INR · Account balance will update" | Quick add | AmountText (display) in a panel | Caption claims balances update. PRD has only `opening_balance` and no balance feature. Drop caption or confirm. |
| Category chips with icons, "Quick switch", "+ More" | Quick add | CategoryChip | Categories have no icon column (PRD §4.2). "Quick switch" does nothing visible. |
| Need chips 2×2, 44 high, check on selected | Quick add | NeedLevelChip | ✓ (selectable, large). |
| Read-only need badge, 24 high, 15% tint (DESIGN.md only) | none | NeedLevelChip small/display variant | Add as a `size` prop. |
| Account select, Date select | Quick add | Select | Date picker has no package in the locked stack. See Q12. |
| Tag chips (removable) + "Add tag" | Quick add | TagChip | ✓ default/removable/add-new. Autocomplete not designed. |
| Note field with receipt button | Quick add | TextField | Receipt photo is **E5, P1**: not Phase 0. Needs an image picker package. |
| MoneyKeypad 3×4 + full-width "Save Expense (₹2,340)" | Quick add | MoneyKeypad + Button | ✓ |
| Toast "Saved · syncs when online" | Quick add | Toast | Neutral toast, `bg-foreground text-background`, no shadow. |
| Month picker with chevrons | Reports | MonthPicker | ✓ |
| Compare/pacing toggle row | Reports | Toggle | See §6 (one toggle or two). |
| Hero card with pace track and marker | Reports | StatCard + ProgressBar | Marker and track meaning undefined. |
| Compare bars per category (this month vs last month) | Reports | CompareBarChart | Built from plain bars, not a chart library. See Q10. |
| Need-level split bar + legend rows with delta | Reports | NeedLevelSplitBar | ✓ "Essential 76% / Discretionary 24%" line is extra. |
| By-member rows with share bar | Reports | **NEW** `MemberShareRow` | PRD §8 asks for it, but not in the §3.4 table. |
| Tag rows with chevron | Reports | ListRow | ✓ |
| Insight rows with icon tile | Reports | **NEW** `InsightRow` | PRD §8 asks for it, but not in the §3.4 table. |
| FIRE segmented tabs | FIRE | SegmentedControl | ✓ |
| Progress ring 208 with % and "₹48.6 L of ₹3.43 Cr" | FIRE | ProgressRing | PRD variants are budget-based (<80 / 80–100 warning / over). The FIRE ring is always `primary`. Needs a neutral variant. |
| "On Track" badge | FIRE | Badge | Rule for "on track" is undefined. |
| "Next Milestone" strip | FIRE | **NEW**, not in PRD | See §6. |
| 3 stat cards (Years to FIRE, FIRE Age, Coast-FIRE) | FIRE | StatCard | Coast-FIRE is F4 (P1). |
| Info note card | FIRE | Card variant | ✓ |
| "Profile Comparison" card | FIRE | **NEW**, not in PRD | Duplicates the tabs. |
| Assumptions list with chevrons | FIRE | ListRow | Editing UI not designed. |
| Disclaimer line | FIRE | Text caption | Copy differs from the mandated caption. See §6. |
| EmptyState, Skeleton, ConfirmSheet, FilterSheet | none | EmptyState, Skeleton, ConfirmSheet | **No design for any.** Build from existing primitives (AGENTS §16.4). |

Icons: the HTML uses Material Symbols. Everything maps to lucide (`user`, `house`, `list`, `wallet`, `flame`, `plus`, `x`, `search`, `users`, `chevron-*`, `bookmark`, `funnel`/`filter`, `cloud-off`, `cloud-check`, `check`, `circle-check`, `trending-up`, `arrow-up`, `delete`, `receipt`, `calendar`, `landmark`, `shopping-cart`, `utensils`, `zap`, `bus`, `heart-pulse`, `shopping-bag`, `hash`, `info`, `lightbulb`, `sliders-horizontal`). Names to be confirmed against the installed `lucide-react-native` version at build time. The design's "Health" chip uses a dumbbell (`fitness_center`); `heart-pulse` fits better.

---

## 5. Screens, states and gaps

| Folder | In design | States shown | PRD/BUILD-PLAN states with **no design** |
| --- | --- | --- | --- |
| `spendr_home` | Home, light | Default only | Loading skeleton, first-launch empty ("Add your first expense"), error, offline, no saved views (row hidden), dark |
| `spendr_ledger` | Ledger, light | Default with 2 filters, one pending-sync row. (Search drawer open state exists only in the HTML JS.) | **Filter sheet** (requested in PRD §8), no results, loading, empty ledger, delete ConfirmSheet, offline, dark |
| `spendr_quick_add_sheet` | Quick add, light | Filled Expense + toast | Empty (₹0 placeholder), **Income**, **Transfer** (from/to accounts, no category or need level), validation, tag autocomplete, "More" categories, account picker, date picker, edit mode (T6), saving, offline badge, dark |
| `spendr_reports` | Reports, light | Current month with pacing | Past full month (no pacing caption), not enough data (first month), loading, empty, compare off, dark |
| `spendr_fire_tracker` | FIRE, Conservative | One frame. Very strict / Liberal only via HTML script. | Very strict and Liberal frames, not enough data (<3 months), loading, assumption editor (tap only vibrates in the HTML), dark |
| `calm_monastic_precision` | DESIGN.md only | n/a | n/a |
| *(missing)* | Onboarding, Settings, Wealth, Projection, component sheet | n/a | Whole screens. Needed for T3, T11, T12, T14, T1. |

---

## 6. Conflicts with the PRD, AGENTS and each other

### 6.1 Scope and phase

1. **Reconciliation UI (Phase 4)** appears in the Ledger: "October reconciled · All 7 matched to family vault", plus `verified` check icons next to "Salary (Income)" on Home. AGENTS §8 and D-008: do not build. (The ₹7,446 shown there is just the sum of the visible day totals.)
2. **Household / Personal switcher** in the Ledger header is not in the PRD. Private vs shared exists only as account visibility (H3) and as filters.
3. **Sticky "Showing 7 entries…" bar** in the Ledger duplicates the FilterBar and collides with the FAB.
4. **"Next Milestone" strip, "On Track" badge and "Profile Comparison" card** (FIRE) are not in the PRD. The milestone also contradicts itself ("Quarter Mark" = ₹50.0 L, but a quarter of ₹3.43 Cr is ₹85.8 L).
5. **Receipt attach button** (Quick add) is E5, P1.
6. **"Swipe filters" and "Quick switch"** are link-styled text with no action.
7. **Top app bar** (logo, household name, profile avatar) is not in PRD §3.5. It is also the only candidate entry point to Settings, which PRD §3.5 does not place anywhere. (Settings needs an entry point: decision Q3.)

### 6.2 Layout and behaviour vs PRD

8. **TransactionRow**: PRD §8 says category icon in a 36 muted circle, 20 member avatar, need-level dot. Designs use a 40 member avatar with the dot on its corner and no category icon. Ledger designs show photographic avatars (external images). PRD wins on behaviour; layout is a design call (Q4).
9. **DeltaBadge colour rule**: PRD says spend up = `debit`, spend down = `credit`, always. The design shows +2% and +8% in **neutral grey**, +11% and +38% in red, -4% in green. That implies an unstated threshold (somewhere between 8% and 11%). Q5.
10. **Reports toggle**: PRD has a "vs previous month" toggle (on by default) and pacing happens automatically for the current month. Design shows one toggle labelled "vs September (pacing on)", which merges the two. Q6.
11. **Reports hero caption**: PRD §8 and BUILD-PLAN: "Compared up to 13 Sep". Design: "Paced comparison up to 13 Sep (₹38,150)". Copy rule says use the design text unless the PRD says otherwise; the PRD prompt is the earlier source. Recommend the design text (it includes the previous-month figure).
12. **CompareBarChart colours**: PRD §8: this month solid *foreground*, last month muted. Design: this month in `primary`. The PRD's own principle is "one accent for actions".
13. **By-member bars**: Arjun in primary, Meera in **green**. Green means credit. Home shows Meera in indigo-tint. Use non-semantic colours (foreground / primary tint) for members.
14. **Day total** (Ledger): shows spend only (₹4,346 = 2,340 + 1,500 + 506). PRD says "day total" without defining it. With income on a day, it could be net or spend-only. Q8.
15. **Pacing bar on Home ("68% of pace") and Reports (72% bar, marker at 64%)**: no PRD definition. The two bars use different numbers for the same month.
16. **FIRE disclaimer copy**: design "Illustrative projections only. Not financial or investment advice." AGENTS §8 and the PRD mandate "Illustrative only. Not investment advice." AGENTS wins.
17. **FIRE assumptions are all tappable.** PRD §6.4 says defaults are editable per household and F3 says expenses are editable. No editor is designed. `fire_profiles.current_age` exists in §4.2, so "Current age 35" is feasible, but needs an input somewhere.
18. **FIRE currency formats**: the design mixes `₹12,00,000` (full) and `₹48.6 L` / `₹3.43 Cr` (compact). `lib/format.ts` needs both; compact formats must match the PRD §6.2/6.4 examples.
19. **Quick add** has its own top bar ("Quick Add" with back arrow and avatar) *behind* a sheet titled "Log Entry". PRD and BUILD-PLAN say "Quick add sheet". Recommend sheet only, titled "Log Entry" (design copy), no second bar.
20. **"Need Classification"** label in Quick add vs "Need level" everywhere in the PRD and AGENTS. Recommend "Need level".
21. **By-member "contribution"**: the figure is share of spend, not contribution. Recommend "of household spend".
22. **Savings rate delta "+3% vs Aug"**: a change in a rate should read in percentage points ("+3 pts").
23. **Insight copy** ("Great adherence to pantry stock!") is congratulatory. DESIGN.md says "without artificial gamification". Copy should be neutral and generated from the engine.

### 6.3 Branding and sample data

24. **Logo**: `OpenLedger Logo` image from an external host, wrong product name. Not usable (and AGENTS §16.3 forbids copying design-tool output). Household name "Family Vault" and all names/amounts are sample data and must not be hardcoded.
25. **Sample data is inconsistent** (not used in code, but flagging so no one copies it):
    - Home says the month is September, with a row dated "Today", then "28 Sep", "27 Sep" below "Yesterday". Reports, Ledger and PRD say October 13.
    - FIRE: ₹48.6 L of ₹3.43 Cr is 14.2%, not 16.1%; Liberal (₹3.0 Cr) would be 16.2%, not 24.3%. Only Very strict (9.7%) is right. The engine must compute these.
    - Insight "Food is 42% above your 3-month average (₹7,800 vs ₹5,500)": ₹5,500 is the September figure in the bars, not a 3-month average.
    - Everything else checks out: category, need-level and member totals all sum to ₹42,380; ₹42,380 − ₹4,230 = ₹38,150; 4,230 / 38,150 = 11%.

### 6.4 Dependencies the designs would require (AGENTS §1.3: ask first)

26. Date picker (Quick add, Ledger filter): nothing in the locked stack.
27. Image picker (receipt attach, avatar photos): nothing in the stack. Both are avoidable (see Q12).
28. `react-native-svg` is already installed (needed for the FIRE ring). No new package needed for the ring.

### 6.5 Data-model gaps

29. `categories` has no `icon` column; the chips need one (or a client-side name → icon map, but categories are user-editable and must not be hardcoded).
30. Row title ("BigBasket") has no column; `transactions.note` is the only text. The Ledger search placeholder "Search merchant, tag, amount..." promises more than T3 allows (note, category, tags, amount range).

---

## 7. Recommendations per mismatch

Each decision has a recommended default. Reply "accept all" or override by number; I will then record the outcomes in `docs/Decisions.md` (D-013 onwards) as BUILD-PLAN asks.

| # | Mismatch | Options | Recommendation |
| --- | --- | --- | --- |
| Q1 | Material-palette colours in the HTML (§1.2) | use existing token / add tokens | **Use existing token** for every colour (mapping table in §1.2). Ignore the HTML hex. |
| Q2 | Need-level dot colours wrong on Home and Ledger (§1.3) | use token / change design | **Use existing token** (`bg-need-*`) everywhere. |
| Q3 | No entry point to Settings; top app bar not in PRD | add header / keep PRD / other | **Change design:** no logo or household label bar. Keep a slim header per screen with the screen title and a profile avatar button that opens Settings. Update PRD §3.5 once agreed. |
| Q4 | TransactionRow layout and photo avatars (§6.2 #8) | follow PRD §8 / follow design | **Follow design layout** (40 initial avatar + need dot), **initials only, no photos**. Update PRD §3.4/§8 text. |
| Q5 | Neutral delta for small changes (§6.2 #9) | PRD rule only / add threshold | **PRD rule only** (every increase `debit`, every decrease `credit`, equal = neutral). A threshold is a product rule and would need a PRD entry. |
| Q6 | One toggle vs two on Reports (§6.2 #10) | follow design / follow PRD | **Follow PRD:** one "vs previous month" toggle, on by default; pacing automatic for the current month. Use the design's label style ("vs September"). |
| Q7 | Light-mode `credit` / `warning` / tints fail AA (§1.4) | keep / add text tokens / change values | **Add tokens**, e.g. `credit-text` and `warning-text` (darker light-mode values, same as dark for dark), and render tinted badges with `foreground` text plus an arrow/sign. Needs your approval; I did not touch any token. Alternative: use `credit`/`warning` only for icons, bars and text ≥ 24 px. |
| Q8 | "Day total" definition | spend only / net | **Spend only** (expenses; income and transfers excluded), matches the design and the "transfers never count" rule. Add to the PRD. |
| Q9 | Typography gaps: no 13/400, no 11/600, no weighted amount (§2) | map as-is / add variants | **Map as in §2**, no new variants. Accept `label` (500) for 13px secondary text and `caption` (400) for tiny labels. Revisit only if it looks wrong on device. Uppercase section labels become sentence case. |
| Q10 | CompareBarChart built from gifted-charts vs plain bars | chart lib / ProgressBar primitives | **Plain `ProgressBar` rows** (the design is two thin bars per category; no axes). Keep `react-native-gifted-charts` for Wealth/Projection. Colour: this month `bg-foreground`, last month `bg-border` (PRD §8). |
| Q11 | Out-of-scope items (§6.1 #1–6) | build / drop | **Drop all:** reconciliation footer and `verified` icons, Household switcher, sticky summary bar, milestone strip, "On Track" badge, Profile Comparison card, receipt button, "Swipe filters", "Quick switch". Re-add only with a PRD entry. |
| Q12 | Date and image pickers (§6.4) | propose packages / avoid | **Date:** propose a package at T5 (licence, size) or build a small in-house date sheet. **Receipt/photos:** defer with E5. Ask again at T5. |
| Q13 | Shadows, blur, FAB glow, scrim (§3.3, §1.2) | follow AGENTS / follow design | **Follow AGENTS.** Add a `scrim` token (needs your OK), values per DESIGN.md (40% light / 70% dark). |
| Q14 | Missing designs (§0, §5) | commission / build from tokens | **Commission** from the design agent: Onboarding (3 steps), Filter sheet, Settings, component sheet, light + dark for all screens, and the missing states. Wealth and Projection can wait until T12/T14. For T0–T2, no design is needed. For T1 and T4 we can start from PRD §3.4 plus this report if you prefer not to wait. |
| Q15 | FIRE ring variant, FIRE copy, assumption editing (§6.2 #16–18) | — | ProgressRing gets a `neutral` tone for FIRE. Use the mandated disclaimer. Show assumptions read-only for now; editing goes in T15 with a design. Add compact ₹ L/Cr formatting to `lib/format.ts` in T1. |
| Q16 | Data model (§6.5) | add column / client map | **Add `icon` (text) to `categories`** in T2, seeded for the defaults. Search covers note, category and tags. |
| Q17 | Folder and file names (§0) | rename / update plan | **Rename** screen folders to the BUILD-PLAN names (`01-onboarding` … `09-fire`) as designs arrive, move `DESIGN.md` to `docs/design/design.md`, and rename `Decisions.md`/`setup.md` to match AGENTS/BUILD-PLAN (`DECISIONS.md`, `SETUP.md`). |

---

## 8. Design deviations I will list in every later screen report

Light-only reference, no dark design, initials not photos, no shadows or blur, tokens instead of Material colours, 13/400 and 11/600 approximated, uppercase labels dropped. Items from Q11 are not built.
