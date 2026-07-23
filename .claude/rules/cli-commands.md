## Development Commands

Note: pnpm is used as package manager. Use pnpm commands below instead of manual commands.

**Run package.json scripts verbatim.** Invoke the script as defined — never append pipes, redirects (`2>&1`, `| tail`, `| head`), or extra flags. Don't append a file path to a whole-project script (`pnpm lint`, `pnpm lint:fix`, `pnpm typecheck`, `pnpm test:run`). To lint a single file, use a dedicated `pnpm lint:file <path>` script (the path is its argument). `typecheck` and the test suites have no per-file variant — run them whole; for tests, run the full suite, not one file.

**Important**: Don't look inside .env files. Don't use commands to read env file content (e.g. `cat .env`, `nano .env`, `vim .env`, `echo .env`, etc.).

These are the expected scripts. If a script name differs in `package.json`, use the one defined there.

**Install & Run:**
```
pnpm install
pnpm dev          # development with watch mode
pnpm build        # build production bundle
```

**Code Quality:**
```
pnpm lint               # ESLint (all files)
pnpm lint:fix           # ESLint with auto-fix (all files)
pnpm lint:file <path>   # ESLint with auto-fix on a single file
pnpm typecheck          # TS type checking
```

**Testing:**
```
pnpm test              # run all tests in watch mode (vitest)
pnpm test:run          # run all tests once (unit + integration), non-watch
pnpm test:unit         # unit project only
pnpm test:integration  # integration project only
```
