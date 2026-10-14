# Spendr — Repository Setup Guide

Follow these steps once, in order. Every tool used here is free. Commands assume macOS, Linux or Windows (PowerShell / WSL) with a terminal open.

> Use `npx expo install <pkg>` (not plain `npm install`) for anything that runs in the app. It picks the version that matches your Expo SDK. Use `npm install -D` only for dev tools.

---

## 1. Prerequisites

| Tool                                                                          | Why                                                     | Check           |
| ----------------------------------------------------------------------------- | ------------------------------------------------------- | --------------- |
| Node.js LTS (20 or newer)                                                     | Runs Expo and all tooling                               | `node -v`       |
| Git                                                                           | Version control                                         | `git --version` |
| Android Studio (SDK + an emulator) **or** an Android phone with USB debugging | Run the dev build                                       | `adb devices`   |
| Java 17 (bundled with Android Studio)                                         | Android builds                                          | `java -version` |
| Free accounts                                                                 | GitHub, Expo (expo.dev), Supabase (supabase.com)        | —               |
| VS Code + extensions                                                          | ESLint, Prettier, Tailwind CSS IntelliSense, Expo Tools | —               |

---

## 2. Create the project

NativeWindUI provides a ready template with Expo Router, NativeWind and its theme already wired:

```bash
npx create-expo-stack@latest spendr --nativewindui --blank
cd spendr
```

- Choose **npm** when asked for a package manager (keeps contributor setup simple).
- When the CLI offers NativeWindUI components, pick **only free components**. Never add Pro components to this public repo.
- If the CLI fails, use the manual install at nativewindui.com/installation/manual (same result).

> NativeWindUI uses `expo-dev-client`, so the app runs as a **development build**, not inside Expo Go. Step 7 covers this.

---

## 3. Install the agreed libraries

Run each block from the project root.

**Icons, charts, fonts, haptics**

```bash
npx expo install lucide-react-native react-native-svg
npx expo install react-native-gifted-charts expo-linear-gradient
npx expo install expo-font @expo-google-fonts/inter expo-haptics
```

**Backend, auth and secure storage**

```bash
npx expo install @supabase/supabase-js react-native-url-polyfill @react-native-async-storage/async-storage expo-secure-store
```

**Data fetching, offline cache and local queue**

```bash
npx expo install @tanstack/react-query @tanstack/react-query-persist-client @tanstack/query-async-storage-persister expo-sqlite
```

**Forms, validation, dates**

```bash
npx expo install react-hook-form zod @hookform/resolvers date-fns
```

**Already installed by the template** (verify in `package.json`): `nativewind`, `tailwindcss@^3.4`, `react-native-reanimated`, `@shopify/flash-list`, `class-variance-authority`, `clsx`, `tailwind-merge`, `expo-router`, `expo-dev-client`.

**Dev tooling: lint, format, tests**

```bash
npx expo lint                      # creates ESLint config for Expo
npm install -D prettier prettier-plugin-tailwindcss
npx expo install -- --save-dev jest-expo jest @testing-library/react-native @types/jest
```

---

## 4. Folder structure

Create these folders so the code matches the rules in `AGENTS.md`:

```bash
mkdir -p components/ui components/finance features data/supabase engine lib theme types supabase docs/design
```

```
spendr/
├─ app/                      # Expo Router routes only (thin screens)
│  ├─ (tabs)/                # Home, Ledger, Reports, Wealth, FIRE
│  ├─ add.tsx                # Quick add (modal sheet)
│  ├─ settings/
│  └─ dev/gallery.tsx        # Component gallery (dev only)
├─ components/
│  ├─ nativewindui/          # Free NativeWindUI primitives (added by its CLI)
│  ├─ ui/                    # In-house primitives on the same tokens
│  └─ finance/               # AmountText, DeltaBadge, TransactionRow, …
├─ features/                 # One folder per feature: hooks/, components/
├─ data/                     # The only place that talks to the backend (Supabase inside data/supabase/)
│  ├─ auth/  households/  transactions/  reports/  wealth/  fire/
├─ engine/                   # Pure TypeScript: money, reports, projections, FIRE
├─ lib/                      # query-client.ts, cn.ts, format.ts, env.ts
├─ theme/                    # tokens.ts (+ NativeWindUI colour files)
├─ types/                    # database.ts (generated from Supabase)
├─ supabase/                 # migrations/, seed.sql, functions/
├─ docs/                     # PRD.md, design/
├─ global.css  tailwind.config.js  AGENTS.md  CLAUDE.md
```

