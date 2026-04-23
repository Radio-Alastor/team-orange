# Solving Race Conditions in useEffect — Option 1 vs Option 2

A race condition in `useEffect` happens when an async operation (a fetch, a library load, a timer)
takes time to complete, but the component's state changes before it finishes — leading to two
competing operations both trying to write to the same place.

---

## Option 1 — Tie `useEffect` to Data from the Loader

**Concept:** Instead of running `useEffect` immediately on mount, make it depend on data that only
exists after an async operation (like a route loader) completes. If the data isn't ready, the effect
simply doesn't run.

**When it works well:** When your effect genuinely needs the loader data to do its job, and the
loader data changes over time (causing the effect to re-run with fresh data).

### Realistic Example — Chart Dashboard

A dashboard page that fetches analytics data from the server and renders a chart.

```tsx
// dashboard.tsx

export async function clientLoader() {
  const res = await fetch('/api/analytics/summary');
  const data = await res.json();
  return { chartData: data };   // loader returns real data, not just a flag
}

export default function Dashboard() {
  const { chartData } = useLoaderData<typeof clientLoader>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: chartData,        // uses the loader data directly
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [chartData]);            // re-runs when chartData changes

  return <canvas ref={canvasRef} />;
}
```

**Why this works here:**
- The chart can't initialize without `chartData` — the dependency is real and meaningful
- If the user changes a date filter, the loader re-runs, `chartData` changes, the chart
  re-initializes with new data automatically
- The effect and the data it needs are explicitly linked

**Why it didn't work for the article editor:**
- The editor doesn't need loader data to initialize — it uses `DEFAULT_DATA` or `localStorage`
- The `ready: true` flag was artificial — a fake dependency, not a real one
- Strict Mode still mounts → unmounts → remounts the component regardless, triggering the effect twice

**The rule:** Option 1 only solves a race condition if the dependency is **genuinely required** by
the effect. A fake flag dependency doesn't prevent Strict Mode from running the effect multiple times.

---

## Option 2 — Guard with a Ref to Prevent Double Initialization

**Concept:** Use a ref to track whether the effect has already run. At the start of the effect,
check the ref — if it's already set, bail out immediately without doing anything.

**When it works well:** When the initialization is synchronous (or near-instant), so there's no
meaningful window between the check and the initialization.

### Realistic Example — Google Maps

A page that embeds a map. Map libraries are expensive to initialize and must only run once.

```tsx
// store-locator.tsx

export default function StoreLocator() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (mapInstanceRef.current) return;   // already initialized, skip

    mapInstanceRef.current = new google.maps.Map(mapRef.current!, {
      center: { lat: -33.8688, lng: 151.2093 },
      zoom: 12,
    });

    return () => {
      // Google Maps doesn't have a destroy() method, but you can clean up listeners
      mapInstanceRef.current = null;
    };
  }, []);

  return <div ref={mapRef} style={{ height: '400px' }} />;
}
```

**Why this works here:**
- `new google.maps.Map(...)` is synchronous — there's no async gap between the check and the creation
- Strict Mode unmounts → remounts, but the second run sees `mapInstanceRef.current` already set
  from the first run and bails out immediately

### The Flaw — When Initialization is Async

If initialization involves `await` (loading a library, fetching data), the ref check happens
*before* the async work, not *after* it. Both runs of the effect pass the check simultaneously:

```tsx
useEffect(() => {
  if (mapInstanceRef.current) return;   // both runs pass this — ref is null for both

  const lib = await import('heavy-library');   // ← gap here where both are mid-flight

  mapInstanceRef.current = new lib.Map(...)    // both runs reach here → two instances
}, []);
```

This is the exact problem the `cancelled` flag solves — it handles the async gap:

```tsx
useEffect(() => {
  let cancelled = false;

  async function init() {
    const lib = await import('heavy-library');

    if (cancelled) return;             // first run's import completes, sees cancelled=true, stops

    mapInstanceRef.current = new lib.Map(...)
  }

  init();
  return () => {
    cancelled = true;                  // cleanup sets the flag before the second run starts
    mapInstanceRef.current?.destroy();
  };
}, []);
```

---

## Summary

| Approach | Solves async race? | Solves Strict Mode double-mount? | Best used when |
|---|---|---|---|
| **Option 1** — loader data as dependency | Only if data is genuinely needed | No | Effect needs real server data to initialize |
| **Option 2** — ref guard (sync)| No | Yes (if sync) | Initialization is synchronous |
| **Option 2** — ref guard (async, no flag) | No | No | ❌ Don't use for async init |
| **`cancelled` flag** | Yes | Yes | Any async initialization in useEffect |
