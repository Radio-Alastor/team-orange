import Navbar from "./Navbar";
import Footer from "./Footer";

export default function PageSpinner() {
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
