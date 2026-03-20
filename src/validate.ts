const BASE64URL_RE = /^[A-Za-z0-9_-]+$/;

export function isJwt(value: unknown): value is string {
  if (typeof value !== 'string') {
    return false;
  }

  const parts = value.split('.');

  if (parts.length !== 3) {
    return false;
  }

  return parts.every((part) => part.length > 0 && BASE64URL_RE.test(part));
}
