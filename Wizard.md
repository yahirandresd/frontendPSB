# INSTRUCCIONES PARA CLAUDE CODE
# Flujo de configuración inicial PSB — Angular + PrimeNG Sakai
# IMPORTANTE: Implementa PASO A PASO. No avances al siguiente paso hasta que yo confirme.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTEXTO DEL PROYECTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sistema de Plan de Saneamiento Básico (PSB) para pymes colombianas de alimentos.
Frontend: Angular con plantilla Sakai (PrimeNG).
El flujo que vas a construir es el "Asistente de Configuración Inicial": guía al usuario
para crear su empresa, tipo de alimento y plan PSB. Al crear el plan, el backend genera
automáticamente los 4 programas obligatorios: LIMPIEZA, PLAGAS, AGUA y RESIDUOS.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESTRUCTURA DE CARPETAS — SEGUIR ESTRICTAMENTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

src/
├── app/
│   │
│   ├── core/
│   │   ├── interceptors/       ← auth, error, loading
│   │   ├── guards/             ← auth.guard, empresa-configurada.guard
│   │   └── services/           ← solo servicios de infraestructura global (auth, storage)
│   │
│   ├── shared/
│   │   ├── components/         ← componentes reutilizables entre features
│   │   ├── pipes/
│   │   ├── directives/
│   │   ├── layouts/
│   │   └── ui/                 ← wrappers de PrimeNG si aplica
│   │
│   ├── features/
│   │   │
│   │   └── configuracion/              ← dominio: configuración inicial
│   │       │
│   │       ├── empresa/
│   │       │   ├── components/
│   │       │   │   └── empresa-form/              ← formulario reutilizable (crear y editar)
│   │       │   │       ├── empresa-form.component.ts
│   │       │   │       ├── empresa-form.component.html
│   │       │   │       └── empresa-form.component.scss
│   │       │   ├── pages/
│   │       │   │   ├── empresa-list/
│   │       │   │   │   ├── empresa-list.component.ts
│   │       │   │   │   ├── empresa-list.component.html
│   │       │   │   │   └── empresa-list.component.scss
│   │       │   │   ├── empresa-create/            ← instancia empresa-form sin datos
│   │       │   │   │   ├── empresa-create.component.ts
│   │       │   │   │   ├── empresa-create.component.html
│   │       │   │   │   └── empresa-create.component.scss
│   │       │   │   └── empresa-edit/              ← carga empresa por :id y la pasa al form
│   │       │   │       ├── empresa-edit.component.ts
│   │       │   │       ├── empresa-edit.component.html
│   │       │   │       └── empresa-edit.component.scss
│   │       │   ├── services/
│   │       │   │   └── empresa.service.ts
│   │       │   ├── models/
│   │       │   │   ├── empresa.interface.ts
│   │       │   │   ├── create-empresa.dto.ts
│   │       │   │   └── update-empresa.dto.ts
│   │       │   ├── store/
│   │       │   │   └── empresa.store.ts
│   │       │   ├── utils/
│   │       │   │   └── empresa.mapper.ts
│   │       │   └── index.ts
│   │       │
│   │       ├── tipo-alimento/
│   │       │   ├── components/
│   │       │   │   └── tipo-alimento-form/        ← formulario reutilizable (crear y editar)
│   │       │   │       ├── tipo-alimento-form.component.ts
│   │       │   │       ├── tipo-alimento-form.component.html
│   │       │   │       └── tipo-alimento-form.component.scss
│   │       │   ├── pages/
│   │       │   │   ├── tipo-alimento-list/
│   │       │   │   │   ├── tipo-alimento-list.component.ts
│   │       │   │   │   ├── tipo-alimento-list.component.html
│   │       │   │   │   └── tipo-alimento-list.component.scss
│   │       │   │   ├── tipo-alimento-create/
│   │       │   │   │   ├── tipo-alimento-create.component.ts
│   │       │   │   │   ├── tipo-alimento-create.component.html
│   │       │   │   │   └── tipo-alimento-create.component.scss
│   │       │   │   └── tipo-alimento-edit/
│   │       │   │       ├── tipo-alimento-edit.component.ts
│   │       │   │       ├── tipo-alimento-edit.component.html
│   │       │   │       └── tipo-alimento-edit.component.scss
│   │       │   ├── services/
│   │       │   │   └── tipo-alimento.service.ts
│   │       │   ├── models/
│   │       │   │   ├── tipo-alimento.interface.ts
│   │       │   │   ├── create-tipo-alimento.dto.ts
│   │       │   │   └── update-tipo-alimento.dto.ts
│   │       │   ├── store/
│   │       │   │   └── tipo-alimento.store.ts
│   │       │   ├── utils/
│   │       │   │   └── tipo-alimento.mapper.ts
│   │       │   └── index.ts
│   │       │
│   │       └── plan-psb/
│   │           ├── components/
│   │           │   ├── wizard-configuracion/    ← contenedor p-steps
│   │           │   ├── step-empresa/            ← paso 1
│   │           │   ├── step-tipo-alimento/      ← paso 2
│   │           │   ├── step-plan-psb/           ← paso 3
│   │           │   └── step-confirmacion/       ← paso 4
│   │           ├── pages/
│   │           │   └── configuracion-inicial-page/
│   │           ├── services/
│   │           │   ├── plan-psb.service.ts
│   │           │   └── wizard-configuracion.service.ts   ← estado compartido del wizard
│   │           ├── models/
│   │           │   ├── plan-psb.interface.ts
│   │           │   ├── programa.interface.ts
│   │           │   ├── create-plan-psb.dto.ts
│   │           │   └── wizard-state.interface.ts
│   │           ├── store/
│   │           │   └── plan-psb.store.ts
│   │           ├── utils/
│   │           │   └── plan-psb.mapper.ts
│   │           ├── plan-psb.routes.ts
│   │           └── index.ts
│   │
│   ├── app.routes.ts
│   └── app.config.ts
│
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
└── assets/

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FLUJO DE PANTALLAS — 4 PASOS DEL WIZARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PASO WIZARD 1 — Datos de la Empresa
  Componente: step-empresa
  Campos:
    - nombre           (text, requerido)
    - nit              (text, requerido, validar formato NNN.NNN.NNN-N)
    - tipo_negocio     (text, requerido)
    - direccion        (text, requerido)
    - representante    (text, requerido)
    - registro_sanitario_funcionamiento  (text, opcional)
    - resolucion_invima                  (text, opcional)
  Comportamiento:
    - Si la empresa ya existe, cargar datos y permitir editar.
    - Botón "Siguiente" valida antes de avanzar.

