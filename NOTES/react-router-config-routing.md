# How Routes Are Configured in This Project

Your project uses **React Router v7's config-based routing**. Unlike some frameworks (e.g. Next.js) that automatically create a route for every file you add to a folder, React Router v7 requires you to explicitly declare each route in a central `routes.ts` file. No file becomes a route unless you register it there.

---

## `routes.ts` — The Route Registry

```ts
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),                                          // → /
  route("login", "routes/login.tsx"),                               // → /login
  route("articles/:id/:slug", "routes/article.tsx", { id: "..." }) // → /articles/1/my-title
  route("articles/:id",       "routes/article.tsx", { id: "..." }) // → /articles/1
] satisfies RouteConfig;
```

Each call to `route(path, file)` registers one URL pattern and points it to a component file. At build time, React Router reads this file and bundles each component so the browser knows which component to render for which URL — but the actual content those components display is always fetched from the backend at request time.

---

## The Two Helper Functions

| Function | Purpose |
|---|---|
| `index(file)` | Maps the **root path** `/` to a file. Equivalent to `route("", file)`. |
| `route(path, file, options?)` | Maps any other path pattern to a file. |

---

## URL Parameters: `:id` and `:slug`

The `:` prefix marks a **dynamic segment** — a placeholder that captures whatever is actually in the URL:

```
Pattern:  articles/:id/:slug
URL:      articles/42/how-to-cook-pasta
Captures: params.id   = "42"
          params.slug = "how-to-cook-pasta"
```

In `article.tsx`, the loader reads `params.id` to call the backend:

```ts
// article.tsx:8
const res = await apiFetch(`/api/articles/${params.id}`);
```

The `:slug` is captured but intentionally ignored — it's only in the URL for SEO/readability purposes. The article is always fetched by ID alone.

---

## Why Two Routes Point to the Same File

```ts
route("articles/:id/:slug", "routes/article.tsx", { id: "article-with-slug" }),
route("articles/:id",       "routes/article.tsx", { id: "article-without-slug" }),
```

Both routes render `article.tsx`, but handle two different URL shapes:

- `/articles/42/how-to-cook-pasta` — the ideal SEO-friendly URL
- `/articles/42` — a shorter URL that still works (e.g. if a slug isn't available yet)

The `{ id: "..." }` option gives each route a unique internal name so React Router can tell them apart when generating links programmatically.

---

## What Happens When You Visit `/articles/42/some-slug`

```
1. Browser requests /articles/42/some-slug
2. React Router checks routes.ts top-to-bottom
3. Matches "articles/:id/:slug" → loads article.tsx
4. clientLoader() runs:
   - params.id   = "42"
   - params.slug = "some-slug"  (ignored)
   - calls GET /api/articles/42
5. Backend returns article JSON
6. ArticlePage() renders with that data
```

---

## Key Distinction from File-Based Routing

Frameworks like Next.js or Remix (older versions) auto-generate routes from your folder structure — a file at `app/routes/articles/[id].tsx` automatically becomes `/articles/:id`.

Your setup is **explicit**: React Router v7 with a `routes.ts` config file. Nothing is auto-generated — every route exists because someone added a `route()` call. This gives you full control but means you must manually register any new **page types**.

> **Important distinction:** A "page type" is a new kind of URL with a new component (e.g. adding `/videos/:id/:slug` would need a new `route()` call and a rebuild). It is **not** the same as new content. Publishing a new article never requires touching `routes.ts` — the existing `articles/:id/:slug` route serves unlimited articles forever, with content fetched from the backend at request time.
