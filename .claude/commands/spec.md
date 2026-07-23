---
description: Analyze a pasted spec into a requirements doc (docs/tasks/<feature>/spec.md)
argument-hint: paste the task spec
---

You are running the SPEC stage of the dev pipeline. The user has pasted a task spec below.

Spec:
$ARGUMENTS

## Steps
1. Pick the task folder:
   - If the repo uses feature/ticket branches, derive the slug from `git branch --show-current` (e.g. `feat/game-map` → `game-map`).
   - Otherwise infer a short kebab-case slug from the task (e.g. `map-foundation`, `join-game-flow`) and tell the user the folder you picked. If it's ambiguous, ask.
2. Size check:
   - Trivial change (a rename, a few lines, an obvious fix): say "This is fast lane — no pipeline needed" and stop. Do not write a spec.
   - Monster (multiple independent subsystems): propose a decomposition into independent chunks and ask which chunk to spec first. Each chunk gets its own pass.
3. Ground the requirements in reality:
   - If code exists, use the Explore subagent or Grep/Read to find the modules, components, stores, and helpers this touches. Do not guess.
   - If this is greenfield (mockups only, little/no code yet), say so, and ground the spec in the mockups, the described flows, and the chosen stack instead. When the task is a technology/foundation choice, compare the real options and give a recommendation with reasons — don't leave it open.
4. Write `docs/tasks/<feature>/spec.md` with:
   - **Requirements** — each a short statement.
   - **Acceptance criteria** — for every requirement, at least one verifiable criterion (observable behavior, not implementation).
   - **Affected modules** — concrete files/paths found in step 3 (or the modules to be created, for greenfield).
   - **Open questions** — anything ambiguous.
5. Stop at the gate: tell the user the spec is written, list the open questions, and ask them to review/refine before `/plan`. Do not proceed to planning.

Use simple English (A2-B1) in spec.md, per `CLAUDE.md`. Follow `.claude/rules/` conventions. Do not write code in this stage. Do not commit.
