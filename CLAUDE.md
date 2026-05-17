# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server at http://localhost:4200 (auto-reloads)
npm run build      # Production build → dist/sakai-ng/
npm run watch      # Dev build with watch mode
npm test           # Karma/Jasmine unit tests
npm run format     # Prettier formatting (4-space indent, single quotes, 250-char line width)
```

Angular CLI scaffolding (components default to SCSS):
```bash
ng generate component app/features/<feature>/components/<name>
ng generate service app/features/<feature>/services/<name>
```

Run a single test file:
```bash
ng test --include="**/my-component.spec.ts"
```

## Architecture

This is an **Angular 21** admin dashboard (Sakai NG template) for managing **PSB (Plan de Saneamiento Básico)** — Colombian food safety compliance plans (Resolución 2674 de 2013). The domain is a dairy company management system.

### Key Angular patterns

- **All components are standalone** — no NgModules anywhere. Every component declares its own `imports: [...]`.
- **Zoneless change detection** — `provideZonelessChangeDetection()` is used in `app.config.ts`. Do not rely on Zone.js-based triggering; use Signals or explicit `markForCheck()`.
- **Angular Signals** — state is managed with `signal()`, `computed()`, and `effect()`. `LayoutService` is the canonical example. Prefer Signals over `BehaviorSubject` for new state.
- **Path alias** — `@/` maps to `src/`. Use `@/app/...` for cross-feature imports.

### Folder structure logic

```
src/app/
  layout/           # Shell: AppLayout, AppTopbar, AppSidebar, AppMenu, AppFooter
    service/        # LayoutService (theme, menu mode, dark mode)
  features/
    auth/           # Login, Register, Access, Error pages (outside AppLayout)
    dashboard/      # PSB dashboard with domain-specific widgets (psb-*-widget.ts)
    registros/      # Daily records feature (in progress)
    uikit/          # PrimeNG component demos
    crud/           # Generic CRUD demo
    landing/        # Public landing page
```

### Layout and theming

`AppLayout` (`src/app/layout/component/app.layout.ts`) is the authenticated shell. All protected routes are children of this component in the router.

`LayoutService` controls two signals:
- `layoutConfig` — `menuMode` (`'static'` | `'overlay'`), `darkTheme`, `primary` color, `preset`
- `layoutState` — sidebar/overlay active states

Dark mode is toggled by adding/removing the `.app-dark` class on `<html>`. The PrimeNG Aura preset is configured in `app.config.ts` with `darkModeSelector: '.app-dark'`.

### UI stack

- **PrimeNG 21** — all UI components (Button, InputText, Password, DataTable, etc.). Import each module individually in the component's `imports` array.
- **PrimeIcons** — icon library, use as `class="pi pi-<icon-name>"`.
- **TailwindCSS v4** — utility classes. Config via `src/assets/tailwind.css` and `.postcssrc.json`.
- **`tailwindcss-primeui`** — bridges Tailwind with PrimeNG design tokens (e.g., `bg-surface-0`, `text-primary`, `text-muted-color`).

### Routing

```
/                   → redirects to /auth/login
/auth/login         → LoginComponent (ReactiveFormsModule, no backend yet)
/auth/access        → Access
/auth/error         → Error
/ (AppLayout shell)
  /dashboard        → Dashboard (PSB widgets)
  /uikit/*          → PrimeNG component demos
  /features/crud    → Crud demo
  /features/empty   → Empty page template
```

The sidebar menu (`AppMenu`) links to `/plan`, `/registros`, `/documentos`, `/reportes` — these routes are **not yet defined** in the router and will show the 404 page.

### Auth

Login (`src/app/features/auth/login.ts`) uses `ReactiveFormsModule` with validation (email format, min 6 chars, requires uppercase + digit). On submit it navigates to `/dashboard` directly — **there is no auth service or guard yet**.

Register (`src/app/features/auth/pages/register.ts`) uses template-driven forms and has no backend integration.

### Dashboard widgets

All PSB dashboard widgets are in `src/app/features/dashboard/components/` with the `psb-` prefix. They currently use hardcoded mock data. The `Dashboard` component (`dashboard.ts`) uses `signal()` for `nombreAdmin`, `nombreEmpresa`, and `fechaHoy`.

### TypeScript config

Strict mode is fully enabled (`strict: true`, `strictTemplates: true`, `noImplicitReturns: true`). The compiler target is ES2022 with `moduleResolution: "bundler"`.
