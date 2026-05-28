#!/usr/bin/env node
/* eslint-disable no-console */

const base = process.env.API_BASE_URL || 'http://localhost:3000';
const username = process.env.ADMIN_USERNAME;
const password = process.env.ADMIN_PASSWORD;

let cookie = '';

async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (cookie) headers.cookie = cookie;

  const res = await fetch(`${base}${path}`, { ...options, headers });
  const setCookie = res.headers.get('set-cookie');
  if (setCookie && setCookie.includes('admin_session=')) {
    cookie = setCookie.split(';')[0];
  }
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    // ignore
  }
  return { status: res.status, json, text };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function main() {
  console.log('[smoke] base =', base);

  const pubPortfolio = await request('/api/public/portfolio');
  assert(pubPortfolio.status === 200, 'public portfolio failed');
  console.log('[smoke] public portfolio ok');

  const pubMethods = await request('/api/public/methods');
  assert(pubMethods.status === 200, 'public methods failed');
  console.log('[smoke] public methods ok');

  if (!username || !password) {
    console.log('[smoke] skip management checks (missing ADMIN_USERNAME / ADMIN_PASSWORD)');
    return;
  }

  const login = await request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  assert(login.status === 200, `login failed: ${login.status}`);
  console.log('[smoke] login ok');

  const mgPortfolio = await request('/api/management/portfolio');
  assert(mgPortfolio.status === 200, `management portfolio failed: ${mgPortfolio.status}`);
  console.log('[smoke] management portfolio ok');

  const mgMethods = await request('/api/management/methods');
  assert(mgMethods.status === 200, `management methods failed: ${mgMethods.status}`);
  console.log('[smoke] management methods ok');
}

main().catch((error) => {
  console.error('[smoke] failed:', error.message);
  process.exit(1);
});
