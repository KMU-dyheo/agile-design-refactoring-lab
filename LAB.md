# Classroom Lab Guide

## Part 1 — Observe before changing

Open `src/pages/ReportPage.tsx`.

Answer these questions before using an AI coding agent:

1. Which function is hardest to read or change?
2. Which responsibilities are mixed together?
3. Which values or rules are duplicated?
4. Which parts would be hard to unit test?
5. Which external resources does the code access directly?

## Part 2 — Small refactoring

Refactor in small steps. Recommended first targets:

- Rename unclear concepts if you find any.
- Extract validation.
- Remove duplicated category validation.
- Extract report creation.

After each step, run the app and confirm behavior is unchanged.

## Part 3 — Add tests

Once pure logic has been extracted, add tests with Vitest.

```bash
npm run test
```

Focus tests on observable behavior rather than the exact internal method structure.

## Part 4 — Testable design

Identify code that depends directly on:

- current time
- Geolocation
- Local Storage

Change the design so tests can supply controlled alternatives without rewriting the whole application.

## Part 5 — TDD

New requirement:

> A report title must contain at least two non-whitespace characters.

Use:

1. RED — write a failing test.
2. GREEN — implement the minimum code required to pass it.
3. REFACTOR — improve names/structure while keeping tests green.

## Optional Kiro exercise

Use Kiro only after you have decided what should change.

Ask it to perform **one small change at a time**, for example:

- "Do not change behavior. Extract only the title validation from `saveReport`."
- "Add tests that describe the current title-validation behavior before changing it."
- "Make the smallest implementation that passes this new failing test."

Review every change before accepting it.
