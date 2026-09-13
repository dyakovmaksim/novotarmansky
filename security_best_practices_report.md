# Security review — 13 September 2026

## Summary

The public booking API had an unauthenticated route that exposed every
application, including names and phone numbers, and allowed updates and
deletions. It has been removed. The production edge now also supplies browser
security headers. Builds, type-aware linting and the existing backend test pass.

## Resolved findings

### SEC-001 — public booking data and destructive API methods

- Severity: High — resolved
- Location: `backend/src/bookings/bookings.controller.ts:10-23`
- Evidence: the public controller now exposes only `POST /api/bookings` and
  `GET /api/bookings/occupied-dates`; details and management live in the
  Telegram admin flow.
- Impact before the change: anyone could enumerate booking records with names
  and telephone numbers, or modify/delete a booking by UUID.
- Fix: removed public list, detail, update and delete handlers. Creation now
  returns only the new request ID and status (`bookings.service.ts:76-78`).

### SEC-002 — unbounded booking values

- Severity: Medium — resolved
- Location: `backend/src/bookings/bookings.service.ts:30-40`
- Evidence: the service rejects totals over eight guests and stays longer than
  31 nights, in addition to DTO validation.
- Impact before the change: direct API callers could bypass the client-side
  guest limit and create excessively long calendar ranges.
- Fix: server-side limits are enforced before querying or writing to the DB.

### SEC-003 — response and upload hardening

- Severity: Medium — resolved
- Location: `backend/src/main.ts:10-20`,
  `backend/src/telegram/telegram.service.ts`
- Evidence: framework-identifying headers are disabled in Nest; Telegram photo
  bytes are limited to 5 MiB and checked for JPEG magic bytes before storage.
- Impact before the change: uploaded content had no file-signature check and
  framework identification was unnecessarily exposed.
- Fix: validate the downloaded photo before persistence and hide
  `X-Powered-By` both in the application and nginx.

### SEC-004 — browser hardening at the edge

- Severity: Medium — resolved
- Location: `nginx/default.conf`
- Evidence: `Content-Security-Policy`, frame restrictions, `nosniff`, referrer
  policy, permissions policy and proxy header hiding are configured.
- Impact before the change: no CSP or permissions policy was visible in the
  production configuration.
- Fix: a restrictive policy permits only site assets, Yandex Metrica and the
  Yandex map. Inline script/style are retained solely because the current
  Metrica integration requires them.

## Remaining dependency advisories

`npm audit --omit=dev` still reports advisories with no safe non-breaking
upgrade path in the current dependency tree:

- Backend: Prisma's configuration dependency (`deepmerge-ts`) and Nest
  platform-express' transitive `multer` advisory.
- Frontend: `@nuxt/image` → `ipx` → `sharp`.

The safe Nuxt update was applied (3.21.11). The remaining suggested commands
require forced major or downgrading changes, so they were intentionally not run.
Before a planned framework upgrade, update Prisma/Nest and `@nuxt/image` in a
separate tested release.

## Verification

- Backend ESLint: passed.
- Backend production build: passed.
- Backend Jest: passed (1 test).
- Frontend production build: passed on Nuxt 3.21.11.
- Frontend ESLint: passed with zero warnings.
