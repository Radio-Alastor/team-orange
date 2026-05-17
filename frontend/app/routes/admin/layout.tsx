import { redirect, Outlet, NavLink, Link } from "react-router";
import { getToken, getUser, clearAuth } from "~/lib/auth";

export async function clientLoader() {
  const token = getToken();
  const user = getUser();

  if (!token || !user?.staff) {
    return redirect("/");
  }

  return { token, user };
}

export default function AdminLayout() {
  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("sg_refresh_token");
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
    } catch {
      // best-effort
    }
    clearAuth();
    window.location.href = "/";
  };

  return (
    <>
      {/* Top navbar turns into burger (visible on small screens) */}
      <nav className="navbar navbar-light bg-success d-md-none">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/admin">
            <img src="/imgs/logo.svg" width="117" alt="logo in white" />
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobileSidebar" aria-controls="mobileSidebar">
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
      </nav>

      {/* Off-canvas sidebar for mobile */}
      <div className="offcanvas offcanvas-start" tabIndex={-1} id="mobileSidebar" aria-labelledby="mobileSidebarLabel">
        <div className="offcanvas-header bg-success">
          <img src="/imgs/logo.svg" className="mx-auto" width="164" alt="logo in white" />
        </div>
        <div className="offcanvas-body">
          <ul className="nav flex-column">
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link text-black ${isActive ? 'active fw-bold' : ''}`} to="/admin" end>
                <i className="bi bi-graph-up me-2"></i> Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link text-black ${isActive ? 'active fw-bold' : ''}`} to="/admin/articles">
                <i className="bi bi-pencil-square me-2"></i> Articles
              </NavLink>
            </li>
            <li className="nav-item mt-4">
              <Link className="nav-link text-primary" to="/">
                <i className="bi bi-house me-2"></i> Go to Live Site
              </Link>
            </li>
            <li className="nav-item">
              <button className="nav-link text-danger border-0 bg-transparent" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2"></i> Logout
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="container-fluid min-vh-100">
        <div className="row min-vh-100">
          <nav className="col-md-3 col-lg-2 d-none d-md-block static-sidebar px-0 bg-success">
            <div className="position-sticky pt-3">
              <Link to="/admin">
                <img src="/imgs/logo.svg" className="mx-auto d-block mb-4" width="134" height="80" alt="logo in static" />
              </Link>
              <ul className="nav flex-column">
                <li className="nav-item">
                  <NavLink className={({ isActive }) => `nav-link text-white ${isActive ? 'active fw-bold' : ''}`} to="/admin" end>
                    <i className="bi bi-graph-up me-2"></i> Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => `nav-link text-white ${isActive ? 'active fw-bold' : ''}`} to="/admin/articles">
                    <i className="bi bi-pencil-square me-2"></i> Articles
                  </NavLink>
                </li>
                <li className="nav-item mt-5 pt-3 border-top border-light border-opacity-25 mx-3">
                  <Link className="nav-link text-white-50" to="/">
                    <i className="bi bi-house me-2"></i> Live Site
                  </Link>
                </li>
                <li className="nav-item mx-3">
                  <button className="nav-link text-white-50 border-0 bg-transparent" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i> Logout
                  </button>
                </li>
              </ul>
            </div>
          </nav>

          {/* Main content area */}
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}
