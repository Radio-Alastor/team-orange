import { useEffect, useRef, useState } from "react";
import { redirect } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { apiFetch } from "../lib/api";
import { getToken } from "../lib/auth";

export async function clientLoader() {
  const token = getToken();
  if (!token) throw redirect('/login');

  const res = await apiFetch('/api/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw redirect('/login');

  const me = await res.json();
  if (!me.staff) throw redirect('/login');

  return null;
}

export function HydrateFallback() {
  return (
    <>
      <Navbar />
      <div className="container py-5 text-center text-muted">Loading…</div>
      <Footer />
    </>
  );
}

export function meta() {
  return [{ title: "Silver Guide - Article Editor" }];
}

const CATEGORIES = {
  tech: { label: "Tech Tutorial", color: "blue" },
  skill: { label: "Skill Building", color: "green" },
  warning: { label: "Urgent Warning", color: "red" },
  scam: { label: "Scam Alert", color: "yellow" },
} as const;

type CategoryKey = keyof typeof CATEGORIES;

const DEFAULT_META = {
  title: "Spotting Phishing Emails",
  category: "scam" as CategoryKey,
  description: "Is that email really from your bank? We teach you how to check sender addresses and avoid suspicious links.",
  readingTime: "5",
  heroImage: "/imgs/phishing_alert.png",
};

const DEFAULT_DATA = {
  blocks: [
    { type: "paragraph", data: { text: '"Phishing" (pronounced "fishing") is when a scammer sends you an email pretending to be someone you trust — your bank, Australia Post, myGov, or even a family member. Their goal is to trick you into clicking a link and entering your personal details.' } },
    { type: "header", data: { text: "The Tell-Tale Signs of a Phishing Email", level: 2 } },
    {
      type: "list",
      data: {
        style: "unordered", meta: {},
        items: [
          { content: "The sender's email address looks odd (e.g. support@amaz0n-help.net instead of @amazon.com)", meta: {}, items: [] },
          { content: 'It creates urgency — "Your account will be closed in 24 hours!"', meta: {}, items: [] },
          { content: "It asks you to click a link and log in to verify your details", meta: {}, items: [] },
          { content: 'The greeting is generic: "Dear Customer" instead of your name', meta: {}, items: [] },
          { content: "There are spelling mistakes or the logo looks slightly off", meta: {}, items: [] },
        ],
      },
    },
    { type: "quote", data: { text: "Think of it like a fake letter in your letterbox — it might look official, but if you hold it up to the light, the small details give it away.", caption: "" } },
    { type: "header", data: { text: "How to Check if an Email Is Real", level: 2 } },
    { type: "paragraph", data: { text: "Before clicking anything, try these quick checks:" } },
    {
      type: "list",
      data: {
        style: "ordered", meta: {},
        items: [
          { content: "Hover your mouse over any link (don't click!) and look at the web address that appears at the bottom of the screen", meta: {}, items: [] },
          { content: "Check the sender's full email address by clicking on their name", meta: {}, items: [] },
          { content: "Go directly to the company's website by typing the address into your browser yourself", meta: {}, items: [] },
          { content: "Call the company on their official number if you're still unsure", meta: {}, items: [] },
        ],
      },
    },
    { type: "warning", data: { title: "When in doubt, don't click", message: "Legitimate companies like your bank or myGov will never email you asking for your password or full credit card number. If an email asks for this, it is a scam." } },
    { type: "delimiter", data: {} },
    { type: "paragraph", data: { text: "If you think you've clicked a phishing link and entered your details, change your password immediately and call your bank." } },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function blocksToHTML(blocks: any[]): string {
  return blocks.map((block) => {
    const d = block.data;
    switch (block.type) {
      case "paragraph":
        return `            <p>${d.text}</p>`;
      case "header": {
        const tag = `h${d.level}`;
        const cls = d.level === 2 ? ' class="section-title"' : "";
        return `            <${tag}${cls}>${d.text}</${tag}>`;
      }
      case "list": {
        const tag = d.style === "ordered" ? "ol" : "ul";
        const items = d.items
          .map((i: { content?: string } | string) => `                <li class="mb-2">${typeof i === "string" ? i : i.content ?? ""}</li>`)
          .join("\n");
        return `            <${tag}>\n${items}\n            </${tag}>`;
      }
      case "quote":
        return `            <div class="analogy mb-4">\n                <p class="mb-0">${d.text}</p>\n            </div>`;
      case "warning":
        return `            <div class="tip-box">\n                <h5 class="fw-bold">${d.title}</h5>\n                <p class="mb-0">${d.message}</p>\n            </div>`;
      case "image":
        return `            <img src="${d.url}" alt="${d.caption || ""}" class="img-fluid rounded mb-4">`;
      case "delimiter":
        return `            <hr class="my-5">`;
      default:
        return "";
    }
  }).filter(Boolean).join("\n\n");
}

export default function ArticleEditor() {
  const editorRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorInstanceRef = useRef<any>(null);

  const [title, setTitle] = useState(DEFAULT_META.title);
  const [category, setCategory] = useState<CategoryKey>(DEFAULT_META.category);
  const [description, setDescription] = useState(DEFAULT_META.description);
  const [readingTime, setReadingTime] = useState(DEFAULT_META.readingTime);
  const [heroImage, setHeroImage] = useState(DEFAULT_META.heroImage);
  const [topicId, setTopicId] = useState("");
  const [generatedHTML, setGeneratedHTML] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

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
      const { default: SimpleImage } = await import("../tools/SimpleImage");

      if (cancelled) return;

      const draft = typeof window !== "undefined" ? localStorage.getItem("articleEditorDraft") : null;

      if (!draft) {
        setTitle(DEFAULT_META.title);
        setCategory(DEFAULT_META.category);
        setDescription(DEFAULT_META.description);
        setReadingTime(DEFAULT_META.readingTime);
        setHeroImage(DEFAULT_META.heroImage);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ed = new EditorJS({
        holder: editorRef.current!,
        placeholder: "Start writing your article… press Tab to add a block.",
        data: draft ? JSON.parse(draft) : DEFAULT_DATA,
        tools: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          header: { class: Header as any, config: { levels: [2, 3, 4], defaultLevel: 2 } },
          list: { class: EditorjsList, inlineToolbar: true, config: { defaultStyle: "unordered" } },
          quote: { class: Quote, inlineToolbar: true, config: { quotePlaceholder: "Enter analogy or quote…", captionPlaceholder: "Source or caption (optional)" } },
          warning: { class: Warning, inlineToolbar: true, config: { titlePlaceholder: "Tip title", messagePlaceholder: "Tip content…" } },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          image: SimpleImage as any,
          delimiter: Delimiter,
        },
        onReady: () => { console.log("Editor.js ready"); },
        onChange: async (api) => {
          const data = await api.saver.save();
          localStorage.setItem("articleEditorDraft", JSON.stringify(data));
        },
      });

      editorInstanceRef.current = ed;
    }

    initEditor();
    return () => {
      cancelled = true;
      editorInstanceRef.current?.destroy();
    };
  }, []);

  async function generateHTMLOutput() {
    const data = await editorInstanceRef.current?.save();
    if (!data) return;
    const cat = CATEGORIES[category];
    const heroTag = heroImage ? `\n            <img src="${heroImage}" class="article-header-img shadow-sm" alt="${title}">\n` : "";
    const content = blocksToHTML(data.blocks);
    const html = `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<title>Silver Guide - ${title}</title>\n</head>\n<body>\n<h1>${title}</h1>\n<span>${cat.label}</span>\n<p>Estimated reading time: ${readingTime} minutes</p>\n${heroTag}\n${content}\n</body>\n</html>`;
    setGeneratedHTML(html);
    setShowModal(true);
  }

  async function loadExample() {
    if (!confirm("This will replace the current content with the example article. Continue?")) return;
    await editorInstanceRef.current?.render(DEFAULT_DATA);
    setTitle(DEFAULT_META.title);
    setCategory(DEFAULT_META.category);
    setDescription(DEFAULT_META.description);
    setReadingTime(DEFAULT_META.readingTime);
    setHeroImage(DEFAULT_META.heroImage);
    localStorage.removeItem("articleEditorDraft");
  }

  async function saveJSON() {
    const data = await editorInstanceRef.current?.save();
    const output = { title, category, description, readingTime, heroImage, content: data };
    console.log("Article JSON:", JSON.stringify(output, null, 2));
    alert("Article data logged to console (F12 → Console).");
  }

  async function saveToBackend() {
    const editorData = await editorInstanceRef.current?.save();
    const payload = {
      title,
      summary: description,
      imageUrl: heroImage,
      content: JSON.stringify(editorData),
      topicId: parseInt(topicId) || null,
      published: false,
    };

    const token = getToken();
    if (!token) {
      alert("You must be signed in to save articles.");
      return;
    }

    try {
      const res = await apiFetch("/api/articles", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (res.status === 401) { alert("Session expired — please sign in again."); return; }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const article = await res.json();
      localStorage.removeItem("articleEditorDraft");
      alert(`Article saved (id: ${article.id})`);
    } catch (err) {
      console.warn("Backend not available, payload logged:", payload);
      alert("Backend not available. Payload logged to console (F12).");
    }
  }

  function copyHTML() {
    if (!generatedHTML) return;
    navigator.clipboard.writeText(generatedHTML)
      .then(() => alert("Copied to clipboard!"))
      .catch(() => alert("Copy failed — please select all and copy manually."));
  }

  return (
    <>
      <Navbar />

      <main className="container py-5">
        {/* Page heading */}
        <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
          <div>
            <h1 className="fw-bold mb-1">Article Editor</h1>
            <p className="text-muted">Write and export a new Silver Guide article</p>
          </div>
          <div className="d-flex gap-2 flex-wrap">
            <button onClick={loadExample} className="btn btn-outline-secondary">Load Example</button>
            <button onClick={saveJSON} className="btn btn-outline-secondary">Log JSON</button>
            <button onClick={saveToBackend} className="btn btn-success fw-bold">Save to Backend</button>
            <button onClick={generateHTMLOutput} className="btn btn-primary fw-bold">Generate HTML</button>
          </div>
        </div>

        {/* Article metadata */}
        <div className="card border-2 border-light shadow-sm rounded-4 mb-4">
          <div className="card-body p-4">
            <h5 className="fw-bold mb-4">Article Details</h5>
            <div className="row g-3">
              <div className="col-md-8">
                <label className="meta-label mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Understanding AI Helpers"
                  className="form-control form-control-lg"
                />
              </div>
              <div className="col-md-4">
                <label className="meta-label mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryKey)}
                  className="form-select form-select-lg"
                >
                  <option value="tech">Tech Tutorial</option>
                  <option value="skill">Skill Building</option>
                  <option value="warning">Urgent Warning</option>
                  <option value="scam">Scam Alert</option>
                </select>
              </div>
              <div className="col-md-9">
                <label className="meta-label mb-1">
                  Short Description <span className="fw-normal text-muted text-lowercase">(shown on article card)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="A brief summary shown on the articles listing page…"
                  className="form-control"
                />
              </div>
              <div className="col-md-2">
                <label className="meta-label mb-1">Reading Time (min)</label>
                <input
                  type="number"
                  value={readingTime}
                  onChange={(e) => setReadingTime(e.target.value)}
                  min={1}
                  max={60}
                  className="form-control form-control-lg"
                />
              </div>
              <div className="col-md-1">
                <label className="meta-label mb-1">Topic ID</label>
                <input
                  type="number"
                  value={topicId}
                  onChange={(e) => setTopicId(e.target.value)}
                  placeholder="1"
                  min={1}
                  className="form-control form-control-lg"
                />
              </div>
              <div className="col-12">
                <label className="meta-label mb-1">Hero Image URL</label>
                <input
                  type="text"
                  value={heroImage}
                  onChange={(e) => setHeroImage(e.target.value)}
                  placeholder="/imgs/your-image.png"
                  className="form-control form-control-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Editor.js content editor */}
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

        {/* Block reference */}
        <div className="card border-2 border-light shadow-sm rounded-4 mb-5">
          <div className="card-body p-4">
            <h6 className="fw-bold mb-4">Block → Article Style Reference</h6>
            <div className="row g-3">
              {[
                { badge: "H2 Header", desc: "Section title with yellow left border", cls: "badge bg-primary-subtle text-primary" },
                { badge: "Quote", desc: "Italic analogy box (dashed border)", cls: "badge bg-info-subtle text-info" },
                { badge: "Warning", desc: "Tip/safety box (blue left border)", cls: "badge bg-warning-subtle text-warning-emphasis" },
                { badge: "List", desc: "Bullet or numbered list", cls: "badge bg-secondary-subtle text-secondary" },
                { badge: "Image", desc: "Inline image by URL", cls: "badge bg-secondary-subtle text-secondary" },
                { badge: "Delimiter", desc: "Horizontal divider", cls: "badge bg-secondary-subtle text-secondary" },
              ].map((item) => (
                <div key={item.badge} className="col-sm-6 col-lg-4 d-flex align-items-start gap-2">
                  <span className={item.cls}>{item.badge}</span>
                  <span className="text-muted small">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Generated HTML modal */}
      {showModal && (
        <div
          className="modal d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Generated Article HTML</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close" />
              </div>
              <div className="modal-body p-0">
                <pre
                  style={{ background: "#1e1e1e", color: "#d4d4d4", padding: "1.5rem", margin: 0, fontSize: "0.78rem", whiteSpace: "pre-wrap", wordBreak: "break-all" }}
                >
                  {generatedHTML}
                </pre>
              </div>
              <div className="modal-footer">
                <button onClick={copyHTML} className="btn btn-primary fw-bold">Copy to Clipboard</button>
                <button onClick={() => setShowModal(false)} className="btn btn-outline-secondary">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