PASO WIZARD 2 — Tipo de Alimento
  Componente: step-tipo-alimento
  Campos del formulario de adición:
    - nombre        (text, requerido)
    - nivel_riesgo  (dropdown: ALTO / MEDIO / BAJO, requerido)
    - descripcion   (textarea, opcional)
  Comportamiento:
    - Tabla p-table con los tipos ya agregados en la sesión.
    - Columnas: Nombre | Nivel de Riesgo (badge) | Eliminar.
    - Badge colores: ALTO=danger, MEDIO=warning, BAJO=success.
    - Agregar ítems a lista local (sin llamar backend todavía).
    - "Siguiente" solo activo con al menos 1 tipo de alimento.
    - "Atrás" conserva datos del paso anterior.

PASO WIZARD 3 — Datos del Plan PSB
  Componente: step-plan-psb
  Campos:
    - tipo_alimento_id  (dropdown con los del paso 2, requerido)
    - version           (text, default "1.0", requerido)
    - nivel_riesgo      (solo lectura, calculado desde tipo_alimento seleccionado)
    - fecha_creacion    (p-calendar, default hoy, requerido)
  Card informativa (no editable):
    Texto: "Al crear este plan se generarán automáticamente los 4 programas
    obligatorios según la Resolución 2674 de 2013."
    Lista con íconos PrimeNG:
      - pi-sparkles   → Limpieza y Desinfección
      - pi-bug        → Control de Plagas
      - pi-tint       → Gestión del Agua
      - pi-inbox      → Manejo de Residuos

