# Frontend Migration: Static HTML → Vite + React Router

## Overview

The Silver Guide frontend was originally built as a collection of standalone static HTML pages
using Bootstrap 5 (loaded via CDN) with a shared `css/styles.css` stylesheet. To support
richer interactivity, backend API integration, and a scalable component model, the frontend was
migrated to a **Vite + React Router 7** single-page application with server-side rendering (SSR).

---

## Original Structure (Static HTML)

```
/ (project root)
├── index.html             ← Home page
├── login.html             ← Login page
├── register.html          ← Registration page
├── articles.html          ← Article listing page
├── article-editor.html    ← Article editor (EditorJS)
├── about.html             ← About / team page
├── ai-tutorial.html       ← Sample article page
├── article-editor.js      ← EditorJS initialisation (vanilla JS)
├── simple-image.js        ← Custom EditorJS image block tool (vanilla JS)
├── css/
│   └── styles.css         ← Shared Bootstrap overrides + custom classes
└── imgs/                  ← All images (served from project root)
    └── videos/
```

**Technology:**
- Bootstrap 5 via `<link>` CDN tag in each HTML file
- Vanilla JavaScript inside `<script>` tags or separate `.js` files
- No build step — files served directly by a web server or opened in a browser
- Navigation between pages via `<a href="login.html">` hard links

---

## New Structure (Vite + React Router 7)

```
frontend/
├── package.json           ← pnpm dependencies (bootstrap, react-router, editorjs…)
├── vite.config.ts         ← Vite build config (reactRouter plugin)
├── react-router.config.ts ← SSR mode enabled
├── public/
│   ├── imgs/              ← Static images (moved from ./imgs/)
│   └── videos/            ← Videos (moved from ./videos/)
└── app/
    ├── root.tsx           ← HTML shell, font links, error boundary
    ├── app.css            ← Bootstrap import + shared custom CSS
    ├── routes.ts          ← Declarative route map
    ├── components/
    │   ├── Navbar.tsx     ← Shared sticky nav (extracted from every page)
    │   └── Footer.tsx     ← Shared footer (extracted from every page)
    ├── lib/
    │   ├── api.ts         ← Base fetch wrapper (VITE_API_URL, Content-Type header)
    │   └── auth.ts        ← sessionStorage helpers (setAuth, getToken, clearAuth)
    ├── tools/
    │   └── SimpleImage.ts ← EditorJS custom tool (ported from simple-image.js)
    └── routes/
        ├── home.tsx       ← index.html
        ├── login.tsx      ← login.html
        ├── register.tsx   ← register.html
        ├── articles.tsx   ← articles.html
        ├── article-editor.tsx ← article-editor.html + article-editor.js
        ├── about.tsx      ← about.html
        └── ai-tutorial.tsx ← ai-tutorial.html
```

---

## Page-by-Page Mapping

| Original file | React route | URL path |
|---|---|---|
| `index.html` | `routes/home.tsx` | `/` |
| `login.html` | `routes/login.tsx` | `/login` |
| `register.html` | `routes/register.tsx` | `/register` |
| `articles.html` | `routes/articles.tsx` | `/articles` |
| `article-editor.html` + `article-editor.js` | `routes/article-editor.tsx` | `/article-editor` |
| `about.html` | `routes/about.tsx` | `/about` |
| `ai-tutorial.html` | `routes/ai-tutorial.tsx` | `/ai-tutorial` |

---

## Key Changes by Area

### 1. Routing

**Before** — hard-coded `href` attributes in every `<a>` tag:
```html
<a href="login.html">Sign In</a>
<a href="index.html">Home</a>
```
Navigating between pages caused a full browser reload and re-downloaded the HTML, CSS, and JS
each time.

**After** — React Router `<Link>` and `<NavLink>` components:
```tsx
<Link to="/login">Sign In</Link>
<NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
  Home
</NavLink>
```
Navigation is client-side (no reload). `NavLink` automatically applies the Bootstrap `active`
class to the currently active route.

