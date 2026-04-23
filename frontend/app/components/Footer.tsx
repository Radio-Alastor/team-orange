import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="py-5 border-top" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container">
        <div className="row">
          <div className="col-md-6 text-start">
            <Link className="d-flex align-items-center mb-3 link-body-emphasis text-decoration-none" to="/">
              <img src="/imgs/logo.svg" width={60} height={60} className="d-inline-block align-text-top" alt="SilverGuide Logo" />
            </Link>
            <h6 className="text-body-secondary">Helping you navigate the digital world</h6>
            <p className="text-muted">&copy; 2026 The Silver Guide Website, All rights reserved.</p>
          </div>
          <div className="col-md-6 text-end">
            <ul className="list-unstyled mb-0">
              <li className="nav-item mb-2">
                <a href="#contact" className="nav-link p-0 text-body-secondary">Contact Us</a>
              </li>
              <li className="nav-item mb-2">
                <Link to="/about" className="nav-link p-0 text-body-secondary">About Us</Link>
              </li>
              <li className="nav-item mb-2">
                <a href="#faq" className="nav-link p-0 text-body-secondary">FAQs</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