Copy `Spendr-PRD.md` to `docs/PRD.md`, and `AGENTS.md` to the project root.

Confirm the `@/` import alias exists in `tsconfig.json` (the template usually adds it). If not, add:

```json
{
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": { "@/*": ["./*"] }
  }
}
```

---

## 5. Design tokens

1. Put the colour variables from PRD section 3.3 into `global.css` (light under `:root`, dark under `.dark:root`, following the NativeWindUI theme format the template generated).
2. Map them in `tailwind.config.js` so classes like `bg-card`, `text-muted-foreground`, `bg-need-must` work.
3. Mirror the same values in `theme/tokens.ts` for charts and APIs that can't read classes.
4. Load Inter in the root layout with `@expo-google-fonts/inter`.

---

## 6. Supabase (free tier)

1. Create a project at supabase.com (choose a region near you, e.g. Mumbai).
2. Install the CLI as a dev dependency and link the project:

```bash
npm install -D supabase
npx supabase init
npx supabase login
npx supabase link --project-ref <your-project-ref>
```

3. Create a `.env` file in the project root (it is git-ignored by the template; double-check `.gitignore`):

```bash
EXPO_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<publishable / anon key>
```

Only the public anon (publishable) key goes in the app. **Never** put the service-role key in the app or in git.

4. Commit a `.env.example` with the same keys and empty values.
5. After every migration, regenerate types:

```bash
npx supabase gen types typescript --linked > types/database.ts
```

---

## 7. Run the app

**Local build (free, unlimited):**

```bash
npx expo run:android      # builds and installs the dev build on emulator/phone
npx expo start            # later runs: just start the dev server
```

**Cloud build (EAS free tier) for an installable APK:**

```bash
npm install -g eas-cli
eas login
eas build:configure
```

In `eas.json`, make the `preview` profile produce an APK:

```json
{
  "build": {
    "development": { "developmentClient": true, "distribution": "internal" },
    "preview": { "distribution": "internal", "android": { "buildType": "apk" } },
    "production": {}
  }
}
```

```bash
eas build -p android --profile preview
```

Upload the APK to GitHub Releases and install it on both phones.

---

## 8. Scripts and quality gate

Add to `package.json` → `"scripts"`:

```json
{
  "typecheck": "tsc --noEmit",
  "lint": "expo lint",
  "format": "prettier --write .",
  "test": "jest",
  "check": "npm run typecheck && npm run lint && npm run test",
  "db:types": "supabase gen types typescript --linked > types/database.ts"
}
```

And a jest preset:

```json
{ "jest": { "preset": "jest-expo" } }
```

`npm run check` must pass before every commit and pull request.

---

## 9. Git and GitHub

```bash
git init
git add .
git commit -m "chore: scaffold Spendr with Expo, NativeWind and NativeWindUI"
git branch -M main
git remote add origin https://github.com/<you>/spendr.git
git push -u origin main
```

Then on GitHub:

- Add an MIT `LICENSE`.
- Protect `main`: require pull requests and passing checks.
- Add a GitHub Actions workflow running `npm ci && npm run check` on every pull request.
- Add `.github/pull_request_template.md` with the Definition of Done from `AGENTS.md`.

---

## 10. Connect your AI tools to the rules

`AGENTS.md` in the root is the single source of rules. Point every tool at it:

| Tool                                    | File to add                       | Content                                           |
| --------------------------------------- | --------------------------------- | ------------------------------------------------- |
| Claude Code                             | `CLAUDE.md`                       | `@AGENTS.md`                                      |
| Cursor                                  | `.cursor/rules/spendr.mdc`        | "Follow all rules in AGENTS.md at the repo root." |
| GitHub Copilot                          | `.github/copilot-instructions.md` | Same one line                                     |
| Others (Codex, Windsurf, Gemini CLI, …) | Most read `AGENTS.md` directly    | —                                                 |

When you change a rule, edit only `AGENTS.md`.
