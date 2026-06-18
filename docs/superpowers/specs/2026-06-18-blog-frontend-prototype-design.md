# Blog Frontend Prototype Design

## Goal

Build a high-polish frontend prototype for the personal blog before the backend direction is fixed. The prototype should feel like a real product, reuse the current Next.js App Router project, and keep component/data boundaries ready for later Prisma, NextAuth, Markdown rendering, and admin features.

The first version focuses on the public-facing blog experience. Backend persistence, authentication, admin CRUD, file upload, and real Markdown rendering are intentionally out of scope for this pass.

## Product Direction

Use a magazine-curation style as the primary frontend identity:

- Desktop layout: left taxonomy rail, central editorial article stream, right search/tools rail.
- Mobile layout: single-column reading flow, taxonomy moved into a menu/drawer, tools condensed into compact actions.
- Frontend mood: creative and memorable, but still efficient for reading and scanning.
- Future admin mood: content-studio style, reserved for a later backend/admin phase.
- Timeline-style interaction is reserved for future archive or reading-path pages, not the homepage core.

## Pages

### `/`

The homepage is the strongest visual surface. It presents:

- Header with brand, primary navigation, search entry, theme/action icons, and mobile menu.
- Editorial hero for the featured article or weekly curation.
- Announcement block for project or writing updates.
- Article cards with cover treatment, title, excerpt, category, tags, date, reading time, and views.
- Left taxonomy menu for categories and tags.
- Right tools panel for search, popular posts, reading tools, and quick actions.
- Empty/filter states when no mock article matches a selected filter.

### `/home`

Use the same data and article-list components as `/`, but bias it toward a denser article browsing surface. This preserves the user's existing route and gives it a clear browsing purpose.

### Article Preview

For this frontend-only version, article cards can open a high-fidelity preview area or link-style visual state instead of a full database-driven article page. Full `/posts/[slug]` Markdown rendering is reserved for the backend/content phase.

### `/user`

Keep the route available, but do not invest heavily in account behavior yet. It may become a lightweight profile/coming-soon surface or remain minimally styled if it is not needed for the frontend prototype.

## Component Boundaries

### `src/lib/blog-data.ts`

Create typed mock data that mirrors likely future backend models:

- `Author`
- `Category`
- `Tag`
- `Post`
- `Announcement`

Posts should include slug, title, excerpt, cover style metadata, category, tags, publish date, reading time, view count, featured flag, and popularity score. The data should be easy to replace with Prisma queries later.

### `src/components/header/Header.tsx`

Redesign the header around the blog brand and navigation. It should include:

- Brand mark and blog name.
- Navigation links: home, articles, archive, and a lightweight about/user route.
- Search/action icon controls using lucide-react.
- Mobile menu entry.

Only interactive pieces should be client components. Avoid pushing the whole app into `use client` unless necessary.

### `src/components/home/LeftMenu.tsx`

Reuse the existing component as the taxonomy rail:

- Category list with article counts and active visual state.
- Tag cluster.
- Short blog identity or reading note.
- Responsive version that can fit inside a mobile menu/drawer later.

### `src/components/home/MainContent.tsx`

Own the central editorial experience:

- Featured/hero article.
- Announcement card.
- Article grid/list.
- Filter summary and empty state.
- Pagination or "load more" style control as a visual prototype.

### `src/components/home/RighTools.tsx`

Preserve the existing filename for now to avoid broad file churn, but export `RightTools` consistently. It should contain:

- Search input or search affordance.
- Popular posts list.
- Reading tools/actions.
- Theme/action controls.

If the filename is later corrected to `RightTools.tsx`, imports should be updated in the same focused change.

## Interactions

The prototype should include smooth local-only interactions where useful:

- Category/tag selection should visibly filter or highlight the article stream.
- Search should support local filtering across mock post title, excerpt, category, and tags.
- Header/mobile menu should be usable on small screens.
- Buttons and cards should have restrained hover/active transitions without layout shift.
- Empty state should feel designed, not like a missing data error.
- Theme toggle can be visual-only or local state if quick to implement; full persistence can wait.

## Visual System

Use a restrained magazine palette:

- Background: warm off-white/paper tone.
- Text and frames: near-black for strong editorial contrast.
- Accents: teal/seafoam, warm yellow, and small coral/red highlights.
- Avoid a one-note blue/purple gradient palette.
- Keep card radius around 8-12px unless inherited shadcn components require otherwise.
- Use lucide icons for tool buttons and navigation actions.
- Use stable dimensions for cards, side rails, buttons, and tool rows so interaction does not shift layout.

The UI should feel creative but not decorative at the cost of readability.

## Responsive Behavior

Desktop:

- Three-column layout: taxonomy rail, editorial content, tools rail.
- Center content carries the reading hierarchy.

Tablet:

- Collapse or reduce the right tools rail.
- Keep the article stream readable with two-column cards where width allows.

Mobile:

- Single-column content.
- Category/tag navigation moves out of the main flow.
- Search and tool actions remain accessible through header or compact action rows.
- Text must not overflow buttons/cards, and content must not overlap.

## Data Flow

For the prototype:

1. Pages import typed mock data from `src/lib/blog-data.ts`.
2. Server components can compute initial featured posts, popular posts, categories, and tags.
3. Client components handle local search/filter UI where needed.
4. Derived UI state never mutates the source mock data.

Future backend replacement:

- `blog-data.ts` can be swapped for Prisma-backed query functions.
- Category/tag/post shapes should stay close enough to avoid rewriting presentation components.
- Search can later move from local filtering to API/DB full-text search.

## Error, Empty, and Loading States

Frontend prototype states:

- Empty filtered article list.
- Search with no results.
- Lightweight coming-soon state for user/admin surfaces.
- Skeleton or subtle loading surface if any client interaction simulates loading.

Global 404/error pages are part of the larger blog roadmap but not required for this first frontend polish pass unless they are cheap to add.

## Verification

Before considering implementation complete:

- Run `npm run lint`.
- Run `npm run build`.
- Start the local Next.js dev server.
- Inspect the app in browser at desktop and mobile widths.
- Confirm the page is nonblank, text does not overlap, primary interactions work, and responsive layout behaves correctly.

## Out of Scope for This Pass

- Prisma schema and database setup.
- NextAuth authentication.
- Admin dashboard and CRUD.
- Real Markdown parsing/rendering with shiki.
- Image upload.
- ISR/revalidate behavior.
- Read-count anti-spam.
- Full-text backend search.
- Deployment, Docker, CI/CD.

These remain in the roadmap from `博客.md`, but they should come after the public frontend prototype establishes the product direction.
