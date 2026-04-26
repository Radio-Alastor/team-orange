import { useState, useRef, useEffect } from "react";
import { apiFetch } from "../lib/api";
import { getToken } from "../lib/auth";


// These are loading messages to keep the user entertained while waiting for the tutor's response.
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

// Typescript interface for the props expected by the ChatWidget component, which includes the article's title and content.
interface ChatWidgetProps {
  articleTitle: string;
  articleContent: string;
}

// Defining the structure of a chat message, which can be from either the user or the assistant (tutor).
type Message = { role: "user" | "assistant"; content: string };

// The opening message shown when the chat is first opened.
const WELCOME: Message = {
  role: "assistant",
  content:
    "Hi! I'm your article tutor. Ask me anything about this article, or say **quiz me** and I'll test your understanding!",
};

// Maximum number of messages to keep in the chat history (WELCOME + 50 exchanges).
// Older messages beyond this limit are dropped to avoid sending too much context to the backend.
const MAX_MESSAGES = 51; // WELCOME + 50 exchanges

// Keeps the WELCOME message and the most recent messages up to MAX_MESSAGES.
function truncateMessages(msgs: Message[]): Message[] {
  if (msgs.length <= MAX_MESSAGES) return msgs;
  return [msgs[0], ...msgs.slice(-(MAX_MESSAGES - 1))];
}

export default function ChatWidget({ articleTitle, articleContent }: ChatWidgetProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  // Used to auto-scroll to the latest message.
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom whenever a new message arrives or the panel opens.
  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  // Cycle through random loading messages at random intervals while waiting for the tutor's reply.
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

  // Resets the conversation back to just the welcome message and clears the input field.
  function resetChat() {
    setMessages([WELCOME]);
    setInput("");
  }

  // Sends the user's message to the backend and appends the tutor's reply to the chat.
  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    // Append the new user message and truncate history if needed before sending.
    const next = truncateMessages([...messages, userMsg]);
    setMessages(next);
    setInput("");
    setLoading(true);
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
      // Show a fallback error message in the chat if the request fails.
      setMessages([
        ...next,
        { role: "assistant", content: "Sorry, I am not able to connect to the tutor services. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  // Allows the user to submit their message by pressing Enter (Shift+Enter inserts a new line instead).
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
          {/* Header bar with the tutor title, reset button, and close button. */}
          <div className="chat-panel-header">
            <span className="fw-semibold">Article Tutor</span>
            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-sm btn-outline-light py-0 px-2"
                aria-label="Reset chat"
                title="Start a new conversation"
                onClick={resetChat}
                disabled={loading}
              >
                Reset
              </button>
              <button
                className="btn-close btn-close-white"
                aria-label="Close"
                title="Close the tutor"
                onClick={() => setOpen(false)}
              />
            </div>
          </div>

          {/* Scrollable message history. */}
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={msg.role === "user" ? "chat-msg-user" : "chat-msg-assistant"}
              >
                {msg.content}
              </div>
            ))}
            {/* Animated loading indicator shown while waiting for the tutor's reply. */}
            {loading && (
              <div className="chat-msg-assistant chat-msg-loading">
                <span className="loading-text">{loadingMsg}</span>
                <span className="dot" /><span className="dot" /><span className="dot" />
              </div>
            )}
            {/* Invisible anchor element used to scroll the view to the latest message. */}
            <div ref={bottomRef} />
          </div>

          {/* Input area with a textarea and a send button. */}
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
              title="Send message"
            >
              &#9654;
            </button>
          </div>
        </div>
      )}

      {/* Floating tab button that toggles the chat panel open and closed. */}
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