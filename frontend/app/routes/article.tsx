import { Link, redirect, useLoaderData } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { apiFetch } from "../lib/api";

export async function clientLoader({ params }: { params: Record<string, string> }) {
  try {
    const res = await apiFetch(`/api/articles/${params.id}`);
    if (!res.ok) throw redirect("/articles");
    return await res.json();
  } catch (e) {
    // If it's already a redirect Response, re-throw it
    if (e instanceof Response) throw e;
    throw redirect("/articles");
  }
}

export function HydrateFallback() {
  return (
    <>
      <Navbar />
      <div className="container py-5 text-center text-muted">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading…</span>
        </div>
      </div>
      <Footer />
    </>
  );
}

export function meta({ data }: { data: { title?: string } }) {
  return [{ title: `Silver Guide - ${data?.title ?? "Article"}` }];
}

type Block = {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
};

function renderBlocks(blocks: Block[]) {
  return blocks.map((block, i) => {
    const { type, data } = block;

    if (type === "paragraph") {
      return <p key={i} dangerouslySetInnerHTML={{ __html: data.text }} />;
    }

    if (type === "header") {
      if (data.level === 2) {
        return <h2 key={i} className="section-title">{data.text}</h2>;
      }
      if (data.level === 3) {
        return <h3 key={i}>{data.text}</h3>;
      }
      return <h4 key={i}>{data.text}</h4>;
    }

    if (type === "list") {
      const items = (data.items as string[]).map((item, j) => (
        <li key={j} dangerouslySetInnerHTML={{ __html: item }} />
      ));
      return data.style === "ordered"
        ? <ol key={i} className="mb-4">{items}</ol>
        : <ul key={i} className="mb-4">{items}</ul>;
    }

    if (type === "quote") {
      return (
        <div key={i} className="analogy mb-4">
          <span dangerouslySetInnerHTML={{ __html: data.text }} />
          {data.caption && (
            <footer className="blockquote-footer mt-1">
              <span dangerouslySetInnerHTML={{ __html: data.caption }} />
            </footer>
          )}
        </div>
      );
    }

    if (type === "warning") {
      return (
        <div key={i} className="tip-box">
          <h5 className="fw-bold">{data.title}</h5>
          <p dangerouslySetInnerHTML={{ __html: data.message }} />
        </div>
      );
    }

    if (type === "delimiter") {
      return <hr key={i} className="my-4" />;
    }

    if (type === "image") {
      return (
        <img
          key={i}
          src={data.url}
          className="img-fluid rounded mb-4"
          alt={data.caption ?? ""}
        />
      );
    }

    return null;
  });
}

export default function ArticlePage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const article = useLoaderData<any>();

  let blocks: Block[] = [];
  try {
    blocks = JSON.parse(article.content).blocks ?? [];
  } catch {
    // malformed content — render nothing
  }

  return (
    <>
      <Navbar />

      <div className="container py-5 d-flex justify-content-center">
        <article className="article-container">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/articles" className="text-decoration-none text-muted">Articles</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {article.title}
              </li>
            </ol>
          </nav>

          <h1 className="display-4 fw-bold mb-3">{article.title}</h1>

          {article.topicName && (
            <span className="badge bg-primary-subtle text-primary-emphasis mb-4 d-inline-block">
              {article.topicName}
            </span>
          )}

          {article.imgUrl && (
            <img
              src={article.imgUrl}
              className="article-header-img shadow-sm"
              alt={article.title}
            />
          )}

          {article.subtitle && (
            <p className="lead">{article.subtitle}</p>
          )}

          {renderBlocks(blocks)}

          <div className="text-center mt-5">
            <Link to="/articles" className="btn btn-outline-secondary btn-lg rounded-pill px-5">
              Back to Articles
            </Link>
          </div>
        </article>
      </div>

      <Footer />
    </>
  );
}
