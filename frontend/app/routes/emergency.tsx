import { Link } from "react-router";
import { useI18n } from "../i18n/I18nContext";

export default function Emergency() {
  const { t } = useI18n();

  return (
    <main className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-danger">{t.emergency.title}</h1>
        <p className="lead">{t.emergency.lead}</p>
      </div>

      <div className="row g-4 justify-content-center">
        <div className="col-md-8">
          <div className="emergency-card shadow-lg mb-4">
            <div className="d-flex align-items-center mb-3">
              <div className="step-number">1</div>
              <h2 className="h4 mb-0 fw-bold">{t.emergency.step1Title}</h2>
            </div>
            <p>{t.emergency.step1Body}</p>
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

        <div className="col-md-8">
          <div className="emergency-card shadow-lg mb-4">
            <div className="d-flex align-items-center mb-3">
              <div className="step-number">2</div>
              <h2 className="h4 mb-0 fw-bold">{t.emergency.step2Title}</h2>
            </div>
            <p>{t.emergency.step2Body}</p>
            <a href="tel:18007226688" className="btn btn-danger btn-lg w-100 fw-bold py-3 mb-2">{t.emergency.step2Call}</a>
            <p className="text-muted small text-center">{t.emergency.step2Availability}</p>
          </div>
        </div>

        <div className="col-md-8">
          <div className="emergency-card shadow-lg mb-4">
            <div className="d-flex align-items-center mb-3">
              <div className="step-number">3</div>
              <h2 className="h4 mb-0 fw-bold">{t.emergency.step3Title}</h2>
            </div>
            <p>{t.emergency.step3Body}</p>
            <a href="https://www.police.gov.sg/e-services" target="_blank" rel="noreferrer" className="btn btn-outline-danger w-100">{t.emergency.step3Button}</a>
          </div>
        </div>
      </div>

      <div className="text-center mt-5">
        <Link to="/" className="btn btn-secondary rounded-pill px-5">{t.emergency.backHome}</Link>
      </div>
    </main>
  );
}
