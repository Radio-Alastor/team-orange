import { Link } from "react-router";

export function meta() {
  return [{ title: "Silver Guide - Understanding AI Helpers" }];
}

export default function AiTutorial() {
  return (
    <>
      <div className="container py-5 d-flex justify-content-center">
        <article className="article-container">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/articles" className="text-decoration-none text-muted">Articles</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">Understanding AI Helpers</li>
            </ol>
          </nav>

          <h1 className="display-4 fw-bold mb-4">Understanding AI Helpers</h1>
          <p className="text-muted mb-4">Estimated reading time: 5 minutes</p>

          <img
            src="/imgs/ai_tutorial.png"
            className="article-header-img shadow-sm"
            alt="Friendly AI Interface"
          />

          <p className="lead">
            You might have heard the term "AI" or "Artificial Intelligence" on the news or from your grandchildren.
            While it sounds like science fiction, AI is essentially just a very advanced helper living inside your
            computer or phone.
          </p>

          <h2 className="section-title">What exactly is an AI Helper?</h2>
          <p className="mb-4">
            Think of an AI helper like a friendly, incredibly well-read librarian who has read almost every book in the
            world and can answer your questions in seconds.
          </p>
          <div className="analogy mb-4">
            <strong>Analogy:</strong> If a regular search engine (like Google) is a large library where you have to find
            the book yourself, an AI helper is the librarian who goes and gets the answer for you, then explains it in
            simple terms.
          </div>

          <h2 className="section-title">What can they do for you?</h2>
          <p className="mb-4">AI helpers are designed to make your life easier. Here are a few things they are great at:</p>
          <ul className="mb-4">
            <li><strong>Answering Questions:</strong> "How do I bake a gluten-free cake?" or "What is the capital of France?"</li>
            <li><strong>Writing &amp; Editing:</strong> Helping you write a polite email to a neighbor or checking your spelling.</li>
            <li><strong>Planning:</strong> "Plan a 3-day trip to London for someone who loves history."</li>
            <li><strong>Translation:</strong> Helping you understand a letter written in another language.</li>
          </ul>

          <h2 className="section-title">Common AI Helpers you might know</h2>
          <div className="row g-4 mb-4">
            <div className="col-md-6">
              <div className="card h-100 border-0 bg-light p-3">
                <p className="fw-bold mb-1">ChatGPT</p>
                <p className="small text-muted mb-0">
                  A "chatbot" that you can talk to just like you're texting a friend. It's great for long conversations and
                  complicated explanations.
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card h-100 border-0 bg-light p-3">
                <p className="fw-bold mb-1">Siri or Alexa</p>
                <p className="small text-muted mb-0">
                  Voice-activated helpers that live on your phone or in a speaker. Perfect for setting timers, playing
                  music, or checking the weather.
                </p>
              </div>
            </div>
          </div>

          <h2 className="section-title">How to get started safely</h2>
          <p className="mb-4">
            The best way to learn is to try! You can start by asking a simple question. However, keep these two rules in
            mind:
          </p>

          <div className="tip-box">
            <h5 className="fw-bold">Safety First</h5>
            <ol>
              <li>
                <strong>Don't share secrets:</strong> Treat an AI like a helpful stranger. Don't tell it your passwords,
                bank details, or private home address.
              </li>
              <li>
                <strong>Always double-check:</strong> While they are smart, AI helpers can sometimes make mistakes. If
                something seems wrong, verify it with a trusted source.
              </li>
            </ol>
          </div>

          <div className="text-center mt-5">
            <Link to="/articles" className="btn btn-outline-secondary btn-lg rounded-pill px-5">
              Back to Articles
            </Link>
          </div>
        </article>
      </div>

    </>
  );
}
