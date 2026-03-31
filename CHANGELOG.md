# Changelog

## 0.1.3

- Standardize README to 3-badge format with emoji Support section
- Update CI actions to v5 for Node.js 24 compatibility
- Add GitHub issue templates, dependabot config, and PR template

## 0.1.2

- Standardize README badges and CHANGELOG formatting

## 0.1.1

- Standardize package.json configuration

## 0.1.0

- `decodeJwt` — decode a JWT into header, payload, and signature
- `decodePayload` — shorthand to extract just the payload
- `isExpired` — check if a token's `exp` claim is in the past
- `expiresIn` — milliseconds until token expiry (negative if expired)
- `expiresAt` — `Date` object from the `exp` claim
- `isJwt` — type guard to validate JWT format
- `InvalidTokenError` — custom error class for malformed tokens
