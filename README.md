# Pomodoro Timer

A Pomodoro Technique timer web app built with React + TypeScript + Vite.

## Features

- Countdown timer with Start / Pause / Resume / Reset / Skip controls
- Multiple configurable sections (1-10), each with individual work and break durations
- Three timer phases: **Work** -> **Break** -> **Long Break**, cycling in loops
- Two configuration modes: **Simple** (all sections share one setting) and **Complex** (each section configured individually)
- Settings persisted to localStorage
- Browser tab title updates with remaining time and current phase
- Progress bar per phase
- Deployed to Vercel

## Tech Stack

| Technology | Version | Role |
|---|---|---|
| React | 19.1 | UI framework |
| TypeScript | ~5.9 | Type safety |
| Vite | 7.x | Build tool / Dev server |
| Tailwind CSS | v4 | Utility-first styling |
| tailwind-variants | 3.x | Type-safe variant-based component styles |
| tailwind-merge | 3.x | Tailwind class merging |
| Zustand | 5.x | Global state management |
| Zod | 4.x | Runtime schema validation |
| Vitest | 4.x | Unit / Integration test runner (jsdom) |
| Testing Library | 16.x | React component testing |
| MSW | 2.x | Mock Service Worker (API mocking for tests) |
| Playwright | 1.58 | E2E browser testing |
| Storybook | 10.2 | Component development / Visual testing |
| Biome | 2.x | Linting + Formatting |

## Folder Structure

```
src/
├── app/
│   ├── main.tsx              # Entry point
│   ├── App.tsx               # Root component
│   ├── App.test.tsx          # Smoke tests
│   └── index.css             # Global CSS (Tailwind import)
├── features/
│   └── timer/
│       ├── index.ts          # Public API (re-exports TimerPage)
│       ├── constants.ts      # Numeric constants (durations, limits)
│       ├── store.ts          # Zustand store (state + actions + interval + localStorage)
│       ├── store.test.ts     # Store integration tests
│       ├── types/
│       │   └── index.ts      # Zod schemas + TypeScript types
│       ├── utils/
│       │   ├── time.ts       # Time formatting / conversion
│       │   ├── time.test.ts
│       │   ├── config.ts     # Config factory functions
│       │   └── config.test.ts
│       ├── hooks/
│       │   ├── use-timer.ts  # Pure reducer (timer state machine)
│       │   └── use-timer.test.ts
│       └── components/
│           ├── timer-page.tsx          # Top-level page (connects to store)
│           ├── timer-page.test.tsx
│           ├── timer-display.tsx       # Phase label, countdown, progress bar
│           ├── timer-display.test.tsx
│           ├── timer-display.stories.ts
│           ├── timer-controls.tsx      # Start/Pause/Resume/Reset/Skip buttons
│           ├── timer-controls.test.tsx
│           ├── timer-controls.stories.ts
│           ├── timer-config-panel.tsx  # Settings UI (mode, sections, durations)
│           ├── timer-config-panel.test.tsx
│           ├── section-editor.tsx      # Single section work/break editor
│           ├── section-editor.test.tsx
│           ├── section-editor.stories.ts
│           ├── document-title.tsx      # Browser tab title updater
│           └── document-title.test.tsx
├── stories/                  # Storybook scaffold (stock examples)
└── testing/
    ├── setup.ts              # Global test setup (MSW lifecycle)
    └── mocks/
        ├── handlers.ts       # MSW request handlers
        └── server.ts         # MSW Node server setup

e2e/
└── app.spec.ts               # Playwright E2E tests

.storybook/
├── main.ts                   # Storybook config (React Vite + addons)
├── preview.ts                # Global preview (CSS, a11y)
└── vitest.setup.ts           # Storybook vitest setup
```

## Architecture

Feature-first architecture with clear layer separation:

1. **Types** (`types/`) - Zod schemas define the domain model
2. **Utils** (`utils/`) - Pure functions (time math, config factories)
3. **Reducer** (`hooks/use-timer.ts`) - Pure state machine for timer logic
4. **Store** (`store.ts`) - Zustand connects the reducer to React, manages side effects (setInterval, localStorage)
5. **Components** (`components/`) - Presentational components; `TimerPage` is the only smart component connecting to the store

## Commands

```bash
# Install dependencies
pnpm install

# Development server (http://localhost:5173)
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Unit / Integration tests
pnpm test

# Unit tests (watch mode)
pnpm test:watch

# Storybook tests (browser-based via Playwright)
pnpm test:storybook

# E2E tests (Playwright)
pnpm test:e2e

# Storybook dev server (http://localhost:6006)
pnpm storybook

# Build Storybook
pnpm build-storybook

# Lint
pnpm lint

# Format
pnpm format

# Lint + Format (auto-fix)
pnpm check
```

## Path Alias

`@/*` is mapped to `src/*` (configured in both `tsconfig.json` and `vite.config.ts`).

## Default Timer Settings

| Setting | Default |
|---|---|
| Work duration | 25 min |
| Break duration | 5 min |
| Long break duration | 15 min |
| Section count | 4 |
| Config mode | Simple |
