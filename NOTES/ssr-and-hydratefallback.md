# SSR and HydrateFallback — A Simple Guide

## What is SSR?

**SSR (Server-Side Rendering)** means the server builds the full HTML of a page before sending it to the browser.

Without SSR (pure client-side rendering):
1. Browser receives an almost-empty HTML file
2. Browser downloads JavaScript
3. JavaScript runs and builds the page
4. User finally sees content

With SSR:
1. Server builds the full HTML
2. Browser receives ready-made HTML — user sees content immediately
3. JavaScript downloads and "attaches" to the existing HTML (this step is called **hydration**)

---

## Advantages of SSR

| Advantage | Why it matters |
|---|---|
| **Faster first paint** | User sees content before JavaScript finishes loading |
| **Better SEO** | Search engines read the HTML directly — no need to run JavaScript |
| **Works without JavaScript** | Core content is visible even if JS fails to load |

---

## Disadvantages of SSR

| Disadvantage | Why it matters |
|---|---|
| **Server does more work** | Every request requires building HTML on the server, not just serving a file |
| **Hydration complexity** | The server and client must produce identical output, or React throws errors |
| **Not useful for private pages** | A staff editor, dashboard, or auth-gated page has no SEO benefit and no "fast first paint" need — the user has to log in anyway |
| **Can cause timing bugs** | Code that uses browser-only APIs (`localStorage`, `sessionStorage`, `window`) runs on the server where those don't exist |

---

## What is Hydration?

Hydration is the process where React **attaches JavaScript behaviour to existing server-generated HTML**.

When SSR sends HTML to the browser, the page looks correct but is "dead" — buttons don't work, state doesn't exist, event listeners aren't attached. Hydration is React going through that existing HTML and wiring everything up so it becomes a fully interactive React app.

```
Server sends:
  <button class="btn">Log Out</button>   ← looks like a button, does nothing yet

Hydration:
  React finds that button
  Attaches the onClick handler
  Now the button actually works          ← the page is "alive"
```

**The key rule:** React expects the HTML the server produced to **exactly match** what the component would render on the client. If they differ, you get a hydration mismatch error and React may behave unexpectedly.

### Hydration Mismatches — A Real Example

This is exactly the bug we hit in `Navbar.tsx` with `getUser()`:

```tsx
// BROKEN — causes hydration mismatch
export default function Navbar() {
  const user = getUser()  // reads sessionStorage
  // ...
}
```

`getUser()` reads from `sessionStorage`. The server has no `sessionStorage` — it doesn't know who is logged in — so it renders the navbar with `user = null` (showing Sign In / Register). The browser then hydrates and reads `sessionStorage`, finding `user = { name: "Alice", staff: true }`. Now the server HTML and the client output don't match — React sees a mismatch and may show the wrong buttons or throw a warning.

**The fix** was to read `sessionStorage` inside `useEffect` instead, so both the server and the initial client render agree on `user = null`, and only after hydration does the real value load in:

```tsx
// FIXED — server and client agree on the initial render
export default function Navbar() {
  const [user, setUser] = useState(null)  // null on both server and client initially

  useEffect(() => {
    setUser(getUser())  // only runs on the client, after hydration
  }, [])
  // ...
}
```

This is the same reason `getUser()` and `getToken()` in `auth.ts` guard against the server environment with `typeof window !== 'undefined'` — to avoid crashing when those functions are called during SSR where `sessionStorage` doesn't exist at all.

---

## The Problem SSR Created in Our Editor

Our article editor route (`/editor`) is:
- Staff-only (no SEO value)
- Fully interactive (EditorJS runs in the browser)
- Protected by `clientLoader` (verifies the user's JWT against the backend)

With SSR enabled globally, this is what happened on page load:

```
1. Server renders the editor page HTML → sends to browser
2. Browser shows HTML → React hydrates → useEffect fires → initEditor() starts (async)
3. AT THE SAME TIME, clientLoader runs (fetching /api/auth/me from the backend)
4. clientLoader finishes → React Router re-renders the route
5. useEffect cleanup runs — but initEditor() is still mid-flight (still loading EditorJS)
   so instance is null → destroy() does nothing
6. useEffect fires AGAIN for the re-render → second initEditor() starts
7. Both initEditor() calls finish → two EditorJS instances on the same div → content doubled
```

The root cause: SSR caused a two-phase render (server phase + client phase) that the async `initEditor()` wasn't designed to handle.

---

## What is HydrateFallback?

`HydrateFallback` is a React Router v7 export you can add to any route file. It tells React Router:

> "During the server/hydration phase, show this simple placeholder instead of the real component.
> Only render the real component after `clientLoader` has finished on the client."

It is React Router's built-in way to say **"this route's real content is client-side only"** — without disabling SSR globally for the whole app.

---

## How HydrateFallback Fixed the Editor

```tsx
// article-editor.tsx

export function HydrateFallback() {
  return (
    <>
      <Navbar />
      <div className="container py-5 text-center text-muted">Loading…</div>
      <Footer />
    </>
  );
}

export default function ArticleEditor() {
  // ... the real editor
}
```

Now the page load sequence is:

```
1. Server renders HydrateFallback (just a navbar + "Loading…") → sends to browser
2. Browser shows the fallback → clientLoader runs (fetching /api/auth/me)
3. clientLoader finishes:
     → if not staff: redirect to /login
     → if staff: replace fallback with the real ArticleEditor
4. ArticleEditor appears for the first time → useEffect fires ONCE → initEditor() runs ONCE ✓
```

The real component never touches the server. `useEffect` only ever fires after `clientLoader` is done.
No race condition. No doubled content.

---

## When to Use HydrateFallback

Use it on routes that:
- Are protected (require login or a specific role)
- Use browser-only APIs (`localStorage`, `sessionStorage`, `window`, `document`)
- Are highly interactive tools with no SEO purpose (dashboards, editors, admin panels)
- Have a `clientLoader` that does meaningful async work before the page is useful

Don't use it on routes that:
- Need SEO (public article pages, home page, about page)
- Benefit from fast first paint for anonymous users
