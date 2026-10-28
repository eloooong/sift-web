# Contributing

Keep changes focused on a clear behavior or defect. Explain the trigger, expected result, and verification in the pull request.

## Local workflow

1. Install with `npm ci` and copy `.env.example` to `.env.local`.
2. Run `npm run dev`.
3. Add a regression check when fixing logic, authorization, parsing, or persistence behavior.
4. Run `npm run check` and `npm run build` before opening a pull request.

Tests run without external service credentials. Do not use real passwords, OTPs, phone numbers, or customer messages as fixtures.

## Code conventions

- Keep API inputs untrusted and validate them at the boundary.
- Derive account identity from the server session, not a request-supplied user id.
- Scope history reads and writes by owner in the data layer.
- Use parameterized SQL.
- Keep service credentials in server modules.
- Add new interface copy to both languages in `src/lib/i18n/dictionary.ts`.
- Follow the [Filipino copy guide](docs/filipino-copy.md) for natural wording and consistent terms.
- Use existing visual tokens and shared controls; consult `DESIGN.md` for interface changes.
- Avoid timed progress claims unless actual backend events support them.

For a visual change, verify mobile and desktop, keyboard focus, both languages, and night mode. For a database change, add a new migration rather than editing an already-applied migration.

## Checks

- `npm run typecheck`: generates route definitions and checks TypeScript from a clean checkout.
- `npm test`: runs the scanner, validation, and security regression suites.
- `npm run lint`: checks code quality.
- `npm run lint:design`: checks interface rules.
- `npm run build`: builds the production application.

Please report suspected vulnerabilities privately; see `SECURITY.md`.
