import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  route("articles", "routes/articles.tsx"),
  route("editor", "routes/editor/editor.tsx"),
  route("about", "routes/about.tsx"),
  route("ai-tutorial", "routes/ai-tutorial.tsx"),
] satisfies RouteConfig;
