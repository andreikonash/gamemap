# CLAUDE.md

At the start of every session, read ALL of these files before any task — don't rely on memory for project conventions:

- Code style & conventions → `.claude/rules/code-style.md`
- Vue.js conventions → `.claude/rules/vue.md`
- Testing patterns → `.claude/rules/testing.md`
- CLI commands (use these, not manual equivalents) → `.claude/rules/cli-commands.md`
- Design & UI tooling (21st MCP + ui-ux-pro-max) → `.claude/rules/design-tools.md`

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- Prefer **KISS** principle over the others (DRY, GRASP, SOLID)
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be e.g. 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

## 5. UI Verification

After editing any UI component, run `/verify` to confirm the change works correctly in the running app. Type checking and linting verify code correctness, not feature correctness.

## Writing style for user-facing text

Use simple English in any text meant for a user or a tester to read (titles, descriptions, acceptance criteria):
- Target **A2-B1** level. Use short, common words — no rare or academic vocabulary.
- Short sentences, one idea per sentence.
- Avoid idioms and phrasal verbs that are hard to guess from context.
