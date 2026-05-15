import { Link } from "react-router";

export default function Emergency() {
  return (
    <main className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-danger">Emergency Help</h1>
        <p className="lead">
          If you think you have been scammed, <strong>stay calm</strong> and follow these steps immediately.
        </p>
      </div>

      <div className="row g-4 justify-content-center">
        {/* Step 1 */}
        <div className="col-md-8">
          <div className="emergency-card shadow-lg mb-4">
            <div className="d-flex align-items-center mb-3">
              <div className="step-number">1</div>
              <h2 className="h4 mb-0 fw-bold">Call Your Bank Immediately</h2>
            </div>
            <p>Ask them to <strong>freeze your accounts</strong> and credit cards. Do this even if you aren't sure yet.</p>
            <div className="row g-2">
              <a href="tel:18003396963" className="col-6 col-md-3 text-black text-decoration-none">
                <div className="bank-contact text-center small"><strong>DBS/POSB</strong><br />1800 339 6963</div>
              </a>
              <a href="tel:18003633333" className="col-6 col-md-3 text-black text-decoration-none">
                <div className="bank-contact text-center small"><strong>OCBC</strong><br />1800 363 3333</div>
              </a>
              <a href="tel:18002222121" className="col-6 col-md-3 text-black text-decoration-none">
                <div className="bank-contact text-center small"><strong>UOB</strong><br />1800 222 2121</div>
              </a>
              <a href="tel:18007477000" className="col-6 col-md-3 text-black text-decoration-none">
                <div className="bank-contact text-center small"><strong>Standard Chartered</strong><br />1800 747 7000</div>
              </a>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="col-md-8">
          <div className="emergency-card shadow-lg mb-4">
            <div className="d-flex align-items-center mb-3">
              <div className="step-number">2</div>
              <h2 className="h4 mb-0 fw-bold">Call the Anti-Scam Hotline</h2>
            </div>
            <p>Get expert advice from the police on what to do next.</p>
            <a href="tel:18007226688" className="btn btn-danger btn-lg w-100 fw-bold py-3 mb-2">Call 1800-722-6688</a>
            <p className="text-muted small text-center">Available 24/7 for scam reports.</p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="col-md-8">
          <div className="emergency-card shadow-lg mb-4">
            <div className="d-flex align-items-center mb-3">
              <div className="step-number">3</div>
              <h2 className="h4 mb-0 fw-bold">Make a Police Report</h2>
            </div>
            <p>Go to the nearest Neighborhood Police Center or report online.</p>
            <a href="https://www.police.gov.sg/e-services" target="_blank" rel="noreferrer" className="btn btn-outline-danger w-100">Submit Online Report</a>
          </div>
        </div>
      </div>

      <div className="text-center mt-5">
        <Link to="/" className="btn btn-secondary rounded-pill px-5">Back to Home</Link>
      </div>
    </main>
  );
}
