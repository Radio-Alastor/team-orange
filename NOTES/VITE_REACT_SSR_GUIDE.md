# Vite + React — Achieving Thymeleaf-like SEO

How to make a Vite + React app serve article pages with clean URLs and SEO, without needing Thymeleaf or a second server.

---

## The Goal

Replicate what Thymeleaf does — fully rendered HTML that Google can read instantly — but stay entirely within Vite + React.

```
Visitor goes to:  yoursite.com/articles/spotting-phishing-emails
React Router matches the URL → ArticlePage component loads
ArticlePage fetches from:     /api/articles/slug/spotting-phishing-emails
Spring Boot returns:          article JSON from MySQL
React renders:                complete article page
```

---

## What You Need

```bash
npm install react-router-dom      # client-side routing (clean URLs)
npm install react-helmet-async    # dynamic <title> and <meta> tags
npx react-snap                    # prerendering at build time (SEO)
```

---

## Step 1 — Set Up React Router

Wrap your app in a `BrowserRouter` and define your routes. Each route maps a URL pattern to a component, exactly like React Router's `<Route>` system.

**`src/main.jsx`**
```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>
)
```

**`src/App.jsx`**
```jsx
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ArticlesPage from './pages/ArticlesPage'
import ArticlePage from './pages/ArticlePage'
import AboutPage from './pages/AboutPage'
import ArticleEditor from './pages/ArticleEditor'

export default function App() {
    return (
        <Routes>
            <Route path="/"                   element={<HomePage />} />
            <Route path="/articles"           element={<ArticlesPage />} />
            <Route path="/articles/:slug"     element={<ArticlePage />} />
            <Route path="/about"              element={<AboutPage />} />
            <Route path="/article-editor"     element={<ArticleEditor />} />
        </Routes>
    )
}
```

This replaces all your `.html` files. Each `<Route>` is the equivalent of a separate HTML page.

---

## Step 2 — Build the Article Page Component

This is the equivalent of Thymeleaf's `article-view.html`. One component handles every article URL — the slug from the URL determines which article is fetched.

**`src/pages/ArticlePage.jsx`**
```jsx
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { blocksToHTML } from '../utils/blocksToHTML'

export default function ArticlePage() {
    const { slug } = useParams()
    const [article, setArticle] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetch(`/api/articles/slug/${slug}`)
            .then(res => {
                if (!res.ok) throw new Error('Article not found')
                return res.json()
            })
            .then(setArticle)
            .catch(setError)
    }, [slug])

    if (error)   return <p>Article not found.</p>
    if (!article) return <p>Loading…</p>

    const content = blocksToHTML(JSON.parse(article.content).blocks)

    return (
        <>
            {/* SEO tags — equivalent to Thymeleaf's th:text on <title> and <meta> */}
            <Helmet>
                <title>{article.title} — Silver Guide</title>
                <meta name="description" content={article.summary} />
                <meta property="og:title" content={article.title} />
                <meta property="og:description" content={article.summary} />
            </Helmet>

            <main className="container py-5 d-flex justify-content-center">
                <article className="article-container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-4">
                            <li className="breadcrumb-item">
                                <Link to="/articles" className="text-decoration-none text-muted">Articles</Link>
                            </li>
                            <li className="breadcrumb-item active">{article.title}</li>
                        </ol>
                    </nav>

                    <h1 className="display-4 fw-bold mb-4">{article.title}</h1>
                    <p className="text-muted mb-4">Estimated reading time: {article.readingTime} minutes</p>

                    {article.imageUrl && (
                        <img src={article.imageUrl} className="article-header-img shadow-sm" alt={article.title} />
                    )}

                    {/* Render Editor.js blocks as HTML */}
                    <div dangerouslySetInnerHTML={{ __html: content }} />

                    <div className="text-center mt-5">
                        <Link to="/articles" className="btn btn-outline-secondary btn-lg rounded-pill px-5">
                            Back to Articles
                        </Link>
                    </div>
                </article>
            </main>
        </>
    )
}
```

### Compared to Thymeleaf

| Thymeleaf | React equivalent |
|---|---|
| `@PathVariable String slug` | `const { slug } = useParams()` |
| `model.addAttribute("article", article)` | `setArticle(data)` via `fetch` |
| `th:text="${article.title}"` | `{article.title}` |
| `th:utext="${article.content}"` | `dangerouslySetInnerHTML={{ __html: content }}` |
| `<title th:text="…">` | `<Helmet><title>…</title></Helmet>` |

---

## Step 3 — Move blocksToHTML to a Shared Utility

The `blocksToHTML` function already exists in `article-editor.js`. Move it into a shared utility so both the editor and the article page can use it.

