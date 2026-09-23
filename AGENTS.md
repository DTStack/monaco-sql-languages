# AGENTS.md

Guidance for agents working in this repository.

**If this document contradicts the code, trust the code, fix this document, and say so in your reply.**
**Keep this file short — pair every addition with a deletion.**

## What this is

`monaco-sql-languages` is a published npm library adding SQL support to
[monaco-editor](https://github.com/microsoft/monaco-editor): highlighting, validation, completion,
hover/definition/reference, an optional format action, and a run-statement gutter button. The README
has the feature tour.

Parsing comes from **`dt-sql-parser`** (external). Editor providers run it in **web workers**; the
run-statement splitter (`src/runStatementButton/statementRanges.ts`) is the only main-thread parser.

Dialects: `flinksql`, `sparksql`, `hivesql`, `trinosql`, `mysql`, `pgsql`, `impalasql`, `genericsql`
(`LanguageIdEnum` in `src/common/constants.ts`). Use **pnpm 9.7.0**, **Node >= 18**.

## Layout

| Path | What it is |
| --- | --- |
| `src/` | The library. Everything published comes from here. |
| `website/` | The playground — see "Playground (website/)". Own `package.json` and lockfile. |
| `test/` | Mocha harness: monaco under jsdom + requirejs. |
| `documents/`, `samples/` | Integration guides; four runnable consumer integrations (`esm-vite`, `esm-plain-webpack`, `esm-monaco-webpack-plugin`, `esm-vite-monaco-editor-react`). |
| `esm/`, `esm-dev/`, `out/`, `docs/` | Build output, git-ignored. `docs/` is the published site. |

## Commands

```bash
pnpm build                   # tsc -> esm/   (what gets published)
pnpm build-amd               # tsc -> out/amd/ (required before tests)
pnpm watch-esm               # incremental esm/ build for local dev
pnpm test                    # build-amd + mocha ./test/all.js
pnpm check-types             # tsc -p tsconfig.json (noEmit, strict)
pnpm format / prettier-check # prettier write / check
pnpm build:dev               # -> esm-dev/ — nothing consumes this; don't use it

cd website && pnpm install && pnpm dev    # playground; needs esm/ built first
cd website && pnpm lint                   # eslint, max-warnings 0
cd website && pnpm build                  # builds the site into ../docs
```

Judge success by the signal, not the exit code: `prettier-check` ends with `All matched files use
Prettier code style!`; `check-types`, `build` and `build-amd` print nothing on success; `pnpm test`
ends with mocha's `N passing` summary. Never report "tests pass" without one of these in hand.

**Run these only when the user explicitly asks:** `pnpm release` (interactive `standard-version` — it
rewrites `CHANGELOG.md`, commits and tags) and `pnpm deploy` (pushes the site to GitHub Pages).

CI (`.github/workflows/ci.yml`, Node 18 + 20, `--frozen-lockfile`) runs three jobs: `check`
(`prettier-check` + `check-types`), `test` (`pnpm test`), `build` (`pnpm build`).

## Definition of done

Rows **overlap**; they are not alternatives. The `src/**/*.ts` row is the floor — always run it for a
source change — then add every specific row that matches. (`check-types` uses `noEmit` and does
**not** prove the ESM build compiles.)

| You changed | Run | Why |
| --- | --- | --- |
| Any `src/**/*.ts` — **always** | `pnpm build` **and** `pnpm check-types` | Different tsconfigs; both must pass. |
| `src/languages/<d>/<d>.ts` | also `pnpm test` | Tokenization assertions live in `<d>.test.ts`. |
| `src/languageFeatures.ts`, `src/format*.ts`, `src/runStatementButton/**` | also `pnpm test` | Covered by `src/test/languageFeatures.test.ts`, `format*.test.ts`, `statementSplitUtils.test.ts`. |
| `website/**` | `cd website && pnpm build` (strict `tsc`), `pnpm lint`, then exercise by hand | No tests; lint isn't in CI; root `pnpm build` never sees `website/`. |
| `package.json` / `pnpm-lock.yaml` | `pnpm install`, then `pnpm test` | A stale lockfile breaks CI. |
| `README*.md` / `documents/**` | nothing | Docs only. |

## Architecture

### Two parallel worker pipelines

1. **Editor-provider pipeline** — `setupLanguageFeatures` → `setupLanguageMode` → `WorkerManager` →
   the adapters in `src/languageFeatures.ts`. Driven by the user's config.
2. **Imperative pipeline** — the exported `LanguageService` class (`src/languageService.ts`), with
   its own per-language `WorkerManager` map, exposing `valid`, `getAllEntities`,
   `getSerializedParseTree` and `dispose`.

`LanguageService` **ignores `setupLanguageFeatures` entirely** — `getLanguageServiceDefault()` builds
its defaults from `modeConfigurationDefault`, so custom completion services, `preprocessCode` and
feature toggles do not apply. The playground's parse-tree panel uses this pipeline, deep-importing
`monaco-sql-languages/esm/languageService`. When you change provider behaviour, say which pipeline you
touched.

### Public entry points

`.` → `esm/main.js` (`src/main.ts`) re-exports the public API — add new public symbols there.
`./format` → `esm/format.entry.js` (see "Format entry"). `./esm/*` passes through, so consumers
deep-import contributions, workers and `languageService`.

### Per-dialect wiring

Each dialect is `src/languages/<d>/`. **`mysql` is the reference — copy its file shape.**

| File | Role |
| --- | --- |
| `<d>.ts` | Exports `language` (Monarch tokenizer) and `conf`. Tokens come from `TokenClassConsts`, not raw strings. |
| `<d>.contribution.ts` | Side-effect module: `registerLanguage(...)` then `setupLanguageFeatures(...)`. |
| `<d>Worker.ts` | Parser class extending `BaseSQLWorker`. `pgsql` breaks the casing (`PgSQLWorker.ts`). |
| `<d>.worker.ts` | Worker entry: `self.onmessage` + `EditorWorker.initialize(...)`. |
| `<d>.snippet.ts`, `<d>.test.ts` | Snippets; tokenization tests (`trino` and `generic` have none). |

### Other modules

`_.contribution.ts` registers languages and loads Monarch **lazily** (`loader: () => import('./mysql')`)
so contributions stay cheap. `monaco.contribution.ts` holds the public types,
`LanguageServiceDefaultsImpl` and `defaultCompletionService`. `baseSQLWorker.ts` is the worker-side API
shared by all dialects. `src/fillers/monaco-editor-core*.ts` is the single place monaco is referenced
(ESM re-exports `editor.api`; AMD returns a lazy proxy over the global).

### dt-sql-parser coupling

Beyond its public API, the library imports internal build paths that can move in any release:
`dt-sql-parser/dist/parser/<dialect>` in every `<d>Worker.ts` (and in `statementRanges.ts` on the main
thread), plus `/common/basicSQL`, `/types`, `/entityCollector`, `/textAndWord` in `baseSQLWorker.ts`
and `languageFeatures.ts`. When upgrading, re-check those paths, not just the version.

### Adding a new dialect

1. Create `src/languages/<d>/` with the files above, copying `mysql`.
2. Add the id to `LanguageIdEnum`; import the contribution in `src/all.contributions.ts`; export
   snippets from `src/snippets.ts` and add a case in `getDefaultSnippets`.
3. Add the parser to `parserMap` (`statementRanges.ts`) and to `languageIdToSqlLanguage`
   (`src/format.ts`).
4. **Wire the worker label.** `WorkerManager` uses
   `editor.createWebWorker({ moduleId: languageId, label: languageId })`, so consumers must map that
   `label` inside `MonacoEnvironment.getWorker` (see `documents/integrate-esm.md`). Miss it and the
   language highlights but has no diagnostics or completion.
5. Wire the playground's three integration points — see "Playground (website/)".
6. Add tokenization cases to `<d>.test.ts`.

## Playground (website/)

Vite + React + `@dtinsight/molecule`; its build output goes to `../docs`, published to GitHub Pages.

- **Run it:** `pnpm build` (or keep `pnpm watch-esm` running) at the root first, then
  `cd website && pnpm install && pnpm dev`. Do **not** use the root `pnpm dev` — it writes to
  `esm-dev/`, which nothing consumes.
- `website/vite.config.ts` aliases `monaco-sql-languages` to the repo root, so `main`/`exports`
  resolve to `esm/main.js`, and `monaco-editor` to the root copy pinned by the devDependency (0.54.0).
- **Three integration points** per dialect: `src/languages/languageWorker.ts`
  (`MonacoEnvironment.getWorker`), `src/languages/index.ts` (feature setup), `src/consts/index.ts`.
- `src/languages/helpers/completionService.ts` (~780 lines of CTE / derived-table / alias resolution)
  is the **reference implementation consumers copy** — treat its behaviour as user-facing API.
- **No tests exist here.** Changes can only be verified by hand; say so instead of implying coverage.

## Format entry

`src/formatBridge.ts` holds a registrar that `format.entry.ts` sets. This is the single source of
truth for format.

- `setupLanguageFeatures(..., { format: { enable: true } })` **throws** unless
  `import 'monaco-sql-languages/format'` ran first. If the entry loads later, already-loaded languages
  are re-registered automatically.
- Importing the entry does **not** statically bundle `sql-formatter` — it is an optional peer loaded
  via `await import('sql-formatter')` in `src/format.ts`. Never add a static import to the main entry.

## Conventions

- **Prettier**: tabs, single quotes, no trailing commas, semicolons, width 100. Run `pnpm format`
  yourself — a `simple-git-hooks` pre-commit hook is configured, but `package.json` has no
  `postinstall`/`prepare` to install it, so a fresh clone may have none.
- **Conventional commits**, types limited to `feat | fix | docs | style | refactor | test | build | ci | chore`.
- **TypeScript is strict** with `noUnusedLocals`/`noUnusedParameters` — unused imports fail `check-types`.
- **Import monaco from `./fillers/monaco-editor-core`**, never from `monaco-editor`. Two exceptions:
  `*.worker.ts` imports `editor.worker.js`, and `src/languageFeatures.ts` imports it as a value — an
  existing inconsistency, not a pattern to copy.
- **Write new comments and public docs in English**; update both `README.md` and `README-zh_CN.md`
  when the public API changes.

## Testing

Tests compile to AMD (`out/amd/`) and run in Node under jsdom + requirejs via `test/all.js`, which
shims the browser globals monaco needs.

**You cannot run a subset.** `test/all.js` never reads `process.argv` — no `--grep`, no single-file
run — and `.mocharc.json` is vestigial (the runner builds its own Mocha with `ui: 'bdd'`). It globs
exactly these paths, so a test file elsewhere silently never runs:

- `src/languages/*/*.test.ts`, `src/runStatementButton/*.test.ts`, `src/test/*.test.ts`
- `src/format.test.ts`, `src/formatBridge.test.ts`

Write tokenizer tests with `testTokenization` from `src/test/testRunner.ts`, asserting against
`TokenClassConsts` + `postfixTokenClass`; copy `src/test/languageFeatures.test.ts` for provider-level
behaviour. Browser globals go in `test/all.js`; AMD module stubs (`vs/css`, `dt-sql-parser`) in
`test/setup.js`.

`tsconfig.esm.json` excludes `**/*.test.ts` and `src/test/**`; `tsconfig.amd.json` targets **ES5** with
`allowJs`, which is why a change can pass `pnpm test` yet break `pnpm build`. The AMD run uses monaco's
**dev** build and stubs `vs/css`, `vs/nls` and the bare `dt-sql-parser` specifier — but not deep
imports like `dt-sql-parser/dist/parser/mysql`, which resolve to the real package.

## Gotchas

- **Changing the online preview** → edit `website/`, never `docs/`.
- **Recording a change for release notes** → the commit message, not `CHANGELOG.md` (generated by
  `standard-version`).
- **Editing `package.json` dependencies** → update `pnpm-lock.yaml` in the same change.
- **Renaming anything under `src/languages/<d>/`** → consumers deep-import those paths via `./esm/*`.
- **Passing `preprocessCode`** → keep the line count identical, or diagnostics land on the wrong
  lines. It also does not reach the `LanguageService` pipeline.
- **Working on the parser across repos** → `package.json` may temporarily point `dt-sql-parser` at a
  local checkout; restore the published version before committing.
