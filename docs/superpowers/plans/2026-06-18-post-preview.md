# Post Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a frontend-only article detail route for the blog prototype.

**Architecture:** Data lookup stays in pure helpers inside `src/lib/blog-data.ts`, with Node tests added before implementation. The dynamic route `src/app/posts/[slug]/page.tsx` performs lookup and renders a focused `PostPreview` component.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, lucide-react, Node test runner.

---

## Tasks

### Task 1: Data Helpers

**Files:**
- Modify: `src/lib/blog-data.test.ts`
- Modify: `src/lib/blog-data.ts`

- [ ] Add failing tests for `getPostBySlug`, `getAdjacentPosts`, and `getRelatedPosts`.
- [ ] Run `node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --test src/lib/blog-data.test.ts` and confirm the helpers are missing.
- [ ] Implement the helpers with Chinese function comments.
- [ ] Re-run the data test and confirm all tests pass.

### Task 2: Detail UI

**Files:**
- Create: `src/components/post/PostPreview.tsx`

- [ ] Create a typed `PostPreview` component.
- [ ] Render metadata, mock sections, reading tools, previous/next links, and related posts.
- [ ] Keep styling aligned with the existing magazine palette.

### Task 3: Route And Links

**Files:**
- Create: `src/app/posts/[slug]/page.tsx`
- Modify: `src/components/home/MainContent.tsx`
- Modify: `src/components/home/RighTools.tsx`

- [ ] Add dynamic `/posts/[slug]` route using `notFound()`.
- [ ] Wrap article cards and featured article controls with `next/link`.
- [ ] Link popular posts to their detail pages.

### Task 4: Verification

**Commands:**
- `node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --test src/lib/blog-data.test.ts`
- `npm.cmd run lint -- src/app/posts src/components/post src/components/home src/lib`
- `Invoke-WebRequest http://localhost:3000/posts/nextjs-cache-field-notes`
- `Invoke-WebRequest http://localhost:3000/posts/not-real`

Expected results: data tests pass, lint passes, known slug returns 200, unknown slug returns 404.
