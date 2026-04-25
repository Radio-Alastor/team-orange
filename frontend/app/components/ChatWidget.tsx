import { useState, useRef, useEffect } from "react";
import { apiFetch } from "../lib/api";
import { getToken } from "../lib/auth";

const LOADING_MESSAGES = [
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
  "Nearly there — good things take time…",
];

interface ChatWidgetProps {
  articleTitle: string;
  articleContent: string;
}

type Message = { role: "user" | "assistant"; content: string };

const WELCOME: Message = {
  role: "assistant",
  content:
    "Hi! I'm your article tutor. Ask me anything about this article, or say **quiz me** and I'll test your understanding!",
};

export default function ChatWidget({ articleTitle, articleContent }: ChatWidgetProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (!loading) return;
    const randomMsg = () => LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];
    const randomDelay = () => 1500 + Math.random() * 1500; // 1500–3000 ms
    setLoadingMsg(randomMsg());
    let id: ReturnType<typeof setTimeout>;
    const schedule = () => {
      id = setTimeout(() => { setLoadingMsg(randomMsg()); schedule(); }, randomDelay());
    };
    schedule();
    return () => clearTimeout(id);
  }, [loading]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);
    setTimeout(() => {}, 10000);
    try {
      const res = await apiFetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          article_title: articleTitle,
          article_content: articleContent,
          messages: next,
        }),
      });
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages([
        ...next,
        { role: "assistant", content: "Sorry, I am not able to connect to the tutor services. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="chat-widget">
      {open && (
        <div className="chat-panel">
          <div className="chat-panel-header">
            <span className="fw-semibold">Article Tutor</span>
            <button
              className="btn-close btn-close-white"
              aria-label="Close"
              onClick={() => setOpen(false)}
            />
          </div>

          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={msg.role === "user" ? "chat-msg-user" : "chat-msg-assistant"}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="chat-msg-assistant chat-msg-loading">
                <span className="loading-text">{loadingMsg}</span>
                <span className="dot" /><span className="dot" /><span className="dot" />
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="chat-input-row">
            <textarea
              className="form-control chat-textarea"
              rows={2}
              placeholder="Ask a question…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              className="btn btn-primary chat-send-btn"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              aria-label="Send"
            >
              &#9654;
            </button>
          </div>
        </div>
      )}

      <button
        className="chat-tab"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Toggle article tutor"
      >
        Ask Tutor
      </button>
    </div>
  );
}