PASO WIZARD 4 — Confirmación y Creación
  Componente: step-confirmacion
  Mostrar resumen:
    - Card empresa con todos sus datos
    - Lista de tipos de alimento con sus badges
    - Datos del plan PSB
    - Lista visual de los 4 programas a crear
  Botón "Crear Plan PSB" con [loading] mientras se procesan las llamadas.
  Flujo de llamadas al confirmar (en orden):
    1. POST /empresas
    2. POST /tipos-alimento  (una por cada ítem, con Promise.all)
    3. POST /planes-psb      (el backend crea los 4 programas automáticamente)
  En éxito: p-toast success → navigate al dashboard del plan.
  En error: p-toast error → permitir reintentar sin perder datos del wizard.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MODELOS DE REFERENCIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// empresa.interface.ts
export interface Empresa {
  id: string;
  nombre: string;
  nit: string;
  tipo_negocio: string;
  direccion: string;
  representante: string;
  registro_sanitario_funcionamiento?: string;
  resolucion_invima?: string;
}

// tipo-alimento.interface.ts
export type NivelRiesgo = 'ALTO' | 'MEDIO' | 'BAJO';

export interface TipoAlimento {
  id: string;
  empresa_id: string;
  nombre: string;
  nivel_riesgo: NivelRiesgo;
  descripcion?: string;
}

// plan-psb.interface.ts
export type EstadoPlan = 'BORRADOR' | 'ACTIVO' | 'OBSOLETO';

export interface PlanPSB {
  id: string;
  empresa_id: string;
  tipo_alimento_id: string;
  version: string;
  estado: EstadoPlan;
  nivel_riesgo: NivelRiesgo;
  fecha_creacion: string;
  fecha_actualizacion?: string;
}

// programa.interface.ts
export type TipoPrograma = 'LIMPIEZA' | 'PLAGAS' | 'AGUA' | 'RESIDUOS';

export interface Programa {
  id: string;
  plan_psb_id: string;
  tipo: TipoPrograma;
  nombre: string;
  responsable: string;
  frecuencia: string;
  descripcion?: string;
}

