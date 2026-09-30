# 애자일 디자인 리팩토링 실습

이 저장소는 **Agile Design 2 — Refactoring & Testable Design** 수업을 위한 실습 프로젝트입니다.

예제 앱은 **교내 시설 신고 앱**이며, React + TypeScript + Capacitor로 작성된 Android 하이브리드 앱입니다.

이 프로젝트의 시작 코드는 일부러 **동작은 하지만 변경하기 어렵고 테스트하기 어려운 상태**로 구성되어 있습니다. 완성된 구조를 보여주는 예제가 아니라, 학생들이 직접 문제를 발견하고 작은 단위로 개선하기 위한 출발점입니다.

## 학습 목표

- 동작하는 코드에서 Code Smell을 찾을 수 있다.
- 동작을 유지하면서 작은 Refactoring을 적용할 수 있다.
- Test를 Refactoring의 Safety Net으로 사용할 수 있다.
- 테스트하기 어려운 코드에서 설계 문제를 발견할 수 있다.
- Red → Green → Refactor의 TDD 사이클을 직접 수행할 수 있다.

## 예제 앱

학생은 교내 시설의 고장이나 불편 사항을 다음 정보와 함께 신고할 수 있습니다.

- 제목
- 카테고리
- 설명
- 현재 위치
- 사진

신고 데이터는 우선 `localStorage`에 저장합니다.

## 사용 기술

- React
- TypeScript
- Vite
- Capacitor
- Capacitor Camera
- Capacitor Geolocation
- Vitest

## 브라우저에서 실행

```bash
npm install
npm run dev
```

브라우저에서는 화면과 기본 입력/저장 동작을 확인할 수 있습니다.

Camera와 Geolocation은 Android 환경에서 확인하는 것을 권장합니다.

## Android 하이브리드 앱으로 실행

Android Studio가 설치되어 있어야 합니다.

처음 한 번은 다음 순서로 실행합니다.

```bash
npm install
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

`android/` 프로젝트가 생성된 이후에는 다음 명령으로 반복 실행할 수 있습니다.

```bash
npm run android:sync
npm run android:open
```

## 실습에서 지켜야 할 원칙

**처음부터 전체 구조를 다시 설계하지 않습니다.**

이번 실습의 목적은 큰 구조를 한 번에 만드는 것이 아니라 다음 과정을 반복하는 것입니다.

```text
문제 발견
  ↓
작은 Refactoring
  ↓
동작 확인
  ↓
다음 작은 Refactoring
```

## 권장 실습 순서

1. `src/pages/ReportPage.tsx`를 읽고 Code Smell을 찾습니다.
2. 기존 동작을 유지한 채 Validation을 분리합니다.
3. 중복된 Validation 로직을 제거합니다.
4. Report 생성 로직을 분리합니다.
5. 분리된 로직에 Test를 추가합니다.
6. 현재 시간과 위치 정보처럼 테스트하기 어려운 외부 환경을 통제 가능하게 개선합니다.
7. 새로운 요구사항 하나를 TDD로 추가합니다.

## 살펴볼 수 있는 Code Smell

아래 목록을 처음부터 정답처럼 사용하지 않는 것을 권장합니다. 먼저 코드를 직접 읽고 문제를 찾은 뒤 비교하십시오.

- Long Function
- Large Component
- Duplicated Code
- Magic String / Magic Number
- 현재 시간에 대한 직접 의존
- Geolocation에 대한 직접 의존
- Local Storage에 대한 직접 의존
- UI 처리와 핵심 로직의 혼합

## TDD 추가 요구사항

Refactoring을 어느 정도 수행한 뒤 다음 요구사항을 추가합니다.

> 신고 제목은 공백을 제외하고 최소 2글자 이상이어야 한다.

다음 순서로 진행합니다.

```text
RED
실패하는 Test 작성
   ↓
GREEN
Test를 통과하는 최소 구현
   ↓
REFACTOR
구조 개선
```

## Kiro 사용

Kiro는 실습의 중심이 아니라 **Refactoring과 TDD를 수행하는 보조 도구**로 사용합니다.

먼저 개발자가 어떤 문제를 고칠지 판단한 뒤, Kiro에게 한 번에 작은 변경만 요청하는 것을 권장합니다.

예:

> 기존 동작을 변경하지 말고 `saveReport()`에서 제목 검증 로직만 별도 함수로 추출하라.

> 현재 제목 검증 동작을 보존하는 Test를 먼저 작성하라.

> 새로 실패한 Test 하나를 통과시키는 최소 구현만 작성하라.

Kiro가 만든 변경도 반드시 직접 검토합니다.
