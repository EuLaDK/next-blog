# Archive Timeline Design

## Goal

Make `/home?view=archive` render a distinct time-track archive experience while keeping `/home` as the article browsing flow.

## Scope

- Use existing mock posts only.
- Do not add a separate `/archive` route.
- Do not add backend, Markdown parsing, auth, or persistence.
- Preserve the left taxonomy rail and right tools rail.
- Central content switches from article cards to a year/month timeline when `view=archive`.

## Data Design

Add `getArchiveGroups(posts)` in `src/lib/blog-data.ts`.

The helper groups posts by year and month using `publishedAt`, keeps posts ordered by date descending, and returns data shaped for rendering:

- `year`
- `months`
- `month`
- `label`
- `posts`

## UI Design

Create `src/components/home/ArchiveTimeline.tsx`.

The component shows:

- Archive header with total visible posts.
- Year bands.
- Month sections.
- Post rows with date, title, category, tags, reading time, and views.
- Empty state when current search/filter has no posts.

Post rows link to `/posts/[slug]`.

## Verification

- Run archive data helper tests.
- Run scoped lint for `src/components/home`, `src/app/home`, and `src/lib`.
- Verify `http://localhost:3000/home?view=archive` returns HTTP 200 and contains `时间轨道`.
