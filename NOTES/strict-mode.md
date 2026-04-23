# React Strict Mode — What It Is and What to Expect

## What is Strict Mode?

Strict Mode is a development-only tool built into React. It doesn't change what your app looks like
or how it behaves for the user — it runs invisible checks in the background to help you catch bugs
before they reach production.

You never see Strict Mode in a deployed app. It only runs during local development.

---

## What Does Strict Mode Actually Do?

Strict Mode intentionally runs certain things **twice** in development:

1. **Mounts the component** — runs the component function and `useEffect`
2. **Immediately unmounts it** — runs the `useEffect` cleanup
3. **Mounts it again** — runs the component function and `useEffect` a second time

```
Development (Strict Mode ON):

Component appears → useEffect runs       ← mount #1
                  → cleanup runs         ← unmount (invisible to user)
                  → useEffect runs       ← mount #2  (invisible to user)
User sees the final result

Production (Strict Mode OFF):

Component appears → useEffect runs       ← mount, once, done
```

The user never sees the extra mount/unmount cycle. The screen looks identical. It all happens
silently behind the scenes before the first paint is shown.

---

## Why Does React Do This?

React does this to enforce a rule: **your `useEffect` cleanup must properly undo whatever the
effect set up.**

If your code breaks after a mount → unmount → remount cycle, it means your cleanup is incomplete.
Strict Mode makes that visible in development so you fix it before shipping.

### A Well-Written Effect (Passes Strict Mode)

```tsx
useEffect(() => {
  const timer = setInterval(() => {
    console.log('tick');
  }, 1000);

  return () => clearInterval(timer);   // cleanup properly cancels the timer
}, []);
```

With Strict Mode:
1. Mount: timer starts
2. Unmount: `clearInterval` cancels it
3. Remount: a new timer starts cleanly

Result: one timer running, as expected. ✓

### A Broken Effect (Fails Strict Mode)

```tsx
useEffect(() => {
  const connection = openWebSocket('wss://example.com');
  // no cleanup — socket is never closed
}, []);
```

With Strict Mode:
1. Mount: socket #1 opens
2. Unmount: nothing closes it — socket #1 stays open
3. Remount: socket #2 opens
4. Now two sockets are open simultaneously

Result: resource leak exposed. The fix is to add `return () => connection.close()`.

Strict Mode made this problem visible in development. Without it, the leak would silently make it
to production.

---

## How is Strict Mode Enabled in This Project?

We don't explicitly write `<StrictMode>` anywhere in the source code. React Router v7 enables it
automatically via its default `entry.client.tsx` file:

```tsx
// node_modules/@react-router/dev/dist/config/defaults/entry.client.tsx
import { startTransition, StrictMode } from "react";

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>       // ← React Router wraps the whole app here
      <HydratedRouter />
    </StrictMode>
  );
});
```

Since the project doesn't have a custom `entry.client.tsx`, this default is used. The entire app
runs inside `<StrictMode>` in development.

---

## What Happens in Production?

**Strict Mode is completely absent in production.** React strips it out during the build process.

In production:
- Every `useEffect` runs exactly **once** on mount
- Cleanup runs exactly **once** on unmount
- No double mounting, no extra renders
- No performance impact from Strict Mode

```
Production behaviour:

User visits /editor
  → ArticleEditor mounts
  → useEffect fires once
  → initEditor() runs once
  → Editor shows content once  ✓

User leaves /editor
  → cleanup runs once
  → Editor is destroyed  ✓
```

---

## Does This Mean Strict Mode Bugs Don't Matter?

No — the opposite. If your code only works because Strict Mode isn't running, you have a real bug
that could surface in production under different conditions:

- React's concurrent features (like Suspense and transitions) can also cause effects to run more
  than once in production
- Server-side rendering + hydration creates a similar mount/remount cycle in production
- Future versions of React may introduce more cases where effects run multiple times

The rule is: **write effects that work correctly regardless of how many times they run.** The
`cancelled` flag is how you do that for async initialization — it makes the effect safe whether
it runs once or a hundred times.

---

## Summary

| | Development | Production |
|---|---|---|
| Strict Mode active | Yes | No |
| `useEffect` runs | Twice (mount → unmount → remount) | Once |
| User sees double content | If cleanup is broken | No |
| Performance impact | Minor (dev only) | None |
| Purpose | Expose cleanup bugs early | — |
