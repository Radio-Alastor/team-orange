import type { CategoryKey } from "./editorDefaults";

interface Props {
  title: string;
  setTitle: (v: string) => void;
  category: CategoryKey;
  setCategory: (v: CategoryKey) => void;
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
  category, setCategory,
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
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryKey)}
              className="form-select form-select-lg"
            >
              <option value="tech">Tech Tutorial</option>
              <option value="skill">Skill Building</option>
              <option value="warning">Urgent Warning</option>
              <option value="scam">Scam Alert</option>
            </select>
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
