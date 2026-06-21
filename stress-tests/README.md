# VerifyCertify — Stress Testing with k6

## Overview

This directory contains [k6](https://k6.io) load and stress tests for VerifyCertify API endpoints.
Tests are designed to run against a **dedicated stress-test database** — never against production.

## Prerequisites

### 1. Install k6

```bash
# macOS
brew install k6

# Linux (Debian/Ubuntu)
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg \
  --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" \
  | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update && sudo apt-get install k6

# Windows
winget install k6
# or: choco install k6
```

### 2. Set Up the Stress Test Database

> ⚠️ **NEVER point stress tests at your production MongoDB URI.**

1. Create a new Atlas cluster (or use a separate DB on the same cluster).
2. Copy `.env.production.example` → `.env.stress.local` and fill in `STRESS_MONGODB_URI` and `STRESS_BASE_URL`.
3. Seed the stress test DB with the required accounts (see below).

### 3. Seed Stress Test Accounts

Run the seeding script to create admin and org accounts in your stress test DB:

```bash
# Coming soon: npm run stress:seed
# For now, manually create via the app's signup + admin approval flow.
```

Required accounts in stress-test DB:
| Role | Email | Password |
|---|---|---|
| admin | admin@stress.test | Admin@StressTest1 |
| organization (approved) | org@stress.test | Org@StressTest1 |
| learner | learner@stress.test | Learner@StressTest1 |

---

## Running Tests

### Quick Start — Smoke Test (always run this first)

```bash
# Against local dev server
k6 run stress-tests/k6/smoke.js

# Against Vercel preview
k6 run -e BASE_URL=https://your-app.vercel.app \
       -e ADMIN_EMAIL=admin@stress.test \
       -e ADMIN_PASSWORD=Admin@StressTest1 \
       stress-tests/k6/smoke.js
```

### Auth Load Test (ramp 1→150 VUs)

```bash
k6 run stress-tests/k6/auth-load.js

# Save results as JSON for later analysis
k6 run --out json=results/auth-load-$(date +%Y%m%d).json stress-tests/k6/auth-load.js
```

### Course Creation Load Test

```bash
k6 run stress-tests/k6/course-create.js
```

### Learner Enrollment Load Test

```bash
# Auto-creates a course if COURSE_ID not specified
k6 run stress-tests/k6/learner-add.js

# Use a specific pre-created course
k6 run -e COURSE_ID=<mongodb-object-id> stress-tests/k6/learner-add.js
```

### Admin Dashboard Load Test

```bash
k6 run stress-tests/k6/admin-dashboard.js
```

---

## Available Environment Variables

| Variable | Default | Description |
|---|---|---|
| `BASE_URL` | `http://localhost:3000` | Target server URL |
| `ADMIN_EMAIL` | `admin@stress.test` | Admin account email |
| `ADMIN_PASSWORD` | `Admin@StressTest1` | Admin account password |
| `ORG_EMAIL` | `org@stress.test` | Org account email |
| `ORG_PASSWORD` | `Org@StressTest1` | Org account password |
| `COURSE_ID` | *(auto-created)* | MongoDB ObjectId of test course |

---

## Understanding the Results

k6 outputs a summary at the end of each run:

```
✓ login status 200
✓ returns token
✗ profile fetch 200 or 404 ← A check failed

http_req_duration............: avg=142ms  p(90)=280ms  p(95)=350ms  p(99)=820ms
http_req_failed..............: 0.12%  ← Should be < 1%
login_latency................: avg=195ms  p(95)=450ms  ← Should be < 500ms
```

### Performance Thresholds (pass/fail criteria)

| Metric | Threshold |
|---|---|
| `http_req_duration` p(95) | < 500ms |
| `http_req_failed` rate | < 1% |
| `checks` pass rate | > 95% |
| `login_latency` p(95) | < 800ms |
| `admin_dashboard_latency` p(95) | < 400ms |

### Generating an HTML Report

```bash
# Install k6-reporter
npm install -g k6-html-reporter

# Run with JSON output, then generate HTML
k6 run --out json=results/auth-load.json stress-tests/k6/auth-load.js
k6-reporter results/auth-load.json
# Opens results/auth-load.html in browser
```

---

## Adding to CI (GitHub Actions)

```yaml
# .github/workflows/stress.yml
- name: Run k6 smoke test
  uses: grafana/k6-action@v0.3.1
  with:
    filename: stress-tests/k6/smoke.js
  env:
    BASE_URL: ${{ secrets.STAGING_URL }}
    ADMIN_EMAIL: ${{ secrets.STRESS_ADMIN_EMAIL }}
    ADMIN_PASSWORD: ${{ secrets.STRESS_ADMIN_PASSWORD }}
```
