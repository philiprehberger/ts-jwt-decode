import type { JwtPayload } from './types.js';
import { decodeJwt } from './decode.js';

export function decodePayload<T = JwtPayload>(token: string): T {
  return decodeJwt<T>(token).payload;
}
