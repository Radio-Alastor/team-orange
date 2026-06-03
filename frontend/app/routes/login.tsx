import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { apiFetch } from "../lib/api";
import { setAuth } from "../lib/auth";
import { useI18n } from "../i18n/I18nContext";

export function meta() {
  return [{ title: "Silver Guide - Sign In" }];
}

type LoginErrorKey = "invalidCredentials" | "generic" | "network";
type LoginInfoKey = "expired" | "unauthorized";

export default function Login() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorKey, setErrorKey] = useState<LoginErrorKey | null>(null);
  const [infoKey, setInfoKey] = useState<LoginInfoKey | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const reason = searchParams.get("reason");
    if (reason === "expired") {
      setInfoKey("expired");
    } else if (reason === "unauthorized") {
      setInfoKey("unauthorized");
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorKey(null);
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
        setErrorKey("invalidCredentials");
      } else {
        setErrorKey("generic");
      }
    } catch {
      setErrorKey("network");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-5">
            <Link to="/" className="btn btn-outline-secondary btn-sm mb-3">
              {t.login.backHome}
            </Link>

            <div className="bg-white p-5" style={{ borderRadius: '2rem', boxShadow: '0 1rem 3rem rgba(0,0,0,0.05)' }}>
              <div className="text-center mb-4">
                <Link to="/">
                  <img src="/imgs/logo.svg" alt="SilverGuide Logo" width={64} height={64} className="mx-auto d-block" />
                </Link>
                <h3 className="fw-bold mt-3 mb-0">Silver Guide</h3>
              </div>

              <div className="mb-4" style={{ borderLeft: '5px solid #dfff6f', paddingLeft: '1rem' }}>
                <h5 className="fw-bold mb-1">{t.login.welcomeBack}</h5>
                <p className="text-muted mb-0">{t.login.signInSubtitle}</p>
              </div>

              {infoKey && (
                <div className="alert alert-info alert-dismissible" role="alert">
                  {t.login.info[infoKey]}
                  <button type="button" className="btn-close" onClick={() => setInfoKey(null)} aria-label={t.login.close} />
                </div>
              )}

              {errorKey && (
                <div className="alert alert-danger alert-dismissible" role="alert">
                  {t.login.errors[errorKey]}
                  <button type="button" className="btn-close" onClick={() => setErrorKey(null)} aria-label={t.login.close} />
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-bold">{t.login.emailLabel}</label>
                  <input
                    type="email"
                    id="email"
                    className="form-control form-control-lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.login.emailPlaceholder}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label fw-bold">{t.login.passwordLabel}</label>
                  <input
                    type="password"
                    id="password"
                    className="form-control form-control-lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.login.passwordPlaceholder}
                    required
                    autoComplete="current-password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary btn-lg w-100 mt-2"
                >
                  {isLoading ? t.login.signingIn : t.login.signIn}
                  {isLoading && (
                    <span className="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true" />
                  )}
                </button>
              </form>
            </div>

            <p className="text-center mt-4 text-muted">
              {t.login.noAccount}{" "}
              <Link to="/register" className="fw-bold text-decoration-none">
                {t.login.registerLink}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
