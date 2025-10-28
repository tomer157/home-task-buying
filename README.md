# ------------------

## Overview

This project contains a **Playwright**-based end-to-end (E2E) testing suite designed to validate core web application flows such as login, authentication, search, and cart functionality.  
The suite is modular, reusable, and easily extendable for future test cases.

## Prerequisites

- Node.js **v14+**
- npm (Node Package Manager)
- Playwright (installed automatically via `npm install`)

## Getting Started

### Step 1: Clone the Repository

Clone the repository to your local machine:

git clone <private repository URL will be provided>
cd <project-directory>
npm install

## how to run tests:

    1. In terminal type: npm run test:latests: For running on all browsers latests versions.
    2. In terminal type: npm run test:chrome: for running only on chrome (Preffered).

### Architecture Structure Explanation..

The project follows a **clean Page Object Model (POM)** structure with clear separation between layers:

- **core/** — Contains base classes (`BasePage`, `decorators.ts`) providing shared behavior such as navigation, step annotation, and logging.
- **pages/** — Contains modular page classes (`MainPage.ts`) implementing specific UI flows (login, validation, etc.).
- **utils/** — Utility classes such as `LocatorFinder` for resilient multi-locator element handling and `IUtils` for environment and cookie management.
- **tests/** — Contains Playwright test suites using the page objects to run realistic E2E scenarios.

This modular approach allows easy maintenance, parallel execution, and resilience to UI changes.

### Reports

- By default, Playwright generates an **HTML report** located at: playwright-report/index.html

### Error loggers:

- All functions behaviour during test will logged into: logs\locator-fallback.log

### data-driven fixtures

- All test non secret data will fetched from data\searchData.json

```

```
