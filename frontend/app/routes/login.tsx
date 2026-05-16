import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { apiFetch } from "../lib/api";
import { setAuth } from "../lib/auth";

export function meta() {
  return [{ title: "Silver Guide - Sign In" }];
}

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        setAuth(data);
        navigate("/");
      } else if (res.status === 401) {
        setError("Invalid email or password.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Could not connect to the server. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-5">
            {/* Back button */}
            <Link to="/" className="btn btn-outline-secondary btn-sm mb-3">
              &larr; Back to Home
            </Link>

            {/* Card */}
            <div className="bg-white p-5" style={{ borderRadius: '2rem', boxShadow: '0 1rem 3rem rgba(0,0,0,0.05)' }}>
              {/* Logo + Heading */}
              <div className="text-center mb-4">
                <Link to="/">
                  <img src="/imgs/logo.svg" alt="SilverGuide Logo" width={64} height={64} className="mx-auto d-block" />
                </Link>
                <h3 className="fw-bold mt-3 mb-0">Silver Guide</h3>
              </div>

              {/* Section title with lime accent */}
              <div className="mb-4" style={{ borderLeft: '5px solid #dfff6f', paddingLeft: '1rem' }}>
                <h5 className="fw-bold mb-1">Welcome Back</h5>
                <p className="text-muted mb-0">Sign in to your account</p>
              </div>

              {/* Error alert */}
              {error && (
                <div className="alert alert-danger alert-dismissible" role="alert">
                  {error}
                  <button type="button" className="btn-close" onClick={() => setError(null)} aria-label="Close" />
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-bold">Email address</label>
                  <input
                    type="email"
                    id="email"
                    className="form-control form-control-lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label fw-bold">Password</label>
                  <input
                    type="password"
                    id="password"
                    className="form-control form-control-lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary btn-lg w-100 mt-2"
                >
                  {isLoading ? "Signing in…" : "Sign In"}
                  {isLoading && (
                    <span className="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true" />
                  )}
                </button>
              </form>
            </div>

            {/* Register link */}
            <p className="text-center mt-4 text-muted">
              Don't have an account?{" "}
              <Link to="/register" className="fw-bold text-decoration-none">
                Register &rarr;
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
