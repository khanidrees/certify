/**
 * course-create.js — Organization course creation load test.
 * Tests concurrent course creation by multiple org users.
 *
 * Setup required in stress-test DB:
 *   - At least 1 approved organization account (ORG_EMAIL / ORG_PASSWORD)
 *
 * Usage:
 *   k6 run stress-tests/k6/course-create.js
 */
import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Trend, Rate } from 'k6/metrics';
import { BASE_URL, standardThresholds, login, authHeaders } from './config.js';

const courseCreateLatency = new Trend('course_create_latency', true);
const courseCreateFailRate = new Rate('course_create_fail_rate');

export const options = {
  stages: [
    { duration: '20s', target: 20 },
    { duration: '60s', target: 20 },
    { duration: '20s', target: 50 },
    { duration: '30s', target: 50 },
    { duration: '20s', target: 0 },
  ],
  thresholds: Object.assign({}, standardThresholds, {
    'course_create_latency': ['p(95)<1000'],
    'course_create_fail_rate': ['rate<0.02'],
  }),
};

// VU-level setup: each VU logs in once and reuses the token
export function setup() {
  return {
    orgToken: login(
      __ENV.ORG_EMAIL || 'org@stress.test',
      __ENV.ORG_PASSWORD || 'Org@StressTest1'
    ),
  };
}

export default function ({ orgToken }) {
  group('Create course', () => {
    const courseName = `Load Test Course ${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const res = http.post(
      `${BASE_URL}/api/organization/courses`,
      JSON.stringify({
        courseName,
        description: `Automatically generated course for load testing purposes. VU iteration.`,
      }),
      authHeaders(orgToken)
    );

    courseCreateLatency.add(res.timings.duration);

    const success = check(res, {
      'course created (201)': (r) => r.status === 201,
      'response has courseId': (r) => {
        try { return r.json('data._id') !== undefined; } catch (e) { return false; }
      },
    });

    if (!success) {
      courseCreateFailRate.add(1);
      console.warn(`Course create failed: ${res.status} ${res.body}`);
    } else {
      courseCreateFailRate.add(0);
    }
  });

  sleep(Math.random() * 1.5 + 0.5);
}
