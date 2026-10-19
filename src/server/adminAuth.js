import { timingSafeEqual } from 'crypto';

function matches(left, right) {
  const given = Buffer.from(String(left));
  const expected = Buffer.from(String(right));
  if (given.length !== expected.length) {
    timingSafeEqual(given, given);
    return false;
  }
  return timingSafeEqual(given, expected);
}

export function adminAllowed(request) {
  const username = process.env.ADMIN_USERNAME || '';
  const password = process.env.ADMIN_PASSWORD || '';
  if (!username || !password) return false;
  return matches(request.headers.get('x-admin-user') || '', username)
    && matches(request.headers.get('x-admin-key') || '', password);
}

export function adminAuthMessage() {
  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
    return 'Set ADMIN_USERNAME and ADMIN_PASSWORD on the server.';
  }
  return 'That username or password does not match.';
}
