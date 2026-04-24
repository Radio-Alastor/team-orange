# Tutorial: Two Fixes That Made `GET /api/articles/{id}` Work

---

## Part 1: Why `GET /api/articles/1` Was Returning 403

### The Setup

Spring Security acts as a **gatekeeper** in front of your API. Every incoming request passes through it before reaching your controller. You configure rules like:

> "Anyone can call `GET /api/articles/*` — no login required."

In code, that looked like:

```java
.requestMatchers(HttpMethod.GET, "/api/articles/*").permitAll()
```

This *looks* correct. But it was silently broken. Here's why.

---

### How Spring Security Matches URLs

When you write `.requestMatchers(HttpMethod.GET, "/api/articles/*")`, Spring Security needs to decide **how** to compare the pattern `/api/articles/*` against an incoming URL like `/api/articles/1`.

There are two matchers it can use:

| Matcher | How it works |
|---|---|
| `AntPathRequestMatcher` | Classic pattern matching. `*` = any single path segment. Straightforward. |
| `MvcRequestMatcher` | Uses Spring MVC's own routing engine to match paths — the same engine that maps URLs to your `@Controller` methods. |

In **Spring Security 6** (used by Spring Boot 3), when Spring MVC is on the classpath (which it always is in a REST API project), `.requestMatchers(HttpMethod, String...)` silently switches to `MvcRequestMatcher` as the default.

---

### Why `MvcRequestMatcher` Caused the Problem

`MvcRequestMatcher` is designed to match against **registered controller routes**, not raw URL patterns. In certain configurations — especially with path variable patterns — it can fail to match `/api/articles/*` against a real request to `/api/articles/1`.

Think of it like this:

```
You wrote:   "Let anyone access /api/articles/*"
You meant:   Any URL starting with /api/articles/ and one more segment
Spring used: MvcRequestMatcher("/api/articles/*")
Result:      Failed to match /api/articles/1  ← ✗
Spring said: "No permitAll() rule matched this request → 403 Forbidden"
```

The request never even reached your controller. The gatekeeper turned it away.

---

### The Fix: Be Explicit About the Matcher

```java
// BEFORE (broken):
.requestMatchers(HttpMethod.GET, "/api/articles/*").permitAll()

// AFTER (fixed):
.requestMatchers(new AntPathRequestMatcher("/api/articles/*", "GET")).permitAll()
```

By constructing an `AntPathRequestMatcher` directly, you bypass the automatic selection and **force** Spring Security to use the simple, predictable Ant-style matching:

```
Pattern:  /api/articles/*
Request:  /api/articles/1
Match?    YES — * matches "1"   ✓
```

Now the rule fires correctly, `permitAll()` applies, and the request reaches your controller with a 200.

#### Ant Wildcard Reference (useful to know)

| Pattern | Matches | Does not match |
|---|---|---|
| `/api/articles/*` | `/api/articles/1`, `/api/articles/abc` | `/api/articles/1/comments` |
| `/api/articles/**` | `/api/articles/1`, `/api/articles/1/comments` | — |

---

## Part 2: Why `@Transactional` Was Needed

### The Setup

Your `Article` entity has a relationship to a `Topic`:

```java
// Article.java (simplified)
@ManyToOne(fetch = LAZY)
private Topic topic;
```

The key word is **`LAZY`**. This is a performance optimization that says:

> "Don't load the Topic data from the database when you load the Article. Wait until someone actually asks for it."

---

### What "Lazy Loading" Means in Practice

When you call `articleRepository.findById(id)`, JPA does this:

```sql
SELECT * FROM articles WHERE id = 1;
-- Topic is NOT fetched yet. Just a placeholder.
```

The `topic` field on the returned `Article` object is a **proxy** — a placeholder object that knows how to go fetch the real data *if and when* you access it.

That fetch only works while the **database session (transaction) is still open**.

---

### The Problem: The Session Closes Too Early

Without `@Transactional`, this is what happened inside `getArticle()`:

```
1. getArticle(1) is called
2. articleRepository.findById(1) runs
   → Spring opens a DB session, runs SELECT, closes the session ← session closed here
3. toResponse(article) is called
4. a.getTopic().getTopicName() is accessed
   → JPA proxy tries to fetch Topic from DB
   → No open session!  ← BOOM: LazyInitializationException (500 error)
```

The session closed after step 2, but the lazy data wasn't fetched until step 4. Too late.

---

### The Fix: Keep the Session Open for the Whole Method

```java
@Transactional(readOnly = true)
public ArticleResponse getArticle(Long id) {
    Article article = articleRepository.findById(id)
            .orElseThrow(...);
    return toResponse(article);  // topic can now be loaded — session still open
}
```

`@Transactional` tells Spring:

> "Open a database session at the start of this method and keep it open until the method returns."

Now the timeline is:

```
1. Session opened  ← @Transactional
2. findById(1) runs → Article loaded, topic proxy created
3. toResponse() runs → a.getTopic().getTopicName() accessed
   → proxy fetches Topic  ← session is STILL OPEN, this works
4. Method returns → session closed
```

The `readOnly = true` flag on `getArticle` is an optimization hint — it tells the database "nothing will be written here," which allows it to skip certain locking overhead.

---

## Summary

| Problem | Root Cause | Fix |
|---|---|---|
| `GET /api/articles/1` → 403 | `MvcRequestMatcher` failed to match the `permitAll()` rule | Use `AntPathRequestMatcher` explicitly |
| `GET /api/articles/1` → 500 | Lazy-loaded `topic` accessed after DB session closed | Add `@Transactional` to keep session open |

Both bugs were invisible from the outside — they required knowing how Spring Security and JPA work internally. This is typical of Java framework debugging: the code *looks* right, but the framework's default behavior is doing something unexpected under the hood.
