# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

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

This is **Sanify** — an **Angular 21** admin dashboard for managing **PSB (Plan de Saneamiento Básico)** — Colombian food safety compliance plans (Resolución 2674 de 2013). The domain is a dairy company management system.

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
/                         → redirects to /auth/login
/auth/login               → LoginComponent
/auth/access, /auth/error → Auth utility pages
/ (AppLayout shell)
  /dashboard              → Dashboard (PSB widgets)
  /configuracion-inicial  → Wizard PSB (lazy → plan-psb.routes.ts)
  /uikit/*                → PrimeNG component demos
  /features/crud          → Crud demo
  /features/empty         → Empty page template
```

Sidebar menu (`AppMenu`) also links to `/plan`, `/registros`, `/documentos`, `/reportes` — **not yet registered** in the router.

To add a new protected route, insert it inside the `AppLayout` children in `src/app.routes.ts` and add the menu item in `src/app/layout/component/app.menu.ts`.

---

## Feature structure convention

Every new domain feature lives under `src/app/features/configuracion/<entidad>/` and follows this layout strictly:

```
<entidad>/
  components/
    <entidad>-form/           ← formulario reutilizable (crear Y editar)
      <entidad>-form.component.ts
      <entidad>-form.component.html
      <entidad>-form.component.scss
  pages/
    <entidad>-list/           ← tabla con todos los registros
    <entidad>-create/         ← instancia el form sin datos
    <entidad>-edit/           ← carga el registro por :id y lo pasa al form
  services/
    <entidad>.service.ts      ← getAll, getById, create, update vía HttpClient
  models/
    <entidad>.interface.ts
    create-<entidad>.dto.ts
    update-<entidad>.dto.ts
  store/
    <entidad>.store.ts
  utils/
    <entidad>.mapper.ts       ← transforma API response → interface
  index.ts                    ← barrel, exporta solo lo público
```

### Routes per entity

```typescript
// <entidad>.routes.ts
export default [
    { path: '',           component: EntidadListComponent   },
    { path: 'crear',      component: EntidadCreateComponent },
    { path: ':id/editar', component: EntidadEditComponent   }
] as Routes;
```

### Create vs Edit pattern (mandatory)

- **`<entidad>-form`** — componente puro, sin lógica de navegación ni llamadas HTTP.  
  Recibe `@Input() entidad?: Entidad` (undefined = crear) y emite `@Output() formSubmit`.
- **`<entidad>-create`** — instancia el form sin `@Input`. Llama a `service.create()` al recibir `formSubmit`.
- **`<entidad>-edit`** — lee `:id` de la URL, llama a `service.getById(id)`, pasa el resultado como `@Input` al form. Llama a `service.update()` al recibir `formSubmit`.
- **Never** put create/edit logic in the same page component with an `if (modoEdicion)`.

### Component file rule

Every component uses **3 separate files** — never inline `template:` or `styles:` in the decorator:

```typescript
@Component({
    selector: 'app-<name>',
    standalone: true,
    imports: [...],
    templateUrl: './<name>.component.html',
    styleUrls: ['./<name>.component.scss']
})
```

### Service pattern

```typescript
@Injectable({ providedIn: 'root' })
export class EntidadService {
    private http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/entidades`;

    getAll(): Observable<Entidad[]>         { return this.http.get<Entidad[]>(this.url); }
    getById(id: string): Observable<Entidad>{ return this.http.get<Entidad>(`${this.url}/${id}`); }
    create(dto: CreateDto): Observable<Entidad>            { return this.http.post<Entidad>(this.url, dto); }
    update(id: string, dto: UpdateDto): Observable<Entidad>{ return this.http.patch<Entidad>(`${this.url}/${id}`, dto); }
}
```

Use `firstValueFrom()` for one-shot calls in event handlers. Use `async` pipe in templates.

### Mapper pattern

```typescript
// <entidad>.mapper.ts
export function toCreateDto(form: Partial<Entidad>): CreateEntidadDto { ... }
export function toUpdateDto(form: Partial<Entidad>): UpdateEntidadDto { ... }
```

Mappers live in `utils/`. Services never transform data — they only call HTTP.

### Backend URL

Configured in `src/environments/environment.ts` → `apiUrl: 'http://localhost:3000/api'`.

### Auth

Login (`src/app/features/auth/login.ts`) uses `ReactiveFormsModule` with validation (email format, min 6 chars, requires uppercase + digit). On submit it navigates to `/dashboard` directly — **there is no auth service or guard yet**.

Register (`src/app/features/auth/pages/register.ts`) uses template-driven forms and has no backend integration.

### Dashboard widgets

All PSB dashboard widgets are in `src/app/features/dashboard/components/` with the `psb-` prefix. They currently use hardcoded mock data. The `Dashboard` component (`dashboard.ts`) uses `signal()` for `nombreAdmin`, `nombreEmpresa`, and `fechaHoy`.

### TypeScript config

Strict mode is fully enabled (`strict: true`, `strictTemplates: true`, `noImplicitReturns: true`). The compiler target is ES2022 with `moduleResolution: "bundler"`.
