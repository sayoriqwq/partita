# Standards smell baseline

Use this fallback only after loading the target repository's documented standards. A repository rule overrides a conflicting smell. Every smell finding is a labelled judgment call, never a hard violation; skip anything tooling already enforces.

Each smell states what to notice, then the corresponding move:

- **Mysterious Name** — a function, variable, or type whose name does not reveal what it does or holds. Rename it; if no honest name emerges, the design remains unclear.
- **Duplicated Code** — the same logic shape appears in more than one changed hunk or file. Extract the shared shape and call it from both.
- **Feature Envy** — a method reaches into another object's data more than its own. Move the method onto the data it envies.
- **Data Clumps** — the same fields or parameters repeatedly travel together. Bundle them into one type.
- **Primitive Obsession** — a primitive or string stands in for a domain concept that deserves its own type. Give the concept a small type.
- **Repeated Switches** — the same switch or conditional cascade on the same type recurs across the change. Replace it with polymorphism or one shared map.
- **Shotgun Surgery** — one logical change requires scattered edits across many files. Gather what changes together into one module.
- **Divergent Change** — one file or module is edited for several unrelated reasons. Split it so each module changes for one reason.
- **Speculative Generality** — abstraction, parameters, or hooks serve needs absent from the spec. Delete them and inline until a real need appears.
- **Message Chains** — long navigation such as `a.b().c().d()` exposes a walk the caller should not know. Hide it behind one method on the first object.
- **Middle Man** — a class or function mostly delegates onward. Remove it and call the real target directly.
- **Refused Bequest** — a subclass or implementer ignores or overrides most inherited behavior. Replace inheritance with composition.
