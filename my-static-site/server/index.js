import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { Form, Link, Links, Meta, NavLink, Outlet, Scripts, ScrollRestoration, ServerRouter, UNSAFE_withComponentProps, UNSAFE_withErrorBoundaryProps, UNSAFE_withHydrateFallbackProps, isRouteErrorResponse, redirect, useLoaderData, useLocation, useNavigate, useSearchParams, useSubmit } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region node_modules/.pnpm/@react-router+dev@7.14.0_@react-router+serve@7.14.0_react-router@7.14.0_react-dom@19.2.5_reac_wcpbdttev66kuaw73fsibjikri/node_modules/@react-router/dev/dist/config/defaults/entry.server.node.tsx
var entry_server_node_exports = /* @__PURE__ */ __exportAll({
	default: () => handleRequest,
	streamTimeout: () => streamTimeout
});
var streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
	if (request.method.toUpperCase() === "HEAD") return new Response(null, {
		status: responseStatusCode,
		headers: responseHeaders
	});
	return new Promise((resolve, reject) => {
		let shellRendered = false;
		let userAgent = request.headers.get("user-agent");
		let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
		let timeoutId = setTimeout(() => abort(), streamTimeout + 1e3);
		const { pipe, abort } = renderToPipeableStream(/* @__PURE__ */ jsx(ServerRouter, {
			context: routerContext,
			url: request.url
		}), {
			[readyOption]() {
				shellRendered = true;
				const body = new PassThrough({ final(callback) {
					clearTimeout(timeoutId);
					timeoutId = void 0;
					callback();
				} });
				const stream = createReadableStreamFromReadable(body);
				responseHeaders.set("Content-Type", "text/html");
				pipe(body);
				resolve(new Response(stream, {
					headers: responseHeaders,
					status: responseStatusCode
				}));
			},
			onShellError(error) {
				reject(error);
			},
			onError(error) {
				responseStatusCode = 500;
				if (shellRendered) console.error(error);
			}
		});
	});
}
//#endregion
//#region app/root.tsx
var root_exports = /* @__PURE__ */ __exportAll({
	ErrorBoundary: () => ErrorBoundary,
	Layout: () => Layout,
	default: () => root_default,
	links: () => links
});
var links = () => [
	{
		rel: "preconnect",
		href: "https://fonts.googleapis.com"
	},
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous"
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&display=swap"
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&family=Noto+Sans+Tamil:wght@400;700&display=swap"
	},
	{
		rel: "stylesheet",
		href: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css"
	}
];
function Layout({ children }) {
	useEffect(() => {
		import("bootstrap/dist/js/bootstrap.bundle.min.js");
	}, []);
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		children: [/* @__PURE__ */ jsxs("head", { children: [
			/* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
			/* @__PURE__ */ jsx("meta", {
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			}),
			/* @__PURE__ */ jsx(Meta, {}),
			/* @__PURE__ */ jsx(Links, {})
		] }), /* @__PURE__ */ jsxs("body", { children: [
			children,
			/* @__PURE__ */ jsx(ScrollRestoration, {}),
			/* @__PURE__ */ jsx(Scripts, {})
		] })]
	});
}
var root_default = UNSAFE_withComponentProps(function App() {
	return /* @__PURE__ */ jsx(Outlet, {});
});
var ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary({ error }) {
	let message = "Oops!";
	let details = "An unexpected error occurred.";
	let stack;
	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? "404" : "Error";
		details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
	}
	return /* @__PURE__ */ jsxs("main", {
		className: "container pt-5 p-4",
		children: [
			/* @__PURE__ */ jsx("h1", { children: message }),
			/* @__PURE__ */ jsx("p", { children: details }),
			stack
		]
	});
});
var isBrowser$1 = typeof window !== "undefined";
/**
* Attempts a silent token refresh using the stored refresh token.
* Returns the new access token on success, or null on failure.
* On failure, stored auth is cleared so the user is treated as logged out.
*/
async function attemptTokenRefresh() {
	if (!isBrowser$1) return null;
	try {
		const res = await fetch(`/api/auth/refresh`, {
			method: "POST",
			credentials: "include"
		});
		if (!res.ok) {
			localStorage.removeItem("sg_token");
			localStorage.removeItem("sg_user");
			return null;
		}
		const data = await res.json();
		localStorage.setItem("sg_token", data.token);
		const stored = JSON.parse(localStorage.getItem("sg_user") ?? "{}");
		localStorage.setItem("sg_user", JSON.stringify({
			...stored,
			staff: data.staff
		}));
		return data.token;
	} catch {
		return null;
	}
}
/**
* Thin wrapper around fetch that automatically retries with a refreshed token
* on a 401 response. If the refresh also fails, auth is cleared and the 401
* response is returned so callers / loaders can handle the redirect.
*/
async function apiFetch(path, options) {
	const { headers: optionHeaders, ...restOptions } = options ?? {};
	const baseHeaders = {
		"Content-Type": "application/json",
		...optionHeaders ?? {}
	};
	const res = await fetch(`${path}`, {
		headers: baseHeaders,
		...restOptions
	});
	if ((res.status === 401 || res.status === 403) && isBrowser$1 && !path.includes("/api/auth/")) {
		const newToken = await attemptTokenRefresh();
		if (newToken) return fetch(`${path}`, {
			...restOptions,
			headers: {
				...baseHeaders,
				Authorization: `Bearer ${newToken}`
			}
		});
	}
	return res;
}
async function getLikeStatus(articleId, token) {
	const headers = {};
	if (token) headers["Authorization"] = `Bearer ${token}`;
	const res = await apiFetch(`/api/articles/${articleId}/engagements/like-status`, { headers });
	if (!res.ok) throw new Error("Failed to fetch like status");
	return res.json();
}
async function toggleLike(articleId, token) {
	const res = await apiFetch(`/api/articles/${articleId}/engagements/like`, {
		method: "POST",
		headers: { "Authorization": `Bearer ${token}` }
	});
	if (!res.ok) throw new Error("Failed to toggle like");
	return res.json();
}
async function getComments(articleId, page = 0, size = 10) {
	const res = await apiFetch(`/api/articles/${articleId}/engagements/comments?page=${page}&size=${size}`);
	if (!res.ok) throw new Error("Failed to fetch comments");
	return res.json();
}
async function addComment(articleId, text, token) {
	const res = await apiFetch(`/api/articles/${articleId}/engagements/comments`, {
		method: "POST",
		headers: { "Authorization": `Bearer ${token}` },
		body: JSON.stringify({ text })
	});
	if (!res.ok) throw new Error("Failed to add comment");
	return res.json();
}
async function deleteComment(commentId, token) {
	if (!(await apiFetch(`/api/articles/engagements/comments/${commentId}`, {
		method: "DELETE",
		headers: { "Authorization": `Bearer ${token}` }
	})).ok) throw new Error("Failed to delete comment");
}
async function getAdminMetrics(token) {
	const res = await apiFetch(`/api/admin/metrics`, { headers: { "Authorization": `Bearer ${token}` } });
	if (!res.ok) throw new Error("Failed to fetch admin metrics");
	return res.json();
}
async function getAdminUsers(token) {
	const res = await apiFetch(`/api/admin/users`, { headers: { "Authorization": `Bearer ${token}` } });
	if (!res.ok) throw new Error("Failed to fetch admin users");
	return res.json();
}
async function getAdminArticles(token, page = 0, size = 10, sort = "createdAt,desc") {
	const res = await apiFetch(`/api/admin/articles?page=${page}&size=${size}&sort=${sort}`, { headers: { "Authorization": `Bearer ${token}` } });
	if (!res.ok) throw new Error("Failed to fetch admin articles");
	return res.json();
}
async function updateArticleStatus(id, status, token) {
	if (!(await apiFetch(`/api/admin/articles/${id}/status?status=${status}`, {
		method: "PATCH",
		headers: { "Authorization": `Bearer ${token}` }
	})).ok) throw new Error("Failed to update article status");
}
async function deleteAdminArticle(id, token) {
	if (!(await apiFetch(`/api/admin/articles/${id}`, {
		method: "DELETE",
		headers: { "Authorization": `Bearer ${token}` }
	})).ok) throw new Error("Failed to delete article");
}
async function searchArticles(query, page = 0, size = 12) {
	const res = await apiFetch(`/api/articles/search?q=${encodeURIComponent(query)}&page=${page}&size=${size}`);
	if (!res.ok) throw new Error("Failed to search articles");
	return res.json();
}
async function getArticlesByTopic(topicId, page = 0, size = 12) {
	const res = await apiFetch(`/api/articles/topic/${topicId}?page=${page}&size=${size}`);
	if (!res.ok) throw new Error("Failed to fetch articles by topic");
	return res.json();
}
//#endregion
//#region app/lib/auth.ts
var isBrowser = typeof window !== "undefined";
var getToken = () => isBrowser ? localStorage.getItem("sg_token") : null;
var getUser = () => isBrowser ? JSON.parse(localStorage.getItem("sg_user") ?? "null") : null;
function setAuth(data) {
	localStorage.setItem("sg_token", data.token);
	localStorage.setItem("sg_user", JSON.stringify({
		userId: data.userId,
		name: data.name,
		email: data.email,
		staff: data.staff
	}));
}
function clearAuth() {
	localStorage.removeItem("sg_token");
	localStorage.removeItem("sg_user");
}
/**
* Validates the token with the backend and returns the user object if authenticated.
* If not authenticated or token is invalid, returns null without throwing.
* Perfect for public pages (like articles) that hide/show features based on auth.
*/
async function getOptionalAuthUser() {
	const token = getToken();
	if (!token) return {
		token: null,
		user: null
	};
	try {
		const res = await apiFetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } });
		if (!res.ok) return {
			token: null,
			user: null
		};
		return {
			token,
			user: await res.json()
		};
	} catch {
		return {
			token: null,
			user: null
		};
	}
}
/**
* Validates the token with the backend and ensures the user is authenticated.
* If authentication fails, throws a redirect to /login.
* Perfect for generic User Profile or Settings pages.
*/
async function requireAuthUser() {
	const { token, user } = await getOptionalAuthUser();
	if (!token || !user) throw redirect("/login?reason=unauthorized");
	return {
		token,
		user
	};
}
/**
* Validates the token with the backend and ensures the user is staff.
* If authentication fails or the user is not staff, throws a redirect to /login.
* Useful for reusing in React Router loaders.
*/
async function requireStaffUser() {
	const { token, user } = await requireAuthUser();
	if (!user?.staff) throw redirect("/login?reason=unauthorized");
	return {
		token,
		user
	};
}
//#endregion
//#region app/routes/admin/layout.tsx
var layout_exports$1 = /* @__PURE__ */ __exportAll({
	clientLoader: () => clientLoader$7,
	default: () => layout_default$1
});
async function clientLoader$7() {
	const { token, user } = await requireStaffUser();
	return {
		token,
		user
	};
}
var layout_default$1 = UNSAFE_withComponentProps(function AdminLayout() {
	const handleLogout = async () => {
		try {
			await fetch("/api/auth/logout", {
				method: "POST",
				credentials: "include"
			});
		} catch {}
		clearAuth();
		window.location.href = "/";
	};
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx("nav", {
			className: "navbar navbar-light bg-success d-md-none",
			children: /* @__PURE__ */ jsxs("div", {
				className: "container-fluid",
				children: [/* @__PURE__ */ jsx(Link, {
					className: "navbar-brand",
					to: "/admin",
					children: /* @__PURE__ */ jsx("img", {
						src: "/imgs/logo.svg",
						width: "117",
						alt: "logo in white"
					})
				}), /* @__PURE__ */ jsx("button", {
					className: "navbar-toggler",
					type: "button",
					"data-bs-toggle": "offcanvas",
					"data-bs-target": "#mobileSidebar",
					"aria-controls": "mobileSidebar",
					children: /* @__PURE__ */ jsx("span", { className: "navbar-toggler-icon" })
				})]
			})
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "offcanvas offcanvas-start",
			tabIndex: -1,
			id: "mobileSidebar",
			"aria-labelledby": "mobileSidebarLabel",
			children: [/* @__PURE__ */ jsx("div", {
				className: "offcanvas-header bg-success",
				children: /* @__PURE__ */ jsx("img", {
					src: "/imgs/logo.svg",
					className: "mx-auto",
					width: "164",
					alt: "logo in white"
				})
			}), /* @__PURE__ */ jsx("div", {
				className: "offcanvas-body",
				children: /* @__PURE__ */ jsxs("ul", {
					className: "nav flex-column",
					children: [
						/* @__PURE__ */ jsx("li", {
							className: "nav-item",
							children: /* @__PURE__ */ jsxs(NavLink, {
								className: ({ isActive }) => `nav-link text-black ${isActive ? "active fw-bold" : ""}`,
								to: "/admin",
								end: true,
								children: [/* @__PURE__ */ jsx("i", { className: "bi bi-graph-up me-2" }), " Dashboard"]
							})
						}),
						/* @__PURE__ */ jsx("li", {
							className: "nav-item",
							children: /* @__PURE__ */ jsxs(NavLink, {
								className: ({ isActive }) => `nav-link text-black ${isActive ? "active fw-bold" : ""}`,
								to: "/admin/articles",
								children: [/* @__PURE__ */ jsx("i", { className: "bi bi-pencil-square me-2" }), " Articles"]
							})
						}),
						/* @__PURE__ */ jsx("li", {
							className: "nav-item mt-4",
							children: /* @__PURE__ */ jsxs(Link, {
								className: "nav-link text-primary",
								to: "/",
								children: [/* @__PURE__ */ jsx("i", { className: "bi bi-house me-2" }), " Go to Live Site"]
							})
						}),
						/* @__PURE__ */ jsx("li", {
							className: "nav-item",
							children: /* @__PURE__ */ jsxs("button", {
								className: "nav-link text-danger border-0 bg-transparent",
								onClick: handleLogout,
								children: [/* @__PURE__ */ jsx("i", { className: "bi bi-box-arrow-right me-2" }), " Logout"]
							})
						})
					]
				})
			})]
		}),
		/* @__PURE__ */ jsx("div", {
			className: "container-fluid min-vh-100",
			children: /* @__PURE__ */ jsxs("div", {
				className: "row min-vh-100",
				children: [/* @__PURE__ */ jsx("nav", {
					className: "col-md-3 col-lg-2 d-none d-md-block static-sidebar px-0 bg-success",
					children: /* @__PURE__ */ jsxs("div", {
						className: "position-sticky pt-3",
						children: [/* @__PURE__ */ jsx(Link, {
							to: "/",
							children: /* @__PURE__ */ jsx("img", {
								src: "/imgs/logo.svg",
								className: "mx-auto d-block mb-4",
								width: "134",
								height: "80",
								alt: "logo in static"
							})
						}), /* @__PURE__ */ jsxs("ul", {
							className: "nav flex-column",
							children: [
								/* @__PURE__ */ jsx("li", {
									className: "nav-item",
									children: /* @__PURE__ */ jsxs(NavLink, {
										className: ({ isActive }) => `nav-link text-white ${isActive ? "active fw-bold" : ""}`,
										to: "/admin",
										end: true,
										children: [/* @__PURE__ */ jsx("i", { className: "bi bi-graph-up me-2" }), " Dashboard"]
									})
								}),
								/* @__PURE__ */ jsx("li", {
									className: "nav-item",
									children: /* @__PURE__ */ jsxs(NavLink, {
										className: ({ isActive }) => `nav-link text-white ${isActive ? "active fw-bold" : ""}`,
										to: "/admin/articles",
										children: [/* @__PURE__ */ jsx("i", { className: "bi bi-pencil-square me-2" }), " Articles"]
									})
								}),
								/* @__PURE__ */ jsx("li", {
									className: "nav-item mt-5 pt-3 border-top border-light border-opacity-25 mx-3",
									children: /* @__PURE__ */ jsxs(Link, {
										className: "nav-link text-white-50",
										to: "/",
										children: [/* @__PURE__ */ jsx("i", { className: "bi bi-house me-2" }), " Home Page"]
									})
								}),
								/* @__PURE__ */ jsx("li", {
									className: "nav-item mx-3",
									children: /* @__PURE__ */ jsxs("button", {
										className: "nav-link text-white-50 border-0 bg-transparent",
										onClick: handleLogout,
										children: [/* @__PURE__ */ jsx("i", { className: "bi bi-box-arrow-right me-2" }), " Logout"]
									})
								})
							]
						})]
					})
				}), /* @__PURE__ */ jsx("main", {
					className: "col-md-9 ms-sm-auto col-lg-10 px-md-4",
					children: /* @__PURE__ */ jsx(Outlet, {})
				})]
			})
		})
	] });
});
//#endregion
//#region app/routes/admin/dashboard.tsx
var dashboard_exports = /* @__PURE__ */ __exportAll({
	clientLoader: () => clientLoader$6,
	default: () => dashboard_default
});
async function clientLoader$6() {
	const { token } = await requireStaffUser();
	try {
		const [metrics, users] = await Promise.all([getAdminMetrics(token), getAdminUsers(token)]);
		return {
			metrics,
			users
		};
	} catch {
		throw redirect("/login?reason=expired");
	}
}
var dashboard_default = UNSAFE_withComponentProps(function AdminDashboard() {
	const { metrics, users } = useLoaderData();
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx("div", {
			className: "d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom",
			children: /* @__PURE__ */ jsx("h1", {
				className: "h2 text-black",
				children: "Dashboard"
			})
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "row mb-4",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "col-md-4",
					children: /* @__PURE__ */ jsx("div", {
						className: "card text-white bg-success mb-3",
						children: /* @__PURE__ */ jsxs("div", {
							className: "card-body",
							children: [/* @__PURE__ */ jsxs("h5", {
								className: "card-title",
								children: [/* @__PURE__ */ jsx("i", { className: "bi bi-people me-2" }), "Total Users"]
							}), /* @__PURE__ */ jsx("h3", {
								className: "card-text",
								children: metrics.totalUsers
							})]
						})
					})
				}),
				/* @__PURE__ */ jsx("div", {
					className: "col-md-4",
					children: /* @__PURE__ */ jsx("div", {
						className: "card text-white bg-primary mb-3",
						children: /* @__PURE__ */ jsxs("div", {
							className: "card-body",
							children: [/* @__PURE__ */ jsxs("h5", {
								className: "card-title",
								children: [/* @__PURE__ */ jsx("i", { className: "bi bi-chat-dots me-2" }), "Total Comments"]
							}), /* @__PURE__ */ jsx("h3", {
								className: "card-text",
								children: metrics.totalComments
							})]
						})
					})
				}),
				/* @__PURE__ */ jsx("div", {
					className: "col-md-4",
					children: /* @__PURE__ */ jsx("div", {
						className: "card text-white bg-danger mb-3",
						children: /* @__PURE__ */ jsxs("div", {
							className: "card-body",
							children: [/* @__PURE__ */ jsxs("h5", {
								className: "card-title",
								children: [/* @__PURE__ */ jsx("i", { className: "bi bi-heart-fill me-2" }), "Total Likes"]
							}), /* @__PURE__ */ jsx("h3", {
								className: "card-text",
								children: metrics.totalLikes
							})]
						})
					})
				})
			]
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "card mt-4",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "card-header bg-white",
				children: [/* @__PURE__ */ jsx("i", { className: "bi bi-table me-1" }), " All Users"]
			}), /* @__PURE__ */ jsx("div", {
				className: "card-body",
				children: /* @__PURE__ */ jsx("div", {
					className: "table-responsive",
					children: /* @__PURE__ */ jsxs("table", {
						className: "table table-striped table-hover",
						children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsx("th", { children: "ID" }),
							/* @__PURE__ */ jsx("th", { children: "Username" }),
							/* @__PURE__ */ jsx("th", { children: "Date Created" }),
							/* @__PURE__ */ jsx("th", { children: "Engagements" }),
							/* @__PURE__ */ jsx("th", { children: "Status" })
						] }) }), /* @__PURE__ */ jsx("tbody", { children: users.map((user) => /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsxs("td", { children: ["#", user.id.substring(0, 8)] }),
							/* @__PURE__ */ jsx("td", { children: user.username }),
							/* @__PURE__ */ jsx("td", { children: new Date(user.dateCreated).toLocaleDateString() }),
							/* @__PURE__ */ jsx("td", { children: user.totalEngagements }),
							/* @__PURE__ */ jsx("td", { children: user.isSuperuser ? /* @__PURE__ */ jsx("span", {
								className: "badge bg-danger",
								children: "Superuser"
							}) : user.isStaff ? /* @__PURE__ */ jsx("span", {
								className: "badge bg-primary",
								children: "Admin"
							}) : /* @__PURE__ */ jsx("span", {
								className: "badge bg-success",
								children: "User"
							}) })
						] }, user.id)) })]
					})
				})
			})]
		})
	] });
});
//#endregion
//#region app/routes/admin/articles.tsx
var articles_exports$1 = /* @__PURE__ */ __exportAll({
	clientLoader: () => clientLoader$5,
	default: () => articles_default$1
});
async function clientLoader$5({ request }) {
	const { token } = await requireStaffUser();
	const url = new URL(request.url);
	const page = parseInt(url.searchParams.get("page") || "0", 10);
	const size = parseInt(url.searchParams.get("size") || "10", 10);
	const sort = url.searchParams.get("sort") || "createdAt,desc";
	try {
		return {
			articlesPage: await getAdminArticles(token, page, size, sort),
			token,
			page,
			size,
			sort
		};
	} catch {
		throw redirect("/login?reason=expired");
	}
}
var articles_default$1 = UNSAFE_withComponentProps(function AdminArticles() {
	const { articlesPage, token, page, sort } = useLoaderData();
	const navigate = useNavigate();
	const handleStatusChange = async (id, currentStatus) => {
		let nextStatus = "PUBLISHED";
		if (currentStatus === "DRAFT") nextStatus = "PUBLISHED";
		else if (currentStatus === "PUBLISHED") nextStatus = "ARCHIVED";
		else if (currentStatus === "ARCHIVED") nextStatus = "DRAFT";
		if (confirm(`Change article #${id} status from ${currentStatus} to ${nextStatus}?`)) try {
			await updateArticleStatus(id, nextStatus, token);
			navigate(`?page=${page}&sort=${sort}`, { replace: true });
		} catch (err) {
			alert("Failed to update status.");
		}
	};
	const handleDelete = async (id) => {
		if (confirm(`Are you sure you want to permanently DELETE article #${id}?`)) try {
			await deleteAdminArticle(id, token);
			navigate(`?page=${page}&sort=${sort}`, { replace: true });
		} catch (err) {
			alert("Failed to delete article.");
		}
	};
	const handleSort = (column) => {
		navigate(`?page=${page}&sort=${`${column},${sort === `${column},asc` ? "desc" : "asc"}`}`);
	};
	const getSortIcon = (column) => {
		if (sort === `${column},asc`) return /* @__PURE__ */ jsx("i", { className: "bi bi-caret-up-fill ms-1 fs-6" });
		if (sort === `${column},desc`) return /* @__PURE__ */ jsx("i", { className: "bi bi-caret-down-fill ms-1 fs-6" });
		return /* @__PURE__ */ jsx("i", { className: "bi bi-caret-up ms-1 text-muted opacity-50 fs-6" });
	};
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
		className: "d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom",
		children: [/* @__PURE__ */ jsx("h1", {
			className: "h2 text-black",
			children: "Articles Management"
		}), /* @__PURE__ */ jsx("div", {
			className: "btn-toolbar mb-2 mb-md-0",
			children: /* @__PURE__ */ jsxs(Link, {
				to: "/editor",
				className: "btn btn-sm btn-success",
				children: [/* @__PURE__ */ jsx("i", { className: "bi bi-plus-circle me-1" }), " New Article"]
			})
		})]
	}), /* @__PURE__ */ jsxs("div", {
		className: "card mt-4",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "card-header bg-white",
			children: [/* @__PURE__ */ jsx("i", { className: "bi bi-pencil-square me-1" }), " All Articles"]
		}), /* @__PURE__ */ jsxs("div", {
			className: "card-body",
			children: [/* @__PURE__ */ jsx("div", {
				className: "table-responsive",
				children: /* @__PURE__ */ jsxs("table", {
					className: "table table-striped table-hover align-middle",
					children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
						/* @__PURE__ */ jsxs("th", {
							style: { cursor: "pointer" },
							onClick: () => handleSort("id"),
							children: ["ID ", getSortIcon("id")]
						}),
						/* @__PURE__ */ jsxs("th", {
							style: { cursor: "pointer" },
							onClick: () => handleSort("title"),
							children: ["Title ", getSortIcon("title")]
						}),
						/* @__PURE__ */ jsx("th", { children: "Author" }),
						/* @__PURE__ */ jsxs("th", {
							style: { cursor: "pointer" },
							onClick: () => handleSort("createdAt"),
							children: ["Date Created ", getSortIcon("createdAt")]
						}),
						/* @__PURE__ */ jsxs("th", {
							style: { cursor: "pointer" },
							onClick: () => handleSort("status"),
							children: ["Status ", getSortIcon("status")]
						}),
						/* @__PURE__ */ jsx("th", {
							className: "text-end",
							children: "Actions"
						})
					] }) }), /* @__PURE__ */ jsxs("tbody", { children: [articlesPage.content.map((article) => /* @__PURE__ */ jsxs("tr", { children: [
						/* @__PURE__ */ jsxs("td", { children: ["#", article.id] }),
						/* @__PURE__ */ jsx("td", { children: article.title }),
						/* @__PURE__ */ jsx("td", { children: article.authorName }),
						/* @__PURE__ */ jsx("td", { children: new Date(article.dateCreated).toLocaleDateString() }),
						/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("span", {
							className: `badge ${article.status === "PUBLISHED" ? "bg-success" : article.status === "DRAFT" ? "bg-warning text-dark" : article.status === "ARCHIVED" ? "bg-secondary" : "bg-danger"}`,
							children: article.status
						}) }),
						/* @__PURE__ */ jsx("td", {
							className: "text-end",
							children: /* @__PURE__ */ jsxs("div", {
								className: "btn-group btn-group-sm",
								children: [
									/* @__PURE__ */ jsx(Link, {
										to: `/articles/${article.id}`,
										className: "btn btn-outline-primary",
										title: "View Public",
										children: /* @__PURE__ */ jsx("i", { className: "bi bi-eye" })
									}),
									/* @__PURE__ */ jsx(Link, {
										to: `/editor?edit=${article.id}`,
										className: "btn btn-outline-secondary",
										title: "Edit Content",
										children: /* @__PURE__ */ jsx("i", { className: "bi bi-pencil" })
									}),
									/* @__PURE__ */ jsx("button", {
										className: "btn btn-outline-warning",
										title: "Cycle Status (Draft -> Publ -> Arch -> Draft)",
										onClick: () => handleStatusChange(article.id, article.status),
										disabled: article.status === "DELETED",
										children: /* @__PURE__ */ jsx("i", { className: "bi bi-arrow-repeat" })
									}),
									/* @__PURE__ */ jsx("button", {
										className: "btn btn-outline-danger",
										title: "Delete Article",
										onClick: () => handleDelete(article.id),
										disabled: article.status === "DELETED",
										children: /* @__PURE__ */ jsx("i", { className: "bi bi-trash" })
									})
								]
							})
						})
					] }, article.id)), articlesPage.content.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
						colSpan: 6,
						className: "text-center py-4 text-muted",
						children: "No articles found in the system."
					}) })] })]
				})
			}), articlesPage.totalPages > 1 && /* @__PURE__ */ jsx("nav", {
				"aria-label": "Article page navigation",
				className: "mt-3",
				children: /* @__PURE__ */ jsxs("ul", {
					className: "pagination justify-content-center mb-0",
					children: [
						/* @__PURE__ */ jsx("li", {
							className: `page-item ${page === 0 ? "disabled" : ""}`,
							children: /* @__PURE__ */ jsx(Link, {
								className: "page-link",
								to: `?page=${page - 1}&sort=${sort}`,
								children: "Previous"
							})
						}),
						[...Array(articlesPage.totalPages)].map((_, i) => /* @__PURE__ */ jsx("li", {
							className: `page-item ${page === i ? "active" : ""}`,
							children: /* @__PURE__ */ jsx(Link, {
								className: "page-link",
								to: `?page=${i}&sort=${sort}`,
								children: i + 1
							})
						}, i)),
						/* @__PURE__ */ jsx("li", {
							className: `page-item ${page >= articlesPage.totalPages - 1 ? "disabled" : ""}`,
							children: /* @__PURE__ */ jsx(Link, {
								className: "page-link",
								to: `?page=${page + 1}&sort=${sort}`,
								children: "Next"
							})
						})
					]
				})
			})]
		})]
	})] });
});
//#endregion
//#region app/components/ProfileModal.tsx
function ProfileModal({ onClose }) {
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	async function handleSubmit(e) {
		e.preventDefault();
		setError(null);
		setSuccess(false);
		if (newPassword.length < 8) {
			setError("New password must be at least 8 characters.");
			return;
		}
		if (newPassword !== confirmPassword) {
			setError("New passwords do not match.");
			return;
		}
		setIsLoading(true);
		try {
			const res = await apiFetch("/api/user/me/password", {
				method: "PUT",
				headers: { Authorization: `Bearer ${getToken()}` },
				body: JSON.stringify({
					currentPassword,
					newPassword
				})
			});
			if (res.status === 204) {
				setSuccess(true);
				setCurrentPassword("");
				setNewPassword("");
				setConfirmPassword("");
			} else if (res.status === 422) setError("Current password is incorrect.");
			else setError("Something went wrong. Please try again.");
		} catch {
			setError("Could not connect to the server.");
		} finally {
			setIsLoading(false);
		}
	}
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
		className: "modal-backdrop fade show",
		onClick: onClose
	}), /* @__PURE__ */ jsx("div", {
		className: "modal d-block",
		tabIndex: -1,
		children: /* @__PURE__ */ jsx("div", {
			className: "modal-dialog modal-dialog-centered",
			children: /* @__PURE__ */ jsxs("div", {
				className: "modal-content rounded-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "modal-header border-0 pb-0",
					children: [/* @__PURE__ */ jsx("h5", {
						className: "modal-title fw-bold",
						children: "Profile"
					}), /* @__PURE__ */ jsx("button", {
						className: "btn-close",
						onClick: onClose,
						"aria-label": "Close"
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "modal-body pt-2",
					children: [
						/* @__PURE__ */ jsx("h6", {
							className: "fw-semibold mb-3",
							children: "Change Password"
						}),
						error && /* @__PURE__ */ jsxs("div", {
							className: "alert alert-danger alert-dismissible py-2",
							role: "alert",
							children: [error, /* @__PURE__ */ jsx("button", {
								type: "button",
								className: "btn-close",
								onClick: () => setError(null),
								"aria-label": "Close"
							})]
						}),
						success && /* @__PURE__ */ jsxs("div", {
							className: "alert alert-success alert-dismissible py-2",
							role: "alert",
							children: ["Password changed successfully.", /* @__PURE__ */ jsx("button", {
								type: "button",
								className: "btn-close",
								onClick: () => setSuccess(false),
								"aria-label": "Close"
							})]
						}),
						/* @__PURE__ */ jsxs("form", {
							onSubmit: handleSubmit,
							noValidate: true,
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "mb-3",
									children: [/* @__PURE__ */ jsx("label", {
										htmlFor: "currentPassword",
										className: "form-label fw-semibold",
										children: "Current Password"
									}), /* @__PURE__ */ jsx("input", {
										type: "password",
										id: "currentPassword",
										className: "form-control",
										value: currentPassword,
										onChange: (e) => setCurrentPassword(e.target.value),
										required: true,
										autoComplete: "current-password"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mb-3",
									children: [/* @__PURE__ */ jsx("label", {
										htmlFor: "newPassword",
										className: "form-label fw-semibold",
										children: "New Password"
									}), /* @__PURE__ */ jsx("input", {
										type: "password",
										id: "newPassword",
										className: "form-control",
										value: newPassword,
										onChange: (e) => setNewPassword(e.target.value),
										required: true,
										autoComplete: "new-password"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mb-4",
									children: [/* @__PURE__ */ jsx("label", {
										htmlFor: "confirmPassword",
										className: "form-label fw-semibold",
										children: "Confirm New Password"
									}), /* @__PURE__ */ jsx("input", {
										type: "password",
										id: "confirmPassword",
										className: "form-control",
										value: confirmPassword,
										onChange: (e) => setConfirmPassword(e.target.value),
										required: true,
										autoComplete: "new-password"
									})]
								}),
								/* @__PURE__ */ jsxs("button", {
									type: "submit",
									disabled: isLoading,
									className: "btn btn-primary w-100",
									children: [isLoading ? "Saving…" : "Change Password", isLoading && /* @__PURE__ */ jsx("span", {
										className: "spinner-border spinner-border-sm ms-2",
										role: "status",
										"aria-hidden": "true"
									})]
								})
							]
						})
					]
				})]
			})
		})
	})] });
}
//#endregion
//#region app/i18n/types.ts
var LANGUAGES = [
	{
		code: "en",
		label: "English"
	},
	{
		code: "zh",
		label: "中文"
	},
	{
		code: "ms",
		label: "Melayu"
	},
	{
		code: "ta",
		label: "தமிழ்"
	}
];
var STORAGE_KEY = "silverguide-language";
var HTML_LANG = {
	en: "en",
	zh: "zh-Hans",
	ms: "ms",
	ta: "ta"
};
//#endregion
//#region app/i18n/translations/index.ts
var translations = {
	en: {
		nav: {
			home: "Home",
			learn: "Learn",
			about: "About",
			editor: "Editor",
			admin: "Admin",
			helpLine: "🚨 Help-Line",
			signIn: "Sign In",
			register: "Register",
			logOut: "Log Out",
			toggleNav: "Toggle navigation",
			profile: "Profile"
		},
		footer: {
			tagline: "Helping you navigate the digital world",
			copyright: "© 2026 The Silver Guide Website, All rights reserved.",
			contactUs: "Contact Us",
			aboutUs: "About Us",
			faqs: "FAQs"
		},
		home: {
			heroAlt: "an elderly woman smiling and using her smartphone",
			badge: "Welcome to Silver Guide",
			title: "Embrace the Digital World with Confidence",
			lead: "At Silver Guide, we make learning technology simple, safe, and fun. Explore our easy, step-by-step guides on using smartphones, staying connected with family, and recognizing online scams.",
			startLearning: "Start Learning",
			emergencyHelpLine: "🚨 Emergency Help-Line",
			latestArticles: "Latest Articles",
			latestArticlesLead: "Discover our newest, most up-to-date guides. Select a category below to browse the latest clear, jargon-free articles designed specifically for seniors.",
			tabTech: "Technology Basics",
			tabScam: "Scam Awareness",
			viewAllTech: "View All Technology Basics Guides →",
			viewAllScam: "View All Scam Awareness Guides →",
			noGuidesTitle: "No guides available right now",
			noGuidesBody: "We are currently creating new tutorials. Please check back later!",
			emergencyBadge: "EMERGENCY HELP",
			emergencyTitle: "Think you have been scammed?",
			emergencySubtitle: "Don't panic. We are here to help you step-by-step.",
			emergencyBody: "If you gave away your banking details, OTP, or transferred money to someone suspicious, follow our immediate security checklist. Freeze your accounts and contact the Anti-Scam Hotline.",
			getScamHelp: "Get Scam Help Now"
		},
		about: {
			purposeBadge: "our purpose",
			purposeQuote: "\"Technology is for everyone.\"",
			purposeLead: "We want ours to provide clear, step-by-step resources that make technology accessible, reduce fear, and build independence for seniors navigating the digital world.",
			differentTitle: "What makes us different",
			safeTitle: "Safe",
			safeBody: "The internet can be scary. We want you to have a reliable source to teach you how to spot these risks and protect your privacy.",
			simpleTitle: "Simple",
			simpleBody: "With readable fonts, simple navigation and jargon-free instructions. Our interface is designed for seniors, like you, to build your digital skills!",
			teamTitle: "Meet our team",
			scrollHint: "Scroll for more →",
			ctaTitle: "Ready to start learning?",
			ctaLead: "Explore our easy-to-follow resources designed specifically for you.",
			ctaButton: "View Learning Portal",
			readMore: "Read more",
			readLess: "Read less"
		},
		team: {
			christine: {
				name: "Christine",
				role: "Lead Designer",
				bio: "I'm passionate about using my organisational skills with my technical abilities to improve efficiency and support people behind the scenes."
			},
			ekhong: {
				name: "Ek Hong",
				role: "Database expert",
				bio: "With expertise in data, machine learning and agentic deveopment, I specialize in bridging the gap between complex technology and practical strategy. My approach combines a consulting mindset with a focus on building reliable systems that are practical yet prepared for the future."
			},
			kelvin: {
				name: "Kelvin",
				role: "AI expert",
				bio: "Passionate about building SaaS solutions and AI systems for real-world problems, I bring a proven track record in high-performance sales and entrepreneurial ventures."
			},
			kimshee: {
				name: "Kim Shee",
				role: "Infrastructure expert",
				bio: "I am dedicated to bridging infrastructure discipline with new development knowledge to build secure, scalable applications for fintech and Web3, while delivering reliable solutions in mission critical environments during my mid-career transition into modern mobile and web development."
			}
		},
		emergency: {
			title: "Emergency Help",
			lead: "If you think you have been scammed, stay calm and follow these steps immediately.",
			step1Title: "Call Your Bank Immediately",
			step1Body: "Ask them to freeze your accounts and credit cards. Do this even if you aren't sure yet.",
			step2Title: "Call the Anti-Scam Hotline",
			step2Body: "Get expert advice from the police on what to do next.",
			step2Call: "Call 1800-722-6688",
			step2Availability: "Available 24/7 for scam reports.",
			step3Title: "Make a Police Report",
			step3Body: "Go to the nearest Neighborhood Police Center or report online.",
			step3Button: "Submit Online Report",
			backHome: "Back to Home"
		},
		login: {
			backHome: "← Back to Home",
			welcomeBack: "Welcome Back",
			signInSubtitle: "Sign in to your account",
			emailLabel: "Email address",
			emailPlaceholder: "you@example.com",
			passwordLabel: "Password",
			passwordPlaceholder: "Enter your password",
			signIn: "Sign In",
			signingIn: "Signing in…",
			noAccount: "Don't have an account?",
			registerLink: "Register →",
			close: "Close",
			errors: {
				invalidCredentials: "Invalid email or password.",
				generic: "Something went wrong. Please try again.",
				network: "Could not connect to the server. Please check your connection."
			},
			info: {
				expired: "Your session has expired. Please log in again to continue.",
				unauthorized: "You must be logged in to view that page."
			}
		},
		register: {
			backHome: "← Back to Home",
			createAccount: "Create Your Account",
			joinSubtitle: "Join Silver Guide today — it's free",
			nameLabel: "Full Name",
			namePlaceholder: "Your name",
			emailLabel: "Email address",
			emailPlaceholder: "you@example.com",
			passwordLabel: "Password",
			passwordPlaceholder: "Create a password",
			passwordHint: "Must be at least 8 characters.",
			confirmLabel: "Confirm Password",
			confirmPlaceholder: "Repeat your password",
			createButton: "Create Account",
			creating: "Creating account…",
			hasAccount: "Already have an account?",
			signInLink: "Sign In →",
			close: "Close",
			errors: {
				nameRequired: "Please enter your name.",
				emailInvalid: "Please enter a valid email address.",
				passwordMin: "Password must be at least 8 characters.",
				confirmMismatch: "Passwords do not match.",
				emailExists: "An account with that email already exists.",
				checkInput: "Please check your input and try again.",
				generic: "Something went wrong. Please try again.",
				network: "Could not connect to the server. Please check your connection."
			}
		},
		toolbar: { ariaLabel: "Choose language" }
	},
	zh: {
		nav: {
			home: "首页",
			learn: "学习",
			about: "关于我们",
			editor: "编辑器",
			admin: "管理",
			helpLine: "🚨 求助热线",
			signIn: "登录",
			register: "注册",
			logOut: "退出",
			toggleNav: "切换导航",
			profile: "个人资料"
		},
		footer: {
			tagline: "助您轻松畅游数字世界",
			copyright: "© 2026 银龄指南网站，保留所有权利。",
			contactUs: "联系我们",
			aboutUs: "关于我们",
			faqs: "常见问题"
		},
		home: {
			heroAlt: "一位微笑着的老年女士正在使用智能手机",
			badge: "欢迎来到银龄指南",
			title: "自信拥抱数字世界",
			lead: "在银龄指南，我们让学习科技变得简单、安全又有趣。探索我们易于跟进的指南，学习使用智能手机、与家人保持联系，以及识别网络诈骗。",
			startLearning: "开始学习",
			emergencyHelpLine: "🚨 紧急求助热线",
			latestArticles: "最新文章",
			latestArticlesLead: "探索我们最新、最及时的指南。在下方选择类别，浏览专为长者设计的清晰、无术语文章。",
			tabTech: "科技基础",
			tabScam: "防骗意识",
			viewAllTech: "查看全部科技基础指南 →",
			viewAllScam: "查看全部防骗意识指南 →",
			noGuidesTitle: "目前没有可用指南",
			noGuidesBody: "我们正在制作新的教程，请稍后再来查看！",
			emergencyBadge: "紧急求助",
			emergencyTitle: "怀疑自己被骗了？",
			emergencySubtitle: "不要慌张。我们将一步步帮助您。",
			emergencyBody: "如果您泄露了银行资料、一次性密码（OTP），或向可疑人士转账，请立即按照我们的安全清单操作。冻结账户并联系反诈骗热线。",
			getScamHelp: "立即获取诈骗求助"
		},
		about: {
			purposeBadge: "我们的宗旨",
			purposeQuote: "“科技属于每一个人。”",
			purposeLead: "我们希望提供清晰、循序渐进的资源，让科技更易接触，减少恐惧，帮助长者在数字世界中建立独立能力。",
			differentTitle: "我们的不同之处",
			safeTitle: "安全",
			safeBody: "互联网可能令人不安。我们希望成为您可靠的学习来源，教您识别风险并保护隐私。",
			simpleTitle: "简单",
			simpleBody: "易读字体、简单导航、无术语说明。我们的界面专为像您一样的长者设计，帮助您建立数字技能！",
			teamTitle: "认识我们的团队",
			scrollHint: "滑动查看更多 →",
			ctaTitle: "准备好开始学习了吗？",
			ctaLead: "探索专为您设计的易懂资源。",
			ctaButton: "进入学习专区",
			readMore: "阅读更多",
			readLess: "收起"
		},
		team: {
			christine: {
				name: "Christine",
				role: "首席设计师",
				bio: "我热衷于将组织能力与技术能力结合，在幕后提升效率并支持他人。"
			},
			ekhong: {
				name: "Ek Hong",
				role: "数据库专家",
				bio: "凭借数据、机器学习和智能体开发方面的专长，我擅长在复杂技术与实用策略之间架起桥梁。我的方法结合咨询思维，专注于构建可靠、务实且面向未来的系统。"
			},
			kelvin: {
				name: "Kelvin",
				role: "人工智能专家",
				bio: "热衷于为现实问题构建 SaaS 解决方案和 AI 系统，我在高性能销售和创业方面拥有丰富经验。"
			},
			kimshee: {
				name: "Kim Shee",
				role: "基础设施专家",
				bio: "我致力于将基础设施规范与新开发知识相结合，为金融科技和 Web3 构建安全、可扩展的应用，并在职业生涯中期转型现代移动和 Web 开发的同时，在关键任务环境中提供可靠解决方案。"
			}
		},
		emergency: {
			title: "紧急求助",
			lead: "如果您怀疑自己被骗了，请保持冷静，并立即按照以下步骤操作。",
			step1Title: "立即致电您的银行",
			step1Body: "请银行冻结您的账户和信用卡。即使您还不确定，也请这样做。",
			step2Title: "致电反诈骗热线",
			step2Body: "向警方专家咨询下一步该怎么做。",
			step2Call: "拨打 1800-722-6688",
			step2Availability: "全年无休，受理诈骗举报。",
			step3Title: "向警方报案",
			step3Body: "前往最近的邻里警署或在线报案。",
			step3Button: "提交在线报案",
			backHome: "返回首页"
		},
		login: {
			backHome: "← 返回首页",
			welcomeBack: "欢迎回来",
			signInSubtitle: "登录您的账户",
			emailLabel: "电子邮箱",
			emailPlaceholder: "you@example.com",
			passwordLabel: "密码",
			passwordPlaceholder: "请输入密码",
			signIn: "登录",
			signingIn: "正在登录…",
			noAccount: "还没有账户？",
			registerLink: "注册 →",
			close: "关闭",
			errors: {
				invalidCredentials: "电子邮箱或密码不正确。",
				generic: "出了点问题，请重试。",
				network: "无法连接服务器，请检查网络连接。"
			},
			info: {
				expired: "您的会话已过期，请重新登录以继续。",
				unauthorized: "您需要登录才能查看该页面。"
			}
		},
		register: {
			backHome: "← 返回首页",
			createAccount: "创建账户",
			joinSubtitle: "立即加入银龄指南 — 完全免费",
			nameLabel: "全名",
			namePlaceholder: "您的姓名",
			emailLabel: "电子邮箱",
			emailPlaceholder: "you@example.com",
			passwordLabel: "密码",
			passwordPlaceholder: "创建密码",
			passwordHint: "至少需要 8 个字符。",
			confirmLabel: "确认密码",
			confirmPlaceholder: "再次输入密码",
			createButton: "创建账户",
			creating: "正在创建账户…",
			hasAccount: "已有账户？",
			signInLink: "登录 →",
			close: "关闭",
			errors: {
				nameRequired: "请输入您的姓名。",
				emailInvalid: "请输入有效的电子邮箱地址。",
				passwordMin: "密码至少需要 8 个字符。",
				confirmMismatch: "两次输入的密码不一致。",
				emailExists: "该电子邮箱已被注册。",
				checkInput: "请检查输入后重试。",
				generic: "出了点问题，请重试。",
				network: "无法连接服务器，请检查网络连接。"
			}
		},
		toolbar: { ariaLabel: "选择语言" }
	},
	ms: {
		nav: {
			home: "Laman Utama",
			learn: "Belajar",
			about: "Perihal Kami",
			editor: "Editor",
			admin: "Pentadbir",
			helpLine: "🚨 Talian Bantuan",
			signIn: "Log Masuk",
			register: "Daftar",
			logOut: "Log Keluar",
			toggleNav: "Togol navigasi",
			profile: "Profil"
		},
		footer: {
			tagline: "Membantu anda menavigasi dunia digital",
			copyright: "© 2026 Laman Web Silver Guide, Hak cipta terpelihara.",
			contactUs: "Hubungi Kami",
			aboutUs: "Perihal Kami",
			faqs: "Soalan Lazim"
		},
		home: {
			heroAlt: "seorang wanita warga emas tersenyum menggunakan telefon pintarnya",
			badge: "Selamat datang ke Silver Guide",
			title: "Terokai Dunia Digital dengan Yakin",
			lead: "Di Silver Guide, kami menjadikan pembelajaran teknologi mudah, selamat dan menyeronokkan. Terokai panduan langkah demi langkah tentang telefon pintar, kekal berhubung dengan keluarga, dan mengenali penipuan dalam talian.",
			startLearning: "Mula Belajar",
			emergencyHelpLine: "🚨 Talian Bantuan Kecemasan",
			latestArticles: "Artikel Terkini",
			latestArticlesLead: "Temui panduan terbaharu kami. Pilih kategori di bawah untuk melayari artikel yang jelas dan mudah difahami, direka khas untuk warga emas.",
			tabTech: "Asas Teknologi",
			tabScam: "Kesedaran Penipuan",
			viewAllTech: "Lihat Semua Panduan Asas Teknologi →",
			viewAllScam: "Lihat Semua Panduan Kesedaran Penipuan →",
			noGuidesTitle: "Tiada panduan buat masa ini",
			noGuidesBody: "Kami sedang menyediakan tutorial baharu. Sila semak semula kemudian!",
			emergencyBadge: "BANTUAN KECEMASAN",
			emergencyTitle: "Terfikir anda telah ditipu?",
			emergencySubtitle: "Jangan panik. Kami sedia membantu anda langkah demi langkah.",
			emergencyBody: "Jika anda memberikan butiran bank, OTP, atau memindahkan wang kepada pihak mencurigakan, ikuti senarai semak keselamatan segera kami. Bekukan akaun anda dan hubungi Talian Anti-Penipuan.",
			getScamHelp: "Dapatkan Bantuan Penipuan Sekarang"
		},
		about: {
			purposeBadge: "tujuan kami",
			purposeQuote: "\"Teknologi adalah untuk semua.\"",
			purposeLead: "Kami ingin menyediakan sumber yang jelas dan langkah demi langkah agar teknologi lebih mudah diakses, mengurangkan ketakutan, dan membina kebebasan warga emas dalam dunia digital.",
			differentTitle: "Apa yang membezakan kami",
			safeTitle: "Selamat",
			safeBody: "Internet boleh menakutkan. Kami mahu menjadi sumber yang boleh dipercayai untuk mengajar anda mengenal pasti risiko dan melindungi privasi anda.",
			simpleTitle: "Mudah",
			simpleBody: "Dengan fon yang mudah dibaca, navigasi ringkas dan arahan tanpa jargon. Antara muka kami direka untuk warga emas seperti anda membina kemahiran digital!",
			teamTitle: "Kenali pasukan kami",
			scrollHint: "Tatal untuk lihat lagi →",
			ctaTitle: "Bersedia untuk mula belajar?",
			ctaLead: "Terokai sumber mudah diikuti yang direka khas untuk anda.",
			ctaButton: "Lihat Portal Pembelajaran",
			readMore: "Baca lagi",
			readLess: "Tutup"
		},
		team: {
			christine: {
				name: "Christine",
				role: "Pereka Utama",
				bio: "Saya bersemangat menggabungkan kemahiran organisasi dengan keupayaan teknikal untuk meningkatkan kecekapan dan menyokong orang di belakang tabir."
			},
			ekhong: {
				name: "Ek Hong",
				role: "Pakar pangkalan data",
				bio: "Dengan kepakaran dalam data, pembelajaran mesin dan pembangunan ejen, saya pakar merapatkan jurang antara teknologi kompleks dan strategi praktikal. Pendekatan saya menggabungkan minda perundingan dengan fokus membina sistem yang boleh dipercayai dan bersedia untuk masa depan."
			},
			kelvin: {
				name: "Kelvin",
				role: "Pakar AI",
				bio: "Bersemangat membina penyelesaian SaaS dan sistem AI untuk masalah dunia sebenar, saya membawa rekod terbukti dalam jualan berprestasi tinggi dan usahawan."
			},
			kimshee: {
				name: "Kim Shee",
				role: "Pakar infrastruktur",
				bio: "Saya komited merapatkan disiplin infrastruktur dengan pengetahuan pembangunan baharu untuk membina aplikasi selamat dan boleh skala untuk fintech dan Web3, sambil menyampaikan penyelesaian boleh dipercayai dalam persekitaran kritikal semasa peralihan kerjaya ke pembangunan mudah alih dan web moden."
			}
		},
		emergency: {
			title: "Bantuan Kecemasan",
			lead: "Jika anda terfikir telah ditipu, kekal tenang dan ikuti langkah-langkah ini dengan segera.",
			step1Title: "Hubungi Bank Anda Segera",
			step1Body: "Minta mereka membekukan akaun dan kad kredit anda. Lakukan ini walaupun anda belum pasti.",
			step2Title: "Hubungi Talian Anti-Penipuan",
			step2Body: "Dapatkan nasihat pakar polis tentang langkah seterusnya.",
			step2Call: "Hubungi 1800-722-6688",
			step2Availability: "Tersedia 24/7 untuk laporan penipuan.",
			step3Title: "Buat Laporan Polis",
			step3Body: "Pergi ke Pusat Polis Kejiranan terdekat atau lapor dalam talian.",
			step3Button: "Hantar Laporan Dalam Talian",
			backHome: "Kembali ke Laman Utama"
		},
		login: {
			backHome: "← Kembali ke Laman Utama",
			welcomeBack: "Selamat Kembali",
			signInSubtitle: "Log masuk ke akaun anda",
			emailLabel: "Alamat e-mel",
			emailPlaceholder: "you@example.com",
			passwordLabel: "Kata laluan",
			passwordPlaceholder: "Masukkan kata laluan anda",
			signIn: "Log Masuk",
			signingIn: "Sedang log masuk…",
			noAccount: "Belum mempunyai akaun?",
			registerLink: "Daftar →",
			close: "Tutup",
			errors: {
				invalidCredentials: "E-mel atau kata laluan tidak sah.",
				generic: "Sesuatu tidak kena. Sila cuba lagi.",
				network: "Tidak dapat menyambung ke pelayan. Sila semak sambungan anda."
			},
			info: {
				expired: "Sesi anda telah tamat. Sila log masuk semula untuk meneruskan.",
				unauthorized: "Anda mesti log masuk untuk melihat halaman itu."
			}
		},
		register: {
			backHome: "← Kembali ke Laman Utama",
			createAccount: "Cipta Akaun Anda",
			joinSubtitle: "Sertai Silver Guide hari ini — percuma",
			nameLabel: "Nama Penuh",
			namePlaceholder: "Nama anda",
			emailLabel: "Alamat e-mel",
			emailPlaceholder: "you@example.com",
			passwordLabel: "Kata laluan",
			passwordPlaceholder: "Cipta kata laluan",
			passwordHint: "Mesti sekurang-kurangnya 8 aksara.",
			confirmLabel: "Sahkan Kata Laluan",
			confirmPlaceholder: "Ulang kata laluan anda",
			createButton: "Cipta Akaun",
			creating: "Sedang mencipta akaun…",
			hasAccount: "Sudah mempunyai akaun?",
			signInLink: "Log Masuk →",
			close: "Tutup",
			errors: {
				nameRequired: "Sila masukkan nama anda.",
				emailInvalid: "Sila masukkan alamat e-mel yang sah.",
				passwordMin: "Kata laluan mesti sekurang-kurangnya 8 aksara.",
				confirmMismatch: "Kata laluan tidak sepadan.",
				emailExists: "Akaun dengan e-mel itu sudah wujud.",
				checkInput: "Sila semak input anda dan cuba lagi.",
				generic: "Sesuatu tidak kena. Sila cuba lagi.",
				network: "Tidak dapat menyambung ke pelayan. Sila semak sambungan anda."
			}
		},
		toolbar: { ariaLabel: "Pilih bahasa" }
	},
	ta: {
		nav: {
			home: "முகப்பு",
			learn: "கற்றல்",
			about: "எங்களைப் பற்றி",
			editor: "எடிட்டர்",
			admin: "நிர்வாகம்",
			helpLine: "🚨 உதவி வழி",
			signIn: "உள்நுழை",
			register: "பதிவு",
			logOut: "வெளியேறு",
			toggleNav: "வழிசெலுத்தலை மாற்று",
			profile: "சுயவிவரம்"
		},
		footer: {
			tagline: "டிஜிட்டல் உலகில் நீங்கள் சுலபமாக செல்ல உதவுகிறோம்",
			copyright: "© 2026 சில்வர் கைடு வலைத்தளம், அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
			contactUs: "எங்களை தொடர்பு கொள்ளுங்கள்",
			aboutUs: "எங்களைப் பற்றி",
			faqs: "அடிக்கடி கேட்கப்படும் கேள்விகள்"
		},
		home: {
			heroAlt: "புன்னகையுடன் ஸ்மார்ட்போன் பயன்படுத்தும் முதியப் பெண்",
			badge: "சில்வர் கைடுக்கு வரவேற்கிறோம்",
			title: "நம்பிக்கையுடன் டிஜிட்டல் உலகத்தை ஏற்றுக்கொள்ளுங்கள்",
			lead: "சில்வர் கைடில், தொழில்நுட்பத்தை கற்றல் எளிமையாகவும் பாதுகாப்பாகவும் வேடிக்கையாகவும் ஆக்குகிறோம். ஸ்மார்ட்போன் பயன்பாடு, குடும்பத்துடன் தொடர்பு, ஆன்லைன் மோசடிகளை அறிதல் போன்ற எளிய வழிகாட்டிகளை ஆராயுங்கள்.",
			startLearning: "கற்றலைத் தொடங்கு",
			emergencyHelpLine: "🚨 அவசர உதவி வழி",
			latestArticles: "சமீபத்திய கட்டுரைகள்",
			latestArticlesLead: "எங்கள் புதிய வழிகாட்டிகளைக் கண்டறியுங்கள். கீழே வகையைத் தேர்ந்தெடுத்து முதியர்களுக்காக வடிவமைக்கப்பட்ட தெளிவான கட்டுரைகளைப் பாருங்கள்.",
			tabTech: "தொழில்நுட்ப அடிப்படை",
			tabScam: "மோசடி விழிப்புணர்வு",
			viewAllTech: "அனைத்து தொழில்நுட்ப அடிப்படை வழிகாட்டிகளும் →",
			viewAllScam: "அனைத்து மோசடி விழிப்புணர்வு வழிகாட்டிகளும் →",
			noGuidesTitle: "தற்போது வழிகாட்டிகள் இல்லை",
			noGuidesBody: "புதிய பயிற்சிகளை உருவாக்கி வருகிறோம். பின்னர் மீண்டும் பாருங்கள்!",
			emergencyBadge: "அவசர உதவி",
			emergencyTitle: "மோசடியாக நினைக்கிறீர்களா?",
			emergencySubtitle: "பதற வேண்டாம். படிப்படியாக உதவுகிறோம்.",
			emergencyBody: "வங்கி விவரங்கள், OTP அல்லது சந்தேகத்திற்குரிய நபருக்கு பணம் அனுப்பியிருந்தால், உடனடி பாதுகாப்பு பட்டியலைப் பின்பற்றுங்கள். கணக்குகளை முடக்கி மோசடி எதிர்ப்பு ஹாட்லைனை தொடர்பு கொள்ளுங்கள்.",
			getScamHelp: "இப்போது மோசடி உதவி பெறுங்கள்"
		},
		about: {
			purposeBadge: "எங்கள் நோக்கம்",
			purposeQuote: "\"தொழில்நுட்பம் அனைவருக்கும்.\"",
			purposeLead: "தொழில்நுட்பத்தை அணுகக்கூடியதாக்கி, பயத்தைக் குறைத்து, டிஜிட்டல் உலகில் முதியர்களின் சுயாதீனத்தை வளர்க்க தெளிவான படிப்படி வளங்களை வழங்க விரும்புகிறோம்.",
			differentTitle: "எங்களை வேறுபடுத்துவது",
			safeTitle: "பாதுகாப்பு",
			safeBody: "இணையம் பயமுறுத்தலாக இருக்கலாம். அபாயங்களைக் கண்டறிந்து தனியுரிமையைப் பாதுகாக்க உதவும் நம்பகமான மூலமாக இருக்க விரும்புகிறோம்.",
			simpleTitle: "எளிமை",
			simpleBody: "படிக்க எளிய எழுத்துருக்கள், எளிய வழிசெலுத்தல், சொல் சுற்றுச்சொல் இல்லா வழிமுறைகள். முதியர்களான உங்களுக்காக டிஜிட்டல் திறன்களை வளர்க்க வடிவமைக்கப்பட்டது!",
			teamTitle: "எங்கள் குழுவை சந்திப்பீர்கள்",
			scrollHint: "மேலும் பார்க்க உருட்டு →",
			ctaTitle: "கற்றலைத் தொடங்க தயாரா?",
			ctaLead: "உங்களுக்காக வடிவமைக்கப்பட்ட எளிய வளங்களை ஆராயுங்கள்.",
			ctaButton: "கற்றல் போர்டலைப் பார்",
			readMore: "மேலும் படி",
			readLess: "குறைவாகக் காட்டு"
		},
		team: {
			christine: {
				name: "Christine",
				role: "முதன்மை வடிவமைப்பாளர்",
				bio: "ஒழுங்கமைப்பு திறன்களை தொழில்நுட்ப திறன்களுடன் இணைத்து செயல்திறனை மேம்படுத்தவும் பின்னணியில் மக்களுக்கு உதவவும் ஆர்வமுள்ளவர்."
			},
			ekhong: {
				name: "Ek Hong",
				role: "தரவுத்தள நிபுணர்",
				bio: "தரவு, இயந்திரக் கற்றல் மற்றும் ஏஜென்ட் மேம்பாட்டில் நிபுணத்துவம். சிக்கலான தொழில்நுட்பத்திற்கும் நடைமுறை உத்திக்கும் இடையே இணைப்பு. நம்பகமான, எதிர்காலத்திற்கு தயாரான அமைப்புகளை உருவாக்குகிறேன்."
			},
			kelvin: {
				name: "Kelvin",
				role: "செயற்கை நுண்ணறிவு நிபுணர்",
				bio: "உண்மையான பிரச்சினைகளுக்கு SaaS மற்றும் AI அமைப்புகள் உருவாக்குவதில் ஆர்வம். உயர் செயல்திறன் விற்பனை மற்றும் தொழில்முனைவு அனுபவம்."
			},
			kimshee: {
				name: "Kim Shee",
				role: "உள்கட்டமைப்பு நிபுணர்",
				bio: "உள்கட்டமைப்பு ஒழுக்கத்தைப் புதிய மேம்பாட்டு அறிவுடன் இணைத்து fintech மற்றும் Web3-க்கு பாதுகாப்பான, விரிவாக்கக்கூடிய பயன்பாடுகள் உருவாக்குகிறேன். நடுத்த வயது மாற்றத்தில் நம்பகமான தீர்வுகள் வழங்குகிறேன்."
			}
		},
		emergency: {
			title: "அவசர உதவி",
			lead: "மோசடியாக நினைத்தால், அமைதியாக இருந்து உடனே இந்த படிகளைப் பின்பற்றுங்கள்.",
			step1Title: "உடனே உங்கள் வங்கியை அழையுங்கள்",
			step1Body: "கணக்குகள் மற்றும் கிரெடிட் கார்டுகளை முடக்குமாறு கேளுங்கள். உறுதியில்லாவிட்டாலும் செய்யுங்கள்.",
			step2Title: "மோசடி எதிர்ப்பு ஹாட்லைனை அழையுங்கள்",
			step2Body: "அடுத்து என்ன செய்வது என்று போலீஸ் நிபுணர்களிடம் ஆலோசனை பெறுங்கள்.",
			step2Call: "1800-722-6688 அழையுங்கள்",
			step2Availability: "மோசடி புகார்களுக்கு 24/7 கிடைக்கும்.",
			step3Title: "போலீஸ் புகார் செய்யுங்கள்",
			step3Body: "அருகிலுள்ள அண்டை போலீஸ் மையத்திற்குச் செல்லுங்கள் அல்லது ஆன்லைனில் புகார் செய்யுங்கள்.",
			step3Button: "ஆன்லைன் புகார் சமர்ப்பி",
			backHome: "முகப்புக்குத் திரும்பு"
		},
		login: {
			backHome: "← முகப்புக்குத் திரும்பு",
			welcomeBack: "மீண்டும் வரவேற்கிறோம்",
			signInSubtitle: "உங்கள் கணக்கில் உள்நுழையுங்கள்",
			emailLabel: "மின்னஞ்சல் முகவரி",
			emailPlaceholder: "you@example.com",
			passwordLabel: "கடவுச்சொல்",
			passwordPlaceholder: "கடவுச்சொல்லை உள்ளிடுங்கள்",
			signIn: "உள்நுழை",
			signingIn: "உள்நுழைகிறது…",
			noAccount: "கணக்கு இல்லையா?",
			registerLink: "பதிவு →",
			close: "மூடு",
			errors: {
				invalidCredentials: "மின்னஞ்சல் அல்லது கடவுச்சொல் தவறானது.",
				generic: "ஏதோ தவறு ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.",
				network: "சேவையகத்துடன் இணைக்க முடியவில்லை. இணைப்பைச் சரிபார்க்கவும்."
			},
			info: {
				expired: "உங்கள் அமர்வு காலாவதியானது. தொடர மீண்டும் உள்நுழையுங்கள்.",
				unauthorized: "அந்தப் பக்கத்தைப் பார்க்க உள்நுழைவது அவசியம்."
			}
		},
		register: {
			backHome: "← முகப்புக்குத் திரும்பு",
			createAccount: "கணக்கை உருவாக்கு",
			joinSubtitle: "இன்றே சில்வர் கைடில் சேருங்கள் — இலவசம்",
			nameLabel: "முழு பெயர்",
			namePlaceholder: "உங்கள் பெயர்",
			emailLabel: "மின்னஞ்சல் முகவரி",
			emailPlaceholder: "you@example.com",
			passwordLabel: "கடவுச்சொல்",
			passwordPlaceholder: "கடவுச்சொல் உருவாக்கு",
			passwordHint: "குறைந்தது 8 எழுத்துகள் இருக்க வேண்டும்.",
			confirmLabel: "கடவுச்சொலை உறுதிப்படுத்து",
			confirmPlaceholder: "கடவுச்சொல்லை மீண்டும் உள்ளிடுங்கள்",
			createButton: "கணக்கை உருவாக்கு",
			creating: "கணக்கு உருவாக்கப்படுகிறது…",
			hasAccount: "ஏற்கனவே கணக்கு உள்ளதா?",
			signInLink: "உள்நுழை →",
			close: "மூடு",
			errors: {
				nameRequired: "உங்கள் பெயரை உள்ளிடுங்கள்.",
				emailInvalid: "செல்லுபடியான மின்னஞ்சல் முகவரியை உள்ளிடுங்கள்.",
				passwordMin: "கடவுச்சொல் குறைந்தது 8 எழுத்துகள் இருக்க வேண்டும்.",
				confirmMismatch: "கடவுச்சொற்கள் பொருந்தவில்லை.",
				emailExists: "அந்த மின்னஞ்சலில் ஏற்கனவே கணக்கு உள்ளது.",
				checkInput: "உள்ளீட்டைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.",
				generic: "ஏதோ தவறு ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.",
				network: "சேவையகத்துடன் இணைக்க முடியவில்லை. இணைப்பைச் சரிபார்க்கவும்."
			}
		},
		toolbar: { ariaLabel: "மொழியைத் தேர்ந்தெடுக்கவும்" }
	}
};
//#endregion
//#region app/i18n/I18nContext.tsx
function readStoredLanguage() {
	if (typeof window === "undefined") return "en";
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored === "en" || stored === "zh" || stored === "ms" || stored === "ta") return stored;
	return "en";
}
var I18nContext = createContext(null);
function I18nProvider({ children }) {
	const [language, setLanguageState] = useState(readStoredLanguage);
	const setLanguage = useCallback((lang) => {
		setLanguageState(lang);
		localStorage.setItem(STORAGE_KEY, lang);
	}, []);
	const t = translations[language];
	useEffect(() => {
		document.documentElement.lang = HTML_LANG[language];
	}, [language]);
	const value = useMemo(() => ({
		language,
		setLanguage,
		t
	}), [
		language,
		setLanguage,
		t
	]);
	return /* @__PURE__ */ jsx(I18nContext.Provider, {
		value,
		children
	});
}
function useI18n() {
	const ctx = useContext(I18nContext);
	if (!ctx) throw new Error("useI18n must be used within I18nProvider");
	return ctx;
}
//#endregion
//#region app/components/Navbar.tsx
function Navbar() {
	const { t } = useI18n();
	const [user, setUser] = useState(null);
	const [showProfile, setShowProfile] = useState(false);
	useEffect(() => {
		setUser(getUser());
	}, [useLocation()]);
	async function handleLogout() {
		try {
			await fetch("/api/auth/logout", {
				method: "POST",
				credentials: "include"
			});
		} catch {}
		clearAuth();
		window.location.href = "/";
	}
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("nav", {
		className: "navbar sticky-top navbar-expand-md navbar-light border-bottom",
		style: { backgroundColor: "#f8f9fa" },
		children: /* @__PURE__ */ jsxs("div", {
			className: "container",
			children: [
				/* @__PURE__ */ jsx(Link, {
					className: "me-3",
					to: "/",
					children: /* @__PURE__ */ jsx("img", {
						src: "/imgs/logo.svg",
						width: 60,
						height: 60,
						className: "d-inline-block align-text-top",
						alt: "SilverGuide Logo"
					})
				}),
				/* @__PURE__ */ jsx("button", {
					className: "navbar-toggler",
					type: "button",
					"data-bs-toggle": "collapse",
					"data-bs-target": "#navbarMain",
					"aria-controls": "navbarMain",
					"aria-expanded": "false",
					"aria-label": t.nav.toggleNav,
					children: /* @__PURE__ */ jsx("span", { className: "navbar-toggler-icon" })
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "collapse navbar-collapse",
					id: "navbarMain",
					children: [/* @__PURE__ */ jsxs("ul", {
						className: "navbar-nav align-items-center mx-auto mb-2 mb-lg-0",
						children: [
							/* @__PURE__ */ jsx("li", {
								className: "nav-item",
								children: /* @__PURE__ */ jsx(NavLink, {
									className: ({ isActive }) => `nav-link${isActive ? " active" : ""}`,
									to: "/",
									end: true,
									children: t.nav.home
								})
							}),
							/* @__PURE__ */ jsx("li", {
								className: "nav-item",
								children: /* @__PURE__ */ jsx(NavLink, {
									className: ({ isActive }) => `nav-link${isActive ? " active" : ""}`,
									to: "/articles",
									children: t.nav.learn
								})
							}),
							/* @__PURE__ */ jsx("li", {
								className: "nav-item",
								children: /* @__PURE__ */ jsx(NavLink, {
									className: ({ isActive }) => `nav-link${isActive ? " active" : ""}`,
									to: "/about",
									children: t.nav.about
								})
							}),
							user?.staff && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("li", {
								className: "nav-item",
								children: /* @__PURE__ */ jsx(NavLink, {
									className: ({ isActive }) => `nav-link${isActive ? " active" : ""}`,
									to: "/editor",
									children: t.nav.editor
								})
							}), /* @__PURE__ */ jsx("li", {
								className: "nav-item",
								children: /* @__PURE__ */ jsx(NavLink, {
									className: ({ isActive }) => `nav-link${isActive ? " active" : ""}`,
									to: "/admin",
									children: t.nav.admin
								})
							})] })
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "d-flex align-items-center gap-2",
						children: [/* @__PURE__ */ jsx(Link, {
							className: "text-danger fw-bold me-3 text-decoration-none",
							to: "/emergency",
							children: t.nav.helpLine
						}), user ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("button", {
							className: "btn btn-link p-0",
							title: t.nav.profile,
							onClick: () => setShowProfile(true),
							children: /* @__PURE__ */ jsx("i", { className: "bi bi-person-circle fs-4" })
						}), /* @__PURE__ */ jsx("button", {
							className: "btn btn-outline-secondary btn-sm",
							onClick: handleLogout,
							children: t.nav.logOut
						})] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Link, {
							className: "btn btn-outline-primary btn-sm",
							to: "/login",
							children: t.nav.signIn
						}), /* @__PURE__ */ jsx(Link, {
							className: "btn btn-primary btn-sm",
							to: "/register",
							children: t.nav.register
						})] })]
					})]
				})
			]
		})
	}), showProfile && /* @__PURE__ */ jsx(ProfileModal, { onClose: () => setShowProfile(false) })] });
}
//#endregion
//#region app/components/Footer.tsx
function Footer() {
	const { t } = useI18n();
	return /* @__PURE__ */ jsx("footer", {
		className: "py-5 border-top",
		style: { backgroundColor: "#f8f9fa" },
		children: /* @__PURE__ */ jsx("div", {
			className: "container",
			children: /* @__PURE__ */ jsxs("div", {
				className: "row",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "col-md-6 text-start",
					children: [
						/* @__PURE__ */ jsx(Link, {
							className: "d-flex align-items-center mb-3 link-body-emphasis text-decoration-none",
							to: "/",
							children: /* @__PURE__ */ jsx("img", {
								src: "/imgs/logo.svg",
								width: 60,
								height: 60,
								className: "d-inline-block align-text-top",
								alt: "SilverGuide Logo"
							})
						}),
						/* @__PURE__ */ jsx("h6", {
							className: "text-body-secondary",
							children: t.footer.tagline
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-muted",
							children: t.footer.copyright
						})
					]
				}), /* @__PURE__ */ jsx("div", {
					className: "col-md-6 text-end",
					children: /* @__PURE__ */ jsxs("ul", {
						className: "list-unstyled mb-0",
						children: [
							/* @__PURE__ */ jsx("li", {
								className: "nav-item mb-2",
								children: /* @__PURE__ */ jsx("a", {
									href: "#contact",
									className: "nav-link p-0 text-body-secondary",
									children: t.footer.contactUs
								})
							}),
							/* @__PURE__ */ jsx("li", {
								className: "nav-item mb-2",
								children: /* @__PURE__ */ jsx(Link, {
									to: "/about",
									className: "nav-link p-0 text-body-secondary",
									children: t.footer.aboutUs
								})
							}),
							/* @__PURE__ */ jsx("li", {
								className: "nav-item mb-2",
								children: /* @__PURE__ */ jsx("a", {
									href: "#faq",
									className: "nav-link p-0 text-body-secondary",
									children: t.footer.faqs
								})
							})
						]
					})
				})]
			})
		})
	});
}
//#endregion
//#region app/components/LanguageToolbar.tsx
var HOVER_ZONE_WIDTH = 300;
var HOVER_ZONE_HEIGHT = 160;
function LanguageToolbar() {
	const { pathname } = useLocation();
	const { language, setLanguage, t } = useI18n();
	const [hiddenByScroll, setHiddenByScroll] = useState(false);
	const [nearHover, setNearHover] = useState(false);
	const scrollTimer = useRef(null);
	const isHiddenRoute = pathname.startsWith("/admin") || pathname.startsWith("/editor");
	const handleScroll = useCallback(() => {
		setHiddenByScroll(true);
		if (scrollTimer.current) clearTimeout(scrollTimer.current);
	}, []);
	const handleMouseMove = useCallback((e) => {
		setNearHover(e.clientX >= window.innerWidth - HOVER_ZONE_WIDTH && e.clientY <= HOVER_ZONE_HEIGHT);
	}, []);
	useEffect(() => {
		if (isHiddenRoute) return;
		window.addEventListener("scroll", handleScroll, { passive: true });
		window.addEventListener("mousemove", handleMouseMove, { passive: true });
		return () => {
			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, [
		isHiddenRoute,
		handleScroll,
		handleMouseMove
	]);
	if (isHiddenRoute) return null;
	return /* @__PURE__ */ jsx("div", {
		className: `language-toolbar${!hiddenByScroll || nearHover ? " language-toolbar--visible" : ""}`,
		role: "group",
		"aria-label": t.toolbar.ariaLabel,
		children: LANGUAGES.map(({ code, label }) => /* @__PURE__ */ jsx("button", {
			type: "button",
			className: `language-toolbar__btn${language === code ? " language-toolbar__btn--active" : ""}`,
			onClick: () => setLanguage(code),
			"aria-pressed": language === code,
			"aria-label": label,
			title: label,
			children: /* @__PURE__ */ jsx("span", {
				className: "language-toolbar__label",
				children: label
			})
		}, code))
	});
}
//#endregion
//#region app/routes/layout.tsx
var layout_exports = /* @__PURE__ */ __exportAll({ default: () => layout_default });
var layout_default = UNSAFE_withComponentProps(function Layout() {
	return /* @__PURE__ */ jsxs(I18nProvider, { children: [
		/* @__PURE__ */ jsx(LanguageToolbar, {}),
		/* @__PURE__ */ jsx(Navbar, {}),
		/* @__PURE__ */ jsx(Outlet, {}),
		/* @__PURE__ */ jsx(Footer, {})
	] });
});
//#endregion
//#region app/components/PageSpinner.tsx
function PageSpinner() {
	return /* @__PURE__ */ jsx("div", {
		className: "container py-5 text-center text-muted",
		children: /* @__PURE__ */ jsx("div", {
			className: "spinner-border text-primary",
			role: "status",
			children: /* @__PURE__ */ jsx("span", {
				className: "visually-hidden",
				children: "Loading…"
			})
		})
	});
}
//#endregion
//#region app/components/ArticleCard.tsx
function slugify$1(title) {
	return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
function ArticleCard({ a }) {
	return /* @__PURE__ */ jsx("div", {
		className: "col",
		children: /* @__PURE__ */ jsxs("div", {
			className: "card article-card shadow-sm h-100",
			children: [a.imgUrl && /* @__PURE__ */ jsx("img", {
				src: a.imgUrl,
				className: "card-img-top",
				alt: a.title,
				style: {
					maxHeight: "140px",
					objectFit: "cover"
				}
			}), /* @__PURE__ */ jsxs("div", {
				className: "card-body d-flex flex-column p-3",
				children: [
					a.topicName && /* @__PURE__ */ jsx("span", {
						className: "badge bg-secondary mb-2 align-self-start",
						children: a.topicName
					}),
					/* @__PURE__ */ jsx("h6", {
						className: "card-title fw-bold",
						children: a.title
					}),
					a.description && /* @__PURE__ */ jsx("p", {
						className: "card-text text-muted flex-grow-1 small",
						children: a.description
					}),
					/* @__PURE__ */ jsx(Link, {
						to: `/articles/${a.id}/${slugify$1(a.title)}`,
						className: "btn btn-primary btn-sm btn-read mt-2",
						children: "Read Guide"
					})
				]
			})]
		})
	});
}
//#endregion
//#region app/routes/home.tsx
var home_exports = /* @__PURE__ */ __exportAll({
	HydrateFallback: () => HydrateFallback$4,
	clientLoader: () => clientLoader$4,
	default: () => home_default,
	meta: () => meta$8
});
function meta$8() {
	return [{ title: "Silver Guide - Home" }, {
		name: "description",
		content: "Helping seniors navigate the digital world with confidence"
	}];
}
async function fetchTopic$1(topicId) {
	try {
		const r = await apiFetch(`/api/articles?topicId=${topicId}`);
		if (!r.ok) return [];
		return r.json();
	} catch {
		return [];
	}
}
async function clientLoader$4() {
	const [tech, scam] = await Promise.all([fetchTopic$1(1), fetchTopic$1(2)]);
	return {
		tech,
		scam
	};
}
var HydrateFallback$4 = UNSAFE_withHydrateFallbackProps(function HydrateFallback() {
	return /* @__PURE__ */ jsx(PageSpinner, {});
});
var home_default = UNSAFE_withComponentProps(function Home() {
	const { t } = useI18n();
	const { tech, scam } = useLoaderData();
	const [activeTab, setActiveTab] = useState("tech");
	const activeArticles = activeTab === "tech" ? tech : scam;
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx("div", {
			className: "container col-xxl-8 px-4 py-5",
			children: /* @__PURE__ */ jsxs("div", {
				className: "row flex-lg-row-reverse align-items-center g-5 py-5",
				children: [/* @__PURE__ */ jsx("div", {
					className: "col-10 col-sm-8 col-lg-6",
					children: /* @__PURE__ */ jsx("img", {
						src: "/imgs/herobanner-img.jpeg",
						className: "d-block mx-lg-auto img-fluid rounded-4 shadow-lg border border-2 border-dark",
						alt: t.home.heroAlt,
						width: 700,
						height: 500,
						loading: "lazy"
					})
				}), /* @__PURE__ */ jsxs("div", {
					className: "col-lg-6",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "badge rounded-pill px-3 py-2 mb-3 d-inline-block text-uppercase fw-bold",
							style: {
								backgroundColor: "#dfff6f",
								color: "#1a1a1a",
								border: "1px solid #1a1a1a",
								fontSize: "0.85rem"
							},
							children: t.home.badge
						}),
						/* @__PURE__ */ jsx("h1", {
							className: "display-4 fw-bold text-body-emphasis lh-sm mb-3",
							children: t.home.title
						}),
						/* @__PURE__ */ jsx("p", {
							className: "lead fs-5 text-secondary mb-4",
							style: { lineHeight: "1.6" },
							children: t.home.lead
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "d-grid gap-3 d-md-flex justify-content-md-start",
							children: [/* @__PURE__ */ jsxs("a", {
								href: "#learning-section",
								className: "btn btn-primary btn-lg px-4 py-3 rounded-pill fw-bold shadow-sm",
								children: [
									t.home.startLearning,
									" ",
									/* @__PURE__ */ jsx("i", { className: "bi bi-arrow-down-short ms-1" })
								]
							}), /* @__PURE__ */ jsx(Link, {
								to: "/emergency",
								className: "btn btn-outline-danger btn-lg px-4 py-3 rounded-pill fw-bold shadow-sm",
								children: t.home.emergencyHelpLine
							})]
						})
					]
				})]
			})
		}),
		/* @__PURE__ */ jsxs("div", {
			id: "learning-section",
			className: "px-4 pt-5 pb-2 my-5 text-center",
			children: [/* @__PURE__ */ jsx("h2", {
				className: "display-5 fw-bold text-body-emphasis",
				children: t.home.latestArticles
			}), /* @__PURE__ */ jsx("div", {
				className: "col-lg-6 mx-auto",
				children: /* @__PURE__ */ jsx("p", {
					className: "lead text-secondary mb-4",
					children: t.home.latestArticlesLead
				})
			})]
		}),
		/* @__PURE__ */ jsx("div", {
			className: "container mb-4",
			children: /* @__PURE__ */ jsx("div", {
				className: "d-flex justify-content-center",
				children: /* @__PURE__ */ jsx("ul", {
					className: "nav nav-pills p-1 bg-white border border-dark rounded-pill shadow-sm",
					style: { maxWidth: "fit-content" },
					children: ["tech", "scam"].map((tab) => /* @__PURE__ */ jsx("li", {
						className: "nav-item",
						children: /* @__PURE__ */ jsxs("button", {
							type: "button",
							className: `nav-link rounded-pill px-4 py-2 fw-bold d-flex align-items-center ${activeTab === tab ? "active bg-primary text-white" : "text-dark bg-transparent"}`,
							onClick: () => setActiveTab(tab),
							style: {
								transition: "all 0.2s ease-in-out",
								border: "none"
							},
							children: [tab === "tech" ? /* @__PURE__ */ jsx("i", { className: "bi bi-phone-vibrate me-2 fs-5" }) : /* @__PURE__ */ jsx("i", { className: "bi bi-shield-lock-fill me-2 fs-5" }), tab === "tech" ? t.home.tabTech : t.home.tabScam]
						})
					}, tab))
				})
			})
		}),
		/* @__PURE__ */ jsx("div", {
			className: "album pb-5",
			children: /* @__PURE__ */ jsx("div", {
				className: "container",
				children: activeArticles.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
					className: "row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 justify-content-center",
					children: activeArticles.slice(0, 4).map((a) => /* @__PURE__ */ jsx(ArticleCard, { a }, a.id))
				}), /* @__PURE__ */ jsx("div", {
					className: "text-center mt-5",
					children: /* @__PURE__ */ jsx(Link, {
						to: activeTab === "tech" ? "/articles/topic/1" : "/articles/topic/2",
						className: "btn btn-outline-primary btn-lg rounded-pill px-5 fw-bold shadow-sm animate-button",
						children: activeTab === "tech" ? t.home.viewAllTech : t.home.viewAllScam
					})
				})] }) : /* @__PURE__ */ jsxs("div", {
					className: "text-center py-5 text-muted bg-white border border-dark rounded-4 p-5 shadow-sm",
					style: {
						maxWidth: "500px",
						margin: "0 auto"
					},
					children: [
						/* @__PURE__ */ jsx("i", { className: "bi bi-journal-x fs-1 text-secondary mb-3 d-block" }),
						/* @__PURE__ */ jsx("h5", {
							className: "fw-bold",
							children: t.home.noGuidesTitle
						}),
						/* @__PURE__ */ jsx("p", {
							className: "small mb-0 text-secondary",
							children: t.home.noGuidesBody
						})
					]
				})
			})
		}),
		/* @__PURE__ */ jsx("div", {
			className: "container my-5 pb-5",
			children: /* @__PURE__ */ jsxs("div", {
				className: "p-4 p-md-5 rounded-5 border border-2 border-danger shadow-sm bg-white position-relative overflow-hidden",
				children: [/* @__PURE__ */ jsx("div", {
					className: "position-absolute end-0 bottom-0 opacity-10 d-none d-lg-block",
					style: {
						transform: "translate(10%, 10%)",
						pointerEvents: "none"
					},
					children: /* @__PURE__ */ jsx("i", {
						className: "bi bi-shield-fill-exclamation",
						style: {
							fontSize: "15rem",
							color: "#dc3545"
						}
					})
				}), /* @__PURE__ */ jsxs("div", {
					className: "row align-items-center position-relative",
					style: { zIndex: 1 },
					children: [/* @__PURE__ */ jsxs("div", {
						className: "col-lg-8 mb-4 mb-lg-0",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "d-flex align-items-center mb-3 flex-wrap gap-2",
								children: [/* @__PURE__ */ jsxs("span", {
									className: "badge bg-danger rounded-pill px-3 py-2 text-white fw-bold me-2",
									children: [
										/* @__PURE__ */ jsx("i", { className: "bi bi-exclamation-triangle-fill me-1" }),
										" ",
										t.home.emergencyBadge
									]
								}), /* @__PURE__ */ jsx("h3", {
									className: "fw-bold m-0 text-danger",
									children: t.home.emergencyTitle
								})]
							}),
							/* @__PURE__ */ jsx("h4", {
								className: "fw-bold mb-3",
								children: t.home.emergencySubtitle
							}),
							/* @__PURE__ */ jsx("p", {
								className: "lead mb-0 text-secondary",
								style: {
									maxWidth: "750px",
									fontSize: "1.1rem"
								},
								children: t.home.emergencyBody
							})
						]
					}), /* @__PURE__ */ jsx("div", {
						className: "col-lg-4 text-lg-end",
						children: /* @__PURE__ */ jsxs(Link, {
							to: "/emergency",
							className: "btn btn-danger btn-lg px-5 py-3 rounded-pill fw-bold shadow-lg w-100 w-lg-auto",
							children: [
								/* @__PURE__ */ jsx("i", { className: "bi bi-telephone-fill me-2" }),
								" ",
								t.home.getScamHelp
							]
						})
					})]
				})]
			})
		})
	] });
});
//#endregion
//#region app/routes/login.tsx
var login_exports = /* @__PURE__ */ __exportAll({
	default: () => login_default,
	meta: () => meta$7
});
function meta$7() {
	return [{ title: "Silver Guide - Sign In" }];
}
var login_default = UNSAFE_withComponentProps(function Login() {
	const { t } = useI18n();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorKey, setErrorKey] = useState(null);
	const [infoKey, setInfoKey] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	useEffect(() => {
		const reason = searchParams.get("reason");
		if (reason === "expired") setInfoKey("expired");
		else if (reason === "unauthorized") setInfoKey("unauthorized");
	}, [searchParams]);
	async function handleSubmit(e) {
		e.preventDefault();
		setErrorKey(null);
		setIsLoading(true);
		try {
			const res = await apiFetch("/api/auth/login", {
				method: "POST",
				body: JSON.stringify({
					email,
					password
				})
			});
			if (res.ok) {
				setAuth(await res.json());
				navigate("/");
			} else if (res.status === 401) setErrorKey("invalidCredentials");
			else setErrorKey("generic");
		} catch {
			setErrorKey("network");
		} finally {
			setIsLoading(false);
		}
	}
	return /* @__PURE__ */ jsx("div", {
		className: "min-vh-100 d-flex align-items-center py-5",
		children: /* @__PURE__ */ jsx("div", {
			className: "container",
			children: /* @__PURE__ */ jsx("div", {
				className: "row justify-content-center",
				children: /* @__PURE__ */ jsxs("div", {
					className: "col-12 col-sm-10 col-md-8 col-lg-5",
					children: [
						/* @__PURE__ */ jsx(Link, {
							to: "/",
							className: "btn btn-outline-secondary btn-sm mb-3",
							children: t.login.backHome
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white p-5",
							style: {
								borderRadius: "2rem",
								boxShadow: "0 1rem 3rem rgba(0,0,0,0.05)"
							},
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "text-center mb-4",
									children: [/* @__PURE__ */ jsx(Link, {
										to: "/",
										children: /* @__PURE__ */ jsx("img", {
											src: "/imgs/logo.svg",
											alt: "SilverGuide Logo",
											width: 64,
											height: 64,
											className: "mx-auto d-block"
										})
									}), /* @__PURE__ */ jsx("h3", {
										className: "fw-bold mt-3 mb-0",
										children: "Silver Guide"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mb-4",
									style: {
										borderLeft: "5px solid #dfff6f",
										paddingLeft: "1rem"
									},
									children: [/* @__PURE__ */ jsx("h5", {
										className: "fw-bold mb-1",
										children: t.login.welcomeBack
									}), /* @__PURE__ */ jsx("p", {
										className: "text-muted mb-0",
										children: t.login.signInSubtitle
									})]
								}),
								infoKey && /* @__PURE__ */ jsxs("div", {
									className: "alert alert-info alert-dismissible",
									role: "alert",
									children: [t.login.info[infoKey], /* @__PURE__ */ jsx("button", {
										type: "button",
										className: "btn-close",
										onClick: () => setInfoKey(null),
										"aria-label": t.login.close
									})]
								}),
								errorKey && /* @__PURE__ */ jsxs("div", {
									className: "alert alert-danger alert-dismissible",
									role: "alert",
									children: [t.login.errors[errorKey], /* @__PURE__ */ jsx("button", {
										type: "button",
										className: "btn-close",
										onClick: () => setErrorKey(null),
										"aria-label": t.login.close
									})]
								}),
								/* @__PURE__ */ jsxs("form", {
									onSubmit: handleSubmit,
									noValidate: true,
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "mb-3",
											children: [/* @__PURE__ */ jsx("label", {
												htmlFor: "email",
												className: "form-label fw-bold",
												children: t.login.emailLabel
											}), /* @__PURE__ */ jsx("input", {
												type: "email",
												id: "email",
												className: "form-control form-control-lg",
												value: email,
												onChange: (e) => setEmail(e.target.value),
												placeholder: t.login.emailPlaceholder,
												required: true,
												autoComplete: "email"
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "mb-3",
											children: [/* @__PURE__ */ jsx("label", {
												htmlFor: "password",
												className: "form-label fw-bold",
												children: t.login.passwordLabel
											}), /* @__PURE__ */ jsx("input", {
												type: "password",
												id: "password",
												className: "form-control form-control-lg",
												value: password,
												onChange: (e) => setPassword(e.target.value),
												placeholder: t.login.passwordPlaceholder,
												required: true,
												autoComplete: "current-password"
											})]
										}),
										/* @__PURE__ */ jsxs("button", {
											type: "submit",
											disabled: isLoading,
											className: "btn btn-primary btn-lg w-100 mt-2",
											children: [isLoading ? t.login.signingIn : t.login.signIn, isLoading && /* @__PURE__ */ jsx("span", {
												className: "spinner-border spinner-border-sm ms-2",
												role: "status",
												"aria-hidden": "true"
											})]
										})
									]
								})
							]
						}),
						/* @__PURE__ */ jsxs("p", {
							className: "text-center mt-4 text-muted",
							children: [
								t.login.noAccount,
								" ",
								/* @__PURE__ */ jsx(Link, {
									to: "/register",
									className: "fw-bold text-decoration-none",
									children: t.login.registerLink
								})
							]
						})
					]
				})
			})
		})
	});
});
//#endregion
//#region app/routes/register.tsx
var register_exports = /* @__PURE__ */ __exportAll({
	default: () => register_default,
	meta: () => meta$6
});
function meta$6() {
	return [{ title: "Silver Guide - Register" }];
}
var register_default = UNSAFE_withComponentProps(function Register() {
	const { t } = useI18n();
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");
	const [fieldErrors, setFieldErrors] = useState({});
	const [globalErrorKey, setGlobalErrorKey] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	function validate() {
		const errors = {};
		if (!name.trim()) errors.name = "nameRequired";
		if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "emailInvalid";
		if (password.length < 8) errors.password = "passwordMin";
		if (password !== confirm) errors.confirm = "confirmMismatch";
		return errors;
	}
	async function handleSubmit(e) {
		e.preventDefault();
		setGlobalErrorKey(null);
		const errors = validate();
		if (Object.keys(errors).length > 0) {
			setFieldErrors(errors);
			return;
		}
		setFieldErrors({});
		setIsLoading(true);
		try {
			const res = await apiFetch("/api/auth/register", {
				method: "POST",
				body: JSON.stringify({
					name: name.trim(),
					email: email.trim(),
					password
				})
			});
			if (res.status === 201) {
				setAuth(await res.json());
				navigate("/");
			} else if (res.status === 409) setGlobalErrorKey("emailExists");
			else if (res.status === 400) {
				const serverErrors = (await res.json()).errors;
				if (serverErrors) {
					const mapped = {};
					if (serverErrors.name) mapped.name = "nameRequired";
					if (serverErrors.email) mapped.email = "emailInvalid";
					if (serverErrors.password) mapped.password = "passwordMin";
					setFieldErrors(mapped);
				} else setGlobalErrorKey("checkInput");
			} else setGlobalErrorKey("generic");
		} catch {
			setGlobalErrorKey("network");
		} finally {
			setIsLoading(false);
		}
	}
	return /* @__PURE__ */ jsx("div", {
		className: "min-vh-100 d-flex align-items-center py-5",
		children: /* @__PURE__ */ jsx("div", {
			className: "container",
			children: /* @__PURE__ */ jsx("div", {
				className: "row justify-content-center",
				children: /* @__PURE__ */ jsxs("div", {
					className: "col-12 col-sm-10 col-md-8 col-lg-5",
					children: [
						/* @__PURE__ */ jsx(Link, {
							to: "/",
							className: "btn btn-outline-secondary btn-sm mb-3",
							children: t.register.backHome
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white p-5",
							style: {
								borderRadius: "2rem",
								boxShadow: "0 1rem 3rem rgba(0,0,0,0.05)"
							},
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "text-center mb-4",
									children: [/* @__PURE__ */ jsx(Link, {
										to: "/",
										children: /* @__PURE__ */ jsx("img", {
											src: "/imgs/logo.svg",
											alt: "SilverGuide Logo",
											width: 64,
											height: 64,
											className: "mx-auto d-block"
										})
									}), /* @__PURE__ */ jsx("h3", {
										className: "fw-bold mt-3 mb-0",
										children: "Silver Guide"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mb-4",
									style: {
										borderLeft: "5px solid #75adf6",
										paddingLeft: "1rem"
									},
									children: [/* @__PURE__ */ jsx("h5", {
										className: "fw-bold mb-1",
										children: t.register.createAccount
									}), /* @__PURE__ */ jsx("p", {
										className: "text-muted mb-0",
										children: t.register.joinSubtitle
									})]
								}),
								globalErrorKey && /* @__PURE__ */ jsxs("div", {
									className: "alert alert-danger alert-dismissible",
									role: "alert",
									children: [t.register.errors[globalErrorKey], /* @__PURE__ */ jsx("button", {
										type: "button",
										className: "btn-close",
										onClick: () => setGlobalErrorKey(null),
										"aria-label": t.register.close
									})]
								}),
								/* @__PURE__ */ jsxs("form", {
									onSubmit: handleSubmit,
									noValidate: true,
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "mb-3",
											children: [
												/* @__PURE__ */ jsx("label", {
													htmlFor: "name",
													className: "form-label fw-bold",
													children: t.register.nameLabel
												}),
												/* @__PURE__ */ jsx("input", {
													type: "text",
													id: "name",
													className: `form-control form-control-lg${fieldErrors.name ? " is-invalid" : ""}`,
													value: name,
													onChange: (e) => setName(e.target.value),
													placeholder: t.register.namePlaceholder,
													required: true,
													autoComplete: "name"
												}),
												fieldErrors.name && /* @__PURE__ */ jsx("div", {
													className: "invalid-feedback",
													children: t.register.errors[fieldErrors.name]
												})
											]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "mb-3",
											children: [
												/* @__PURE__ */ jsx("label", {
													htmlFor: "email",
													className: "form-label fw-bold",
													children: t.register.emailLabel
												}),
												/* @__PURE__ */ jsx("input", {
													type: "email",
													id: "email",
													className: `form-control form-control-lg${fieldErrors.email ? " is-invalid" : ""}`,
													value: email,
													onChange: (e) => setEmail(e.target.value),
													placeholder: t.register.emailPlaceholder,
													required: true,
													autoComplete: "email"
												}),
												fieldErrors.email && /* @__PURE__ */ jsx("div", {
													className: "invalid-feedback",
													children: t.register.errors[fieldErrors.email]
												})
											]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "mb-3",
											children: [
												/* @__PURE__ */ jsx("label", {
													htmlFor: "password",
													className: "form-label fw-bold",
													children: t.register.passwordLabel
												}),
												/* @__PURE__ */ jsx("input", {
													type: "password",
													id: "password",
													className: `form-control form-control-lg${fieldErrors.password ? " is-invalid" : ""}`,
													value: password,
													onChange: (e) => setPassword(e.target.value),
													placeholder: t.register.passwordPlaceholder,
													required: true,
													minLength: 8,
													autoComplete: "new-password"
												}),
												/* @__PURE__ */ jsx("div", {
													className: "form-text",
													children: t.register.passwordHint
												}),
												fieldErrors.password && /* @__PURE__ */ jsx("div", {
													className: "invalid-feedback",
													children: t.register.errors[fieldErrors.password]
												})
											]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "mb-4",
											children: [
												/* @__PURE__ */ jsx("label", {
													htmlFor: "confirmPassword",
													className: "form-label fw-bold",
													children: t.register.confirmLabel
												}),
												/* @__PURE__ */ jsx("input", {
													type: "password",
													id: "confirmPassword",
													className: `form-control form-control-lg${fieldErrors.confirm ? " is-invalid" : ""}`,
													value: confirm,
													onChange: (e) => setConfirm(e.target.value),
													placeholder: t.register.confirmPlaceholder,
													required: true,
													autoComplete: "new-password"
												}),
												fieldErrors.confirm && /* @__PURE__ */ jsx("div", {
													className: "invalid-feedback",
													children: t.register.errors[fieldErrors.confirm]
												})
											]
										}),
										/* @__PURE__ */ jsxs("button", {
											type: "submit",
											disabled: isLoading,
											className: "btn btn-primary btn-lg w-100",
											children: [isLoading ? t.register.creating : t.register.createButton, isLoading && /* @__PURE__ */ jsx("span", {
												className: "spinner-border spinner-border-sm ms-2",
												role: "status",
												"aria-hidden": "true"
											})]
										})
									]
								})
							]
						}),
						/* @__PURE__ */ jsxs("p", {
							className: "text-center mt-4 text-muted",
							children: [
								t.register.hasAccount,
								" ",
								/* @__PURE__ */ jsx(Link, {
									to: "/login",
									className: "fw-bold text-decoration-none",
									children: t.register.signInLink
								})
							]
						})
					]
				})
			})
		})
	});
});
//#endregion
//#region app/components/SearchBar.tsx
function SearchBar() {
	const [searchParams] = useSearchParams();
	const submit = useSubmit();
	const [query, setQuery] = useState(searchParams.get("q") || "");
	useEffect(() => {
		setQuery(searchParams.get("q") || "");
	}, [searchParams]);
	const handleSubmit = (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		if (!formData.get("q")) formData.delete("q");
		submit(formData, {
			action: "/articles",
			method: "get"
		});
	};
	return /* @__PURE__ */ jsx("div", {
		className: "search-bar-container mb-5",
		children: /* @__PURE__ */ jsxs(Form, {
			onSubmit: handleSubmit,
			className: "position-relative",
			children: [/* @__PURE__ */ jsx("label", {
				htmlFor: "search-input",
				className: "visually-hidden",
				children: "Search articles"
			}), /* @__PURE__ */ jsxs("div", {
				className: "input-group input-group-lg shadow-sm rounded-pill overflow-hidden",
				children: [
					/* @__PURE__ */ jsx("span", {
						className: "input-group-text bg-white border-end-0 px-4 text-muted",
						children: /* @__PURE__ */ jsx("i", { className: "bi bi-search" })
					}),
					/* @__PURE__ */ jsx("input", {
						id: "search-input",
						type: "search",
						name: "q",
						className: "form-control border-start-0 ps-0 pe-4 py-3",
						placeholder: "Search for 'Password', 'Scam', 'Email'...",
						value: query,
						onChange: (e) => setQuery(e.target.value)
					}),
					/* @__PURE__ */ jsx("button", {
						type: "submit",
						className: "btn btn-primary px-4 fw-bold",
						children: "Search"
					})
				]
			})]
		})
	});
}
//#endregion
//#region app/routes/articles.tsx
var articles_exports = /* @__PURE__ */ __exportAll({
	HydrateFallback: () => HydrateFallback$3,
	clientLoader: () => clientLoader$3,
	default: () => articles_default,
	meta: () => meta$5
});
function meta$5() {
	return [{ title: "Silver Guide - Articles" }, {
		name: "description",
		content: "Learn & Protect — guides for seniors"
	}];
}
async function fetchTopic(topicId) {
	try {
		const r = await apiFetch(`/api/articles?topicId=${topicId}`);
		if (!r.ok) return [];
		return r.json();
	} catch {
		return [];
	}
}
async function clientLoader$3({ request }) {
	const url = new URL(request.url);
	const q = url.searchParams.get("q");
	if (q) {
		const page = parseInt(url.searchParams.get("page") || "0", 10);
		try {
			return {
				isSearch: true,
				q,
				searchResults: await searchArticles(q, page, 12),
				tech: [],
				scam: []
			};
		} catch {
			return {
				isSearch: true,
				q,
				searchResults: {
					content: [],
					totalPages: 0,
					totalElements: 0
				},
				tech: [],
				scam: []
			};
		}
	} else {
		const [tech, scam] = await Promise.all([fetchTopic(1), fetchTopic(2)]);
		return {
			isSearch: false,
			q: "",
			searchResults: null,
			tech,
			scam
		};
	}
}
var HydrateFallback$3 = UNSAFE_withHydrateFallbackProps(function HydrateFallback() {
	return /* @__PURE__ */ jsx(PageSpinner, {});
});
function PlaceholderCard({ label }) {
	return /* @__PURE__ */ jsx("div", {
		className: "col",
		children: /* @__PURE__ */ jsx("div", {
			className: "card article-card shadow-sm h-100",
			children: /* @__PURE__ */ jsx("div", {
				className: "card-body d-flex flex-column p-4 text-center text-muted",
				children: /* @__PURE__ */ jsxs("p", {
					className: "mt-3",
					children: [
						"No ",
						label,
						" articles yet. Check back soon!"
					]
				})
			})
		})
	});
}
var articles_default = UNSAFE_withComponentProps(function Articles() {
	const { isSearch, q, searchResults, tech, scam } = useLoaderData();
	return /* @__PURE__ */ jsxs("div", {
		className: "container py-5",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "text-center mb-5",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "display-3 fw-bold mb-3",
					children: "Learn & Protect Library"
				}), /* @__PURE__ */ jsx("p", {
					className: "lead text-muted mx-auto",
					style: { maxWidth: "800px" },
					children: "Welcome to our complete library of guides from the beginning of time. Whether you want to master new technology or learn how to stay safe online, you can explore our entire collection here. Use the search bar or browse through the pages to easily find simple instructions to help you every step of the way."
				})]
			}),
			/* @__PURE__ */ jsx(SearchBar, {}),
			isSearch ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
				className: "row mb-4 border-bottom pb-3",
				children: /* @__PURE__ */ jsxs("div", {
					className: "col d-flex justify-content-between align-items-center",
					children: [/* @__PURE__ */ jsxs("h2", {
						className: "mb-0",
						children: [
							"Search Results for \"",
							q,
							"\""
						]
					}), /* @__PURE__ */ jsx(Link, {
						to: "/articles",
						className: "btn btn-outline-secondary btn-sm",
						children: "Clear Search"
					})]
				})
			}), searchResults && searchResults.content.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
				className: "row g-4 row-cols-1 row-cols-md-2 row-cols-lg-3 justify-content-center",
				children: searchResults.content.map((a) => /* @__PURE__ */ jsx(ArticleCard, { a }, a.id))
			}), searchResults.totalPages > 1 && /* @__PURE__ */ jsx("div", {
				className: "d-flex justify-content-center mt-5 gap-2",
				children: [...Array(searchResults.totalPages)].map((_, i) => /* @__PURE__ */ jsx(Link, {
					to: `/articles?q=${encodeURIComponent(q || "")}&page=${i}`,
					className: `btn ${searchResults.pageable?.pageNumber === i ? "btn-primary" : "btn-outline-primary"}`,
					children: i + 1
				}, i))
			})] }) : /* @__PURE__ */ jsxs("div", {
				className: "text-center py-5 text-muted",
				children: [/* @__PURE__ */ jsxs("h4", { children: [
					"No articles found for \"",
					q,
					"\""
				] }), /* @__PURE__ */ jsx("p", { children: "Try searching with different keywords." })]
			})] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
				/* @__PURE__ */ jsx("div", {
					className: "row",
					children: /* @__PURE__ */ jsx("div", {
						className: "col-12 mt-4",
						children: /* @__PURE__ */ jsx("h2", {
							className: "text-center border-bottom pb-3 mb-4",
							children: "Technology Basics"
						})
					})
				}),
				/* @__PURE__ */ jsx("div", {
					className: "row g-4 row-cols-1 row-cols-md-2 row-cols-lg-4 justify-content-center",
					children: tech.length > 0 ? tech.map((a) => /* @__PURE__ */ jsx(ArticleCard, { a }, a.id)) : /* @__PURE__ */ jsx(PlaceholderCard, { label: "Technology Basics" })
				}),
				/* @__PURE__ */ jsx("div", {
					className: "text-center mt-4",
					children: /* @__PURE__ */ jsx(Link, {
						to: "/articles/topic/1",
						className: "btn btn-outline-primary",
						children: "View More Technology Basics →"
					})
				}),
				/* @__PURE__ */ jsx("div", {
					className: "row",
					children: /* @__PURE__ */ jsx("div", {
						className: "text-center col-12 mt-5",
						children: /* @__PURE__ */ jsx("h2", {
							className: "border-bottom pb-3 mb-4",
							children: "Scam Awareness"
						})
					})
				}),
				/* @__PURE__ */ jsx("div", {
					className: "row g-4 row-cols-1 row-cols-md-2 row-cols-lg-4 justify-content-center",
					children: scam.length > 0 ? scam.map((a) => /* @__PURE__ */ jsx(ArticleCard, { a }, a.id)) : /* @__PURE__ */ jsx(PlaceholderCard, { label: "Scam Awareness" })
				}),
				/* @__PURE__ */ jsx("div", {
					className: "text-center mt-4",
					children: /* @__PURE__ */ jsx(Link, {
						to: "/articles/topic/2",
						className: "btn btn-outline-primary",
						children: "View More Scam Awareness →"
					})
				})
			] })
		]
	});
});
//#endregion
//#region app/routes/editor/editorDefaults.ts
var DEFAULT_META = {
	title: "Spotting Phishing Emails",
	topicId: null,
	subtitle: "",
	description: "Is that email really from your bank? We teach you how to check sender addresses and avoid suspicious links.",
	heroImage: "/imgs/phishing_alert.png"
};
var DEFAULT_DATA = { blocks: [
	{
		type: "paragraph",
		data: { text: "\"Phishing\" (pronounced \"fishing\") is when a scammer sends you an email pretending to be someone you trust — your bank, Australia Post, myGov, or even a family member. Their goal is to trick you into clicking a link and entering your personal details." }
	},
	{
		type: "header",
		data: {
			text: "The Tell-Tale Signs of a Phishing Email",
			level: 2
		}
	},
	{
		type: "list",
		data: {
			style: "unordered",
			meta: {},
			items: [
				{
					content: "The sender's email address looks odd (e.g. support@amaz0n-help.net instead of @amazon.com)",
					meta: {},
					items: []
				},
				{
					content: "It creates urgency — \"Your account will be closed in 24 hours!\"",
					meta: {},
					items: []
				},
				{
					content: "It asks you to click a link and log in to verify your details",
					meta: {},
					items: []
				},
				{
					content: "The greeting is generic: \"Dear Customer\" instead of your name",
					meta: {},
					items: []
				},
				{
					content: "There are spelling mistakes or the logo looks slightly off",
					meta: {},
					items: []
				}
			]
		}
	},
	{
		type: "quote",
		data: {
			text: "Think of it like a fake letter in your letterbox — it might look official, but if you hold it up to the light, the small details give it away.",
			caption: ""
		}
	},
	{
		type: "header",
		data: {
			text: "How to Check if an Email Is Real",
			level: 2
		}
	},
	{
		type: "paragraph",
		data: { text: "Before clicking anything, try these quick checks:" }
	},
	{
		type: "list",
		data: {
			style: "ordered",
			meta: {},
			items: [
				{
					content: "Hover your mouse over any link (don't click!) and look at the web address that appears at the bottom of the screen",
					meta: {},
					items: []
				},
				{
					content: "Check the sender's full email address by clicking on their name",
					meta: {},
					items: []
				},
				{
					content: "Go directly to the company's website by typing the address into your browser yourself",
					meta: {},
					items: []
				},
				{
					content: "Call the company on their official number if you're still unsure",
					meta: {},
					items: []
				}
			]
		}
	},
	{
		type: "warning",
		data: {
			title: "When in doubt, don't click",
			message: "Legitimate companies like your bank or myGov will never email you asking for your password or full credit card number. If an email asks for this, it is a scam."
		}
	},
	{
		type: "delimiter",
		data: {}
	},
	{
		type: "paragraph",
		data: { text: "If you think you've clicked a phishing link and entered your details, change your password immediately and call your bank." }
	}
] };
//#endregion
//#region app/routes/editor/ArticleMetaForm.tsx
function ArticleMetaForm({ title, setTitle, topicId, setTopicId, topics, subtitle, setSubtitle, description, setDescription, heroImage, setHeroImage, errors, onClearError, onDismissErrors }) {
	return /* @__PURE__ */ jsx("div", {
		className: "card border-2 border-light shadow-sm rounded-4 mb-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "card-body p-4",
			children: [
				/* @__PURE__ */ jsx("h5", {
					className: "fw-bold mb-4",
					children: "Article Details"
				}),
				Object.values(errors).some(Boolean) && /* @__PURE__ */ jsxs("div", {
					className: "alert alert-danger alert-dismissible",
					role: "alert",
					children: [/* @__PURE__ */ jsxs("ul", {
						className: "mb-0 ps-3",
						children: [
							errors.title && /* @__PURE__ */ jsx("li", { children: errors.title }),
							errors.topicId && /* @__PURE__ */ jsx("li", { children: errors.topicId }),
							errors.subtitle && /* @__PURE__ */ jsx("li", { children: errors.subtitle }),
							errors.description && /* @__PURE__ */ jsx("li", { children: errors.description }),
							errors.heroImage && /* @__PURE__ */ jsx("li", { children: errors.heroImage })
						]
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						className: "btn-close",
						onClick: onDismissErrors,
						"aria-label": "Close"
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "row g-3",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "col-md-8",
							children: [
								/* @__PURE__ */ jsx("label", {
									className: "meta-label mb-1",
									children: "Title"
								}),
								/* @__PURE__ */ jsx("input", {
									type: "text",
									value: title,
									onChange: (e) => {
										setTitle(e.target.value);
										onClearError("title");
									},
									maxLength: 255,
									placeholder: "e.g. Understanding AI Helpers",
									className: `form-control form-control-lg${errors.title ? " is-invalid" : ""}`
								}),
								errors.title && /* @__PURE__ */ jsx("div", {
									className: "invalid-feedback",
									children: errors.title
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "col-md-4",
							children: [
								/* @__PURE__ */ jsx("label", {
									className: "meta-label mb-1",
									children: "Topics"
								}),
								/* @__PURE__ */ jsxs("select", {
									value: topicId ?? "",
									onChange: (e) => {
										const val = e.target.value;
										setTopicId(val === "" ? null : Number(val));
										onClearError("topicId");
									},
									className: `form-select form-select-lg${errors.topicId ? " is-invalid" : ""}`,
									children: [/* @__PURE__ */ jsx("option", {
										value: "",
										children: "Select a topic…"
									}), topics.map((t) => /* @__PURE__ */ jsx("option", {
										value: t.id,
										children: t.topicName
									}, t.id))]
								}),
								errors.topicId && /* @__PURE__ */ jsx("div", {
									className: "invalid-feedback",
									children: errors.topicId
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "col-12",
							children: [
								/* @__PURE__ */ jsx("label", {
									className: "meta-label mb-1",
									children: "Sub Title"
								}),
								/* @__PURE__ */ jsx("input", {
									type: "text",
									value: subtitle,
									onChange: (e) => {
										setSubtitle(e.target.value);
										onClearError("subtitle");
									},
									maxLength: 500,
									placeholder: "e.g. How to recognise and avoid common email scams",
									className: `form-control form-control-lg${errors.subtitle ? " is-invalid" : ""}`
								}),
								errors.subtitle && /* @__PURE__ */ jsx("div", {
									className: "invalid-feedback",
									children: errors.subtitle
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "col-12",
							children: [
								/* @__PURE__ */ jsxs("label", {
									className: "meta-label mb-1",
									children: ["Summary ", /* @__PURE__ */ jsx("span", {
										className: "fw-normal text-muted text-lowercase",
										children: "(shown on article card)"
									})]
								}),
								/* @__PURE__ */ jsx("textarea", {
									value: description,
									onChange: (e) => {
										setDescription(e.target.value);
										onClearError("description");
									},
									maxLength: 1e3,
									rows: 2,
									placeholder: "A brief summary shown on the articles listing page…",
									className: `form-control${errors.description ? " is-invalid" : ""}`
								}),
								errors.description && /* @__PURE__ */ jsx("div", {
									className: "invalid-feedback",
									children: errors.description
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "col-12",
							children: [
								/* @__PURE__ */ jsx("label", {
									className: "meta-label mb-1",
									children: "Hero Image URL"
								}),
								/* @__PURE__ */ jsx("input", {
									type: "text",
									value: heroImage,
									onChange: (e) => {
										setHeroImage(e.target.value);
										onClearError("heroImage");
									},
									maxLength: 255,
									placeholder: "/imgs/your-image.png",
									className: `form-control form-control-lg${errors.heroImage ? " is-invalid" : ""}`
								}),
								errors.heroImage && /* @__PURE__ */ jsx("div", {
									className: "invalid-feedback",
									children: errors.heroImage
								})
							]
						})
					]
				})
			]
		})
	});
}
//#endregion
//#region app/routes/editor/BlockReference.tsx
var BLOCKS = [
	{
		badge: "H2 Header",
		desc: "Section title with yellow left border",
		cls: "badge bg-primary-subtle text-primary"
	},
	{
		badge: "Quote",
		desc: "Italic analogy box (dashed border)",
		cls: "badge bg-info-subtle text-info"
	},
	{
		badge: "Warning",
		desc: "Tip/safety box (blue left border)",
		cls: "badge bg-warning-subtle text-warning-emphasis"
	},
	{
		badge: "List",
		desc: "Bullet or numbered list",
		cls: "badge bg-secondary-subtle text-secondary"
	},
	{
		badge: "Image",
		desc: "Inline image by URL",
		cls: "badge bg-secondary-subtle text-secondary"
	},
	{
		badge: "Delimiter",
		desc: "Horizontal divider",
		cls: "badge bg-secondary-subtle text-secondary"
	}
];
function BlockReference() {
	return /* @__PURE__ */ jsx("div", {
		className: "card border-2 border-light shadow-sm rounded-4 mb-5",
		children: /* @__PURE__ */ jsxs("div", {
			className: "card-body p-4",
			children: [/* @__PURE__ */ jsx("h6", {
				className: "fw-bold mb-4",
				children: "Block → Article Style Reference"
			}), /* @__PURE__ */ jsx("div", {
				className: "row g-3",
				children: BLOCKS.map((item) => /* @__PURE__ */ jsxs("div", {
					className: "col-sm-6 col-lg-4 d-flex align-items-start gap-2",
					children: [/* @__PURE__ */ jsx("span", {
						className: item.cls,
						children: item.badge
					}), /* @__PURE__ */ jsx("span", {
						className: "text-muted small",
						children: item.desc
					})]
				}, item.badge))
			})]
		})
	});
}
//#endregion
//#region app/routes/editor/editor.tsx
var editor_exports = /* @__PURE__ */ __exportAll({
	HydrateFallback: () => HydrateFallback$2,
	clientLoader: () => clientLoader$2,
	default: () => editor_default,
	meta: () => meta$4
});
async function clientLoader$2({ request }) {
	const { token, user: me } = await requireStaffUser();
	let topics = [];
	try {
		const topicsRes = await apiFetch("/api/topics");
		if (topicsRes.ok) topics = await topicsRes.json();
	} catch {}
	const editId = new URL(request.url).searchParams.get("edit");
	let article = null;
	if (editId) {
		const articleRes = await apiFetch(`/api/articles/${editId}`);
		if (articleRes.ok) article = await articleRes.json();
	}
	return {
		topics,
		article
	};
}
var HydrateFallback$2 = UNSAFE_withHydrateFallbackProps(function HydrateFallback() {
	return /* @__PURE__ */ jsx(PageSpinner, {});
});
function meta$4() {
	return [{ title: "Silver Guide - Article Editor" }];
}
function slugify(title) {
	return title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-");
}
var editor_default = UNSAFE_withComponentProps(function ArticleEditor() {
	const { topics, article } = useLoaderData();
	const navigate = useNavigate();
	const editorRef = useRef(null);
	const editorInstanceRef = useRef(null);
	const [title, setTitle] = useState(article?.title ?? "");
	const [topicId, setTopicId] = useState(article?.topicId ?? null);
	const [subtitle, setSubtitle] = useState(article?.subtitle ?? "");
	const [description, setDescription] = useState(article?.description ?? "");
	const [heroImage, setHeroImage] = useState(article?.imgUrl ?? "");
	const [errors, setErrors] = useState({});
	function validate() {
		const e = {};
		if (!title.trim()) e.title = "Title is required.";
		else if (title.length > 255) e.title = "Title must be 255 characters or fewer.";
		if (!topicId) e.topicId = "Topic is required.";
		if (subtitle.length > 500) e.subtitle = "Sub Title must be 500 characters or fewer.";
		if (description.length > 1e3) e.description = "Summary must be 1000 characters or fewer.";
		if (heroImage.length > 255) e.heroImage = "Hero Image URL must be 255 characters or fewer.";
		return e;
	}
	useEffect(() => {
		let cancelled = false;
		async function initEditor() {
			const EditorJS = (await import("@editorjs/editorjs")).default;
			const Header = (await import("@editorjs/header")).default;
			const EditorjsList = (await import("@editorjs/list")).default;
			const Quote = (await import("@editorjs/quote")).default;
			const Warning = (await import("@editorjs/warning")).default;
			const Delimiter = (await import("@editorjs/delimiter")).default;
			const Underline = (await import("@editorjs/underline")).default;
			const Marker = (await import("@editorjs/marker")).default;
			const InlineCode = (await import("@editorjs/inline-code")).default;
			const Strikethrough = (await import("@sotaproject/strikethrough")).default;
			const { default: SimpleImage } = await import("./assets/SimpleImage-DPxNGQ54.js");
			const { default: ScamAlertTool } = await import("./assets/ScamAlertTool-Xv-6cnog.js");
			if (cancelled) return;
			let initialData = { blocks: [] };
			if (article?.content) try {
				initialData = JSON.parse(article.content);
			} catch {}
			editorInstanceRef.current = new EditorJS({
				holder: editorRef.current,
				placeholder: "Start writing your article… press Tab to add a block.",
				data: initialData,
				tools: {
					header: {
						class: Header,
						config: {
							levels: [
								2,
								3,
								4
							],
							defaultLevel: 2
						}
					},
					list: {
						class: EditorjsList,
						inlineToolbar: true,
						config: { defaultStyle: "unordered" }
					},
					quote: {
						class: Quote,
						inlineToolbar: true,
						config: {
							quotePlaceholder: "Enter analogy or quote…",
							captionPlaceholder: "Source or caption (optional)"
						}
					},
					warning: {
						class: Warning,
						inlineToolbar: true,
						config: {
							titlePlaceholder: "Tip title",
							messagePlaceholder: "Tip content…"
						}
					},
					image: SimpleImage,
					delimiter: Delimiter,
					scam_alert: ScamAlertTool,
					underline: Underline,
					marker: Marker,
					inlineCode: InlineCode,
					strikethrough: Strikethrough
				},
				onReady: () => {
					console.log("Editor.js ready");
				}
			});
		}
		initEditor();
		return () => {
			cancelled = true;
			editorInstanceRef.current?.destroy();
		};
	}, []);
	async function loadExample() {
		if (!confirm("This will replace the current content with the example article. Continue?")) return;
		await editorInstanceRef.current?.render(DEFAULT_DATA);
		setTitle(DEFAULT_META.title);
		setTopicId(DEFAULT_META.topicId);
		setSubtitle(DEFAULT_META.subtitle);
		setDescription(DEFAULT_META.description);
		setHeroImage(DEFAULT_META.heroImage);
	}
	async function saveToBackend(status = "PUBLISHED") {
		const fieldErrors = validate();
		if (Object.keys(fieldErrors).length > 0) {
			setErrors(fieldErrors);
			return;
		}
		setErrors({});
		const editorData = await editorInstanceRef.current?.save();
		const payload = {
			title,
			topicId,
			subtitle,
			summary: description,
			imageUrl: heroImage,
			content: JSON.stringify(editorData),
			published: status === "PUBLISHED",
			status
		};
		const token = getToken();
		if (!token) {
			alert("You must be signed in to save articles.");
			return;
		}
		try {
			const res = await apiFetch(article ? `/api/articles/${article.id}` : "/api/articles", {
				method: article ? "PUT" : "POST",
				headers: { Authorization: `Bearer ${token}` },
				body: JSON.stringify(payload)
			});
			if (res.status === 401) {
				alert("Session expired — please sign in again.");
				return;
			}
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const saved = await res.json();
			navigate(`/articles/${saved.id}/${slugify(saved.title)}`);
		} catch (err) {
			console.warn("Backend not available, payload logged:", payload);
			alert("Backend not available. Payload logged to console (F12).");
		}
	}
	return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("main", {
		className: "container py-5",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
					className: "fw-bold mb-1",
					children: article ? "Edit Article" : "Article Editor"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-muted",
					children: article ? "Update an existing Silver Guide article" : "Write and publish a new Silver Guide article"
				})] }), /* @__PURE__ */ jsxs("div", {
					className: "d-flex gap-2 flex-wrap",
					children: [
						/* @__PURE__ */ jsx("button", {
							onClick: () => saveToBackend("DRAFT"),
							className: "btn btn-outline-secondary",
							children: "Save Draft"
						}),
						/* @__PURE__ */ jsx("button", {
							onClick: loadExample,
							className: "btn btn-outline-secondary",
							children: "Load Example"
						}),
						/* @__PURE__ */ jsx("button", {
							onClick: () => saveToBackend("PUBLISHED"),
							className: "btn btn-success fw-bold",
							children: article ? "Update Article" : "Publish Article"
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx(ArticleMetaForm, {
				title,
				setTitle,
				topicId,
				setTopicId,
				topics,
				subtitle,
				setSubtitle,
				description,
				setDescription,
				heroImage,
				setHeroImage,
				errors,
				onClearError: (field) => setErrors((prev) => ({
					...prev,
					[field]: ""
				})),
				onDismissErrors: () => setErrors({})
			}),
			/* @__PURE__ */ jsx("div", {
				className: "card border-2 border-light shadow-sm rounded-4 mb-4",
				children: /* @__PURE__ */ jsxs("div", {
					className: "card-body p-4",
					children: [
						/* @__PURE__ */ jsx("h5", {
							className: "fw-bold mb-1",
							children: "Article Content"
						}),
						/* @__PURE__ */ jsxs("p", {
							className: "text-muted mb-4",
							children: [
								"Click ",
								/* @__PURE__ */ jsx("strong", { children: "+" }),
								" or press ",
								/* @__PURE__ */ jsx("kbd", { children: "Tab" }),
								" to add a block. Use ",
								/* @__PURE__ */ jsx("strong", { children: "Header (H2)" }),
								" for section titles, ",
								/* @__PURE__ */ jsx("strong", { children: "Quote" }),
								" for analogy boxes, and",
								" ",
								/* @__PURE__ */ jsx("strong", { children: "Warning" }),
								" for tip/safety boxes."
							]
						}),
						/* @__PURE__ */ jsx("div", {
							ref: editorRef,
							className: "editor-wrapper"
						})
					]
				})
			}),
			/* @__PURE__ */ jsx(BlockReference, {})
		]
	}) });
});
//#endregion
//#region app/config/team.ts
var TEAM_MEMBERS = [
	{
		id: "christine",
		img: "/imgs/ElderlyChristine.jpg",
		video: "/videos/OldChristineVid.mp4",
		portfolioUrl: "https://radio-alastor.github.io/christine-portfolio/",
		linkedinUrl: "https://www.linkedin.com/in/christine-portfolio/",
		githubUrl: "https://github.com/Radio-Alastor"
	},
	{
		id: "ekhong",
		img: "/imgs/ElderlyEkHong.jpg",
		video: "/videos/OldEkHongVid.mp4",
		portfolioUrl: "https://krenova.github.io/krenova-portfolio/",
		linkedinUrl: "https://sg.linkedin.com/in/ekhong-lim",
		githubUrl: "https://github.com/krenova/"
	},
	{
		id: "kelvin",
		img: "/imgs/ElderlyKelvin.jpg",
		video: "/videos/OldKelvinVid.mp4",
		portfolioUrl: "https://kelvinsu1983.github.io/kelvin-portfolio/",
		linkedinUrl: "https://www.linkedin.com/in/kelvin-su-59332515a/",
		githubUrl: "https://github.com/KelvinSu1983"
	},
	{
		id: "kimshee",
		img: "/imgs/ElderlyKimShee.jpg",
		video: "/videos/OldKimSheeVid.mp4",
		portfolioUrl: "https://kslee008.github.io/portfolio_v2",
		linkedinUrl: "https://www.linkedin.com/in/kim-shee-lee-b1378288/",
		githubUrl: "https://github.com/kslee008"
	}
];
//#endregion
//#region app/routes/about.tsx
var about_exports = /* @__PURE__ */ __exportAll({
	default: () => about_default,
	meta: () => meta$3
});
function meta$3() {
	return [{ title: "Silver Guide - About" }];
}
function TeamCard({ member, index }) {
	const { t } = useI18n();
	const videoRef = useRef(null);
	const checkboxId = `bio-check-${index}`;
	const profile = t.team[member.id];
	return /* @__PURE__ */ jsx("div", {
		className: "col-6 col-md-3",
		children: /* @__PURE__ */ jsxs("div", {
			className: "team-card",
			children: [
				/* @__PURE__ */ jsx("a", {
					href: member.portfolioUrl,
					target: "_blank",
					rel: "noreferrer",
					className: "portrait-link",
					children: /* @__PURE__ */ jsxs("div", {
						className: "portrait-container border border-dark",
						onMouseEnter: () => videoRef.current?.play(),
						onMouseLeave: () => {
							const v = videoRef.current;
							if (v) {
								v.pause();
								v.currentTime = 0;
							}
						},
						children: [/* @__PURE__ */ jsx("img", {
							src: member.img,
							alt: profile.name,
							className: "team-img static-img"
						}), /* @__PURE__ */ jsx("video", {
							ref: videoRef,
							className: "team-video",
							muted: true,
							loop: true,
							playsInline: true,
							children: /* @__PURE__ */ jsx("source", {
								src: member.video,
								type: "video/mp4"
							})
						})]
					})
				}),
				/* @__PURE__ */ jsx("h4", {
					className: "mt-3 mb-0",
					children: profile.name
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-muted",
					children: profile.role
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "social-links mb-3",
					children: [/* @__PURE__ */ jsx("a", {
						href: member.linkedinUrl,
						target: "_blank",
						rel: "noreferrer",
						className: "btn btn-outline-dark btn-sm rounded-circle mx-1",
						children: /* @__PURE__ */ jsx("i", { className: "bi bi-linkedin" })
					}), /* @__PURE__ */ jsx("a", {
						href: member.githubUrl,
						target: "_blank",
						rel: "noreferrer",
						className: "btn btn-outline-dark btn-sm rounded-circle mx-1",
						children: /* @__PURE__ */ jsx("i", { className: "bi bi-github" })
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "bio-wrapper",
					children: [
						/* @__PURE__ */ jsx("input", {
							type: "checkbox",
							id: checkboxId,
							className: "bio-toggle"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "bio-text",
							children: profile.bio
						}),
						/* @__PURE__ */ jsx("label", {
							htmlFor: checkboxId,
							className: "bio-more-btn",
							"data-read-more": t.about.readMore,
							"data-read-less": t.about.readLess
						})
					]
				})
			]
		})
	});
}
var about_default = UNSAFE_withComponentProps(function About() {
	const { t } = useI18n();
	return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("div", {
		className: "container my-5",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "row align-items-center mb-5 py-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "col-md-6",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "badge rounded-pill px-4 py-2 mb-3 d-inline-block",
							style: {
								backgroundColor: "#dfff6f",
								color: "#1a1a1a",
								border: "1px solid #1a1a1a"
							},
							children: t.about.purposeBadge
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "display-6 fw-bold",
							children: t.about.purposeQuote
						}),
						/* @__PURE__ */ jsx("p", {
							className: "lead mt-3",
							children: t.about.purposeLead
						})
					]
				}), /* @__PURE__ */ jsx("div", {
					className: "col-md-6 text-center",
					children: /* @__PURE__ */ jsx("div", {
						className: "bg-light border rounded-4 d-flex align-items-center justify-content-center aboutimage1",
						style: { height: "300px" }
					})
				})]
			}),
			/* @__PURE__ */ jsx("h2", {
				className: "text-center mb-4",
				children: t.about.differentTitle
			}),
			/* @__PURE__ */ jsx("div", {
				className: "p-4 mb-4 rounded-5 border border-dark",
				style: { backgroundColor: "#dfff6f" },
				children: /* @__PURE__ */ jsxs("div", {
					className: "row align-items-center",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "col-8",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "fw-bold",
							children: t.about.safeTitle
						}), /* @__PURE__ */ jsx("p", { children: t.about.safeBody })]
					}), /* @__PURE__ */ jsx("div", {
						className: "col-4 text-end",
						children: /* @__PURE__ */ jsx("div", { className: "aboutimage2 bg-white border rounded-4 d-inline-block p-5" })
					})]
				})
			}),
			/* @__PURE__ */ jsx("div", {
				className: "p-4 mb-4 rounded-5 border border-dark",
				style: { backgroundColor: "#75adf6" },
				children: /* @__PURE__ */ jsxs("div", {
					className: "row align-items-center",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "col-8",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "fw-bold",
							children: t.about.simpleTitle
						}), /* @__PURE__ */ jsx("p", { children: t.about.simpleBody })]
					}), /* @__PURE__ */ jsx("div", {
						className: "col-4 text-end",
						children: /* @__PURE__ */ jsx("div", { className: "aboutimage3 bg-white border rounded-4 d-inline-block p-5" })
					})]
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "text-center py-5",
				children: [
					/* @__PURE__ */ jsx("h2", {
						className: "mb-5",
						children: t.about.teamTitle
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "d-md-none text-muted mb-2 small",
						children: [
							/* @__PURE__ */ jsx("i", { className: "bi bi-arrow-left-right" }),
							" ",
							t.about.scrollHint
						]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "row g-4 flex-nowrap overflow-auto pb-4 custom-scrollbar",
						children: TEAM_MEMBERS.map((member, index) => /* @__PURE__ */ jsx(TeamCard, {
							member,
							index
						}, member.id))
					}),
					/* @__PURE__ */ jsx("div", {
						className: "row mt-5",
						children: /* @__PURE__ */ jsx("div", {
							className: "col-12",
							children: /* @__PURE__ */ jsxs("div", {
								className: "cta-box p-5 rounded-4 border border-2 border-dark",
								style: { backgroundColor: "#f8f9fa" },
								children: [
									/* @__PURE__ */ jsx("h3", { children: t.about.ctaTitle }),
									/* @__PURE__ */ jsx("p", {
										className: "lead",
										children: t.about.ctaLead
									}),
									/* @__PURE__ */ jsx(Link, {
										to: "/articles",
										className: "btn btn-primary btn-lg px-5 mt-3 shadow-sm",
										children: t.about.ctaButton
									})
								]
							})
						})
					})
				]
			})
		]
	}) });
});
//#endregion
//#region app/routes/emergency.tsx
var emergency_exports = /* @__PURE__ */ __exportAll({ default: () => emergency_default });
var emergency_default = UNSAFE_withComponentProps(function Emergency() {
	const { t } = useI18n();
	return /* @__PURE__ */ jsxs("main", {
		className: "container py-5",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "text-center mb-5",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "display-4 fw-bold text-danger",
					children: t.emergency.title
				}), /* @__PURE__ */ jsx("p", {
					className: "lead",
					children: t.emergency.lead
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "row g-4 justify-content-center",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "col-md-8",
						children: /* @__PURE__ */ jsxs("div", {
							className: "emergency-card shadow-lg mb-4",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "d-flex align-items-center mb-3",
									children: [/* @__PURE__ */ jsx("div", {
										className: "step-number",
										children: "1"
									}), /* @__PURE__ */ jsx("h2", {
										className: "h4 mb-0 fw-bold",
										children: t.emergency.step1Title
									})]
								}),
								/* @__PURE__ */ jsx("p", { children: t.emergency.step1Body }),
								/* @__PURE__ */ jsxs("div", {
									className: "row g-2",
									children: [
										/* @__PURE__ */ jsx("a", {
											href: "tel:18003396963",
											className: "col-6 col-md-3 text-black text-decoration-none",
											children: /* @__PURE__ */ jsxs("div", {
												className: "bank-contact text-center small",
												children: [
													/* @__PURE__ */ jsx("strong", { children: "DBS/POSB" }),
													/* @__PURE__ */ jsx("br", {}),
													"1800 339 6963"
												]
											})
										}),
										/* @__PURE__ */ jsx("a", {
											href: "tel:18003633333",
											className: "col-6 col-md-3 text-black text-decoration-none",
											children: /* @__PURE__ */ jsxs("div", {
												className: "bank-contact text-center small",
												children: [
													/* @__PURE__ */ jsx("strong", { children: "OCBC" }),
													/* @__PURE__ */ jsx("br", {}),
													"1800 363 3333"
												]
											})
										}),
										/* @__PURE__ */ jsx("a", {
											href: "tel:18002222121",
											className: "col-6 col-md-3 text-black text-decoration-none",
											children: /* @__PURE__ */ jsxs("div", {
												className: "bank-contact text-center small",
												children: [
													/* @__PURE__ */ jsx("strong", { children: "UOB" }),
													/* @__PURE__ */ jsx("br", {}),
													"1800 222 2121"
												]
											})
										}),
										/* @__PURE__ */ jsx("a", {
											href: "tel:18007477000",
											className: "col-6 col-md-3 text-black text-decoration-none",
											children: /* @__PURE__ */ jsxs("div", {
												className: "bank-contact text-center small",
												children: [
													/* @__PURE__ */ jsx("strong", { children: "Standard Chartered" }),
													/* @__PURE__ */ jsx("br", {}),
													"1800 747 7000"
												]
											})
										})
									]
								})
							]
						})
					}),
					/* @__PURE__ */ jsx("div", {
						className: "col-md-8",
						children: /* @__PURE__ */ jsxs("div", {
							className: "emergency-card shadow-lg mb-4",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "d-flex align-items-center mb-3",
									children: [/* @__PURE__ */ jsx("div", {
										className: "step-number",
										children: "2"
									}), /* @__PURE__ */ jsx("h2", {
										className: "h4 mb-0 fw-bold",
										children: t.emergency.step2Title
									})]
								}),
								/* @__PURE__ */ jsx("p", { children: t.emergency.step2Body }),
								/* @__PURE__ */ jsx("a", {
									href: "tel:18007226688",
									className: "btn btn-danger btn-lg w-100 fw-bold py-3 mb-2",
									children: t.emergency.step2Call
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-muted small text-center",
									children: t.emergency.step2Availability
								})
							]
						})
					}),
					/* @__PURE__ */ jsx("div", {
						className: "col-md-8",
						children: /* @__PURE__ */ jsxs("div", {
							className: "emergency-card shadow-lg mb-4",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "d-flex align-items-center mb-3",
									children: [/* @__PURE__ */ jsx("div", {
										className: "step-number",
										children: "3"
									}), /* @__PURE__ */ jsx("h2", {
										className: "h4 mb-0 fw-bold",
										children: t.emergency.step3Title
									})]
								}),
								/* @__PURE__ */ jsx("p", { children: t.emergency.step3Body }),
								/* @__PURE__ */ jsx("a", {
									href: "https://www.police.gov.sg/e-services",
									target: "_blank",
									rel: "noreferrer",
									className: "btn btn-outline-danger w-100",
									children: t.emergency.step3Button
								})
							]
						})
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "text-center mt-5",
				children: /* @__PURE__ */ jsx(Link, {
					to: "/",
					className: "btn btn-secondary rounded-pill px-5",
					children: t.emergency.backHome
				})
			})
		]
	});
});
//#endregion
//#region app/routes/ai-tutorial.tsx
var ai_tutorial_exports = /* @__PURE__ */ __exportAll({
	default: () => ai_tutorial_default,
	meta: () => meta$2
});
function meta$2() {
	return [{ title: "Silver Guide - Understanding AI Helpers" }];
}
var ai_tutorial_default = UNSAFE_withComponentProps(function AiTutorial() {
	return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("div", {
		className: "container py-5 d-flex justify-content-center",
		children: /* @__PURE__ */ jsxs("article", {
			className: "article-container",
			children: [
				/* @__PURE__ */ jsx("nav", {
					"aria-label": "breadcrumb",
					className: "mb-4",
					children: /* @__PURE__ */ jsxs("ol", {
						className: "breadcrumb",
						children: [/* @__PURE__ */ jsx("li", {
							className: "breadcrumb-item",
							children: /* @__PURE__ */ jsx(Link, {
								to: "/articles",
								className: "text-decoration-none text-muted",
								children: "Articles"
							})
						}), /* @__PURE__ */ jsx("li", {
							className: "breadcrumb-item active",
							"aria-current": "page",
							children: "Understanding AI Helpers"
						})]
					})
				}),
				/* @__PURE__ */ jsx("h1", {
					className: "display-4 fw-bold mb-4",
					children: "Understanding AI Helpers"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-muted mb-4",
					children: "Estimated reading time: 5 minutes"
				}),
				/* @__PURE__ */ jsx("img", {
					src: "/imgs/ai_tutorial.png",
					className: "article-header-img shadow-sm",
					alt: "Friendly AI Interface"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "lead",
					children: "You might have heard the term \"AI\" or \"Artificial Intelligence\" on the news or from your grandchildren. While it sounds like science fiction, AI is essentially just a very advanced helper living inside your computer or phone."
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "section-title",
					children: "What exactly is an AI Helper?"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mb-4",
					children: "Think of an AI helper like a friendly, incredibly well-read librarian who has read almost every book in the world and can answer your questions in seconds."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "analogy mb-4",
					children: [/* @__PURE__ */ jsx("strong", { children: "Analogy:" }), " If a regular search engine (like Google) is a large library where you have to find the book yourself, an AI helper is the librarian who goes and gets the answer for you, then explains it in simple terms."]
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "section-title",
					children: "What can they do for you?"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mb-4",
					children: "AI helpers are designed to make your life easier. Here are a few things they are great at:"
				}),
				/* @__PURE__ */ jsxs("ul", {
					className: "mb-4",
					children: [
						/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("strong", { children: "Answering Questions:" }), " \"How do I bake a gluten-free cake?\" or \"What is the capital of France?\""] }),
						/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("strong", { children: "Writing & Editing:" }), " Helping you write a polite email to a neighbor or checking your spelling."] }),
						/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("strong", { children: "Planning:" }), " \"Plan a 3-day trip to London for someone who loves history.\""] }),
						/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("strong", { children: "Translation:" }), " Helping you understand a letter written in another language."] })
					]
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "section-title",
					children: "Common AI Helpers you might know"
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "row g-4 mb-4",
					children: [/* @__PURE__ */ jsx("div", {
						className: "col-md-6",
						children: /* @__PURE__ */ jsxs("div", {
							className: "card h-100 border-0 bg-light p-3",
							children: [/* @__PURE__ */ jsx("p", {
								className: "fw-bold mb-1",
								children: "ChatGPT"
							}), /* @__PURE__ */ jsx("p", {
								className: "small text-muted mb-0",
								children: "A \"chatbot\" that you can talk to just like you're texting a friend. It's great for long conversations and complicated explanations."
							})]
						})
					}), /* @__PURE__ */ jsx("div", {
						className: "col-md-6",
						children: /* @__PURE__ */ jsxs("div", {
							className: "card h-100 border-0 bg-light p-3",
							children: [/* @__PURE__ */ jsx("p", {
								className: "fw-bold mb-1",
								children: "Siri or Alexa"
							}), /* @__PURE__ */ jsx("p", {
								className: "small text-muted mb-0",
								children: "Voice-activated helpers that live on your phone or in a speaker. Perfect for setting timers, playing music, or checking the weather."
							})]
						})
					})]
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "section-title",
					children: "How to get started safely"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mb-4",
					children: "The best way to learn is to try! You can start by asking a simple question. However, keep these two rules in mind:"
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "tip-box",
					children: [/* @__PURE__ */ jsx("h5", {
						className: "fw-bold",
						children: "Safety First"
					}), /* @__PURE__ */ jsxs("ol", { children: [/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("strong", { children: "Don't share secrets:" }), " Treat an AI like a helpful stranger. Don't tell it your passwords, bank details, or private home address."] }), /* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("strong", { children: "Always double-check:" }), " While they are smart, AI helpers can sometimes make mistakes. If something seems wrong, verify it with a trusted source."] })] })]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "text-center mt-5",
					children: /* @__PURE__ */ jsx(Link, {
						to: "/articles",
						className: "btn btn-outline-secondary btn-lg rounded-pill px-5",
						children: "Back to Articles"
					})
				})
			]
		})
	}) });
});
//#endregion
//#region app/routes/articles.topic.$id.tsx
var articles_topic_$id_exports = /* @__PURE__ */ __exportAll({
	HydrateFallback: () => HydrateFallback$1,
	clientLoader: () => clientLoader$1,
	default: () => articles_topic_$id_default,
	meta: () => meta$1
});
function meta$1({ data }) {
	return [{ title: `Silver Guide - ${data?.topicId === 1 ? "Technology Basics" : data?.topicId === 2 ? "Scam Awareness" : "Articles Topic"}` }];
}
async function clientLoader$1({ params, request }) {
	const topicId = parseInt(params.id, 10);
	const url = new URL(request.url);
	const page = parseInt(url.searchParams.get("page") || "0", 10);
	try {
		const articlesPage = await getArticlesByTopic(topicId, page, 12);
		return {
			topicId,
			topicName: topicId === 1 ? "Technology Basics" : topicId === 2 ? "Scam Awareness" : "Articles",
			articlesPage,
			page
		};
	} catch {
		return {
			topicId,
			topicName: "Articles",
			articlesPage: {
				content: [],
				totalPages: 0,
				totalElements: 0
			},
			page
		};
	}
}
var HydrateFallback$1 = UNSAFE_withHydrateFallbackProps(function HydrateFallback() {
	return /* @__PURE__ */ jsx(PageSpinner, {});
});
var articles_topic_$id_default = UNSAFE_withComponentProps(function ArticlesTopic() {
	const { topicName, articlesPage, page } = useLoaderData();
	return /* @__PURE__ */ jsxs("div", {
		className: "container py-5",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "text-center mb-5",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "display-4 fw-bold",
					children: topicName
				}), /* @__PURE__ */ jsxs("p", {
					className: "lead text-muted",
					children: [
						"Browse all articles for ",
						topicName,
						"."
					]
				})]
			}),
			/* @__PURE__ */ jsx(SearchBar, {}),
			/* @__PURE__ */ jsx("div", {
				className: "my-4",
				children: /* @__PURE__ */ jsx(Link, {
					to: "/articles",
					className: "btn btn-outline-secondary btn-sm",
					children: "← Back to Learn"
				})
			}),
			articlesPage.content.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
				className: "row g-4 row-cols-1 row-cols-md-2 row-cols-lg-3 justify-content-center",
				children: articlesPage.content.map((a) => /* @__PURE__ */ jsx(ArticleCard, { a }, a.id))
			}), articlesPage.totalPages > 1 && /* @__PURE__ */ jsx("div", {
				className: "d-flex justify-content-center mt-5 gap-2",
				children: [...Array(articlesPage.totalPages)].map((_, i) => /* @__PURE__ */ jsx(Link, {
					to: `?page=${i}`,
					className: `btn ${page === i ? "btn-primary" : "btn-outline-primary"}`,
					children: i + 1
				}, i))
			})] }) : /* @__PURE__ */ jsx("div", {
				className: "text-center py-5 text-muted",
				children: /* @__PURE__ */ jsx("h4", { children: "No articles found." })
			})
		]
	});
});
//#endregion
//#region app/components/ChatWidget.tsx
var LOADING_MESSAGES = [
	"Consulting the ancient scrolls…",
	"Asking a very wise owl…",
	"Flipping through the encyclopedia…",
	"Brewing a fresh pot of knowledge…",
	"Polishing my reading glasses…",
	"Cross-referencing with the experts…",
	"Untangling some very long thoughts…",
	"Checking my notes from last Tuesday…",
	"Putting on my thinking cap…",
	"Rummaging through the library stacks…",
	"Sharpening my number 2 pencil…",
	"Thumbing through the card catalogue…",
	"Rewinding the VHS for a closer look…",
	"Asking the professor next door…",
	"Digging through decades of wisdom…",
	"Adjusting my bifocals…",
	"Phoning a very knowledgeable friend…",
	"Doing a bit of light reading…",
	"Jotting this down in my notepad…",
	"Conferring with the study group…",
	"Boiling the kettle — this may take a moment…",
	"Translating from academese to plain English…",
	"Dusting off the reference books…",
	"Letting the ideas percolate…",
	"Connecting the dots, one by one…",
	"Summoning my inner librarian…",
	"Running this by my smarter half…",
	"Making sure I have the full picture…",
	"Giving this the thought it deserves…",
	"Nearly there — good things take time…"
];
var WELCOME = {
	role: "assistant",
	content: "Hi! I'm your article tutor. Ask me anything about this article, or say **quiz me** and I'll test your understanding!"
};
var MAX_MESSAGES = 51;
function truncateMessages(msgs) {
	if (msgs.length <= MAX_MESSAGES) return msgs;
	return [msgs[0], ...msgs.slice(-(MAX_MESSAGES - 1))];
}
function ChatWidget({ articleTitle, articleContent }) {
	const [open, setOpen] = useState(false);
	const [messages, setMessages] = useState([WELCOME]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
	const bottomRef = useRef(null);
	useEffect(() => {
		if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, open]);
	useEffect(() => {
		if (!loading) return;
		const randomMsg = () => LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];
		const randomDelay = () => 1500 + Math.random() * 1500;
		setLoadingMsg(randomMsg());
		let id;
		const schedule = () => {
			id = setTimeout(() => {
				setLoadingMsg(randomMsg());
				schedule();
			}, randomDelay());
		};
		schedule();
		return () => clearTimeout(id);
	}, [loading]);
	function resetChat() {
		setMessages([WELCOME]);
		setInput("");
	}
	async function sendMessage() {
		if (!input.trim() || loading) return;
		const userMsg = {
			role: "user",
			content: input.trim()
		};
		const next = truncateMessages([...messages, userMsg]);
		setMessages(next);
		setInput("");
		setLoading(true);
		try {
			const data = await (await apiFetch("/api/chat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${getToken()}`
				},
				body: JSON.stringify({
					article_title: articleTitle,
					article_content: articleContent,
					messages: next
				})
			})).json();
			setMessages([...next, {
				role: "assistant",
				content: data.reply
			}]);
		} catch {
			setMessages([...next, {
				role: "assistant",
				content: "Sorry, I am not able to connect to the tutor services. Please try again."
			}]);
		} finally {
			setLoading(false);
		}
	}
	function handleKeyDown(e) {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	}
	return /* @__PURE__ */ jsxs("div", {
		className: "chat-widget",
		children: [open && /* @__PURE__ */ jsxs("div", {
			className: "chat-panel",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "chat-panel-header",
					children: [/* @__PURE__ */ jsx("span", {
						className: "fw-semibold",
						children: "Article Tutor"
					}), /* @__PURE__ */ jsxs("div", {
						className: "d-flex align-items-center gap-2",
						children: [/* @__PURE__ */ jsx("button", {
							className: "btn btn-sm btn-outline-light py-0 px-2",
							"aria-label": "Reset chat",
							title: "Start a new conversation",
							onClick: resetChat,
							disabled: loading,
							children: "Reset"
						}), /* @__PURE__ */ jsx("button", {
							className: "btn-close btn-close-white",
							"aria-label": "Close",
							title: "Close the tutor",
							onClick: () => setOpen(false)
						})]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "chat-messages",
					children: [
						messages.map((msg, i) => /* @__PURE__ */ jsx("div", {
							className: msg.role === "user" ? "chat-msg-user" : "chat-msg-assistant",
							children: msg.content
						}, i)),
						loading && /* @__PURE__ */ jsxs("div", {
							className: "chat-msg-assistant chat-msg-loading",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "loading-text",
									children: loadingMsg
								}),
								/* @__PURE__ */ jsx("span", { className: "dot" }),
								/* @__PURE__ */ jsx("span", { className: "dot" }),
								/* @__PURE__ */ jsx("span", { className: "dot" })
							]
						}),
						/* @__PURE__ */ jsx("div", { ref: bottomRef })
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "chat-input-row",
					children: [/* @__PURE__ */ jsx("textarea", {
						className: "form-control chat-textarea",
						rows: 2,
						placeholder: "Ask a question…",
						value: input,
						onChange: (e) => setInput(e.target.value),
						onKeyDown: handleKeyDown,
						disabled: loading
					}), /* @__PURE__ */ jsx("button", {
						className: "btn btn-primary chat-send-btn",
						onClick: sendMessage,
						disabled: loading || !input.trim(),
						"aria-label": "Send",
						title: "Send message",
						children: "▶"
					})]
				})
			]
		}), /* @__PURE__ */ jsx("button", {
			className: "chat-tab",
			onClick: () => setOpen((o) => !o),
			"aria-expanded": open,
			"aria-label": "Toggle article tutor",
			children: "Ask Tutor"
		})]
	});
}
//#endregion
//#region app/components/LikeButton.tsx
function LikeButton({ articleId }) {
	const [likes, setLikes] = useState(0);
	const [hasLiked, setHasLiked] = useState(false);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const fetchStatus = async () => {
			try {
				const status = await getLikeStatus(articleId, getToken() || void 0);
				setLikes(status.totalLikes);
				setHasLiked(status.hasLiked);
			} catch (err) {
				console.error("Failed to load like status:", err);
			} finally {
				setLoading(false);
			}
		};
		fetchStatus();
	}, [articleId]);
	const handleToggle = async () => {
		const token = getToken();
		if (!token) {
			alert("Please log in to like this article.");
			return;
		}
		const previousHasLiked = hasLiked;
		setHasLiked(!hasLiked);
		setLikes((prev) => !hasLiked ? prev + 1 : prev - 1);
		try {
			const status = await toggleLike(articleId, token);
			setLikes(status.totalLikes);
			setHasLiked(status.hasLiked);
		} catch (err) {
			console.error("Failed to toggle like:", err);
			setHasLiked(previousHasLiked);
			setLikes((prev) => previousHasLiked ? prev + 1 : prev - 1);
		}
	};
	if (loading) return /* @__PURE__ */ jsxs("button", {
		className: "btn btn-outline-secondary",
		disabled: true,
		children: [/* @__PURE__ */ jsx("i", { className: "bi bi-hand-thumbs-up" }), " Loading..."]
	});
	return /* @__PURE__ */ jsxs("button", {
		onClick: handleToggle,
		className: `btn ${hasLiked ? "btn-primary" : "btn-outline-primary"} d-flex align-items-center gap-2`,
		children: [/* @__PURE__ */ jsx("i", { className: `bi ${hasLiked ? "bi-hand-thumbs-up-fill" : "bi-hand-thumbs-up"}` }), /* @__PURE__ */ jsxs("span", { children: [
			likes,
			" ",
			likes === 1 ? "Like" : "Likes"
		] })]
	});
}
//#endregion
//#region app/components/CommentSection.tsx
function CommentSection({ articleId }) {
	const [comments, setComments] = useState([]);
	const [page, setPage] = useState(0);
	const [hasMore, setHasMore] = useState(false);
	const [loading, setLoading] = useState(false);
	const [newCommentText, setNewCommentText] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const currentUser = getUser();
	const token = getToken();
	const fetchComments = async (pageToFetch, append = false) => {
		setLoading(true);
		try {
			const data = await getComments(articleId, pageToFetch, 10);
			if (append) setComments((prev) => [...prev, ...data.content]);
			else setComments(data.content);
			setHasMore(data.totalPages > pageToFetch + 1);
		} catch (err) {
			console.error("Failed to load comments", err);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchComments(0);
		setPage(0);
	}, [articleId]);
	const handleLoadMore = () => {
		const nextPage = page + 1;
		setPage(nextPage);
		fetchComments(nextPage, true);
	};
	const handleAddComment = async (e) => {
		e.preventDefault();
		if (!token) return;
		if (!newCommentText.trim()) return;
		setSubmitting(true);
		try {
			const comment = await addComment(articleId, newCommentText, token);
			setComments((prev) => [comment, ...prev]);
			setNewCommentText("");
		} catch (err) {
			console.error("Failed to post comment", err);
			alert("Failed to post comment. Please try again.");
		} finally {
			setSubmitting(false);
		}
	};
	const handleDelete = async (commentId) => {
		if (!token) return;
		if (!confirm("Are you sure you want to delete this comment?")) return;
		try {
			await deleteComment(commentId, token);
			setComments((prev) => prev.filter((c) => c.id !== commentId));
		} catch (err) {
			console.error("Failed to delete comment", err);
			alert("Failed to delete comment. You may not be authorized.");
		}
	};
	const canDelete = (authorId) => {
		if (!currentUser) return false;
		return currentUser.userId === authorId || currentUser.staff === true;
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "comments-section mt-5 border-top pt-4",
		children: [
			/* @__PURE__ */ jsx("h4", { children: "Comments" }),
			token ? /* @__PURE__ */ jsxs("form", {
				onSubmit: handleAddComment,
				className: "mb-4",
				children: [/* @__PURE__ */ jsx("div", {
					className: "mb-2",
					children: /* @__PURE__ */ jsx("textarea", {
						className: "form-control",
						rows: 3,
						placeholder: "Add a comment...",
						value: newCommentText,
						onChange: (e) => setNewCommentText(e.target.value),
						disabled: submitting
					})
				}), /* @__PURE__ */ jsx("button", {
					type: "submit",
					className: "btn btn-primary",
					disabled: submitting || !newCommentText.trim(),
					children: submitting ? "Posting..." : "Post Comment"
				})]
			}) : /* @__PURE__ */ jsx("div", {
				className: "alert alert-secondary",
				children: "Please log in to add a comment."
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "comments-list",
				children: [
					comments.length === 0 && !loading && /* @__PURE__ */ jsx("p", {
						className: "text-muted",
						children: "No comments yet. Be the first to start the conversation!"
					}),
					comments.map((comment) => /* @__PURE__ */ jsxs("div", {
						className: "comment-card card mb-3 p-3",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "d-flex justify-content-between align-items-start mb-2",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("strong", { children: comment.authorName }), /* @__PURE__ */ jsx("small", {
								className: "text-muted ms-2",
								children: new Date(comment.createdAt).toLocaleDateString()
							})] }), canDelete(comment.authorId) && /* @__PURE__ */ jsx("button", {
								className: "btn btn-sm btn-outline-danger border-0",
								onClick: () => handleDelete(comment.id),
								title: "Delete Comment",
								children: /* @__PURE__ */ jsx("i", { className: "bi bi-trash" })
							})]
						}), /* @__PURE__ */ jsx("p", {
							className: "mb-0",
							style: { whiteSpace: "pre-wrap" },
							children: comment.text
						})]
					}, comment.id)),
					hasMore && /* @__PURE__ */ jsx("div", {
						className: "text-center mt-3",
						children: /* @__PURE__ */ jsx("button", {
							className: "btn btn-outline-secondary",
							onClick: handleLoadMore,
							disabled: loading,
							children: loading ? "Loading..." : "Load More Comments"
						})
					})
				]
			})
		]
	});
}
//#endregion
//#region app/routes/article.tsx
var article_exports = /* @__PURE__ */ __exportAll({
	HydrateFallback: () => HydrateFallback,
	clientLoader: () => clientLoader,
	default: () => article_default,
	meta: () => meta
});
async function clientLoader({ params }) {
	try {
		const { user } = await getOptionalAuthUser();
		const res = await apiFetch(`/api/articles/${params.id}`);
		if (!res.ok) throw redirect("/articles");
		return {
			article: await res.json(),
			user
		};
	} catch (e) {
		if (e instanceof Response) throw e;
		throw redirect("/articles");
	}
}
var HydrateFallback = UNSAFE_withHydrateFallbackProps(function HydrateFallback() {
	return /* @__PURE__ */ jsx(PageSpinner, {});
});
function meta({ data }) {
	return [{ title: `Silver Guide - ${data?.title ?? "Article"}` }];
}
var ALLOWED_TAGS = new Set([
	"b",
	"strong",
	"i",
	"em",
	"u",
	"a",
	"br",
	"mark",
	"code",
	"s",
	"strike",
	"del"
]);
function sanitize(html) {
	return html.replace(/<(\/?)([a-zA-Z][a-zA-Z0-9]*)([^>]*)>/g, (_, close, tag, attrs) => {
		const lower = tag.toLowerCase();
		if (!ALLOWED_TAGS.has(lower)) return "";
		if (close) return `</${lower}>`;
		if (lower === "a") return `<a href="${attrs.match(/href="([^"]*)"/)?.[1] ?? "#"}">`;
		return `<${lower}>`;
	});
}
function safe(html) {
	return { __html: sanitize(String(html ?? "")) };
}
function renderBlocks(blocks) {
	return blocks.map((block, i) => {
		const { type, data } = block;
		if (type === "paragraph") return /* @__PURE__ */ jsx("p", { dangerouslySetInnerHTML: safe(data.text) }, i);
		if (type === "header") {
			if (data.level === 2) return /* @__PURE__ */ jsx("h2", {
				className: "section-title",
				children: data.text
			}, i);
			if (data.level === 3) return /* @__PURE__ */ jsx("h3", { children: data.text }, i);
			return /* @__PURE__ */ jsx("h4", { children: data.text }, i);
		}
		if (type === "list") {
			const items = data.items.map((item, j) => /* @__PURE__ */ jsx("li", { dangerouslySetInnerHTML: safe(typeof item === "string" ? item : item.content) }, j));
			return data.style === "ordered" ? /* @__PURE__ */ jsx("ol", {
				className: "mb-4",
				children: items
			}, i) : /* @__PURE__ */ jsx("ul", {
				className: "mb-4",
				children: items
			}, i);
		}
		if (type === "quote") return /* @__PURE__ */ jsxs("div", {
			className: "analogy mb-4",
			children: [/* @__PURE__ */ jsx("span", { dangerouslySetInnerHTML: safe(data.text) }), data.caption && /* @__PURE__ */ jsx("footer", {
				className: "blockquote-footer mt-1",
				children: /* @__PURE__ */ jsx("span", { dangerouslySetInnerHTML: safe(data.caption) })
			})]
		}, i);
		if (type === "warning") return /* @__PURE__ */ jsxs("div", {
			className: "tip-box",
			children: [/* @__PURE__ */ jsx("h5", {
				className: "fw-bold",
				children: data.title
			}), /* @__PURE__ */ jsx("p", { dangerouslySetInnerHTML: safe(data.message) })]
		}, i);
		if (type === "scam_alert") return /* @__PURE__ */ jsx("div", {
			className: "alert alert-danger border-0 shadow-sm p-4 mb-4",
			style: { borderRadius: "1.5rem" },
			children: /* @__PURE__ */ jsxs("div", {
				className: "d-flex align-items-center",
				children: [/* @__PURE__ */ jsx("div", {
					className: "me-3 fs-1",
					children: "🚨"
				}), /* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("h4", {
						className: "fw-bold mb-1",
						children: "Think you've been scammed?"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mb-2 text-dark",
						children: "Don't wait. Every minute counts when protecting your money."
					}),
					/* @__PURE__ */ jsx(Link, {
						to: "/emergency",
						className: "btn btn-danger fw-bold rounded-pill px-4",
						children: "GET HELP NOW"
					})
				] })]
			})
		}, i);
		if (type === "delimiter") return /* @__PURE__ */ jsx("hr", { className: "my-4" }, i);
		if (type === "image") return /* @__PURE__ */ jsx("img", {
			src: data.url,
			className: "img-fluid rounded mb-4",
			alt: data.caption ?? ""
		}, i);
		return null;
	});
}
function blocksToText(blocks) {
	return blocks.map(({ type, data }) => {
		if (type === "paragraph") return data.text?.replace(/<[^>]*>/g, "") ?? "";
		if (type === "header") return data.text ?? "";
		if (type === "list") return data.items.map((i) => typeof i === "string" ? i : i.content).join(". ");
		if (type === "quote") return data.text ?? "";
		if (type === "warning") return `${data.title ?? ""}: ${data.message ?? ""}`;
		if (type === "scam_alert") return "Think you've been scammed? Don't wait. Every minute counts when protecting your money. Get help now.";
		return "";
	}).filter(Boolean).join("\n\n");
}
var article_default = UNSAFE_withComponentProps(function ArticlePage() {
	const { article, user } = useLoaderData();
	const navigate = useNavigate();
	let blocks = [];
	try {
		blocks = JSON.parse(article.content).blocks ?? [];
	} catch {}
	async function handleDelete() {
		if (!confirm("Are you sure you want to delete this article? This cannot be undone.")) return;
		const token = getToken();
		if ((await apiFetch(`/api/articles/${article.id}`, {
			method: "DELETE",
			headers: { Authorization: `Bearer ${token}` }
		})).ok) navigate("/articles");
	}
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
		className: "container py-5 d-flex justify-content-center",
		children: /* @__PURE__ */ jsxs("article", {
			className: "article-container",
			children: [
				/* @__PURE__ */ jsx("nav", {
					"aria-label": "breadcrumb",
					className: "mb-4",
					children: /* @__PURE__ */ jsxs("ol", {
						className: "breadcrumb",
						children: [/* @__PURE__ */ jsx("li", {
							className: "breadcrumb-item",
							children: /* @__PURE__ */ jsx(Link, {
								to: "/articles",
								className: "text-decoration-none text-muted",
								children: "Articles"
							})
						}), /* @__PURE__ */ jsx("li", {
							className: "breadcrumb-item active",
							"aria-current": "page",
							children: article.title
						})]
					})
				}),
				user?.staff && /* @__PURE__ */ jsxs("div", {
					className: "d-flex gap-2 mb-3",
					children: [/* @__PURE__ */ jsx(Link, {
						to: `/editor?edit=${article.id}`,
						className: "btn btn-outline-primary btn-sm",
						children: "Edit"
					}), /* @__PURE__ */ jsx("button", {
						onClick: handleDelete,
						className: "btn btn-outline-danger btn-sm",
						children: "Delete"
					})]
				}),
				/* @__PURE__ */ jsx("h1", {
					className: "display-4 fw-bold mb-3",
					children: article.title
				}),
				article.topicName && /* @__PURE__ */ jsx("span", {
					className: "badge bg-primary-subtle text-primary-emphasis mb-4 d-inline-block",
					children: article.topicName
				}),
				article.imgUrl && /* @__PURE__ */ jsx("img", {
					src: article.imgUrl,
					className: "article-header-img shadow-sm",
					alt: article.title
				}),
				article.subtitle && /* @__PURE__ */ jsx("p", {
					className: "lead",
					children: article.subtitle
				}),
				renderBlocks(blocks),
				/* @__PURE__ */ jsx("div", {
					className: "d-flex align-items-center mt-4 mb-2",
					children: /* @__PURE__ */ jsx(LikeButton, { articleId: article.id })
				}),
				/* @__PURE__ */ jsx(CommentSection, { articleId: article.id }),
				/* @__PURE__ */ jsx("div", {
					className: "text-center mt-5",
					children: /* @__PURE__ */ jsx(Link, {
						to: "/articles",
						className: "btn btn-outline-secondary btn-lg rounded-pill px-5",
						children: "Back to Articles"
					})
				})
			]
		})
	}), user && /* @__PURE__ */ jsx(ChatWidget, {
		articleTitle: article.title,
		articleContent: blocksToText(blocks)
	})] });
});
//#endregion
//#region \0virtual:react-router/server-manifest
var server_manifest_default = {
	"entry": {
		"module": "/assets/entry.client-CDBedtRF.js",
		"imports": ["/assets/chunk-Cx__J34k.js", "/assets/jsx-runtime-z62lBz06.js"],
		"css": []
	},
	"routes": {
		"root": {
			"id": "root",
			"parentId": void 0,
			"path": "",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": true,
			"module": "/assets/root-BF14_cLB.js",
			"imports": ["/assets/chunk-Cx__J34k.js", "/assets/jsx-runtime-z62lBz06.js"],
			"css": ["/assets/root-B4dViCnJ.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/admin/layout": {
			"id": "routes/admin/layout",
			"parentId": "root",
			"path": "admin",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": true,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/layout-0PjZirLO.js",
			"imports": [
				"/assets/jsx-runtime-z62lBz06.js",
				"/assets/auth-D0LXK-Lw.js",
				"/assets/chunk-Cx__J34k.js",
				"/assets/api-DaiQSZcV.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/admin/dashboard": {
			"id": "routes/admin/dashboard",
			"parentId": "routes/admin/layout",
			"path": void 0,
			"index": true,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": true,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/dashboard-C7ZXs56X.js",
			"imports": [
				"/assets/jsx-runtime-z62lBz06.js",
				"/assets/api-DaiQSZcV.js",
				"/assets/auth-D0LXK-Lw.js",
				"/assets/chunk-Cx__J34k.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/admin/articles": {
			"id": "routes/admin/articles",
			"parentId": "routes/admin/layout",
			"path": "articles",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": true,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/articles-LFyKErtb.js",
			"imports": [
				"/assets/jsx-runtime-z62lBz06.js",
				"/assets/api-DaiQSZcV.js",
				"/assets/auth-D0LXK-Lw.js",
				"/assets/chunk-Cx__J34k.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/layout": {
			"id": "routes/layout",
			"parentId": "root",
			"path": void 0,
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/layout-B76c8n6G.js",
			"imports": [
				"/assets/chunk-Cx__J34k.js",
				"/assets/jsx-runtime-z62lBz06.js",
				"/assets/I18nContext-CetW8d5I.js",
				"/assets/api-DaiQSZcV.js",
				"/assets/auth-D0LXK-Lw.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/home": {
			"id": "routes/home",
			"parentId": "routes/layout",
			"path": void 0,
			"index": true,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": true,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/home-B06woO8j.js",
			"imports": [
				"/assets/chunk-Cx__J34k.js",
				"/assets/jsx-runtime-z62lBz06.js",
				"/assets/ArticleCard-CiOYnmfM.js",
				"/assets/PageSpinner-Cm3gAB3n.js",
				"/assets/I18nContext-CetW8d5I.js",
				"/assets/api-DaiQSZcV.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/login": {
			"id": "routes/login",
			"parentId": "routes/layout",
			"path": "login",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/login-CtjAdDQ2.js",
			"imports": [
				"/assets/chunk-Cx__J34k.js",
				"/assets/jsx-runtime-z62lBz06.js",
				"/assets/I18nContext-CetW8d5I.js",
				"/assets/api-DaiQSZcV.js",
				"/assets/auth-D0LXK-Lw.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/register": {
			"id": "routes/register",
			"parentId": "routes/layout",
			"path": "register",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/register-7dl2nmnh.js",
			"imports": [
				"/assets/chunk-Cx__J34k.js",
				"/assets/jsx-runtime-z62lBz06.js",
				"/assets/I18nContext-CetW8d5I.js",
				"/assets/api-DaiQSZcV.js",
				"/assets/auth-D0LXK-Lw.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/articles": {
			"id": "routes/articles",
			"parentId": "routes/layout",
			"path": "articles",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": true,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/articles-19XUv5dK.js",
			"imports": [
				"/assets/jsx-runtime-z62lBz06.js",
				"/assets/ArticleCard-CiOYnmfM.js",
				"/assets/PageSpinner-Cm3gAB3n.js",
				"/assets/SearchBar-D54bfpyh.js",
				"/assets/api-DaiQSZcV.js",
				"/assets/chunk-Cx__J34k.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/editor/editor": {
			"id": "routes/editor/editor",
			"parentId": "routes/layout",
			"path": "editor",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": true,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/editor-CMRLeedN.js",
			"imports": [
				"/assets/chunk-Cx__J34k.js",
				"/assets/jsx-runtime-z62lBz06.js",
				"/assets/PageSpinner-Cm3gAB3n.js",
				"/assets/api-DaiQSZcV.js",
				"/assets/auth-D0LXK-Lw.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/about": {
			"id": "routes/about",
			"parentId": "routes/layout",
			"path": "about",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/about-DKI-oVFS.js",
			"imports": [
				"/assets/chunk-Cx__J34k.js",
				"/assets/jsx-runtime-z62lBz06.js",
				"/assets/I18nContext-CetW8d5I.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/emergency": {
			"id": "routes/emergency",
			"parentId": "routes/layout",
			"path": "emergency",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/emergency-BijLikJA.js",
			"imports": [
				"/assets/jsx-runtime-z62lBz06.js",
				"/assets/I18nContext-CetW8d5I.js",
				"/assets/chunk-Cx__J34k.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/ai-tutorial": {
			"id": "routes/ai-tutorial",
			"parentId": "routes/layout",
			"path": "ai-tutorial",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/ai-tutorial-BMk9om13.js",
			"imports": ["/assets/jsx-runtime-z62lBz06.js", "/assets/chunk-Cx__J34k.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/articles.topic.$id": {
			"id": "routes/articles.topic.$id",
			"parentId": "routes/layout",
			"path": "articles/topic/:id",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": true,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/articles.topic._id-B6DqBcG_.js",
			"imports": [
				"/assets/jsx-runtime-z62lBz06.js",
				"/assets/ArticleCard-CiOYnmfM.js",
				"/assets/PageSpinner-Cm3gAB3n.js",
				"/assets/SearchBar-D54bfpyh.js",
				"/assets/api-DaiQSZcV.js",
				"/assets/chunk-Cx__J34k.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"article-with-slug": {
			"id": "article-with-slug",
			"parentId": "routes/layout",
			"path": "articles/:id/:slug",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": true,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/article-DBfOl5lz.js",
			"imports": [
				"/assets/chunk-Cx__J34k.js",
				"/assets/jsx-runtime-z62lBz06.js",
				"/assets/PageSpinner-Cm3gAB3n.js",
				"/assets/api-DaiQSZcV.js",
				"/assets/auth-D0LXK-Lw.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"article-without-slug": {
			"id": "article-without-slug",
			"parentId": "routes/layout",
			"path": "articles/:id",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": true,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/article-DBfOl5lz.js",
			"imports": [
				"/assets/chunk-Cx__J34k.js",
				"/assets/jsx-runtime-z62lBz06.js",
				"/assets/PageSpinner-Cm3gAB3n.js",
				"/assets/api-DaiQSZcV.js",
				"/assets/auth-D0LXK-Lw.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		}
	},
	"url": "/assets/manifest-619ec219.js",
	"version": "619ec219",
	"sri": void 0
};
//#endregion
//#region \0virtual:react-router/server-build
var assetsBuildDirectory = "build/client";
var basename = "/";
var future = {
	"unstable_optimizeDeps": false,
	"unstable_passThroughRequests": false,
	"unstable_subResourceIntegrity": false,
	"unstable_trailingSlashAwareDataRequests": false,
	"unstable_previewServerPrerendering": false,
	"v8_middleware": false,
	"v8_splitRouteModules": false,
	"v8_viteEnvironmentApi": false
};
var ssr = true;
var isSpaMode = false;
var prerender = [];
var routeDiscovery = {
	"mode": "lazy",
	"manifestPath": "/__manifest"
};
var publicPath = "/";
var entry = { module: entry_server_node_exports };
var routes = {
	"root": {
		id: "root",
		parentId: void 0,
		path: "",
		index: void 0,
		caseSensitive: void 0,
		module: root_exports
	},
	"routes/admin/layout": {
		id: "routes/admin/layout",
		parentId: "root",
		path: "admin",
		index: void 0,
		caseSensitive: void 0,
		module: layout_exports$1
	},
	"routes/admin/dashboard": {
		id: "routes/admin/dashboard",
		parentId: "routes/admin/layout",
		path: void 0,
		index: true,
		caseSensitive: void 0,
		module: dashboard_exports
	},
	"routes/admin/articles": {
		id: "routes/admin/articles",
		parentId: "routes/admin/layout",
		path: "articles",
		index: void 0,
		caseSensitive: void 0,
		module: articles_exports$1
	},
	"routes/layout": {
		id: "routes/layout",
		parentId: "root",
		path: void 0,
		index: void 0,
		caseSensitive: void 0,
		module: layout_exports
	},
	"routes/home": {
		id: "routes/home",
		parentId: "routes/layout",
		path: void 0,
		index: true,
		caseSensitive: void 0,
		module: home_exports
	},
	"routes/login": {
		id: "routes/login",
		parentId: "routes/layout",
		path: "login",
		index: void 0,
		caseSensitive: void 0,
		module: login_exports
	},
	"routes/register": {
		id: "routes/register",
		parentId: "routes/layout",
		path: "register",
		index: void 0,
		caseSensitive: void 0,
		module: register_exports
	},
	"routes/articles": {
		id: "routes/articles",
		parentId: "routes/layout",
		path: "articles",
		index: void 0,
		caseSensitive: void 0,
		module: articles_exports
	},
	"routes/editor/editor": {
		id: "routes/editor/editor",
		parentId: "routes/layout",
		path: "editor",
		index: void 0,
		caseSensitive: void 0,
		module: editor_exports
	},
	"routes/about": {
		id: "routes/about",
		parentId: "routes/layout",
		path: "about",
		index: void 0,
		caseSensitive: void 0,
		module: about_exports
	},
	"routes/emergency": {
		id: "routes/emergency",
		parentId: "routes/layout",
		path: "emergency",
		index: void 0,
		caseSensitive: void 0,
		module: emergency_exports
	},
	"routes/ai-tutorial": {
		id: "routes/ai-tutorial",
		parentId: "routes/layout",
		path: "ai-tutorial",
		index: void 0,
		caseSensitive: void 0,
		module: ai_tutorial_exports
	},
	"routes/articles.topic.$id": {
		id: "routes/articles.topic.$id",
		parentId: "routes/layout",
		path: "articles/topic/:id",
		index: void 0,
		caseSensitive: void 0,
		module: articles_topic_$id_exports
	},
	"article-with-slug": {
		id: "article-with-slug",
		parentId: "routes/layout",
		path: "articles/:id/:slug",
		index: void 0,
		caseSensitive: void 0,
		module: article_exports
	},
	"article-without-slug": {
		id: "article-without-slug",
		parentId: "routes/layout",
		path: "articles/:id",
		index: void 0,
		caseSensitive: void 0,
		module: article_exports
	}
};
var allowedActionOrigins = false;
//#endregion
export { allowedActionOrigins, server_manifest_default as assets, assetsBuildDirectory, basename, entry, future, isSpaMode, prerender, publicPath, routeDiscovery, routes, ssr };
