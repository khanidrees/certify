/**
 * auth-load.js — Authentication load & stress test.
 * Simulates real users logging in concurrently.
 *
 * Stages:
 *   0-30s:  Ramp from 1 → 50 VUs  (warm up)
 *   30-90s: Hold at 50 VUs         (sustained load)
 *   90-120s: Ramp to 150 VUs       (peak load)
 *   120-150s: Hold at 150 VUs      (stress)
 *   150-180s: Ramp down to 0       (cool down)
 *
 * Usage:
 *   k6 run stress-tests/k6/auth-load.js
 *   k6 run --out json=results/auth-load.json stress-tests/k6/auth-load.js
 */
import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';
import { BASE_URL, defaultParams, standardThresholds, authHeaders } from './config.js';

// Custom metrics
const loginLatency = new Trend('login_latency', true);
const loginFailRate = new Rate('login_fail_rate');
const successfulLogins = new Counter('successful_logins');

export const options = {
  stages: [
    { duration: '30s', target: 50 },
    { duration: '60s', target: 50 },
    { duration: '30s', target: 150 },
    { duration: '30s', target: 150 },
    { duration: '30s', target: 0 },
  ],
  thresholds: Object.assign({}, standardThresholds, {
    'login_latency': ['p(95)<800'],
    'login_fail_rate': ['rate<0.02'],
  }),
};

// Credential pool — add more accounts to stress-test DB for realism
const credentials = [
  { email: __ENV.ORG_EMAIL || 'org@stress.test', password: __ENV.ORG_PASSWORD || 'Org@StressTest1' },
  { email: __ENV.LEARNER_EMAIL || 'learner@stress.test', password: __ENV.LEARNER_PASSWORD || 'Learner@StressTest1' },
];

export default function () {
  const cred = credentials[Math.floor(Math.random() * credentials.length)];

  group('Login flow', () => {
    const res = http.post(
      `${BASE_URL}/api/auth/login`,
      JSON.stringify({ username: cred.email, password: cred.password }),
      defaultParams
    );

    loginLatency.add(res.timings.duration);

    const success = check(res, {
      'status 200': (r) => r.status === 200,
      'returns token': (r) => {
        try { return r.json('data.token') !== null; } catch (e) { return false; }
      },
    });

    if (!success) {
      loginFailRate.add(1);
    } else {
      loginFailRate.add(0);
      successfulLogins.add(1);

      // After login, hit an authenticated endpoint to simulate real usage
      const token = res.json('data.token');
      const meRes = http.get(`${BASE_URL}/api/learner`, authHeaders(token));
      check(meRes, { 'profile fetch 200 or 404': (r) => [200, 404].includes(r.status) });
    }
  });

  sleep(Math.random() * 2 + 0.5); // Random think time: 0.5–2.5s
}
