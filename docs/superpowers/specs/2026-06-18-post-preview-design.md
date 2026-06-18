# Post Preview Page Design

## Goal

Add a frontend-only article detail/reading preview route for the existing magazine-style blog prototype.

## Scope

- Add `/posts/[slug]` using existing mock posts.
- Make article cards, featured article, and popular posts navigate to detail pages.
- Keep the page static/mock-data based; do not add Markdown parsing, database calls, auth, or backend APIs.
- Show a high-polish reading surface: title, excerpt, metadata, tags, mock body sections, reading tools, previous/next posts, and related posts.
- Use `notFound()` for unknown slugs.

## Data Design

Extend `src/lib/blog-data.ts` with pure helpers:

- `getPostBySlug(posts, slug)` returns the matching post or `undefined`.
- `getAdjacentPosts(posts, slug)` returns `{ previous, next }` based on current post order.
- `getRelatedPosts(posts, post, limit)` returns same-category or shared-tag posts, excluding the current post.

The helpers are covered by `src/lib/blog-data.test.ts`.

## UI Design

Create `src/components/post/PostPreview.tsx` for the detail layout. It receives the selected post, adjacent posts, and related posts as props. The route page does data lookup and passes typed values to the component.

The article list UI should use `next/link` so cards are clickable without introducing new client state.

## Verification

- Run `node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --test src/lib/blog-data.test.ts`.
- Run `npm.cmd run lint -- src/app/posts src/components/post src/components/home src/lib`.
- Verify `http://localhost:3000/posts/nextjs-cache-field-notes` returns HTTP 200 and contains the expected article title.
- Verify an unknown slug returns a 404 status.
