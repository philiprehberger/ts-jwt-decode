import { base64urlDecode } from './base64url.js';
import type { DecodedJwt, JwtHeader, JwtPayload } from './types.js';
import { InvalidTokenError } from './types.js';

export function decodeJwt<T = JwtPayload>(token: string): DecodedJwt<T> {
  if (typeof token !== 'string') {
    throw new InvalidTokenError('Token must be a string');
  }

  const parts = token.split('.');

  if (parts.length !== 3) {
    throw new InvalidTokenError('Token must have 3 parts separated by dots');
  }

  const [headerPart, payloadPart, signature] = parts as [string, string, string];

  if (!headerPart || !payloadPart || !signature) {
    throw new InvalidTokenError('Token parts must not be empty');
  }

  let header: JwtHeader;
  let payload: T;

  try {
    header = JSON.parse(base64urlDecode(headerPart)) as JwtHeader;
  } catch {
    throw new InvalidTokenError('Invalid token header');
  }

  try {
    payload = JSON.parse(base64urlDecode(payloadPart)) as T;
  } catch {
    throw new InvalidTokenError('Invalid token payload');
  }

  return { header, payload, signature };
}
