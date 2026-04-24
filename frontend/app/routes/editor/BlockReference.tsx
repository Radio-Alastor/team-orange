const BLOCKS = [
  { badge: "H2 Header", desc: "Section title with yellow left border", cls: "badge bg-primary-subtle text-primary" },
  { badge: "Quote", desc: "Italic analogy box (dashed border)", cls: "badge bg-info-subtle text-info" },
  { badge: "Warning", desc: "Tip/safety box (blue left border)", cls: "badge bg-warning-subtle text-warning-emphasis" },
  { badge: "List", desc: "Bullet or numbered list", cls: "badge bg-secondary-subtle text-secondary" },
  { badge: "Image", desc: "Inline image by URL", cls: "badge bg-secondary-subtle text-secondary" },
  { badge: "Delimiter", desc: "Horizontal divider", cls: "badge bg-secondary-subtle text-secondary" },
];

export default function BlockReference() {
  return (
    <div className="card border-2 border-light shadow-sm rounded-4 mb-5">
      <div className="card-body p-4">
        <h6 className="fw-bold mb-4">Block → Article Style Reference</h6>
        <div className="row g-3">
          {BLOCKS.map((item) => (
            <div key={item.badge} className="col-sm-6 col-lg-4 d-flex align-items-start gap-2">
              <span className={item.cls}>{item.badge}</span>
              <span className="text-muted small">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
