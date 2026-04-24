import type { Topic } from "./types";

interface Props {
  title: string;
  setTitle: (v: string) => void;
  topicId: number | null;
  setTopicId: (v: number | null) => void;
  topics: Topic[];
  subtitle: string;
  setSubtitle: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  heroImage: string;
  setHeroImage: (v: string) => void;
  errors: Record<string, string>;
  onClearError: (field: string) => void;
  onDismissErrors: () => void;
}

export default function ArticleMetaForm({
  title, setTitle,
  topicId, setTopicId, topics,
  subtitle, setSubtitle,
  description, setDescription,
  heroImage, setHeroImage,
  errors, onClearError, onDismissErrors,
}: Props) {
  return (
    <div className="card border-2 border-light shadow-sm rounded-4 mb-4">
      <div className="card-body p-4">
        <h5 className="fw-bold mb-4">Article Details</h5>
        {Object.values(errors).some(Boolean) && (
          <div className="alert alert-danger alert-dismissible" role="alert">
            <ul className="mb-0 ps-3">
              {errors.title && <li>{errors.title}</li>}
              {errors.topicId && <li>{errors.topicId}</li>}
              {errors.subtitle && <li>{errors.subtitle}</li>}
              {errors.description && <li>{errors.description}</li>}
              {errors.heroImage && <li>{errors.heroImage}</li>}
            </ul>
            <button type="button" className="btn-close" onClick={onDismissErrors} aria-label="Close" />
          </div>
        )}
        <div className="row g-3">
          <div className="col-md-8">
            <label className="meta-label mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); onClearError("title"); }}
              maxLength={255}
              placeholder="e.g. Understanding AI Helpers"
              className={`form-control form-control-lg${errors.title ? " is-invalid" : ""}`}
            />
            {errors.title && <div className="invalid-feedback">{errors.title}</div>}
          </div>
          <div className="col-md-4">
            <label className="meta-label mb-1">Topics</label>
            <select
              value={topicId ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                setTopicId(val === "" ? null : Number(val));
                onClearError("topicId");
              }}
              className={`form-select form-select-lg${errors.topicId ? " is-invalid" : ""}`}
            >
              <option value="">Select a topic…</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>{t.topicName}</option>
              ))}
            </select>
            {errors.topicId && <div className="invalid-feedback">{errors.topicId}</div>}
          </div>
          <div className="col-12">
            <label className="meta-label mb-1">Sub Title</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => { setSubtitle(e.target.value); onClearError("subtitle"); }}
              maxLength={500}
              placeholder="e.g. How to recognise and avoid common email scams"
              className={`form-control form-control-lg${errors.subtitle ? " is-invalid" : ""}`}
            />
            {errors.subtitle && <div className="invalid-feedback">{errors.subtitle}</div>}
          </div>
          <div className="col-12">
            <label className="meta-label mb-1">
              Summary <span className="fw-normal text-muted text-lowercase">(shown on article card)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => { setDescription(e.target.value); onClearError("description"); }}
              maxLength={1000}
              rows={2}
              placeholder="A brief summary shown on the articles listing page…"
              className={`form-control${errors.description ? " is-invalid" : ""}`}
            />
            {errors.description && <div className="invalid-feedback">{errors.description}</div>}
          </div>
          <div className="col-12">
            <label className="meta-label mb-1">Hero Image URL</label>
            <input
              type="text"
              value={heroImage}
              onChange={(e) => { setHeroImage(e.target.value); onClearError("heroImage"); }}
              maxLength={255}
              placeholder="/imgs/your-image.png"
              className={`form-control form-control-lg${errors.heroImage ? " is-invalid" : ""}`}
            />
            {errors.heroImage && <div className="invalid-feedback">{errors.heroImage}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