Routes are declared once in `app/routes.ts`:
```ts
export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  // …
] satisfies RouteConfig;
```

---

### 2. Styling

The styling layer went through two stages during migration:

#### Stage 1 — Initial React port (Tailwind)
The React Router starter template shipped with **Tailwind CSS v4** (`@tailwindcss/vite`).
The initial port translated Bootstrap classes to their Tailwind equivalents
(e.g. `btn btn-primary` → `bg-blue-600 text-white px-4 py-2 rounded`). While functional,
the visual output diverged from the original Bootstrap design.

#### Stage 2 — Reverted to Bootstrap (current)
Bootstrap was added as an npm package and Tailwind was removed entirely, restoring the original
visual design with minimal effort.

```
pnpm remove tailwindcss @tailwindcss/vite
pnpm add bootstrap
```

**`app/app.css`** (replaces the old `css/styles.css`):
```css
@import "bootstrap/dist/css/bootstrap.min.css";

/* custom classes from original styles.css preserved below */
.article-card { … }
.portrait-container { … }
/* … */
```

All custom classes from the original `css/styles.css` (`article-card`, `section-title`,
`tip-box`, `analogy`, `portrait-container`, `aboutimage1/2/3`, etc.) were carried across
unchanged.

**`vite.config.ts`** — Tailwind plugin removed, only the React Router plugin remains:
```ts
export default defineConfig({
  plugins: [reactRouter()],
});
```

---

### 3. Shared Components (Navbar & Footer)

The original HTML duplicated the full `<nav>` and `<footer>` blocks in all seven pages.
Any change to the nav (e.g. adding a link) required editing every file.

**After** — extracted into two components that are imported once per route:
```tsx
// Every route file:
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Articles() {
  return (
    <>
      <Navbar />
      {/* page content */}
      <Footer />
    </>
  );
}
```

---

### 4. Interactivity — Vanilla JS → React Hooks

#### Tab switching (home page)

**Before** (Bootstrap JS + data attributes):
```html
<button class="nav-link active" data-bs-toggle="tab" data-bs-target="#common-tasks">
  Common tasks
</button>
```

**After** (`useState`):
```tsx
const [activeTab, setActiveTab] = useState("Common tasks");
// …
<button className={`nav-link${activeTab === tab ? ' active' : ''}`}
        onClick={() => setActiveTab(tab)}>
  {tab}
</button>
```

#### Team portrait hover video (about page)

**Before** (CSS `:hover` + autoplay attribute):
```html
<video autoplay muted loop>…</video>
```

**After** (`useRef` + event handlers for precise play/pause control):
```tsx
const videoRef = useRef<HTMLVideoElement>(null);
// …
<div onMouseEnter={() => videoRef.current?.play()}
     onMouseLeave={() => { v.pause(); v.currentTime = 0; }}>
  <video ref={videoRef} muted loop playsInline>…</video>
</div>
```

#### Login / Register forms

**Before** — no real JS validation; form submitted via standard HTML `action`.

**After** — fully controlled React forms:

```tsx
// register.tsx — field-level validation with Bootstrap is-invalid classes
const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

<input
  className={`form-control form-control-lg${fieldErrors.name ? ' is-invalid' : ''}`}
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
{fieldErrors.name && <div className="invalid-feedback">{fieldErrors.name}</div>}
```

---

### 5. API Integration

The original pages had no backend integration. Login/register forms were purely UI mock-ups.

**After** — two helper modules in `app/lib/`:

**`api.ts`** — typed fetch wrapper that prepends the API base URL:
```ts
export const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

export async function apiFetch(path: string, options?: RequestInit) {
  return fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
}
```