**`src/utils/blocksToHTML.js`**
```js
export function blocksToHTML(blocks) {
    return blocks.map(block => {
        const d = block.data
        switch (block.type) {
            case 'paragraph':
                return `<p>${d.text}</p>`
            case 'header': {
                const tag = `h${d.level}`
                const cls = d.level === 2 ? ' class="section-title"' : ''
                return `<${tag}${cls}>${d.text}</${tag}>`
            }
            case 'list': {
                const tag = d.style === 'ordered' ? 'ol' : 'ul'
                const items = d.items
                    .map(i => `<li class="mb-2">${i.content ?? i}</li>`)
                    .join('')
                return `<${tag}>${items}</${tag}>`
            }
            case 'quote':
                return `<div class="analogy mb-4"><p class="mb-0">${d.text}</p></div>`
            case 'warning':
                return `<div class="tip-box"><h5 class="fw-bold">${d.title}</h5><p class="mb-0">${d.message}</p></div>`
            case 'image':
                return `<img src="${d.url}" alt="${d.caption || ''}" class="img-fluid rounded mb-4">`
            case 'delimiter':
                return `<hr class="my-5">`
            default:
                return ''
        }
    }).filter(Boolean).join('\n')
}
```

---

## Step 4 — Wrap the App with HelmetProvider

`react-helmet-async` requires a provider at the root of your app.

**`src/main.jsx`** (updated)
```jsx
import { HelmetProvider } from 'react-helmet-async'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <HelmetProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </HelmetProvider>
    </StrictMode>
)
```

---

## Step 5 — SEO via Prerendering (react-snap)

`react-helmet-async` sets the `<title>` and `<meta>` tags dynamically, which works for Google (via its two-pass render system) but **not** for social media previews (WhatsApp, Facebook, LinkedIn), which never run JavaScript.

`react-snap` solves this by visiting every page at build time using a headless browser and saving a static HTML snapshot.

### Setup

Add to `package.json`:
```json
"scripts": {
    "build": "vite build",
    "postbuild": "react-snap"
},
"reactSnap": {
    "source": "dist",
    "puppeteerArgs": ["--no-sandbox"]
}
```

Now every time you run `npm run build`, react-snap automatically:
1. Starts a local server pointing at your built `dist/` folder
2. Visits every route in your app
3. Saves the fully rendered HTML as a static file

The result:
```
dist/
    index.html
    articles/
        index.html
        spotting-phishing-emails/
            index.html          ← complete HTML, no JS needed to read it
```

> **Note:** For article pages to be prerendered, react-snap needs to know all the slugs at build time. You can do this by fetching the article list from your API during the build, or by maintaining a list of slugs in your config.

---

## Step 6 — Vite Dev Server Proxy

During development, your React app runs on `http://localhost:5173` but your Spring Boot API runs on `http://localhost:8080`. Set up a proxy in Vite so `fetch('/api/...')` works without CORS issues.

**`vite.config.js`**
```js
export default {
    server: {
        proxy: {
            '/api': 'http://localhost:8080'
        }
    }
}
```

Now `fetch('/api/articles/slug/spotting-phishing-emails')` in React automatically forwards to `http://localhost:8080/api/articles/slug/spotting-phishing-emails`.

---

## Step 7 — Clean URLs in Production

React Router uses client-side routing. When a user visits `yoursite.com/articles/spotting-phishing-emails` directly (or refreshes the page), the server needs to return `index.html` so React can handle the route.

If serving via **Nginx**:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

If serving via **Spring Boot** (serving the built Vite files as static assets):
```java
@GetMapping(value = "/{path:[^\\.]*}")
public String redirect() {
    return "forward:/index.html";
}
```

---

## Full Picture

```
Development
    Vite dev server  (localhost:5173)  →  React app
    Spring Boot      (localhost:8080)  →  API + database
    Vite proxy:  /api/* → localhost:8080

Production
    Built Vite files (dist/) served as static assets
    Spring Boot serves both the API and the static files
    react-snap snapshots ensure SEO on first load
```

---

## Summary

| Thymeleaf feature | Vite + React equivalent |
|---|---|
| Server-rendered HTML | `react-snap` prerendering at build time |
| Clean URLs (`/articles/{slug}`) | React Router `path="/articles/:slug"` |
| URL parameter | `useParams()` |
| Dynamic `<title>` and `<meta>` | `react-helmet-async` |
| One template for all articles | One `ArticlePage` component |
| Data fetched on the server | `useEffect` + `fetch('/api/...')` |
| Social media previews | `react-snap` static snapshots |
