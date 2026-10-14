# How It Works — Publishing

How chapters get from a writer (human or AI agent) to `https://iamcaye.com/how-it-works/<slug>`.

There is no CMS, database or publishing API. A chapter is one MDX file in this repository. Publishing means getting that file merged into `main`; GitHub (pull requests, Actions, branch protection) is the workflow engine and Dokploy is the deployer.

```text
Writer / agent
    │  1. create branch how-it-works/chapter-NNN from main
    │  2. add content/how-it-works/NNN-slug.mdx
    │  3. open PR → main
    ▼
GitHub Actions "CI"
    │  Validate chapters  (frontmatter, MDX, numbering, links, publication guard vs. latest main)
    │  Typecheck & build  (tsc, eslint, next build)
    ▼
Review / merge          (manual by default; optional auto-merge, see below)
    ▼
Commit on main ──► GitHub webhook ──► Dokploy builds Dockerfile ──► iamcaye.com updated
```

Related documents:

- [`how-it-works-editorial-guide.md`](./how-it-works-editorial-guide.md): structure, voice, formatting, frontmatter.
- [`how-it-works-chatgpt-prompt.md`](./how-it-works-chatgpt-prompt.md): ready-to-use prompt for the ChatGPT scheduled task.

---

## 1. How the site uses the content

| Path | Purpose |
|---|---|
| `content/how-it-works/NNN-slug.mdx` | One chapter per file. `NNN` = zero-padded chapter number |
| `public/how-it-works/<slug>/` | Optional images and diagrams for a chapter |
| `src/lib/how-it-works/schema.ts` | Frontmatter and collection rules |
| `src/lib/how-it-works/content.ts` | Loader used by the pages; throws on invalid content, so `next build` fails |
| `src/lib/how-it-works/mdx.tsx` | MDX pipeline (GFM tables, KaTeX math, Shiki highlighting) and the safe-MDX restrictions |
| `src/lib/how-it-works/publication.ts` | PR rules that compare against the target branch |
| `scripts/validate-how-it-works.ts` | The CI validator (`npm run content:validate`) |
| `src/app/how-it-works/` | `/how-it-works`, `/how-it-works/[slug]`, `/how-it-works/feed.xml` |

Routes are statically generated at build time. Only chapters with `status: "published"` are generated; any other slug, drafts included, returns 404. Drafts are also excluded from the sitemap and RSS feed.

> **Drafts are not secret.** The repository is public, so a draft's source is visible on GitHub. `draft` keeps it off the website, not out of sight.

To preview drafts locally: `HOW_IT_WORKS_SHOW_DRAFTS=true npm run dev`. This only works in `next dev`, never in a production build.

## 2. What CI checks

Workflow: `.github/workflows/ci.yml`, named **CI**, runs on every PR to `main` and every push to `main`.

**Validate chapters** job:

- Unit tests for the rules (`npm test`).
- Frontmatter: every required field present, correct types and lengths, no unknown fields, valid dates, kebab-case slug, file name matches `chapter` and `slug`.
- Collection: unique chapter numbers, unique slugs (drafts included), numbers consecutive from 001, published chapters in chronological order.
- MDX: each chapter is compiled and rendered. Syntax errors are reported with file and line.
- Safe MDX: no `import`/`export`, no `{…}` JavaScript expressions, only allow-listed components with plain string attributes. MDX would otherwise execute code from the chapter during the build.
- Code block languages are supported by the highlighter.
- No `#` headings (the page owns the `h1`); published chapters have at least 800 words.
- Links: internal chapter links point to published chapters, `#anchors` exist, other root-relative links match a page or a file in `public/`, images exist, no `javascript:`-style URLs.
- **Publication guard** (PRs only), evaluated against the **latest** `main`, not just the PR's snapshot:
  - Published chapters cannot be deleted, renumbered, re-slugged or unpublished, from any branch.
  - A newly added chapter cannot reuse a number or slug that exists on `main`, even if that chapter was merged after the PR was opened.
  - On `how-it-works/chapter-NNN` branches the PR must be add-only: exactly one new chapter file whose number is `NNN` and equal to the next free number on `main`, plus optional new assets under `public/how-it-works/<slug>/`.

**Typecheck & build** job: `tsc --noEmit`, `next lint`, `next build`.

Failures appear as failed checks on the PR, and the validator also emits GitHub annotations on the offending file and line.

