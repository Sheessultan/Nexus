import { URL } from 'node:url';

const base = process.env.CONSOLE_API_BASE || 'http://127.0.0.1:4000';
const user = process.env.CONSOLE_AUTH_USER || 'admin';
const pass = process.env.CONSOLE_AUTH_PASSWORD || 'admin';

async function main() {
  const loginUrl = new URL('/auth/login', base);
  const res = await fetch(loginUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ username: user, password: pass }),
  });
  const text = await res.text();
  console.log('POST /auth/login', res.status, text);
  if (!res.ok) process.exit(1);
  const json = JSON.parse(text);
  const token = json.accessToken;
  const meUrl = new URL('/me', base);
  const me = await fetch(meUrl, {
    headers: { authorization: `Bearer ${token}` },
  });
  console.log('GET /me', me.status, await me.text());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
