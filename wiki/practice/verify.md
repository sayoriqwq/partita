# Verify

Verification after wiki or skill work:

```bash
pnpm generate:check
node dist/bin/partita.js verify
pnpm typecheck
pnpm test
pnpm lint
pnpm knip
pnpm effect:verify
```

If `pnpm verify` is blocked by dependency policy, run the equivalent local
binaries and report the blocker.
