import { Link, useLoaderData } from "react-router";
import { getArticlesByTopic } from "../lib/api";
import PageSpinner from "../components/PageSpinner";
import SearchBar from "../components/SearchBar";
import ArticleCard, { type SharedArticleDTO } from "../components/ArticleCard";

export function meta({ data }: any) {
  const title = data?.topicId === 1 ? "Technology Basics" : data?.topicId === 2 ? "Scam Awareness" : "Articles Topic";
  return [{ title: `Silver Guide - ${title}` }];
}

export async function clientLoader({ params, request }: any) {
  const topicId = parseInt(params.id, 10);
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "0", 10);

  try {
    const articlesPage = await getArticlesByTopic(topicId, page, 12);
    // Assuming backend returns topicName in array or we manually infer
    const topicName = topicId === 1 ? "Technology Basics" : topicId === 2 ? "Scam Awareness" : "Articles";
    return { topicId, topicName, articlesPage, page };
  } catch {
    return { topicId, topicName: "Articles", articlesPage: { content: [], totalPages: 0, totalElements: 0 }, page };
  }
}

export function HydrateFallback() { return <PageSpinner />; }

export default function ArticlesTopic() {
  const { topicName, articlesPage, page } = useLoaderData<typeof clientLoader>();

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold">{topicName}</h1>
        <p className="lead text-muted">Browse all articles for {topicName}.</p>
      </div>

      <SearchBar />

      <div className="my-4">
        <Link to="/articles" className="btn btn-outline-secondary btn-sm">&larr; Back to Learn</Link>
      </div>

      {articlesPage.content.length > 0 ? (
        <>
          <div className="row g-4 row-cols-1 row-cols-md-2 row-cols-lg-3 justify-content-center">
            {articlesPage.content.map((a: SharedArticleDTO) => <ArticleCard key={a.id} a={a} />)}
          </div>

          {/* Pagination Controls */}
          {articlesPage.totalPages > 1 && (
            <div className="d-flex justify-content-center mt-5 gap-2">
              {[...Array(articlesPage.totalPages)].map((_, i) => (
                <Link
                  key={i}
                  to={`?page=${i}`}
                  className={`btn ${page === i ? 'btn-primary' : 'btn-outline-primary'}`}
                >
                  {i + 1}
                </Link>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-5 text-muted">
          <h4>No articles found.</h4>
        </div>
      )}
    </div>
  );
}
