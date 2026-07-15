# Partita Effect feedback

## Effect test integration

Partita's Effect-facing tests use `it.effect`; synchronous assertions are
wrapped in `Effect.sync`. The Effect Harness lint policy rejects plain Vitest
test bodies on these surfaces.

This project-specific observation is target-owned. Prelude and Effect Harness
convergence must preserve it byte-for-byte.
