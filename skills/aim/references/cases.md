# Aim Cases

Use these cases to recognize recurrence patterns before changing `aim`.

## Agent Direction Drift

Observed: user and agent are advancing one topic, but the agent starts answering
from a layer, direction, or detail that no longer serves the current aim.

Correction: keep a very small sustained `🧭` handle while the aim constrains the
conversation. When drift appears, show `Aim check` once and continue from the
active aim.

Rule: `Aim` maintains visible direction without repeating the full aim every
turn.

## User Baseline Drift

Observed: the user continues the same topic but starts reasoning from a premise
that contradicts a previously accepted baseline.

Correction: show `Aim check` with the drift point and the current aim or
baseline, then continue unless the missing anchor makes the next answer unsafe.

Rule: `Aim check` is a soft signal. It warns without blocking a user-initiated
topic switch.
