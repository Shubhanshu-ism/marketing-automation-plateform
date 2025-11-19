// k6/smoke-test.js

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 10 }, // Ramp-up to 10 virtual users over 10s
    { duration: '20s', target: 10 }, // Stay at 10 virtual users for 20s
    { duration: '5s', target: 0 },   // Ramp-down to 0 users
  ],
  thresholds: {
    'http_req_duration': ['p(95)<500'], // 95% of requests should be below 500ms
    'http_req_failed': ['rate<0.01'],   // Error rate should be less than 1%
  },
};

export default function () {
  const res = http.get('http://localhost:3001/health');
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'body is correct': (r) => r.body.includes('{"api":"ok","db":"ok"}'),
  });

  sleep(1);
}
