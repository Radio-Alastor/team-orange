import { useState } from "react";
import { Link, useLoaderData } from "react-router";
import { apiFetch } from "../lib/api";
import PageSpinner from "../components/PageSpinner";
import ArticleCard, { type SharedArticleDTO } from "../components/ArticleCard";

export function meta() {
  return [
    { title: "Silver Guide - Home" },
    { name: "description", content: "Helping seniors navigate the digital world with confidence" },
  ];
}

async function fetchTopic(topicId: number): Promise<SharedArticleDTO[]> {
  try {
    const r = await apiFetch(`/api/articles?topicId=${topicId}`);
    if (!r.ok) return [];
    return r.json();
  } catch {
    return [];
  }
}

export async function clientLoader() {
  const [tech, scam] = await Promise.all([fetchTopic(1), fetchTopic(2)]);
  return { tech, scam };
}

export function HydrateFallback() {
  return <PageSpinner />;
}

const TABS = ["Technology Basics", "Scam Awareness"] as const;

export default function Home() {
  const { tech, scam } = useLoaderData<typeof clientLoader>();
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("Technology Basics");

  const activeArticles = activeTab === "Technology Basics" ? tech : scam;

  return (
    <>
      {/* Hero */}
      <div className="container col-xxl-8 px-4 py-5">
        <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
          <div className="col-10 col-sm-8 col-lg-6">
            <img
              src="/imgs/herobanner-img.jpeg"
              className="d-block mx-lg-auto img-fluid rounded-4 shadow-lg border border-2 border-dark"
              alt="an elderly woman smiling and using her smartphone"
              width={700}
              height={500}
              loading="lazy"
            />
          </div>
          <div className="col-lg-6">
            <span
              className="badge rounded-pill px-3 py-2 mb-3 d-inline-block text-uppercase fw-bold"
              style={{ backgroundColor: '#dfff6f', color: '#1a1a1a', border: '1px solid #1a1a1a', fontSize: '0.85rem' }}
            >
              Welcome to Silver Guide
            </span>
            <h1 className="display-4 fw-bold text-body-emphasis lh-sm mb-3">
              Embrace the Digital World with Confidence
            </h1>
            <p className="lead fs-5 text-secondary mb-4" style={{ lineHeight: "1.6" }}>
              At Silver Guide, we make learning technology simple, safe, and fun. Explore our easy, step-by-step guides on using smartphones, staying connected with family, and recognizing online scams.
            </p>
            <div className="d-grid gap-3 d-md-flex justify-content-md-start">
              <a href="#learning-section" className="btn btn-primary btn-lg px-4 py-3 rounded-pill fw-bold shadow-sm">
                Start Learning <i className="bi bi-arrow-down-short ms-1"></i>
              </a>
              <Link to="/emergency" className="btn btn-outline-danger btn-lg px-4 py-3 rounded-pill fw-bold shadow-sm">
                🚨 Emergency Help-Line
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Start learning section */}
      <div id="learning-section" className="px-4 pt-5 pb-2 my-5 text-center">
        <h2 className="display-5 fw-bold text-body-emphasis">Latest Articles</h2>
        <div className="col-lg-6 mx-auto">
          <p className="lead text-secondary mb-4">
            Discover our newest, most up-to-date guides. Select a category below to browse the latest clear, jargon-free articles designed specifically for seniors.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mb-4">
        <div className="d-flex justify-content-center">
          <ul className="nav nav-pills p-1 bg-white border border-dark rounded-pill shadow-sm" style={{ maxWidth: 'fit-content' }}>
            {TABS.map((tab) => (
              <li key={tab} className="nav-item">
                <button
                  type="button"
                  className={`nav-link rounded-pill px-4 py-2 fw-bold d-flex align-items-center ${
                    activeTab === tab 
                      ? 'active bg-primary text-white' 
                      : 'text-dark bg-transparent'
                  }`}
                  onClick={() => setActiveTab(tab)}
                  style={{ transition: 'all 0.2s ease-in-out', border: 'none' }}
                >
                  {tab === "Technology Basics" ? (
                    <i className="bi bi-phone-vibrate me-2 fs-5"></i>
                  ) : (
                    <i className="bi bi-shield-lock-fill me-2 fs-5"></i>
                  )}
                  {tab}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Cards */}
      <div className="album pb-5">
        <div className="container">
          {activeArticles.length > 0 ? (
            <>
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 justify-content-center">
                {activeArticles.slice(0, 4).map((a) => (
                  <ArticleCard key={a.id} a={a} />
                ))}
              </div>
              <div className="text-center mt-5">
                <Link
                  to={activeTab === "Technology Basics" ? "/articles/topic/1" : "/articles/topic/2"}
                  className="btn btn-outline-primary btn-lg rounded-pill px-5 fw-bold shadow-sm animate-button"
                >
                  View All {activeTab} Guides &rarr;
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-5 text-muted bg-white border border-dark rounded-4 p-5 shadow-sm" style={{ maxWidth: '500px', margin: '0 auto' }}>
              <i className="bi bi-journal-x fs-1 text-secondary mb-3 d-block"></i>
              <h5 className="fw-bold">No guides available right now</h5>
              <p className="small mb-0 text-secondary">We are currently creating new tutorials. Please check back later!</p>
            </div>
          )}
        </div>
      </div>

      {/* Emergency Helpline Section */}
      <div className="container my-5 pb-5">
        <div className="p-4 p-md-5 rounded-5 border border-2 border-danger shadow-sm bg-white position-relative overflow-hidden">
          {/* Subtle background emergency icon */}
          <div className="position-absolute end-0 bottom-0 opacity-10 d-none d-lg-block" style={{ transform: 'translate(10%, 10%)', pointerEvents: 'none' }}>
            <i className="bi bi-shield-fill-exclamation" style={{ fontSize: '15rem', color: '#dc3545' }}></i>
          </div>
          
          <div className="row align-items-center position-relative" style={{ zIndex: 1 }}>
            <div className="col-lg-8 mb-4 mb-lg-0">
              <div className="d-flex align-items-center mb-3 flex-wrap gap-2">
                <span className="badge bg-danger rounded-pill px-3 py-2 text-white fw-bold me-2">
                  <i className="bi bi-exclamation-triangle-fill me-1"></i> EMERGENCY HELP
                </span>
                <h3 className="fw-bold m-0 text-danger">Think you have been scammed?</h3>
              </div>
              <h4 className="fw-bold mb-3">Don't panic. We are here to help you step-by-step.</h4>
              <p className="lead mb-0 text-secondary" style={{ maxWidth: '750px', fontSize: '1.1rem' }}>
                If you gave away your banking details, OTP, or transferred money to someone suspicious, follow our immediate security checklist. Freeze your accounts and contact the Anti-Scam Hotline.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <Link to="/emergency" className="btn btn-danger btn-lg px-5 py-3 rounded-pill fw-bold shadow-lg w-100 w-lg-auto">
                <i className="bi bi-telephone-fill me-2"></i> Get Scam Help Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
