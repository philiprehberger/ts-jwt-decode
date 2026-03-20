export function base64urlDecode(input: string): string {
  let base64 = input.replace(/-/g, '+').replace(/_/g, '/');

  const padding = base64.length % 4;
  if (padding === 2) {
    base64 += '==';
  } else if (padding === 3) {
    base64 += '=';
  }

  if (typeof globalThis.atob === 'function') {
    return globalThis.atob(base64);
  }

  return Buffer.from(base64, 'base64').toString();
}
