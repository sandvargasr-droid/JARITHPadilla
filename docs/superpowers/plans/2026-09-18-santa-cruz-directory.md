# Santa Cruz Directory Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Poblar InfluConnect con perfiles públicos reales de creadores y empresas cruceñas sin atribuirles campañas, precios, reseñas o acuerdos inventados.

**Architecture:** Los perfiles reales viven como registros referenciales no autenticables en la base en memoria, mientras dos cuentas ficticias conservan el flujo interactivo. Campos opcionales de procedencia distinguen los perfiles públicos; utilidades puras normalizan métricas desconocidas y las vistas muestran directorios con fuentes externas y avisos de demostración.

**Tech Stack:** React 19, TypeScript, Express, base en memoria, Node test runner, Vite/GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-09-18-santa-cruz-directory.md`

## Global Constraints

- Usar únicamente identidad, ubicación, especialidad, usuario y métricas encontrados en fuentes públicas.
- No inventar tarifas, calificaciones, reseñas, edades, género, portafolios ni colaboraciones para perfiles reales.
- Todas las campañas y relaciones precargadas son ficticias, están etiquetadas como demostración y solo conectan cuentas ficticias.
- Conservar la publicación de GitHub Pages desde la raíz de `main` bajo `/JARITHPadilla/`.

---

### Task 1: Contrato y formato de perfiles referenciales

**Files:**
- Modify: `src/types.ts`
- Create: `src/utils/profileDisplay.ts`
- Test: `tests/profileDisplay.test.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `PublicProfileMetadata`, `formatFollowers(number): string`, `formatRate(number): string`, `formatRating(number, number): string`.
- Consumes: Ninguna interfaz nueva.

- [ ] **Step 1: Write the failing test**

```ts
assert.equal(formatFollowers(0), 'No publicado');
assert.equal(formatFollowers(68800), '68.8 mil');
assert.equal(formatRate(0), 'A consultar');
assert.equal(formatRating(0, 0), 'Sin calificaciones');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx --test tests/profileDisplay.test.ts`
Expected: FAIL porque `src/utils/profileDisplay.ts` todavía no existe.

- [ ] **Step 3: Write minimal implementation**

```ts
export function formatRate(value: number) {
  return value > 0 ? `$${value} USD` : 'A consultar';
}
```

Añadir metadatos opcionales `isReferenceProfile`, `sourceUrl` y `dataUpdatedAt` a perfiles, y `isDemo` a campañas.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS para pruebas estáticas y de formato.

### Task 2: Semillas reales y aislamiento transaccional

**Files:**
- Modify: `server/mockData.ts`
- Modify: `tests/staticApi.test.ts`

**Interfaces:**
- Consumes: Metadatos públicos definidos en Task 1.
- Produces: 13 creadores públicos, 12 empresas locales, 2 cuentas ficticias operativas y campañas demo aisladas.

- [ ] **Step 1: Write the failing test**

```ts
assert.ok(handles.has('@carlitoselfoodie'));
assert.ok(handles.has('@flaviopaniaguac'));
assert.ok(handles.has('@lasabrosabo'));
assert.ok(handles.has('@anabelangus'));
assert.ok(companies.has('Hipermaxi'));
assert.ok(companies.has('Casa del Camba'));
assert.ok(campaigns.every((campaign) => campaign.isDemo));
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL porque las semillas todavía contienen perfiles españoles ficticios.

- [ ] **Step 3: Write minimal implementation**

Reemplazar `server/mockData.ts` con cuentas demo de Santa Cruz, directorios reales con fuentes, campañas demo y relaciones únicamente ficticias.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS y ningún vínculo transaccional con un perfil referencial.

### Task 3: Presentación segura de directorios y campañas demo

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/business/ExploreInfluencersView.tsx`
- Modify: `src/components/influencer/ExploreCampaignsView.tsx`

**Interfaces:**
- Consumes: `BusinessProfile[]`, metadatos públicos y utilidades de formato.
- Produces: Directorio visible de empresas, etiquetas de perfil público, fuentes y avisos de simulación.

- [ ] **Step 1: Extend the failing integration test**

Añadir a `tests/staticApi.test.ts` la carga de empresas y aserciones sobre fuentes, ceros honestos y cuentas autenticables exclusivamente demo.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL hasta que datos y API de consumo satisfagan el contrato.

- [ ] **Step 3: Write minimal implementation**

Aplicar `formatFollowers`, `formatRate` y `formatRating`; deshabilitar invitaciones a perfiles referenciales; cargar empresas en `App` y mostrarlas en `ExploreCampaignsView` con enlaces oficiales.

- [ ] **Step 4: Run test and typecheck**

Run: `npm test && npm run lint`
Expected: PASS, sin errores TypeScript.

### Task 4: Publicación y verificación final

**Files:**
- Modify generated: `index.html`
- Modify generated: `assets/*`
- Test: `tests/pagesArtifact.test.mjs`
- Test: `tests/publishedPages.test.mjs`

**Interfaces:**
- Consumes: Aplicación compilada de Tasks 1-3.
- Produces: GitHub Pages actualizado en la raíz del repositorio.

- [ ] **Step 1: Strengthen artifact expectations**

```js
assert.equal(bundle.includes('carlitoselfoodie'), true);
assert.equal(bundle.includes('Empresa Demo Santa Cruz'), true);
```

- [ ] **Step 2: Verify the artifact test fails before rebuilding**

Run: `npm run test:artifact`
Expected: FAIL porque `dist` aún contiene el artefacto anterior.

- [ ] **Step 3: Build and publish**

Run: `npm run publish:pages`
Expected: PASS para compilación, artefacto y copia publicada.

- [ ] **Step 4: Run complete verification**

Run: `npm test && npm run lint && npm run build && npm run publish:pages && git diff --check`
Expected: Todos los comandos terminan con código 0.

- [ ] **Step 5: Commit and push**

```bash
git add docs src server tests package.json index.html assets
git commit -m "feat: populate Santa Cruz creator marketplace"
git push origin main
```
