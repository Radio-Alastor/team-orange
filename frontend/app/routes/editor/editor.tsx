import { useEffect, useRef, useState } from "react";
import { redirect, useLoaderData, useNavigate } from "react-router";
import PageSpinner from "../../components/PageSpinner";
import { apiFetch } from "../../lib/api";
import { getToken, requireStaffUser } from "../../lib/auth";
import { DEFAULT_META, DEFAULT_DATA } from "./editorDefaults";
import type { Topic } from "./types";
import ArticleMetaForm from "./ArticleMetaForm";
import BlockReference from "./BlockReference";

export async function clientLoader({ request }: { request: Request }) {
  const { token, user: me } = await requireStaffUser();

  let topics: Topic[] = [];
  try {
    const topicsRes = await apiFetch("/api/topics");
    if (topicsRes.ok) topics = await topicsRes.json();
  } catch {
    // backend unreachable; topics stays empty
  }

  const editId = new URL(request.url).searchParams.get("edit");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let article: any = null;
  if (editId) {
    const articleRes = await apiFetch(`/api/articles/${editId}`);
    if (articleRes.ok) article = await articleRes.json();
  }

  return { topics, article };
}

export function HydrateFallback() { return <PageSpinner />; }

export function meta() {
  return [{ title: "Silver Guide - Article Editor" }];
}

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function ArticleEditor() {
  const { topics, article } = useLoaderData<typeof clientLoader>();
  const navigate = useNavigate();
  const editorRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorInstanceRef = useRef<any>(null);

  const [title, setTitle] = useState(article?.title ?? "");
  const [topicId, setTopicId] = useState<number | null>(article?.topicId ?? null);
  const [subtitle, setSubtitle] = useState(article?.subtitle ?? "");
  const [description, setDescription] = useState(article?.description ?? "");
  const [heroImage, setHeroImage] = useState(article?.imgUrl ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = "Title is required.";
    else if (title.length > 255) e.title = "Title must be 255 characters or fewer.";
    if (!topicId) e.topicId = "Topic is required.";
    if (subtitle.length > 500) e.subtitle = "Sub Title must be 500 characters or fewer.";
    if (description.length > 1000) e.description = "Summary must be 1000 characters or fewer.";
    if (heroImage.length > 255) e.heroImage = "Hero Image URL must be 255 characters or fewer.";
    return e;
  }

  useEffect(() => {
    // NOTE: This is to circumvent strict mode double-invoking in development which causes Editor.js
    // to throw an error about being initialized twice. We want to initialize it only once.
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

      const { default: SimpleImage } = await import("../../tools/SimpleImage");
      const { default: ScamAlertTool } = await import("../../tools/ScamAlertTool");

      if (cancelled) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let initialData: any = { blocks: [] };
      if (article?.content) {
        try { initialData = JSON.parse(article.content); } catch { /* keep empty */ }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ed = new EditorJS({
        holder: editorRef.current!,
        placeholder: "Start writing your article… press Tab to add a block.",
        data: initialData,
        tools: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          header: { class: Header as any, config: { levels: [2, 3, 4], defaultLevel: 2 } },
          list: { class: EditorjsList, inlineToolbar: true, config: { defaultStyle: "unordered" } },
          quote: { class: Quote, inlineToolbar: true, config: { quotePlaceholder: "Enter analogy or quote…", captionPlaceholder: "Source or caption (optional)" } },
          warning: { class: Warning, inlineToolbar: true, config: { titlePlaceholder: "Tip title", messagePlaceholder: "Tip content…" } },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          image: SimpleImage as any,
          delimiter: Delimiter,
          scam_alert: ScamAlertTool as any,
          underline: Underline,
          marker: Marker,
          inlineCode: InlineCode,
          strikethrough: Strikethrough,
        },
        onReady: () => { console.log("Editor.js ready"); },
      });

      editorInstanceRef.current = ed;
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

  async function saveToBackend(status: "DRAFT" | "PUBLISHED" = "PUBLISHED") {
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
      status: status
    };

    const token = getToken();
    if (!token) {
      alert("You must be signed in to save articles.");
      return;
    }

    try {
      const endpoint = article ? `/api/articles/${article.id}` : "/api/articles";
      const method   = article ? "PUT" : "POST";
      const res = await apiFetch(endpoint, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (res.status === 401) { alert("Session expired — please sign in again."); return; }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const saved = await res.json();
      navigate(`/articles/${saved.id}/${slugify(saved.title)}`);
    } catch (err) {
      console.warn("Backend not available, payload logged:", payload);
      alert("Backend not available. Payload logged to console (F12).");
    }
  }

  return (
    <>
      <main className="container py-5">
        <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
          <div>
            <h1 className="fw-bold mb-1">{article ? "Edit Article" : "Article Editor"}</h1>
            <p className="text-muted">{article ? "Update an existing Silver Guide article" : "Write and publish a new Silver Guide article"}</p>
          </div>
          <div className="d-flex gap-2 flex-wrap">
            <button onClick={() => saveToBackend("DRAFT")} className="btn btn-outline-secondary">Save Draft</button>
            <button onClick={loadExample} className="btn btn-outline-secondary">Load Example</button>
            <button onClick={() => saveToBackend("PUBLISHED")} className="btn btn-success fw-bold">{article ? "Update Article" : "Publish Article"}</button>
          </div>
        </div>

        <ArticleMetaForm
          title={title} setTitle={setTitle}
          topicId={topicId} setTopicId={setTopicId} topics={topics}
          subtitle={subtitle} setSubtitle={setSubtitle}
          description={description} setDescription={setDescription}
          heroImage={heroImage} setHeroImage={setHeroImage}
          errors={errors}
          onClearError={(field) => setErrors((prev) => ({ ...prev, [field]: "" }))}
          onDismissErrors={() => setErrors({})}
        />

        <div className="card border-2 border-light shadow-sm rounded-4 mb-4">
          <div className="card-body p-4">
            <h5 className="fw-bold mb-1">Article Content</h5>
            <p className="text-muted mb-4">
              Click <strong>+</strong> or press <kbd>Tab</kbd> to add a block.
              Use <strong>Header (H2)</strong> for section titles, <strong>Quote</strong> for analogy boxes, and{" "}
              <strong>Warning</strong> for tip/safety boxes.
            </p>
            <div ref={editorRef} className="editor-wrapper" />
          </div>
        </div>

        <BlockReference />
      </main>

    </>
  );
}