// wizard-state.interface.ts
export interface WizardState {
  empresa: Partial<Empresa>;
  tiposAlimento: Partial<TipoAlimento>[];
  planPsb: Partial<PlanPSB>;
  pasoActual: number;
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PASO 1 DE IMPLEMENTACIÓN — Empieza aquí
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Implementa ÚNICAMENTE esto y detente:

1. Crear todos los archivos de modelos en sus rutas exactas:
   - features/configuracion/empresa/models/  (interface + 2 DTOs)
   - features/configuracion/tipo-alimento/models/  (interface + 2 DTOs)
   - features/configuracion/plan-psb/models/  (interface + programa.interface + 2 DTOs + wizard-state)
   Usar los modelos de referencia de arriba como base.

2. Crear los servicios con HttpClient:
   - features/configuracion/empresa/services/empresa.service.ts
   - features/configuracion/tipo-alimento/services/tipo-alimento.service.ts
   - features/configuracion/plan-psb/services/plan-psb.service.ts
   Métodos: getAll(), getById(id: string), create(dto), update(id: string, dto).
   URL base desde environment.apiUrl.

3. Crear el WizardConfiguracionService:
   - features/configuracion/plan-psb/services/wizard-configuracion.service.ts
   Usar BehaviorSubject<WizardState> para estado compartido.
   Métodos: setEmpresa(), setTiposAlimento(), setPlanPsb(), resetWizard(), getState().

4. Crear el barrel index.ts en cada sub-feature exportando solo lo público.

5. Crear plan-psb.routes.ts con la ruta /configuracion-inicial apuntando a
   ConfiguracionInicialPageComponent (el componente lo crearás en el paso 2).

6. Registrar la ruta lazy en app.routes.ts:
   { path: 'configuracion-inicial', loadChildren: () => import(...) }

Cuando termines di "Paso 1 completo" y espera confirmación.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PASO 2 — Página contenedora + Wizard + Step Empresa
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Implementa ÚNICAMENTE esto y detente:

1. ConfiguracionInicialPageComponent en pages/configuracion-inicial-page/:
   - Página enrutable, solo renderiza el wizard-configuracion.
   - Sin lógica propia.

2. WizardConfiguracionComponent en components/wizard-configuracion/:
   - p-steps con los 4 pasos como indicador visual (no usa routing interno).
   - Renderiza el step activo con *ngIf según pasoActual del WizardConfiguracionService.
   - Escucha eventos (next) y (back) de cada step para cambiar pasoActual.

3. StepEmpresaComponent en components/step-empresa/:
   - ReactiveForm con todos los campos del PASO WIZARD 1.
   - Validador personalizado nitColombiano para formato NNN.NNN.NNN-N.
   - Al hacer "Siguiente": validar → llamar wizardService.setEmpresa(data) → emitir (next).
   - Layout: p-card con grid de 2 columnas usando clases de Sakai (p-fluid, formgrid, grid).
   - Botones: solo "Siguiente" (alineado a la derecha).

Cuando termines di "Paso 2 completo" y espera confirmación.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PASO 3 — Step Tipo de Alimento
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Implementa ÚNICAMENTE esto y detente:

1. StepTipoAlimentoComponent en components/step-tipo-alimento/:
   - ReactiveForm para agregar un tipo de alimento (nombre, nivel_riesgo, descripcion).
   - p-table con los tipos agregados en la sesión (desde WizardConfiguracionService).
   - Columnas: Nombre | Nivel Riesgo (p-tag con severidad) | Eliminar (p-button icon).
   - Botón "Agregar" actualiza lista local vía wizardService.setTiposAlimento().
   - "Siguiente" deshabilitado si tiposAlimento.length === 0.
   - "Atrás" emite evento (back).

Cuando termines di "Paso 3 completo" y espera confirmación.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PASO 4 — Step Plan PSB
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Implementa ÚNICAMENTE esto y detente:

1. StepPlanPsbComponent en components/step-plan-psb/:
   - Dropdown tipo_alimento_id con opciones del wizardService (tiposAlimento).
   - Al seleccionar tipo_alimento, actualizar nivel_riesgo automáticamente (readonly).
   - Campo version (default "1.0") y fecha_creacion (p-calendar, default hoy).
   - Card informativa con los 4 programas y sus íconos PrimeNG.
   - Al "Siguiente": wizardService.setPlanPsb(data) → emitir (next).
   - "Atrás" emite (back).

Cuando termines di "Paso 4 completo" y espera confirmación.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PASO 5 — Step Confirmación + integración backend
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Implementa ÚNICAMENTE esto y detente:

1. StepConfirmacionComponent en components/step-confirmacion/:
   - Leer estado completo del wizardService.
   - Mostrar resumen: card empresa, lista tipos alimento con badges, datos plan, 4 programas.
   - Botón "Crear Plan PSB" con [loading] durante las llamadas.
   - Al confirmar, ejecutar en orden usando firstValueFrom():
       a. empresaService.create(empresaDto)
       b. Promise.all de tipoAlimentoService.create() por cada tipo
       c. planPsbService.create(planDto)  ← backend crea los 4 programas
   - Mapear datos con los mappers (empresa.mapper, plan-psb.mapper) antes de enviar.
   - En éxito: MessageService.add (p-toast success) → router.navigate(['/planes', planId]).
   - En error: MessageService.add (p-toast error, sticky) → no resetear wizard.
   - "Atrás" emite (back).

2. Asegurarse de que MessageService esté provisto en el módulo o en app.config.ts.

Cuando termines di "Paso 5 completo" y espera confirmación.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PATRÓN OBLIGATORIO: CREAR Y EDITAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Para CUALQUIER entidad que tenga pantalla de crear y editar, seguir siempre este patrón:

