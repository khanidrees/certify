/**
 * Shared config and helpers for all k6 stress test scripts.
 * Uses environment variables set in .env.production.example (STRESS_*).
 */

// Base URL — override with: k6 run -e BASE_URL=https://your-app.vercel.app script.js
export const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// Test credentials (use stress-test DB, never production data)
export const ADMIN_EMAIL = __ENV.ADMIN_EMAIL || 'admin@stress.test';
export const ADMIN_PASSWORD = __ENV.ADMIN_PASSWORD || 'Admin@StressTest1';
export const ORG_EMAIL = __ENV.ORG_EMAIL || 'org@stress.test';
export const ORG_PASSWORD = __ENV.ORG_PASSWORD || 'Org@StressTest1';

// Default HTTP params
export const defaultParams = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

/**
 * Login and return JWT token.
 * Throws if login fails (halts VU iteration).
 */
import http from 'k6/http';
import { check, fail } from 'k6';

export function login(email, password) {
  const res = http.post(
    `${BASE_URL}/api/auth/login`,
    JSON.stringify({ username: email, password }),
    defaultParams
  );

  const ok = check(res, {
    'login status 200': (r) => r.status === 200,
    'login returns token': (r) => r.json('data.token') !== undefined,
  });

  if (!ok) {
    fail(`Login failed for ${email}: ${res.status} ${res.body}`);
  }

  return res.json('data.token');
}

/**
 * Returns auth headers for an authenticated request.
 */
export function authHeaders(token) {
  return {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };
}

/**
 * Standard thresholds applied to all scenarios.
 * Adjust per-script if needed.
 */
export const standardThresholds = {
  // 95th percentile response time under 500ms
  http_req_duration: ['p(95)<500'],
  // Less than 1% of requests should fail
  http_req_failed: ['rate<0.01'],
  // All checks must pass at 95%+
  checks: ['rate>0.95'],
};
