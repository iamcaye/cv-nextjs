# How It Works — Editorial Guide

How It Works is a daily series of long-form chapters explaining how technologies, systems and ideas work: where they came from, how they evolved, what actually happens under the hood, and where they are going.

The reader is curious and technically literate but not a specialist in the topic. They should finish a chapter with a working mental model they could explain to someone else, not a list of facts.

---

## Chapter structure

Every chapter follows this arc. Use `##` headings for sections (never `#`, the page renders the title). Heading text can be specific to the topic: "Origins: pixels are embarrassingly parallel" is better than "Origins".

1. **Introduction: why it matters.** Open with something concrete: a number, a scene, an everyday experience. No heading; the first paragraph gets a drop cap. Say what the chapter will explain.
2. **Origins.** The problem that existed before this technology and why existing solutions were not enough.
3. **Historical evolution.** The key milestones, each explained by the limitation it removed. People, dates and places where they help, not as a timeline dump.
4. **Technical explanation.** How it actually works. The longest section, usually split into `###` subsections. Build from first principles; introduce each term before using it.
5. **Practical examples and applications.** Where it shows up in the real world, with specifics.
6. **Limitations, trade-offs and misconceptions.** What it is bad at, what it costs, and what people commonly get wrong. Use bold lead-ins for each misconception.
7. **What comes next.** Current research and industry direction. Hedge appropriately; do not predict with false certainty.
8. **Next chapter.** A short closing section (`## Next chapter`) that bridges to the proposed next topic. It must match `nextChapterSuggestion` in the frontmatter.

Target **2,000–4,000 words**. CI rejects published chapters under 800 words, as a guard against truncated output.

## Voice and style

- **Explain, don't summarise.** Every section should answer "why?" and "how?", not just "what?". Prefer one well-developed idea to five mentioned in passing.
- **Build intuition first, then formalise.** Analogy or picture → precise explanation → formula or code if it helps.
- **Be specific.** "About 60 million parameters trained on two GTX 580s" beats "a large model trained on powerful hardware".
- **Plain words.** Short sentences where possible. Define jargon at first use.
- **British or American spelling, consistently within a chapter.**
- **Accurate over impressive.** If a figure is approximate, say "roughly". If historians disagree on a "first", say so.

### Avoid generic AI-writing patterns

Do not use:

- Throat-clearing openers: "In today's fast-paced world", "Have you ever wondered", "Let's dive in", "In this article we will explore".
- Inflated vocabulary: *delve, tapestry, realm, landscape, testament, pivotal, game-changer, revolutionize, unleash, harness, seamless, robust* (unless literally technical), *myriad*.
- Empty emphasis: "It's important to note that", "It's worth mentioning", "Interestingly,".
- Reflexive triplets ("fast, scalable, and reliable") and paired negations ("It's not just X, it's Y").
- Summaries that repeat the chapter: no "In conclusion" or "In summary".
- Rhetorical questions as section transitions, more than once per chapter.
- Excessive em dashes, bold or bullet points. Prose is the default; lists are for genuinely list-shaped content.
- Emoji.

## Accuracy

- Check every date, name, number and quotation. Prefer primary sources (original papers, vendor documentation).
- Do not invent quotations, citations, benchmark numbers or URLs.
- When unsure, either omit the claim or state the uncertainty.
- Code must be correct and runnable in spirit. Label simplified code as simplified.

## Formatting reference

Chapters are MDX: Markdown plus a small set of components. CI enforces these rules.

| Need | Use |
|---|---|
| Section / subsection | `##` / `###` (`####` for small labels) |
| Code | Fenced block with a language: ` ```python title="file.py" `. Highlight lines with `{2,4-5}` after the language. Languages must be supported by Shiki (e.g. `cpp` for CUDA, `text` for diagrams) |
| Inline math | `$E = mc^2$` |
| Display math | `$$` on its own line, LaTeX, `$$` on its own line |
| Table | GitHub-flavoured Markdown table |
| Diagram | ASCII/box-drawing in a ` ```text ` block, or an SVG/PNG via `<Figure>` |
| Aside | `<Callout type="note">…</Callout>`, `type` is `note`, `insight` or `warning`; optional `title="…"` |
| Image with caption | `<Figure src="/how-it-works/<slug>/diagram.svg" alt="…" caption="…" />` |
| Link to another chapter | `[text](/how-it-works/<slug>)`, must be a published chapter |
| External link | Full `https://` URL |

### MDX pitfalls

MDX is stricter than Markdown. CI will fail on:

- **Curly braces in prose.** `{` and `}` start JavaScript expressions, which are disabled for security. Write `\{` and `\}`, or put the text in inline code. Braces inside code blocks and `$…$` math are fine.
- **`<` followed by a letter** in prose, e.g. `<T>` or `<div>`. It is parsed as a tag. Use inline code (`` `Vec<T>` ``) or `&lt;`. A spaced comparison like `a < b` is fine.
- **HTML comments** (`<!-- -->`). Use `{/* comment */}` instead.
- **Raw HTML/JSX** other than `Callout`, `Figure`, `abbr`, `br`, `kbd`, `mark`, `small`, `sub`, `sup`.
- **JSX attribute expressions** like `type={"note"}`. Only plain string attributes are allowed.
- **`import` / `export`** statements.
- **Relative links** like `../other`. Use `/how-it-works/<slug>` or a full URL.
- **Images** that are neither `https://` nor an existing file in `public/`.

### Assets

Put images and diagrams in `public/how-it-works/<slug>/` and reference them as `/how-it-works/<slug>/<file>`. Prefer SVG for diagrams. Every image needs meaningful `alt` text.

## Frontmatter

```yaml
---
title: "How GPUs Work"                 # 3–120 chars
slug: "how-gpus-work"                  # lowercase kebab-case, matches file name
chapter: 2                             # integer, next free number, matches file prefix
description: "Understanding GPU architecture and parallel computing."  # 20–300 chars, used for SEO and cards
publishedAt: "2026-10-14"              # YYYY-MM-DD, not earlier than the previous chapter
category: "Computing"                  # 2–40 chars; reuse existing categories where they fit
tags:                                  # 1–10 unique entries
  - GPU
  - Hardware
status: "published"                    # or "draft" (never rendered on the site)
nextChapterSuggestion: "How the Internet Works"  # 3–120 chars
---
```

Optional: `updatedAt: "YYYY-MM-DD"` for substantive later edits. Unknown fields are rejected.

Existing categories: *Artificial Intelligence*, *Computing*. Add new ones sparingly (e.g. *Networking*, *Security*, *Databases*, *Mathematics*, *Physics*).

## Choosing topics

The default topic for chapter N is chapter N−1's `nextChapterSuggestion`. This keeps the series coherent and gives readers a reliable "up next". Each chapter should, in turn, propose a topic that follows naturally from it, and that has not been covered already.
