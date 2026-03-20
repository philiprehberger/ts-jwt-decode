# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2026-03-20

### Added

- `decodeJwt` — decode a JWT into header, payload, and signature
- `decodePayload` — shorthand to extract just the payload
- `isExpired` — check if a token's `exp` claim is in the past
- `expiresIn` — milliseconds until token expiry (negative if expired)
- `expiresAt` — `Date` object from the `exp` claim
- `isJwt` — type guard to validate JWT format
- `InvalidTokenError` — custom error class for malformed tokens
