# Archive Timeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a time-track archive mode for `/home?view=archive`.

**Architecture:** The existing `/home` route reads `searchParams` and passes an `archive` view flag into `BlogExperience`. `BlogExperience` keeps local filters and chooses between `MainContent` and the new `ArchiveTimeline` component. Archive grouping is a pure tested helper in `src/lib/blog-data.ts`.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, lucide-react, Node test runner.

---

## Tasks

### Task 1: Archive Data Helper

**Files:**
- Modify: `src/lib/blog-data.test.ts`
- Modify: `src/lib/blog-data.ts`

- [ ] Add failing tests for `getArchiveGroups`.
- [ ] Run `node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --test src/lib/blog-data.test.ts`.
- [ ] Implement `getArchiveGroups` with Chinese function comments.
- [ ] Re-run the data tests.

### Task 2: Archive Timeline UI

**Files:**
- Create: `src/components/home/ArchiveTimeline.tsx`
- Modify: `src/components/home/BlogExperience.tsx`

- [ ] Create `ArchiveTimeline` to render grouped posts.
- [ ] Add a `view` prop to `BlogExperience`.
- [ ] Render `ArchiveTimeline` when `view` is `archive`.

### Task 3: Route Wiring

**Files:**
- Modify: `src/app/home/page.tsx`

- [ ] Read `searchParams.view`.
- [ ] Pass `view="archive"` only for `/home?view=archive`.

### Task 4: Verification

**Commands:**
- `node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --test src/lib/blog-data.test.ts`
- `npm.cmd run lint -- src/app/home src/components/home src/lib`
- `Invoke-WebRequest http://localhost:3000/home?view=archive`

Expected results: tests pass, lint passes, archive route returns 200 and contains `时间轨道`.
