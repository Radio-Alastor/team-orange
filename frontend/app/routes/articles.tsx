import { Link, useLoaderData } from "react-router";
import { apiFetch } from "../lib/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageSpinner from "../components/PageSpinner";

export function meta() {
  return [
    { title: "Silver Guide - Articles" },
    { name: "description", content: "Learn & Protect — guides for seniors" },
  ];
}

type Article = {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  imgUrl?: string;
};

async function fetchTopic(topicId: number): Promise<Article[]> {
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

export function HydrateFallback() { return <PageSpinner />; }

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function ArticleCard({ a }: { a: Article }) {
  return (
    <div className="col">
      <div className="card article-card shadow-sm h-100">
        {a.imgUrl && (
          <img src={a.imgUrl} className="card-img-top" alt={a.title} style={{ maxHeight: "140px", objectFit: "cover" }} />
        )}
        <div className="card-body d-flex flex-column p-3">
          <h6 className="card-title fw-bold">{a.title}</h6>
          {a.description && (
            <p className="card-text text-muted flex-grow-1 small">{a.description}</p>
          )}
          <Link
            to={`/articles/${a.id}/${slugify(a.title)}`}
            className="btn btn-primary btn-sm btn-read mt-2"
          >
            Read Guide
          </Link>
        </div>
      </div>
    </div>
  );
}

function PlaceholderCard({ label }: { label: string }) {
  return (
    <div className="col">
      <div className="card article-card shadow-sm h-100">
        <div className="card-body d-flex flex-column p-4 text-center text-muted">
          <p className="mt-3">No {label} articles yet. Check back soon!</p>
        </div>
      </div>
    </div>
  );
}

export default function Articles() {
  const { tech, scam } = useLoaderData<typeof clientLoader>();

  return (
    <>
      <Navbar />

      <div className="container py-5">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="display-3 fw-bold mb-3">Learn &amp; Protect</h1>
          <p className="lead text-muted mx-auto" style={{ maxWidth: "800px" }}>
            Welcome to our library of guides. Whether you want to master new technology or learn how to stay safe
            online, we have simple instructions to help you every step of the way.
          </p>
        </div>

        {/* Technology Basics */}
        <div className="row">
          <div className="col-12 mt-5">
            <h2 className="text-center border-bottom pb-3 mb-4">Technology Basics</h2>
          </div>
        </div>
        <div className="row g-4 justify-content-center">
          {tech.length > 0
            ? tech.map((a) => <ArticleCard key={a.id} a={a} />)
            : <PlaceholderCard label="Technology Basics" />}
        </div>

        {/* Scam Awareness */}
        <div className="row">
          <div className="text-center col-12 mt-5">
            <h2 className="border-bottom pb-3 mb-4">Scam Awareness</h2>
          </div>
        </div>
        <div className="row g-4 justify-content-center">
          {scam.length > 0
            ? scam.map((a) => <ArticleCard key={a.id} a={a} />)
            : <PlaceholderCard label="Scam Awareness" />}
        </div>
      </div>

      <Footer />
    </>
  );
}