  1. UN solo componente de formulario reutilizable en components/entidad-form/
     - Recibe datos por @Input() y emite por @Output().
     - NO llama al backend. NO sabe si está creando o editando.
     - NO tiene lógica de navegación.

     Ejemplo empresa-form.component.ts:
       @Input() empresa?: Empresa;          // undefined = modo crear, con datos = modo editar
       @Input() loading: boolean = false;   // controla el spinner del botón guardar
       @Output() formSubmit = new EventEmitter<CreateEmpresaDto>();
       @Output() cancelar = new EventEmitter<void>();

  2. DOS pages separadas en pages/: una para crear, otra para editar.
     - empresa-create: instancia empresa-form SIN pasar @Input empresa.
       Llama a empresaService.create(dto) al recibir el evento formSubmit.
     - empresa-edit: lee el :id de la URL, carga la empresa con getById(id),
       se la pasa al form como @Input. Llama a empresaService.update(id, dto)
       al recibir formSubmit.

     Ejemplo empresa-edit.component.ts:
       ngOnInit() {
         const id = this.route.snapshot.paramMap.get('id')!;
         this.empresa$ = this.empresaService.getById(id);
       }
       onSubmit(dto: CreateEmpresaDto) {
         this.empresaService.update(this.empresaId, dto)
           .pipe(first())
           .subscribe(() => this.router.navigate(['/configuracion/empresas']));
       }

  3. Las rutas del feature deben ser:
       { path: '',           component: EmpresaListComponent   },
       { path: 'crear',      component: EmpresaCreateComponent },
       { path: ':id/editar', component: EmpresaEditComponent   }

  NUNCA crear un único componente "empresa-form-page" que maneje ambos casos
  con un if (modoEdicion). Eso mezcla responsabilidades y rompe el principio
  de responsabilidad única. Cada page tiene una sola razón de existir.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BUENAS PRÁCTICAS — OBLIGATORIAS EN TODO EL CÓDIGO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ESTRUCTURA DE COMPONENTES — MUY IMPORTANTE:
  Cada componente SIEMPRE en 3 archivos separados dentro de su propia carpeta.
  NUNCA usar template inline ni styles inline en el decorador @Component.

  Correcto:
    step-empresa/
    ├── step-empresa.component.ts       ← solo lógica, sin HTML ni CSS inline
    ├── step-empresa.component.html     ← todo el template aquí
    └── step-empresa.component.scss     ← todos los estilos aquí

  El decorador debe verse así:
    @Component({
      selector: 'app-step-empresa',
      templateUrl: './step-empresa.component.html',
      styleUrls: ['./step-empresa.component.scss']
    })

  NUNCA así (prohibido):
    @Component({
      selector: 'app-step-empresa',
      template: `<div>...</div>`,     ← NO
      styles: [`h1 { color: red }`]   ← NO
    })

  Motivo: el proyecto usa la plantilla Sakai que está basada en módulos clásicos.
  Mezclar estilos/templates inline con esta plantilla rompe la consistencia del proyecto
  y dificulta el mantenimiento cuando los formularios PrimeNG crecen en tamaño.

RESTO DE BUENAS PRÁCTICAS:
- Usar standalone: false en todos los componentes (módulos clásicos, compatible con Sakai).
- Todos los formularios con ReactiveFormsModule. Nunca template-driven.
- Tipar todo estrictamente. Prohibido usar 'any'.
- Separar lógica de negocio en servicios. Componentes solo manejan vista.
- Usar async pipe en templates en lugar de subscribe() donde sea posible.
- Los mappers transforman API response → interface. Los servicios no mezclan esa lógica.
- Los DTOs (create/update) son interfaces separadas de la interface principal.
- Usar firstValueFrom() en lugar de .subscribe() para llamadas únicas al backend.
- Respetar la estructura de carpetas definida arriba. No crear archivos fuera de ella.
- Cada sub-feature exporta solo lo necesario a través de su index.ts.
