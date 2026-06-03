import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { apiFetch } from "../lib/api";
import { setAuth } from "../lib/auth";
import { useI18n } from "../i18n/I18nContext";

export function meta() {
  return [{ title: "Silver Guide - Register" }];
}

type RegisterErrorKey = keyof typeof import("../i18n/translations/en").default.register.errors;

interface FieldErrors {
  name?: RegisterErrorKey;
  email?: RegisterErrorKey;
  password?: RegisterErrorKey;
  confirm?: RegisterErrorKey;
}

type GlobalErrorKey = "emailExists" | "checkInput" | "generic" | "network";

export default function Register() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [globalErrorKey, setGlobalErrorKey] = useState<GlobalErrorKey | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function validate(): FieldErrors {
    const errors: FieldErrors = {};
    if (!name.trim()) errors.name = "nameRequired";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "emailInvalid";
    if (password.length < 8) errors.password = "passwordMin";
    if (password !== confirm) errors.confirm = "confirmMismatch";
    return errors;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGlobalErrorKey(null);
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
        setGlobalErrorKey("emailExists");
      } else if (res.status === 400) {
        const body = await res.json();
        const serverErrors = body.errors;
        if (serverErrors) {
          const mapped: FieldErrors = {};
          if (serverErrors.name) mapped.name = "nameRequired";
          if (serverErrors.email) mapped.email = "emailInvalid";
          if (serverErrors.password) mapped.password = "passwordMin";
          setFieldErrors(mapped);
        } else {
          setGlobalErrorKey("checkInput");
        }
      } else {
        setGlobalErrorKey("generic");
      }
    } catch {
      setGlobalErrorKey("network");
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
              {t.register.backHome}
            </Link>

            <div className="bg-white p-5" style={{ borderRadius: '2rem', boxShadow: '0 1rem 3rem rgba(0,0,0,0.05)' }}>
              <div className="text-center mb-4">
                <Link to="/">
                  <img src="/imgs/logo.svg" alt="SilverGuide Logo" width={64} height={64} className="mx-auto d-block" />
                </Link>
                <h3 className="fw-bold mt-3 mb-0">Silver Guide</h3>
              </div>

              <div className="mb-4" style={{ borderLeft: '5px solid #75adf6', paddingLeft: '1rem' }}>
                <h5 className="fw-bold mb-1">{t.register.createAccount}</h5>
                <p className="text-muted mb-0">{t.register.joinSubtitle}</p>
              </div>

              {globalErrorKey && (
                <div className="alert alert-danger alert-dismissible" role="alert">
                  {t.register.errors[globalErrorKey]}
                  <button type="button" className="btn-close" onClick={() => setGlobalErrorKey(null)} aria-label={t.register.close} />
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label fw-bold">{t.register.nameLabel}</label>
                  <input
                    type="text"
                    id="name"
                    className={`form-control form-control-lg${fieldErrors.name ? ' is-invalid' : ''}`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.register.namePlaceholder}
                    required
                    autoComplete="name"
                  />
                  {fieldErrors.name && <div className="invalid-feedback">{t.register.errors[fieldErrors.name]}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-bold">{t.register.emailLabel}</label>
                  <input
                    type="email"
                    id="email"
                    className={`form-control form-control-lg${fieldErrors.email ? ' is-invalid' : ''}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.register.emailPlaceholder}
                    required
                    autoComplete="email"
                  />
                  {fieldErrors.email && <div className="invalid-feedback">{t.register.errors[fieldErrors.email]}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label fw-bold">{t.register.passwordLabel}</label>
                  <input
                    type="password"
                    id="password"
                    className={`form-control form-control-lg${fieldErrors.password ? ' is-invalid' : ''}`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.register.passwordPlaceholder}
                    required
                    minLength={8}
                    autoComplete="new-password"
                  />
                  <div className="form-text">{t.register.passwordHint}</div>
                  {fieldErrors.password && <div className="invalid-feedback">{t.register.errors[fieldErrors.password]}</div>}
                </div>

                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label fw-bold">{t.register.confirmLabel}</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className={`form-control form-control-lg${fieldErrors.confirm ? ' is-invalid' : ''}`}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder={t.register.confirmPlaceholder}
                    required
                    autoComplete="new-password"
                  />
                  {fieldErrors.confirm && <div className="invalid-feedback">{t.register.errors[fieldErrors.confirm]}</div>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary btn-lg w-100"
                >
                  {isLoading ? t.register.creating : t.register.createButton}
                  {isLoading && (
                    <span className="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true" />
                  )}
                </button>
              </form>
            </div>

            <p className="text-center mt-4 text-muted">
              {t.register.hasAccount}{" "}
              <Link to="/login" className="fw-bold text-decoration-none">
                {t.register.signInLink}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
