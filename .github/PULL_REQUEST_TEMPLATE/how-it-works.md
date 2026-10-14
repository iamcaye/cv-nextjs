<!--
How It Works chapter publication.
Branch: how-it-works/chapter-NNN · one new file: content/how-it-works/NNN-slug.mdx
Full contract: docs/how-it-works-publishing.md
-->

## How It Works · Chapter NNN

| Field | Value |
|---|---|
| Chapter number | NNN |
| Title | |
| Slug | |
| Category | |
| Status | published / draft |
| Proposed next chapter | |

### Summary

<!-- 2–4 sentences: what the chapter covers and why it matters. -->

### Validation checklist

- [ ] Branch is `how-it-works/chapter-NNN` and matches `chapter:` in the frontmatter
- [ ] Exactly one new file under `content/how-it-works/` (plus optional assets in `public/how-it-works/<slug>/`)
- [ ] No existing chapter was modified, renamed or deleted
- [ ] Frontmatter has every required field; `publishedAt` is not earlier than the previous chapter
- [ ] Follows the editorial structure in `docs/how-it-works-editorial-guide.md`
- [ ] Technical claims, dates and figures checked
- [ ] `npm run content:validate` passes (CI: **Validate chapters**)
- [ ] Site builds (CI: **Typecheck & build**)
