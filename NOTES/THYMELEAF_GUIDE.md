# Thymeleaf — A Guide for React Developers

Written for developers who know Vite + React and want to understand how Thymeleaf fits into a Spring Boot project.

---

## 1. The Core Difference — Where Rendering Happens

This is the most important thing to understand.

**React + Vite (Client-Side Rendering)**
```
Browser downloads blank HTML + JS bundle
→ JS runs in the browser
→ JS fetches data from API
→ JS builds the DOM
→ Page appears
```

**Thymeleaf + Spring Boot (Server-Side Rendering)**
```
Browser requests /articles/spotting-phishing-emails
→ Spring Boot fetches article from the database
→ Spring Boot fills in the HTML template
→ Sends complete, finished HTML to the browser
→ Page appears immediately
```

The browser receives fully-formed HTML. No JavaScript is required to display the content.

---

## 2. Why This Matters for SEO

Google uses a **two-pass system** to index pages:

- **Pass 1 (instant):** Googlebot downloads the raw HTML. If it's empty (`<div id="root">`), there is nothing to index yet.
- **Pass 2 (delayed):** Google queues the page to run JavaScript and render it properly. This can take **hours to weeks**, depending on how well-known your site is.

For a new site with little traffic, Google may not bother with Pass 2 for a long time — meaning your pages go unindexed.

With server-side rendering, **both passes are instant**. Googlebot receives the finished HTML on the very first request.

### Social media previews
WhatsApp, Facebook, and LinkedIn previews **never run JavaScript**. They only read raw HTML. With client-side rendering your share previews show nothing. With Thymeleaf they work perfectly out of the box.

---

## 3. Thymeleaf Syntax — Compared to JSX

Thymeleaf uses special `th:` attributes on standard HTML elements. Spring Boot processes these on the server and strips them out before sending the page to the browser.

**React (JSX)**
```jsx
function ArticlePage({ article }) {
    return (
        <div>
            <h1>{article.title}</h1>
            <p>{article.summary}</p>
        </div>
    );
}
```

**Thymeleaf (HTML)**
```html
<div>
    <h1 th:text="${article.title}">Placeholder Title</h1>
    <p th:text="${article.summary}">Placeholder summary...</p>
</div>
```

The placeholder text (e.g. `Placeholder Title`) is what you see if you open the `.html` file directly. When served by Spring Boot, it gets replaced with real data.

### Common Thymeleaf expressions

| Thymeleaf | React equivalent |
|---|---|
| `th:text="${article.title}"` | `{article.title}` |
| `th:href="@{/articles/{slug}(slug=${article.slug})}"` | `` href={`/articles/${article.slug}`} `` |
| `th:if="${article.published}"` | `{article.published && <div>…</div>}` |
| `th:each="article : ${articles}"` | `{articles.map(article => <div>…</div>)}` |
| `th:src="${article.imageUrl}"` | `src={article.imageUrl}` |

---

## 4. Routing — Compared to React Router

In React you define routes in JavaScript:
```jsx
// React Router
<Route path="/articles/:slug" element={<ArticlePage />} />
```

In Spring Boot + Thymeleaf, routing is handled by a **controller**:
```java
@GetMapping("/articles/{slug}")
public String articlePage(@PathVariable String slug, Model model) {
    Article article = articleService.findBySlug(slug);
    model.addAttribute("article", article);
    return "article-view"; // renders templates/article-view.html
}
```

| Concept | React | Thymeleaf |
|---|---|---|
| Route definition | `<Route path="…">` | `@GetMapping("…")` on a controller method |
| URL parameter | `useParams()` | `@PathVariable` |
| Passing data to view | Props / state | `model.addAttribute(…)` |
| Template file | `ArticlePage.jsx` | `templates/article-view.html` |

The `Model` object is how you pass data from the controller to the template — think of it as props, but set on the server before the page is sent.

---

## 5. File Structure

```
backend/src/main/
    java/com/silverguide/backend/
        controller/
            ArticleController.java     ← handles URL routing
        service/
            ArticleService.java        ← business logic
        entity/
            Article.java               ← database model
    resources/
        templates/
            article-view.html          ← Thymeleaf template (your "page")
        static/
            css/
                styles.css             ← static assets go here
```

One template file (`article-view.html`) serves **all** article URLs. It is the equivalent of a single React component mapped to a dynamic route.

---

## 6. A Full Example

**Controller**
```java
@Controller
public class ArticleController {

    @Autowired
    private ArticleService articleService;

    @GetMapping("/articles/{slug}")
    public String articlePage(@PathVariable String slug, Model model) {
        Article article = articleService.findBySlug(slug);
        model.addAttribute("article", article);
        return "article-view"; // Spring Boot looks for templates/article-view.html
    }
}
```

**Template — `templates/article-view.html`**
```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <title th:text="${article.title}">Article Title</title>
    <meta name="description" th:content="${article.summary}">
</head>
<body>
    <h1 th:text="${article.title}">Title</h1>
    <p class="text-muted" th:text="${article.summary}">Summary</p>
    <div th:utext="${article.renderedContent}">Article content here.</div>
</body>
</html>
```

> `th:utext` (unescaped text) is used when the content contains HTML markup, such as the rendered Editor.js blocks. `th:text` escapes HTML and is used for plain strings.

---

## 7. Thymeleaf vs Next.js — Why Use One Over the Other?

Both achieve the same outcome: server-rendered HTML with great SEO.

| | Next.js | Thymeleaf |
|---|---|---|
| Language | JavaScript / JSX | Java / HTML |
| Backend required | Node.js server | Spring Boot (you already have it) |
| Learning curve (for React devs) | Low — same syntax | Moderate — new syntax |
| Interactivity | Full React on the client | Manual JS or Alpine.js |
| Best for | JS-only stacks | Java stacks |

**For Silver Guide:** Thymeleaf is the pragmatic choice because the Spring Boot backend already exists. Adding Next.js would mean running a second server (Node.js) alongside Spring Boot, doubling infrastructure complexity for no real benefit.

---

## 8. How It Applies to Silver Guide

The plan for article pages:

1. Author writes article in `article-editor.html` (stays as-is — React-style interactive JS)
2. Clicks **Save to Backend** → article saved to MySQL with a generated `slug`
3. A visitor navigates to `/articles/spotting-phishing-emails`
4. Spring Boot's `ArticleController` fetches the article by slug, passes it to the template
5. Thymeleaf renders `article-view.html` with the article data filled in
6. Google receives complete HTML — title, description, content — on the first request

The Editor.js `content` field (stored as JSON in the database) would be converted to HTML by a helper method in the service layer before being passed to the template, using the same block-rendering logic already in `article-editor.js`.

---

## 9. Summary

| Question | Answer |
|---|---|
| Do you need a `.html` file per article? | No — one template handles all articles |
| Where does the template live? | `src/main/resources/templates/` |
| How does routing work? | `@GetMapping` in a Spring controller |
| How is data passed to the template? | `model.addAttribute(…)` |
| Does the browser see Thymeleaf syntax? | No — it is stripped out on the server |
| Is JavaScript still needed? | Only for interactive elements; content renders without it |
| Is it the same as Next.js? | Same concept, different language and ecosystem |
