# Verify

wiki 或 skill 工作后，verification 使用以下命令：

```bash
pnpm generate:check
node dist/bin/partita.js verify
pnpm typecheck
pnpm test
pnpm lint
pnpm knip
```

如果 `pnpm verify` 被 dependency policy 阻塞，MUST 运行等价 local binaries 并报告 blocker。
