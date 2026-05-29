# Refresh Token Security Migration

This document outlines the recent security improvements made to the authentication flow, specifically how refresh tokens are stored, evaluated, and rotated.

## 1. Overview
The primary goal of this migration was to mitigate **Cross-Site Scripting (XSS)** vulnerabilities. Previously, refresh tokens were stored in the browser's `localStorage` alongside short-lived access tokens. Because `localStorage` is accessible via JavaScript, any malicious script running in the browser could steal the refresh token to orchestrate long-term session hijacking.

The new architecture offloads the storage and submission of the refresh token purely to the browser using **`HttpOnly` cookies**.

---

## 2. Architecture Comparison

### Before (Vulnerable to XSS)
* **Storage**: `sg_refresh_token` stored in `window.localStorage`.
* **Cookie usage**: None.
* **Token Refresh**: The frontend (`api.ts`) explicitly read the refresh token from `localStorage` and attached it to the JSON body (`@RequestBody`) of the `POST /api/auth/refresh` fetch call.
* **Logout**: Frontend passed the refresh token inside the JSON body to `POST /api/auth/logout` to revoke the token, then explicitly called `localStorage.removeItem('sg_refresh_token')`.
* **Backend Delivery**: The backend returned the refresh token as a standard string property inside the `AuthResponse` DTO mapping directly to JSON.

### Now (Secure / XSS-Immune)
* **Storage**: Managed entirely by the browser as an `HttpOnly`, `SameSite=Strict`, `Path=/api/auth` cookie.
* **JavaScript Accessibility**: Completely inaccessible to client-side JS.
* **Token Refresh**: The frontend sends a silent `fetch` to `POST /api/auth/refresh` using the flag `credentials: 'include'`. The browser automatically bundles the `HttpOnly` cookie in the background. 
* **Backend Handling**: The backend controller uses `@CookieValue(name = "sg_refresh_token")` instead of checking the request body.
* **Backend Delivery**: The backend generates a `Set-Cookie` HTTP header on `/login`, `/register`, and `/refresh`. The `refreshToken` property inside `AuthResponse.java` dto is suppressed via `@JsonIgnore`.
* **Logout**: The backend sets an invalidated, empty cookie with `Max-Age=0` over the same `Set-Cookie` header to natively wipe the browser's memory, handling cleanup server-side.

---

## 3. Key File Modifications

### Backend (`AuthController.java` & `AuthService.java`)
- **`Set-Cookie` headers**: Added header injection after successful authentication flows, mapping the token directly into the browser's internal cookie jar.
- **`@CookieValue` Extraction**: Modified endpoints `/refresh` and `/logout` to listen for cookie variants of the token rather than JSON request payloads.
- **`@Transactional` safety**: Ensured `AuthService.refresh()` is `@Transactional` to safeguard lazy-loaded queries while resolving JPA entity states.
- **Dynamic Security Parameterization**: Programmed `app.cookie.secure` via application properties mapped to `${SECURE_COOKIE}`. Returns `true` inside `docker-compose.yml` (for HTTPS enforcement in production) and `false` in `docker-compose-dev.yml` (allowing smooth HTTP development).

### Frontend (`api.ts` & `auth.ts`)
- **Sanitized `localStorage`**: Hard removed all references to caching or reading `sg_refresh_token` out of the browser's local memory.
- **`credentials: 'include'`**: Modified `attemptTokenRefresh()` and `handleLogout()` functions to command the browser to ferry the protected background cookies over fetch. 
- **Reactive Workflow**: Token refreshes are entirely reactive. An expired `sg_token` yields a `401 Unauthorized` causing `apiFetch` to seamlessly hit `/refresh` in the background, update the valid `sg_token`, and seamlessly retry the original request.

---

## 4. Summary of Protections Achieved
1. **XSS Protection**: Malicious scripts cannot fetch the refresh token. It rests safely in `HttpOnly` cookie memory.
2. **CSRF Protection**: By configuring `SameSite=Strict` onto the `Set-Cookie` header (and ensuring valid CORS mappings), cross-site request forgery attacks aiming to weaponize the silent cookie are blocked.
3. **Encrypted Transport**: Parameterizing the `Secure` flag natively prepares the production build to immediately require strictly encrypted HTTPS pipelines.