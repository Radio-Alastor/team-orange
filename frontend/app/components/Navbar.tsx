import { Link, NavLink } from "react-router";

export default function Navbar() {
  return (
    <nav className="navbar sticky-top navbar-expand-lg navbar-light border-bottom" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container">
        <Link className="me-3" to="/">
          <img src="/imgs/logo.svg" width={60} height={60} className="d-inline-block align-text-top" alt="SilverGuide Logo" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMain"
          aria-controls="navbarMain"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarMain">
          <ul className="nav nav-underline align-items-center mx-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                to="/"
                end
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                to="/articles"
              >
                Learn
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                to="/about"
              >
                About
              </NavLink>
            </li>
          </ul>
          <div className="d-flex align-items-center gap-2">
            <a className="nav-link" href="#help">Help</a>
            <Link className="btn btn-outline-primary btn-sm" to="/login">Sign In</Link>
            <Link className="btn btn-primary btn-sm" to="/register">Register</Link>
            <form className="d-flex" role="search">
              <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
              <button className="btn btn-outline-success" type="submit">Search</button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  );
}
