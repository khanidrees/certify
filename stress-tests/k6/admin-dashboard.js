/**
 * admin-dashboard.js — Admin dashboard polling load test.
 * Simulates admins repeatedly fetching the organization list to approve/reject accounts.
 *
 * Usage:
 *   k6 run stress-tests/k6/admin-dashboard.js
 */
import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Trend, Rate } from 'k6/metrics';
import { BASE_URL, standardThresholds, login, authHeaders } from './config.js';

const dashboardLatency = new Trend('admin_dashboard_latency', true);
const dashboardFailRate = new Rate('admin_dashboard_fail_rate');

export const options = {
  stages: [
    { duration: '15s', target: 5 },
    { duration: '60s', target: 20 },
    { duration: '30s', target: 20 },
    { duration: '15s', target: 0 },
  ],
  thresholds: Object.assign({}, standardThresholds, {
    'admin_dashboard_latency': ['p(95)<400'],
    'admin_dashboard_fail_rate': ['rate<0.01'],
  }),
};

export function setup() {
  return {
    adminToken: login(
      __ENV.ADMIN_EMAIL || 'admin@stress.test',
      __ENV.ADMIN_PASSWORD || 'Admin@StressTest1'
    ),
  };
}

export default function ({ adminToken }) {
  group('Admin dashboard GET', () => {
    const res = http.get(
      `${BASE_URL}/api/admin/dashboard`,
      authHeaders(adminToken)
    );

    dashboardLatency.add(res.timings.duration);

    const success = check(res, {
      'dashboard status 200': (r) => r.status === 200,
      'dashboard returns array': (r) => {
        try { return Array.isArray(r.json('data')); } catch (e) { return false; }
      },
    });

    if (!success) {
      dashboardFailRate.add(1);
      console.warn(`Admin dashboard failed: ${res.status}`);
    } else {
      dashboardFailRate.add(0);
    }
  });

  sleep(Math.random() * 2 + 1);
}