**`auth.ts`** — `sessionStorage` helpers for JWT management:
```ts
export function setAuth(data: AuthData) {
  sessionStorage.setItem('sg_token', data.token);
  sessionStorage.setItem('sg_refresh_token', data.refreshToken);
  sessionStorage.setItem('sg_user', JSON.stringify({ … }));
}
export const getToken = () => sessionStorage.getItem('sg_token');
export function clearAuth() { … }
```

Login and register routes call `apiFetch`, then `setAuth(data)` and `navigate('/')` on success.
The article editor calls `apiFetch('/api/articles', { headers: { Authorization: \`Bearer ${getToken()}\` } })` to save to the backend.

---

### 6. EditorJS Integration

**Before** — initialised in a separate `article-editor.js` file loaded via a `<script>` tag.
The custom image tool lived in `simple-image.js` as a plain JS class.

**After** — initialised inside a `useEffect` hook with dynamic imports (so EditorJS only loads
client-side, not during SSR):

```tsx
useEffect(() => {
  async function initEditor() {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header  = (await import("@editorjs/header")).default;
    // …
    new EditorJS({ holder: editorRef.current!, tools: { header: Header, … } });
  }
  initEditor();
}, []);
```

`simple-image.js` was converted to a TypeScript class in `app/tools/SimpleImage.ts`,
implementing the EditorJS `BlockTool` interface. The logic is identical:

```ts
// simple-image.js (original)        // SimpleImage.ts (new)
class SimpleImage {                   export default class SimpleImage {
  render() {                            render(): HTMLInputElement {
    return document.createElement('input');  return document.createElement("input");
  }                                     }
  save(block) {                         save(block: HTMLInputElement): SimpleImageData {
    return { url: block.value };          return { url: block.value };
  }                                     }
}                                     }
```

EditorJS packages are installed as npm dependencies rather than CDN scripts:
```
@editorjs/editorjs  @editorjs/header  @editorjs/list
@editorjs/quote     @editorjs/warning  @editorjs/delimiter
```

---

### 7. Static Assets

Images and videos were moved from the project root into the Vite public directory so they are
served correctly during both development and production builds:

| Before | After |
|---|---|
| `./imgs/logo.svg` | `frontend/public/imgs/logo.svg` |
| `./imgs/herobanner-img.jpeg` | `frontend/public/imgs/herobanner-img.jpeg` |
| `./videos/OldChristineVid.mp4` | `frontend/public/videos/OldChristineVid.mp4` |
| *(all 19 images + 4 videos)* | |

All `src` and `href` references updated from relative paths (`../imgs/logo.svg`) to
absolute public paths (`/imgs/logo.svg`).

---

### 8. Build System

| | Before | After |
|---|---|---|
| Bundler | None | Vite 8 |
| Package manager | None | pnpm |
| TypeScript | No | Yes (strict) |
| SSR | No | Yes (React Router SSR mode) |
| Dev server | Open file in browser / live-server | `pnpm dev` → `http://localhost:5173` |
| Production build | None | `pnpm build` → `build/` |
| CSS framework | Bootstrap 5 (CDN) | Bootstrap 5 (npm, bundled) |

---

## Files Deleted After Migration

| File | Replaced by |
|---|---|
| `index.html` | `frontend/app/routes/home.tsx` |
| `login.html` | `frontend/app/routes/login.tsx` |
| `register.html` | `frontend/app/routes/register.tsx` |
| `articles.html` | `frontend/app/routes/articles.tsx` |
| `article-editor.html` | `frontend/app/routes/article-editor.tsx` |
| `about.html` | `frontend/app/routes/about.tsx` |
| `ai-tutorial.html` | `frontend/app/routes/ai-tutorial.tsx` |
| `article-editor.js` | Inline `useEffect` in `article-editor.tsx` |
| `simple-image.js` | `frontend/app/tools/SimpleImage.ts` |
| `css/styles.css` | `frontend/app/app.css` |
| `imgs/` *(root)* | `frontend/public/imgs/` |
| `videos/` *(root)* | `frontend/public/videos/` |
