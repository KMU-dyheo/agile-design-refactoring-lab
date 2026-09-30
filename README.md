# Agile Design Refactoring Lab

**Campus Issue Reporter** is a small React + TypeScript + Capacitor application prepared for an **Agile Design 2: Refactoring & Testable Design** classroom lab.

The starter code intentionally represents a realistic **working-but-hard-to-change** implementation. It is not meant to demonstrate a recommended architecture. Students should improve the code incrementally while preserving behavior.

## Learning goals

- Find code smells in working code.
- Apply small, behavior-preserving refactorings.
- Use tests as a safety net for refactoring.
- Discover design problems through testability problems.
- Practice one Red → Green → Refactor TDD cycle.

## App scenario

A student can report a campus facility issue with:

- title
- category
- description
- current location (Capacitor Geolocation)
- photo (Capacitor Camera)

Reports are stored locally using `localStorage`.

## Tech stack

- React 19
- TypeScript
- Vite 8
- Capacitor 8
- Capacitor Camera
- Capacitor Geolocation
- Vitest

> Capacitor 8 requires Node.js 22 or later.

## Run in the browser

```bash
npm install
npm run dev
```

The UI can be inspected in a browser. Native Camera behavior is intended for Android.

## Run as an Android hybrid app

Install Android Studio first, then:

```bash
npm install
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

After the `android/` project has been generated once, normal iterations can use:

```bash
npm run android:sync
npm run android:open
```

## Starter-code rule

Do **not** redesign the entire project at once.

The exercise is to make small changes and verify behavior after each change.

Suggested sequence:

1. Read `src/pages/ReportPage.tsx` and identify code smells.
2. Extract title/report validation without changing behavior.
3. Remove duplicated validation logic.
4. Extract report creation logic.
5. Add characterization/unit tests for the extracted logic.
6. Make time and location controllable in tests.
7. Add one new requirement with TDD.

## Candidate smells to discuss

Do not treat this list as the answer key. Use it only after students have inspected the code themselves.

- Long function
- Large component / multiple responsibilities
- Duplicated conditional logic
- Magic strings and numbers
- Direct access to current time
- Direct access to Geolocation
- Direct access to Local Storage
- UI notifications mixed with domain logic

## TDD extension requirement

After refactoring, add this requirement using Red → Green → Refactor:

> A report title must contain at least two non-whitespace characters.

Write the failing test first, implement the minimum behavior, then refactor while keeping all tests green.

## Important

The code in the starter state is intentionally not the final design. Its purpose is to give every student the same working code so that the class can focus on **refactoring decisions and testability** rather than initial implementation.
