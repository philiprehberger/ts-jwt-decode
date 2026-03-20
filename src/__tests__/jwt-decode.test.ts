import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  decodeJwt,
  decodePayload,
  isExpired,
  expiresIn,
  expiresAt,
  isJwt,
  InvalidTokenError,
} from '../../dist/index.js';

function toBase64Url(obj: Record<string, unknown>): string {
  const json = JSON.stringify(obj);
  const base64 = Buffer.from(json).toString('base64');
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function createToken(
  header: Record<string, unknown>,
  payload: Record<string, unknown>,
  signature = 'fake-signature',
): string {
  return `${toBase64Url(header)}.${toBase64Url(payload)}.${signature}`;
}

const header = { alg: 'HS256', typ: 'JWT' };
const payload = { sub: '1234567890', name: 'John Doe', iat: 1516239022 };
const token = createToken(header, payload);

const futureExp = Math.floor(Date.now() / 1000) + 3600;
const pastExp = Math.floor(Date.now() / 1000) - 3600;

const tokenWithFutureExp = createToken(header, { ...payload, exp: futureExp });
const tokenWithPastExp = createToken(header, { ...payload, exp: pastExp });

describe('decodeJwt', () => {
  it('should decode a valid JWT', () => {
    const result = decodeJwt(token);
    assert.deepStrictEqual(result.header, header);
    assert.deepStrictEqual(result.payload, payload);
    assert.strictEqual(result.signature, 'fake-signature');
  });

  it('should throw InvalidTokenError for non-string input', () => {
    assert.throws(
      () => decodeJwt(123 as unknown as string),
      (err: Error) => err instanceof InvalidTokenError,
    );
  });

  it('should throw InvalidTokenError for token with wrong number of parts', () => {
    assert.throws(
      () => decodeJwt('only.two'),
      (err: Error) => err instanceof InvalidTokenError,
    );
  });

  it('should throw InvalidTokenError for invalid base64 in header', () => {
    assert.throws(
      () => decodeJwt('!!!.eyJ0ZXN0IjoxfQ.sig'),
      (err: Error) => err instanceof InvalidTokenError,
    );
  });
});

describe('decodePayload', () => {
  it('should return the payload from a JWT', () => {
    const result = decodePayload(token);
    assert.deepStrictEqual(result, payload);
  });

  it('should support generic type parameter', () => {
    interface CustomPayload {
      sub: string;
      name: string;
      iat: number;
    }
    const result = decodePayload<CustomPayload>(token);
    assert.strictEqual(result.sub, '1234567890');
    assert.strictEqual(result.name, 'John Doe');
  });
});

describe('isExpired', () => {
  it('should return false for a token with future exp', () => {
    assert.strictEqual(isExpired(tokenWithFutureExp), false);
  });

  it('should return true for a token with past exp', () => {
    assert.strictEqual(isExpired(tokenWithPastExp), true);
  });

  it('should return false for a token without exp claim', () => {
    assert.strictEqual(isExpired(token), false);
  });

  it('should respect clockTolerance', () => {
    const nearFutureExp = Math.floor(Date.now() / 1000) + 5;
    const nearFutureToken = createToken(header, { ...payload, exp: nearFutureExp });
    assert.strictEqual(isExpired(nearFutureToken, -10), true);
  });
});

describe('expiresIn', () => {
  it('should return positive ms for a non-expired token', () => {
    const ms = expiresIn(tokenWithFutureExp);
    assert.ok(ms > 0, `Expected positive ms, got ${ms}`);
  });

  it('should return negative ms for an expired token', () => {
    const ms = expiresIn(tokenWithPastExp);
    assert.ok(ms < 0, `Expected negative ms, got ${ms}`);
  });

  it('should throw if no exp claim', () => {
    assert.throws(
      () => expiresIn(token),
      (err: Error) => err instanceof InvalidTokenError,
    );
  });
});

describe('expiresAt', () => {
  it('should return a Date for a token with exp', () => {
    const date = expiresAt(tokenWithFutureExp);
    assert.ok(date instanceof Date);
    assert.strictEqual(date.getTime(), futureExp * 1000);
  });

  it('should throw if no exp claim', () => {
    assert.throws(
      () => expiresAt(token),
      (err: Error) => err instanceof InvalidTokenError,
    );
  });
});

describe('isJwt', () => {
  it('should return true for a valid JWT format', () => {
    assert.strictEqual(isJwt(token), true);
  });

  it('should return false for non-string values', () => {
    assert.strictEqual(isJwt(null), false);
    assert.strictEqual(isJwt(undefined), false);
    assert.strictEqual(isJwt(123), false);
  });

  it('should return false for strings without 3 parts', () => {
    assert.strictEqual(isJwt('only.two'), false);
    assert.strictEqual(isJwt('no-dots'), false);
  });

  it('should return false for strings with empty parts', () => {
    assert.strictEqual(isJwt('a..b'), false);
    assert.strictEqual(isJwt('.a.b'), false);
  });

  it('should return false for strings with invalid base64url chars', () => {
    assert.strictEqual(isJwt('a.b.c!@#'), false);
  });
});

describe('InvalidTokenError', () => {
  it('should be an instance of Error', () => {
    const err = new InvalidTokenError('test');
    assert.ok(err instanceof Error);
    assert.strictEqual(err.name, 'InvalidTokenError');
    assert.strictEqual(err.message, 'test');
  });
});
