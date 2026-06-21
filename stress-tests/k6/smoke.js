/**
 * smoke.js — Sanity check: 1 virtual user, 1 iteration.
 * Run this first to verify the environment is working before load tests.
 *
 * Usage:
 *   k6 run stress-tests/k6/smoke.js
 *   k6 run -e BASE_URL=https://your-app.vercel.app stress-tests/k6/smoke.js
 */
import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, defaultParams, login, authHeaders } from './config.js';

export const options = {
  vus: 1,
  iterations: 1,
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<2000'], // Generous threshold for smoke
  },
};

export default function () {
  // 1. Health check — root page should return 200
  const homeRes = http.get(`${BASE_URL}/`, defaultParams);
  check(homeRes, { '1. Home page loads (200)': (r) => r.status === 200 });
  sleep(0.5);

  // 2. Login as admin
  const adminToken = login(
    __ENV.ADMIN_EMAIL || 'admin@stress.test',
    __ENV.ADMIN_PASSWORD || 'Admin@StressTest1'
  );
  check({ token: adminToken }, { '2. Admin login returns token': (r) => r.token !== undefined });
  sleep(0.5);

  // 3. Admin dashboard
  const dashRes = http.get(`${BASE_URL}/api/admin/dashboard`, authHeaders(adminToken));
  check(dashRes, {
    '3. Admin dashboard 200': (r) => r.status === 200,
    '3. Admin dashboard returns success': (r) => r.json('success') === true,
  });
  sleep(0.5);

  // 4. Login as org
  const orgToken = login(
    __ENV.ORG_EMAIL || 'org@stress.test',
    __ENV.ORG_PASSWORD || 'Org@StressTest1'
  );
  check({ token: orgToken }, { '4. Org login returns token': (r) => r.token !== undefined });
  sleep(0.5);

  // 5. Org dashboard
  const orgDashRes = http.get(`${BASE_URL}/api/organization/dashboard`, authHeaders(orgToken));
  check(orgDashRes, {
    '5. Org dashboard 200': (r) => r.status === 200,
    '5. Org dashboard has courses': (r) => r.json('data.courses') !== null,
  });

  console.log('✅ Smoke test complete');
}
