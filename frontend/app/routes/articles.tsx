import { Link, useLoaderData } from "react-router";
import { apiFetch, searchArticles } from "../lib/api";
import PageSpinner from "../components/PageSpinner";
import SearchBar from "../components/SearchBar";
import ArticleCard, { type SharedArticleDTO } from "../components/ArticleCard";

export function meta() {
  return [
    { title: "Silver Guide - Articles" },
    { name: "description", content: "Learn & Protect — guides for seniors" },
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

export async function clientLoader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");

  if (q) {
    const page = parseInt(url.searchParams.get("page") || "0", 10);
    try {
      const searchResults = await searchArticles(q, page, 12);
      return { isSearch: true, q, searchResults, tech: [], scam: [] };
    } catch {
      return { isSearch: true, q, searchResults: { content: [], totalPages: 0, totalElements: 0 }, tech: [], scam: [] };
    }
  } else {
    const [tech, scam] = await Promise.all([fetchTopic(1), fetchTopic(2)]);
    return { isSearch: false, q: "", searchResults: null, tech, scam };
  }
}

export function HydrateFallback() { return <PageSpinner />; }

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
  const { isSearch, q, searchResults, tech, scam } = useLoaderData<typeof clientLoader>();

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="display-3 fw-bold mb-3">Learn &amp; Protect</h1>
        <p className="lead text-muted mx-auto" style={{ maxWidth: "800px" }}>
          Welcome to our library of guides. Whether you want to master new technology or learn how to stay safe
          online, we have simple instructions to help you every step of the way.
        </p>
      </div>

      <SearchBar />

      {isSearch ? (
        <>
          <div className="row mb-4 border-bottom pb-3">
            <div className="col d-flex justify-content-between align-items-center">
              <h2 className="mb-0">Search Results for "{q}"</h2>
              <Link to="/articles" className="btn btn-outline-secondary btn-sm">Clear Search</Link>
            </div>
          </div>
          {searchResults && searchResults.content.length > 0 ? (
            <>
              <div className="row g-4 row-cols-1 row-cols-md-2 row-cols-lg-3 justify-content-center">
                {searchResults.content.map((a: SharedArticleDTO) => <ArticleCard key={a.id} a={a} />)}
              </div>
              
              {/* Pagination Controls */}
              {searchResults.totalPages > 1 && (
                <div className="d-flex justify-content-center mt-5 gap-2">
                  {[...Array(searchResults.totalPages)].map((_, i) => (
                    <Link
                      key={i}
                      to={`/articles?q=${encodeURIComponent(q || "")}&page=${i}`}
                      className={`btn ${searchResults.pageable?.pageNumber === i ? 'btn-primary' : 'btn-outline-primary'}`}
                    >
                      {i + 1}
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-5 text-muted">
              <h4>No articles found for "{q}"</h4>
              <p>Try searching with different keywords.</p>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Technology Basics */}
          <div className="row">
            <div className="col-12 mt-4">
              <h2 className="text-center border-bottom pb-3 mb-4">Technology Basics</h2>
            </div>
          </div>
          <div className="row g-4 row-cols-1 row-cols-md-2 row-cols-lg-4 justify-content-center">
            {tech.length > 0
              ? tech.map((a: SharedArticleDTO) => <ArticleCard key={a.id} a={a} />)
              : <PlaceholderCard label="Technology Basics" />}
          </div>
          <div className="text-center mt-4">
            <Link to="/articles/topic/1" className="btn btn-outline-primary">View More Technology Basics &rarr;</Link>
          </div>

          {/* Scam Awareness */}
          <div className="row">
            <div className="text-center col-12 mt-5">
              <h2 className="border-bottom pb-3 mb-4">Scam Awareness</h2>
            </div>
          </div>
          <div className="row g-4 row-cols-1 row-cols-md-2 row-cols-lg-4 justify-content-center">
            {scam.length > 0
              ? scam.map((a: SharedArticleDTO) => <ArticleCard key={a.id} a={a} />)
              : <PlaceholderCard label="Scam Awareness" />}
          </div>
          <div className="text-center mt-4">
            <Link to="/articles/topic/2" className="btn btn-outline-primary">View More Scam Awareness &rarr;</Link>
          </div>
        </>
      )}
    </div>
  );
}
