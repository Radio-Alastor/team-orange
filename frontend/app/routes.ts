import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  route("admin", "routes/admin/layout.tsx", [
    index("routes/admin/dashboard.tsx"),
    route("articles", "routes/admin/articles.tsx")
  ]),
  layout("routes/layout.tsx", [
    index("routes/home.tsx"),
    route("login", "routes/login.tsx"),
    route("register", "routes/register.tsx"),
    route("articles", "routes/articles.tsx"),
    route("editor", "routes/editor/editor.tsx"),
    route("about", "routes/about.tsx"),
    route("emergency", "routes/emergency.tsx"),
    route("ai-tutorial", "routes/ai-tutorial.tsx"),
    route("articles/:id/:slug", "routes/article.tsx", { id: "article-with-slug" }),
    route("articles/:id", "routes/article.tsx", { id: "article-without-slug" }),
  ]),
] satisfies RouteConfig;
