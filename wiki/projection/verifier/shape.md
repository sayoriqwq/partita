# Shape

Shape checks validate supported runtime files.

Current skill shape is the shape enforced by the verifier. Future V1 shape work
must not be documented as current until the verifier and skills migrate.

Supported skill directory entries are `SKILL.md`, `agents/openai.yaml`, and
one-level `references/*.md` files.

Supported namespace roots under `skills/` are verifier-owned. Current namespace:
`primitive`, projected as `pm:<name>`.
