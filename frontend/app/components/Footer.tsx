import { Link } from "react-router";
import { useI18n } from "../i18n/I18nContext";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="py-5 border-top" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container">
        <div className="row">
          <div className="col-md-6 text-start">
            <Link className="d-flex align-items-center mb-3 link-body-emphasis text-decoration-none" to="/">
              <img src="/imgs/logo.svg" width={60} height={60} className="d-inline-block align-text-top" alt="SilverGuide Logo" />
            </Link>
            <h6 className="text-body-secondary">{t.footer.tagline}</h6>
            <p className="text-muted">{t.footer.copyright}</p>
          </div>
          <div className="col-md-6 text-end">
            <ul className="list-unstyled mb-0">
              <li className="nav-item mb-2">
                <a href="#contact" className="nav-link p-0 text-body-secondary">{t.footer.contactUs}</a>
              </li>
              <li className="nav-item mb-2">
                <Link to="/about" className="nav-link p-0 text-body-secondary">{t.footer.aboutUs}</Link>
              </li>
              <li className="nav-item mb-2">
                <a href="#faq" className="nav-link p-0 text-body-secondary">{t.footer.faqs}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
