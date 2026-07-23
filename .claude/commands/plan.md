---
description: Turn docs/tasks/<feature>/spec.md into an implementation plan with a test map
---

You are running the PLAN stage of the dev pipeline.

## Steps
1. Find the task folder under `docs/tasks/`:
   - If the repo uses feature/ticket branches, derive the slug from `git branch --show-current`.
   - Otherwise use the slug from the spec you just wrote, or ask which folder if several exist.
   - No spec.md found: offer to run `/spec` first, or accept a spec pasted in this message. Do not crash.
2. Read spec.md and explore the affected code (Grep/Read/Explore) to ground the plan in real files. For greenfield work, base the plan on the modules the spec says to create and the chosen stack.
3. Write `docs/tasks/<feature>/plan.md` with:
   - **Steps** — ordered, each a small unit of work, with the exact files to create/modify. Mark each `- [ ]` so `/implement` can track progress.
   - **Test map** — a table: each requirement/acceptance criterion → the test that covers it → level (unit | integration), per `.claude/rules/testing.md`. Every requirement maps to at least one test.
4. Stop at the gate: tell the user the plan is written and ask them to skim it before implementation.

Use simple English (A2-B1) in plan.md, per `CLAUDE.md`. Follow `.claude/rules/` conventions. Do not write code in this stage. Do not commit.