Run the same checks locally:

```bash
npm test
npm run content:validate
npm run content:validate -- --pr --base origin/main --head-branch "$(git branch --show-current)"
npm run typecheck && npm run lint && npm run build
```

## 3. Publication contract for external agents

This is the exact procedure any automated publisher (ChatGPT, Codex, a script) must follow. Anything that cannot follow it must not publish.

### 3.1 Access and permissions

| Requirement | Value |
|---|---|
| Repository | `iamcaye/cv-nextjs` only. Install the GitHub App with **Only select repositories** |
| Contents | Read & write (create branch, create file) |
| Pull requests | Read & write (list and open PRs) |
| Metadata | Read (implicit) |
| **Not needed** | Administration, Workflows, Actions, Secrets, Environments, Deployments, Webhooks. Without the *Workflows* permission GitHub itself refuses changes to `.github/workflows/` |
| Merge | **Not** required. The agent must never merge, approve, or enable auto-merge itself |

For an OAuth- or app-based integration such as ChatGPT's, the permission set is defined by the integration's vendor; what you control is which repositories it may access. Restrict it to this one.

### 3.2 Naming

| Item | Format | Example |
|---|---|---|
| Chapter number | next free integer on `main`, zero-padded to 3 digits | `003` |
| Branch | `how-it-works/chapter-NNN` | `how-it-works/chapter-003` |
| File | `content/how-it-works/NNN-<slug>.mdx` | `content/how-it-works/003-how-the-internet-works.mdx` |
| Assets (optional) | `public/how-it-works/<slug>/<file>` | `public/how-it-works/how-the-internet-works/packet.svg` |
| PR title | `How It Works #NNN: <Title>` | `How It Works #003: How the Internet Works` |
| PR base | `main` | |

### 3.3 Required metadata

