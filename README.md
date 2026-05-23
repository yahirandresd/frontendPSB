# Sanify

Sistema web para la gestión y seguimiento del **Plan de Saneamiento Básico (PSB)** en empresas lácteas, conforme a la Resolución 2674 de 2013 (INVIMA).

Construido con Angular 21, PrimeNG 21, TailwindCSS v4 y Supabase.

## Desarrollo local

```bash
npm install
cp src/environments/environment.example.ts src/environments/environment.ts
# Editar environment.ts con tus credenciales de Supabase
npm start
```

El servidor queda disponible en `http://localhost:4200/`.

## Comandos disponibles

```bash
npm start          # Servidor de desarrollo (auto-recarga)
npm run build      # Build de producción → dist/sakai-ng/
npm run watch      # Build en modo watch
npm test           # Pruebas unitarias con Karma/Jasmine
npm run format     # Formateo con Prettier
```

## Scaffolding con Angular CLI

```bash
ng generate component app/features/<feature>/components/<nombre>
ng generate service app/features/<feature>/services/<nombre>
```

## Build

```bash
ng build
```

Los artefactos quedan en el directorio `dist/`. El build de producción optimiza la aplicación para rendimiento.

## Pruebas

```bash
ng test        # Unitarias
ng e2e         # End-to-end (requiere framework e2e instalado)
```

## Recursos adicionales

- [Angular CLI](https://angular.dev/tools/cli)
- [PrimeNG](https://primeng.org)
- [Supabase](https://supabase.com/docs)
- [Resolución 2674 de 2013](https://www.minsalud.gov.co)
