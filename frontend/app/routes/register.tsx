import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { apiFetch } from "../lib/api";
import { setAuth } from "../lib/auth";

export function meta() {
  return [{ title: "Silver Guide - Register" }];
}

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
}

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function validate(): FieldErrors {
    const errors: FieldErrors = {};
    if (!name.trim()) errors.name = "Please enter your name.";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Please enter a valid email address.";
    if (password.length < 8) errors.password = "Password must be at least 8 characters.";
    if (password !== confirm) errors.confirm = "Passwords do not match.";
    return errors;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGlobalError(null);
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setIsLoading(true);

    try {
      const res = await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      });

      if (res.status === 201) {
        const data = await res.json();
        setAuth(data);
        navigate("/");
      } else if (res.status === 409) {
        setGlobalError("An account with that email already exists.");
      } else if (res.status === 400) {
        const body = await res.json();
        const serverErrors = body.errors;
        if (serverErrors) {
          setFieldErrors({
            name: serverErrors.name,
            email: serverErrors.email,
            password: serverErrors.password,
          });
        } else {
          setGlobalError(body.detail || "Please check your input and try again.");
        }
      } else {
        setGlobalError("Something went wrong. Please try again.");
      }
    } catch {
      setGlobalError("Could not connect to the server. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center py-5" style={{ backgroundColor: "#f8f9fa" }}>
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

              {/* Section title with blue accent */}
              <div className="mb-4" style={{ borderLeft: '5px solid #75adf6', paddingLeft: '1rem' }}>
                <h5 className="fw-bold mb-1">Create Your Account</h5>
                <p className="text-muted mb-0">Join Silver Guide today — it's free</p>
              </div>

              {/* Global error */}
              {globalError && (
                <div className="alert alert-danger alert-dismissible" role="alert">
                  {globalError}
                  <button type="button" className="btn-close" onClick={() => setGlobalError(null)} aria-label="Close" />
                </div>
              )}

              {/* Register Form */}
              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label fw-bold">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    className={`form-control form-control-lg${fieldErrors.name ? ' is-invalid' : ''}`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                    autoComplete="name"
                  />
                  {fieldErrors.name && <div className="invalid-feedback">{fieldErrors.name}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-bold">Email address</label>
                  <input
                    type="email"
                    id="email"
                    className={`form-control form-control-lg${fieldErrors.email ? ' is-invalid' : ''}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                  />
                  {fieldErrors.email && <div className="invalid-feedback">{fieldErrors.email}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label fw-bold">Password</label>
                  <input
                    type="password"
                    id="password"
                    className={`form-control form-control-lg${fieldErrors.password ? ' is-invalid' : ''}`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                  />
                  <div className="form-text">Must be at least 8 characters.</div>
                  {fieldErrors.password && <div className="invalid-feedback">{fieldErrors.password}</div>}
                </div>

                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label fw-bold">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className={`form-control form-control-lg${fieldErrors.confirm ? ' is-invalid' : ''}`}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repeat your password"
                    required
                    autoComplete="new-password"
                  />
                  {fieldErrors.confirm && <div className="invalid-feedback">{fieldErrors.confirm}</div>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary btn-lg w-100"
                >
                  {isLoading ? "Creating account…" : "Create Account"}
                  {isLoading && (
                    <span className="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true" />
                  )}
                </button>
              </form>
            </div>

            {/* Login link */}
            <p className="text-center mt-4 text-muted">
              Already have an account?{" "}
              <Link to="/login" className="fw-bold text-decoration-none">
                Sign In &rarr;
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