See the frontmatter section of the [editorial guide](./how-it-works-editorial-guide.md#frontmatter). In short: `title`, `slug`, `chapter`, `description`, `publishedAt` (today, `YYYY-MM-DD`), `category`, `tags`, `status: "published"`, `nextChapterSuggestion`. No other fields except optional `updatedAt`.

### 3.4 Procedure

All reads are against `main` at the time of the run. REST endpoints are given for reference; an integration may expose them as named actions.

1. **Check for in-flight work.** List open PRs against `main` (`GET /repos/iamcaye/cv-nextjs/pulls?state=open&base=main`). If any PR's head branch starts with `how-it-works/chapter-`, **stop**: report "Previous chapter PR #X is still open" with its URL. Do not open a second one; numbering depends on merged state.
2. **Determine the next chapter.** List `content/how-it-works/` on `main` (`GET /repos/iamcaye/cv-nextjs/contents/content/how-it-works?ref=main`). The highest `NNN` prefix + 1 is the new number (`001` if the directory is empty). Read the highest-numbered chapter's frontmatter: its `nextChapterSuggestion` is today's topic, and its `publishedAt` is the earliest allowed date.
3. **Check for duplicates.** The new slug must not appear in any existing file name, and the topic must not already be covered by an existing title. If it is, stop and report.
4. **Write the chapter** following the editorial guide. Validate it against the rules in section 2 before touching GitHub.
5. **Create the branch** `how-it-works/chapter-NNN` from the current `main` commit (`GET /repos/iamcaye/cv-nextjs/git/ref/heads/main`, then `POST /repos/iamcaye/cv-nextjs/git/refs` with `ref: refs/heads/how-it-works/chapter-NNN`). If it fails because the branch already exists, **stop**: another run is publishing this number. The branch name is the lock.
6. **Create the file** on that branch (`PUT /repos/iamcaye/cv-nextjs/contents/content/how-it-works/NNN-slug.mdx` with `branch`, base64 `content`, and commit message `How It Works #NNN: <Title>`). Do **not** pass a `sha`: without it, GitHub refuses to overwrite an existing file. If it reports the file exists, stop.
7. **Open the pull request** (`POST /repos/iamcaye/cv-nextjs/pulls`) with `head: how-it-works/chapter-NNN`, `base: main`, the title from 3.2, and a body that follows `.github/PULL_REQUEST_TEMPLATE/how-it-works.md` (chapter number, title, summary, category, proposed next chapter, checklist).
8. **Report** the PR URL, branch, file path, chapter number and title, with status **"PR opened, awaiting checks and merge"**. A chapter is *published* only when the PR is merged and the deployment has finished. An agent that cannot observe that must not claim it.

### 3.5 Error handling

- Stop at the first failed step. Report which step failed and the exact error message returned.
- Never retry with a different chapter number, never force-push, never delete or rename branches or files, never edit existing chapters.
- If the branch was created but a later step failed, report the branch name so it can be cleaned up manually.
- If CI later fails on the PR, a human fixes it. The agent may push follow-up commits **only** to its own branch, **only** to the new chapter file, and only if explicitly asked.
- Never invent a PR URL. If no URL was returned, the PR does not exist.

### 3.6 Duplicate and concurrency protection (summary)

| Risk | Protection |
|---|---|
| Two runs pick the same number | Branch `how-it-works/chapter-NNN` can only be created once; the second run stops at step 5 |
| Previous PR not merged yet | Step 1 stops the run; CI also requires `NNN` = next free number on latest `main` |
| Chapter merged while PR was open | Publication guard compares with latest `main` and fails; "Require branches to be up to date" forces a re-run before merge |
| Overwriting a published chapter | Contents API without `sha` refuses; publication branches are add-only; the guard blocks modifying slug/number/status or deleting published chapters on any branch |
| Bad content reaching production | CI must pass before merge; additionally `next build` itself fails on invalid content, so Dokploy keeps the previous deployment |

## 4. ChatGPT integration

### What is and isn't confirmed (as of October 2026)

- OpenAI's help article on scheduled tasks lists voice and GPTs as unsupported, but **does not say whether apps/connectors, including GitHub write actions, run inside scheduled tasks**.
- ChatGPT's GitHub app has historically been documented as **read-only** (search, read and cite code in chat and deep research). Writing code and opening PRs has been the job of **Codex**, which has its own GitHub connection.
- There are user reports that the GitHub connector available to ChatGPT/Codex can create branches, commit files and open PRs, but this is not confirmed in OpenAI's documentation.
- Event-triggered tasks can *react* to GitHub pull request activity. That is the opposite direction (GitHub → ChatGPT) and does not by itself create PRs.

**Therefore this integration is not confirmed to work end-to-end from a scheduled task.** Verify it with the test below before relying on it.

### Verification test (one-off, safe)

1. In ChatGPT settings, connect the GitHub app and grant it access to `iamcaye/cv-nextjs` only.
2. In a **normal chat** with the GitHub app enabled, ask: *"Using the GitHub app, list which write actions you can perform on iamcaye/cv-nextjs (create branch, create file, open pull request). Do not perform any."* If it cannot create a branch, a file and a PR, stop here and use a fallback.
3. Still in chat, ask it to create branch `how-it-works/connectivity-test` from `main`, add `content/how-it-works/.connectivity-test` with the text `ok`, and open a **draft** PR. CI will run; the loader ignores dotfiles, so it should pass. Do not merge.
4. Create a **one-off scheduled task** a few minutes in the future with the same instruction but branch `how-it-works/connectivity-test-2`. Check whether the branch and PR appear on GitHub.
5. Close both PRs and delete both branches.

If step 4 works, scheduled tasks can publish. Use the prompt in [`how-it-works-chatgpt-prompt.md`](./how-it-works-chatgpt-prompt.md). If only step 3 works, scheduled tasks cannot. Use a fallback.

### Fallbacks if scheduled tasks cannot write to GitHub

1. **Semi-manual (works today).** Keep the scheduled task, using the same prompt. It detects that it cannot write and outputs the finished MDX plus instructions. You then open `https://github.com/iamcaye/cv-nextjs/new/main/content/how-it-works`, name the file `NNN-slug.mdx`, paste, choose **Create a new branch** named `how-it-works/chapter-NNN`, and **Propose changes**. CI runs exactly as for an automated PR. About a minute of work per chapter.
2. **Codex.** Codex is designed to push branches and open PRs. A Codex task (or scheduled automation, if available on your plan) can follow section 3 directly, using `docs/how-it-works-publishing.md` as its instructions.
3. **Your own automation** (not implemented, deliberately): a scheduled GitHub Action calling a model API and opening the PR with a fine-grained token. This adds an API key to manage and is only worth it if the options above are unavailable.

## 5. Repository settings (manual, one-time)

These cannot be configured from code. In **Settings → Rules → Rulesets → New branch ruleset** (or classic branch protection) for `main`:

- **Require a pull request before merging.** Required approvals: see note below.
- **Require status checks to pass**: add `Validate chapters` and `Typecheck & build` (they appear after CI has run once).
- **Require branches to be up to date before merging.** This is what makes the publication guard re-run against the latest `main`.
- **Block force pushes** and **restrict deletions**.
- Do not add the agent's identity to the bypass list.

**Approvals note:** if the agent acts through your own GitHub account (common for user-authorised apps), PRs are authored by you and you cannot approve your own PR. Either leave required approvals at 0 and merge manually after reading the PR (recommended to start), or rely on the opt-in auto-merge below with checks as the only gate.

Also recommended: **Settings → Actions → General → Workflow permissions → Read repository contents** (the default token is read-only; the auto-merge job asks for write explicitly).

## 6. Auto-merge (opt-in, disabled by default)

`.github/workflows/how-it-works-auto-merge.yml` runs after **CI** completes successfully and, only if **all** of the following hold, asks GitHub to auto-merge the PR (squash):

- Repository variable `HOW_IT_WORKS_AUTO_MERGE` is `true`.
- The PR comes from a branch in this repository named `how-it-works/chapter-*`.
- The PR author equals repository variable `HOW_IT_WORKS_PUBLISHER` (a GitHub login). If unset, nothing is merged.
- The PR head is the exact commit CI validated, the PR is not a draft, and it has no `do-not-merge` label.

It uses `gh pr merge --auto`, which waits for every branch protection requirement and never bypasses it. The workflow file always runs from `main` (`workflow_run`), so a PR cannot alter it. Write permissions are granted only to that job.

To enable safely:

1. Configure the branch ruleset in section 5 first. **Without required status checks, GitHub may merge immediately.**
2. **Settings → General → Pull Requests → Allow auto-merge.**
3. **Settings → Secrets and variables → Actions → Variables**: set `HOW_IT_WORKS_PUBLISHER` to the login that authors the agent's PRs, then `HOW_IT_WORKS_AUTO_MERGE` = `true`.
4. Watch the first few runs. To pause, set `HOW_IT_WORKS_AUTO_MERGE` to `false` or label a PR `do-not-merge`.

Merges done with the Actions token do not trigger other workflows, but they do fire the repository webhook, so Dokploy still deploys.

## 7. Deployment (Dokploy)

Nothing in deployment changes. The repository already builds with the root `Dockerfile` (`npm install` → `npm run build` → `npm start`, port 3000; `docker-compose.yml` maps it to 3001). Chapters are plain files in the build context, so a merge to `main` that triggers a Dokploy build ships them.

Dokploy's configuration lives on the Dokploy server, not in this repo, so confirm it there:

1. Open the application (or compose service) for iamcaye.com in Dokploy.
2. **General → Provider**: repository `iamcaye/cv-nextjs`, branch **`main`**, build type **Dockerfile** (or Docker Compose with `docker-compose.yml`).
3. **Autodeploy**:
   - With the **GitHub** provider (Dokploy GitHub App): enable **Autodeploy**. Pushes to `main` trigger a deployment through the app's webhook; nothing to add in GitHub.
   - With the **Git** provider (plain URL/SSH): copy the **Webhook URL** from the application's **Deployments** tab and add it in GitHub under **Settings → Webhooks → Add webhook** with content type `application/json` and **Just the push event**. Treat the URL as a secret; do not commit it.
4. Merge a PR and confirm a new deployment appears in Dokploy's **Deployments** tab and the chapter is live.

If a build fails (for example invalid content that somehow reached `main`), Dokploy reports a failed deployment and the previously running container keeps serving the site. Confirm this behaviour in your Dokploy version before relying on it.

Dokploy deploys on push regardless of CI. That is acceptable because CI is required before merge and `next build` re-validates all content.

## 8. Editing or removing chapters (humans)

- Fix typos or content: open a normal PR (any branch name except `how-it-works/chapter-*`). Edits to published chapters are allowed; add `updatedAt` for substantive changes.
- Slug, number and status of published chapters are frozen, because they are public URLs. Removing a published chapter is blocked by CI on purpose. If it is really needed, do it in a PR that also adjusts the guard, and expect the old URL to 404.
