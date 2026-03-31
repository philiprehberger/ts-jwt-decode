# @philiprehberger/jwt-decode-ts

[![CI](https://github.com/philiprehberger/jwt-decode-ts/actions/workflows/ci.yml/badge.svg)](https://github.com/philiprehberger/jwt-decode-ts/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@philiprehberger/jwt-decode-ts.svg)](https://www.npmjs.com/package/@philiprehberger/jwt-decode-ts)
[![Last updated](https://img.shields.io/github/last-commit/philiprehberger/jwt-decode-ts)](https://github.com/philiprehberger/jwt-decode-ts/commits/main)

Decode and inspect JWTs — no verification, typed payload, tiny

> **Note:** This library does **not** verify JWT signatures. It only decodes and inspects token contents. Always verify tokens server-side before trusting their claims.

## Installation

```bash
npm install @philiprehberger/jwt-decode-ts
```

## Usage

```ts
import {
  decodeJwt,
  decodePayload,
  isExpired,
  expiresIn,
  expiresAt,
  isJwt,
} from '@philiprehberger/jwt-decode-ts';

// Decode a full JWT
const { header, payload, signature } = decodeJwt(token);

// Extract just the payload
const claims = decodePayload(token);

// Check expiry
if (isExpired(token)) {
  console.log('Token has expired');
}

// Milliseconds until expiry (negative if already expired)
const ms = expiresIn(token);

// Get expiry as a Date
const date = expiresAt(token);

// Validate JWT format (type guard)
if (isJwt(unknownValue)) {
  const decoded = decodeJwt(unknownValue);
}
```

## API

| Function | Description |
| --- | --- |
| `decodeJwt<T>(token)` | Decode a JWT into `{ header, payload, signature }` |
| `decodePayload<T>(token)` | Decode and return only the payload |
| `isExpired(token, clockTolerance?)` | Check if the token's `exp` claim is in the past |
| `expiresIn(token)` | Milliseconds until expiry (negative if expired). Throws if no `exp` |
| `expiresAt(token)` | `Date` from the `exp` claim. Throws if no `exp` |
| `isJwt(value)` | Type guard — validates string has 3 non-empty base64url parts |
| `InvalidTokenError` | Custom error thrown for malformed tokens |

## Development

```bash
npm install
npm run build
npm run typecheck
npm test
```

## Support

If you find this project useful:

⭐ [Star the repo](https://github.com/philiprehberger/jwt-decode-ts)

🐛 [Report issues](https://github.com/philiprehberger/jwt-decode-ts/issues?q=is%3Aissue+is%3Aopen+label%3Abug)

💡 [Suggest features](https://github.com/philiprehberger/jwt-decode-ts/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement)

❤️ [Sponsor development](https://github.com/sponsors/philiprehberger)

🌐 [All Open Source Projects](https://philiprehberger.com/open-source-packages)

💻 [GitHub Profile](https://github.com/philiprehberger)

🔗 [LinkedIn Profile](https://www.linkedin.com/in/philiprehberger)

## License

[MIT](LICENSE)
