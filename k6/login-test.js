// k6/login-test.js

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 20 },
    { duration: '20s', target: 20 },
    { duration: '5s', target: 0 },
  ],
  thresholds: {
    'http_req_duration': ['p(95)<1000'],
    'http_req_failed': ['rate<0.01'],
  },
};

const BASE_URL = 'http://localhost:3001';
const USER_CREDENTIALS = {
  email: 'test@example.com', // Assume this user exists in the database
  password: 'password',
};

export default function () {
  const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify(USER_CREDENTIALS), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(loginRes, {
    'login successful': (r) => r.status === 201,
    'has access token': (r) => r.json('access_token') !== '',
  });

  sleep(1);
}
