import type { JwtPayload } from './types.js';
import { InvalidTokenError } from './types.js';
import { decodeJwt } from './decode.js';

export function isExpired(token: string, clockTolerance: number = 0): boolean {
  const { payload } = decodeJwt<JwtPayload>(token);

  if (typeof payload.exp !== 'number') {
    return false;
  }

  const now = Math.floor(Date.now() / 1000);
  return now >= payload.exp + clockTolerance;
}

export function expiresIn(token: string): number {
  const { payload } = decodeJwt<JwtPayload>(token);

  if (typeof payload.exp !== 'number') {
    throw new InvalidTokenError('Token does not have an exp claim');
  }

  return payload.exp * 1000 - Date.now();
}

export function expiresAt(token: string): Date {
  const { payload } = decodeJwt<JwtPayload>(token);

  if (typeof payload.exp !== 'number') {
    throw new InvalidTokenError('Token does not have an exp claim');
  }

  return new Date(payload.exp * 1000);
}
