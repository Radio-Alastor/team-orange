export default function PageSpinner() {
  return (
    <div className="container py-5 text-center text-muted">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading…</span>
      </div>
    </div>
  );
}
