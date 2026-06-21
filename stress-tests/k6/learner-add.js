/**
 * learner-add.js — Bulk learner enrollment load test.
 * Tests adding many learners to a course concurrently.
 *
 * Setup required in stress-test DB:
 *   - An approved organization (ORG_EMAIL/ORG_PASSWORD)
 *   - At least one course created by that org (COURSE_ID)
 *
 * Usage:
 *   k6 run -e COURSE_ID=<your-course-id> stress-tests/k6/learner-add.js
 */
import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';
import { BASE_URL, standardThresholds, login, authHeaders } from './config.js';

const learnerAddLatency = new Trend('learner_add_latency', true);
const learnerAddFailRate = new Rate('learner_add_fail_rate');
const learnersEnrolled = new Counter('learners_enrolled');

export const options = {
  stages: [
    { duration: '15s', target: 10 },
    { duration: '60s', target: 30 },
    { duration: '30s', target: 30 },
    { duration: '15s', target: 0 },
  ],
  thresholds: Object.assign({}, standardThresholds, {
    'learner_add_latency': ['p(95)<1500'],
    'learner_add_fail_rate': ['rate<0.05'],
  }),
};

export function setup() {
  const orgToken = login(
    __ENV.ORG_EMAIL || 'org@stress.test',
    __ENV.ORG_PASSWORD || 'Org@StressTest1'
  );

  // If no course ID provided, create one
  let courseId = __ENV.COURSE_ID;
  if (!courseId) {
    const res = http.post(
      `${BASE_URL}/api/organization/courses`,
      JSON.stringify({
        courseName: 'Stress Test Enrollment Course',
        description: 'Course created during learner-add stress test setup.',
      }),
      authHeaders(orgToken)
    );
    courseId = res.json('data._id');
    console.log(`Created test course: ${courseId}`);
  }

  return { orgToken, courseId };
}

export default function ({ orgToken, courseId }) {
  if (!courseId) {
    console.error('No courseId available — skipping iteration');
    return;
  }

  group('Add learner to course', () => {
    // Generate unique learner per iteration
    const uniqueSuffix = `${Date.now()}${Math.random().toString(36).slice(2, 9)}`;
    const learnerEmail = `learner.${uniqueSuffix}@stress.test`;
    const learnerName = `Stress Learner ${uniqueSuffix}`;

    const res = http.post(
      `${BASE_URL}/api/organization/courses/${courseId}/learners?courseId=${courseId}`,
      JSON.stringify({ username: learnerEmail, learnerName }),
      authHeaders(orgToken)
    );

    learnerAddLatency.add(res.timings.duration);

    const success = check(res, {
      'learner enrolled (201)': (r) => r.status === 201,
      'response has userId': (r) => {
        try { return r.json('data.user._id') !== undefined; } catch (e) { return false; }
      },
    });

    if (!success) {
      learnerAddFailRate.add(1);
      console.warn(`Learner add failed: ${res.status} — ${res.body.slice(0, 200)}`);
    } else {
      learnerAddFailRate.add(0);
      learnersEnrolled.add(1);
    }
  });

  sleep(Math.random() * 1 + 0.3);
}
