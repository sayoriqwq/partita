#!/usr/bin/env python3
"""Validate Craft Codex plugin framework and future skills."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from skill_frontmatter import fail, parse_frontmatter, parse_when_to_use_keywords  # noqa: E402

SKILL_REF_RE = re.compile(r"skills/([a-z][a-z0-9_-]*)/SKILL\.md")
LINK_RE = re.compile(r"\[[^\]]*\]\(([^)]+)\)")
URL_PREFIXES = ("http://", "https://", "mailto:", "ftp://", "tel:", "data:")
MINI_WAZA_MARKER = "🧭"
SKILL_CONTRACT_SECTIONS = (
    "## Capability",
    "## Trigger",
    "## Soft Boundary",
    "## Hard Boundary",
    "## Workflow",
    "## Validation",
)
STATE_TOKENS = ("`stateful`", "`stateless`")
ACTIVATION_TOKENS = ("`activation: broad`", "`activation: narrow`")
DURATION_TOKENS = ("`duration: turn`", "`duration: task`", "`duration: topic`", "`duration: mode`")


def section_between(text: str, start: str, end: str) -> str:
    start_index = text.find(start)
    if start_index == -1:
        return ""
    content_start = start_index + len(start)
    end_index = text.find(end, content_start)
    if end_index == -1:
        return text[content_start:]
    return text[content_start:end_index]


def skill_files(root: Path) -> list[Path]:
    return sorted((root / "skills").glob("*/SKILL.md"))


def check_skill_files(root: Path) -> dict[str, str]:
    descriptions: dict[str, str] = {}
    for path in skill_files(root):
        text = path.read_text()
        fields = parse_frontmatter(path)
        name = fields["name"]
        if name != path.parent.name:
            fail(f"NAME MISMATCH: {path} name={name!r} dir={path.parent.name!r}")
        description = fields["description"].strip()
        if len(description) < 40:
            fail(f"DESCRIPTION TOO SHORT: {path}")
        lowered = description.lower()
        if "use when" not in lowered or "not for" not in lowered:
            fail(f"DESCRIPTION MUST INCLUDE Use when AND Not for: {path}")
        if not fields["when_to_use"]:
            fail(f"MISSING when_to_use: {path}")
        if not fields["dispatch_intent"]:
            fail(f"MISSING dispatch_intent: {path}")
        if MINI_WAZA_MARKER not in text:
            fail(f"MISSING MINI-WAZA MARKER INSTRUCTION: {path}")
        missing_sections = [section for section in SKILL_CONTRACT_SECTIONS if section not in text]
        if missing_sections:
            fail(f"MISSING SKILL CONTRACT SECTIONS: {path} missing {missing_sections}")
        soft_boundary = section_between(text, "## Soft Boundary", "## Hard Boundary")
        if "Primitive audit:" not in soft_boundary:
            fail(f"MISSING PRIMITIVE AUDIT: {path}")
        if not any(token in soft_boundary for token in STATE_TOKENS):
            fail(f"PRIMITIVE AUDIT MISSING STATE: {path}")
        if not any(token in soft_boundary for token in ACTIVATION_TOKENS):
            fail(f"PRIMITIVE AUDIT MISSING ACTIVATION: {path}")
        if not any(token in soft_boundary for token in DURATION_TOKENS):
            fail(f"PRIMITIVE AUDIT MISSING DURATION: {path}")
        hard_boundary = section_between(text, "## Hard Boundary", "## Workflow")
        if "primitive `constraint.hard`" not in hard_boundary or "machine-checkable" not in hard_boundary:
            fail(f"HARD BOUNDARY MUST DISTINGUISH MACHINE CHECKS: {path}")
        descriptions[name] = description
        parse_when_to_use_keywords(fields["when_to_use"])
        print(f"ok: {path.as_posix()}")
    print(f"ok: discovered {len(descriptions)} user-defined skills")
    return descriptions


def check_plugin_manifest(root: Path, version: str) -> None:
    path = root / ".codex-plugin" / "plugin.json"
    data = json.loads(path.read_text())
    if data.get("name") != "craft":
        fail("INVALID PLUGIN MANIFEST: name must be craft")
    if data.get("version") != version:
        fail(f"VERSION DRIFT: plugin.json != VERSION {version}")
    if data.get("skills") != "./skills/":
        fail("INVALID PLUGIN MANIFEST: skills must be ./skills/")
    interface = data.get("interface")
    if not isinstance(interface, dict):
        fail("INVALID PLUGIN MANIFEST: interface must be an object")
    for field in ("displayName", "shortDescription", "longDescription", "developerName", "category"):
        if not isinstance(interface.get(field), str) or not interface[field].strip():
            fail(f"INVALID PLUGIN MANIFEST: interface.{field} is required")
    capabilities = interface.get("capabilities")
    if not isinstance(capabilities, list) or not all(
        isinstance(item, str) and item.strip() for item in capabilities
    ):
        fail("INVALID PLUGIN MANIFEST: interface.capabilities must be strings")
    prompts = interface.get("defaultPrompt")
    if not isinstance(prompts, list) or not all(
        isinstance(item, str) and item.strip() for item in prompts
    ):
        fail("INVALID PLUGIN MANIFEST: interface.defaultPrompt must be strings")
    print("ok: Codex plugin manifest")


def check_routing(root: Path, skills: set[str]) -> None:
    refs = set()
    for path in (root / "scripts" / "dispatcher.md", root / "skills" / "RESOLVER.md"):
        refs |= set(SKILL_REF_RE.findall(path.read_text()))
    stale = refs - skills
    if stale:
        fail(f"STALE SKILL REFERENCES: {sorted(stale)}")
    for path in (root / "scripts" / "dispatcher.md", root / "skills" / "RESOLVER.md"):
        if MINI_WAZA_MARKER not in path.read_text():
            fail(f"MISSING MINI-WAZA MARKER: {path.relative_to(root)}")
    print(f"ok: routing references are valid for {len(skills)} skills")


def check_rules(root: Path) -> None:
    required = [
        root / "rules" / "anti-patterns.md",
        root / "rules" / "chinese.md",
        root / "rules" / "durable-context.md",
        root / "rules" / "routing.md",
        root / "rules" / "skills" / "index.md",
        root / "rules" / "skills" / "primitive.md",
        root / "rules" / "skills" / "shape.md",
        root / "rules" / "skills" / "care.md",
        root / "rules" / "skills" / "authoring.md",
    ]
    for path in required:
        if not path.exists():
            fail(f"MISSING RULE FILE: {path.relative_to(root)}")
    print("ok: rule files present")


def check_markdown_links(root: Path) -> None:
    for path in sorted(root.glob("**/*.md")):
        if ".git" in path.parts:
            continue
        text = path.read_text()
        for target in LINK_RE.findall(text):
            if target.startswith(URL_PREFIXES) or target.startswith("#"):
                continue
            clean = target.split("#", 1)[0]
            if not clean:
                continue
            if not (path.parent / clean).exists():
                fail(f"BROKEN MARKDOWN LINK: {path.relative_to(root)} -> {target}")
    print("ok: markdown links")


def check_no_root_skill(root: Path) -> None:
    if (root / "SKILL.md").exists():
        fail("SOURCE ROOT SKILL.md IS NOT ALLOWED")
    print("ok: no source-root SKILL.md")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parent.parent)
    args = parser.parse_args()
    root = args.root.resolve()

    version = (root / "VERSION").read_text().strip()
    if not version:
        fail("EMPTY VERSION")

    descriptions = check_skill_files(root)
    skills = set(descriptions)
    check_plugin_manifest(root, version)
    check_routing(root, skills)
    check_rules(root)
    check_markdown_links(root)
    check_no_root_skill(root)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
