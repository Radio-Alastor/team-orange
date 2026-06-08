import { Link } from "react-router";

export type SharedArticleDTO = {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  imgUrl?: string;
  topicName?: string;
};

export function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ArticleCard({ a }: { a: SharedArticleDTO }) {
  return (
    <div className="col">
      <div className="card article-card shadow-sm h-100">
        {a.imgUrl && (
          <img src={a.imgUrl} className="card-img-top" alt={a.title} style={{ maxHeight: "140px", objectFit: "cover" }} />
        )}
        <div className="card-body d-flex flex-column p-3">
          {a.topicName && <span className="badge bg-secondary mb-2 align-self-start">{a.topicName}</span>}
          <h5 className="card-title fw-bold">{a.title}</h5>
          {a.description && (
            <p className="card-text text-muted flex-grow-1">{a.description}</p>
          )}
          <Link
            to={`/articles/${a.id}/${slugify(a.title)}`}
            className="btn btn-primary btn-read mt-2"
          >
            Read Guide
          </Link>
        </div>
      </div>
    </div>
  );
}
