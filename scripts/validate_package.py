#!/usr/bin/env python3
"""Post-package integrity check for Partita Codex plugin ZIP."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("stage", type=Path)
    args = parser.parse_args()

    plugin_json = args.stage / ".codex-plugin" / "plugin.json"
    if not plugin_json.exists():
        print("POST-PACKAGE ERROR: .codex-plugin/plugin.json missing", file=sys.stderr)
        return 1

    data = json.loads(plugin_json.read_text())
    if data.get("name") != "partita":
        print("POST-PACKAGE ERROR: plugin name is not partita", file=sys.stderr)
        return 1
    if data.get("skills") != "./skills/":
        print("POST-PACKAGE ERROR: plugin skills path must be ./skills/", file=sys.stderr)
        return 1
    if (args.stage / "SKILL.md").exists():
        print("POST-PACKAGE ERROR: root SKILL.md is not part of the Codex plugin", file=sys.stderr)
        return 1
    if (args.stage / ".claude-plugin").exists():
        print("POST-PACKAGE ERROR: .claude-plugin must not be packaged", file=sys.stderr)
        return 1

    source_skills = sorted(
        p.parent.name for p in (args.stage / "skills").glob("*/SKILL.md")
    )
    print(f"ok: post-package Codex plugin validation passed for {len(source_skills)} skills")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
