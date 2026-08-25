# Collaboration glossary

This file owns behavior-changing collaboration leading words. Stable Partita domain terms belong in [`CONTEXT.md`](CONTEXT.md).

## Captain

The human authority who accepts boundaries and resolves product or governance decisions that the agent cannot own.

## Lead

The single outer owner of the outcome, effect policy, STATE writes, completion, and next step. A Skill or delegated worker does not become Lead merely by producing an artifact.

## Worker

A bounded executor that returns evidence, a receipt, and a proposed delta to Lead. A Worker never writes STATE or closes work.

## Receipt

Read-back evidence of what an attempted effect actually changed, including its locator and outcome classification.

## Delta

A proposed change to an owned authority. Its owner must reconcile and apply it; returning a delta is not the same as writing it.

## Applied

Evidence proves the intended mutable effect reached the target state.

## NotApplied

Evidence proves the intended mutable effect did not reach the target state.

## Unknown

Evidence cannot prove either Applied or NotApplied. Unknown requires reconciliation before any retry.
