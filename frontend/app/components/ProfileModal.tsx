import { useState } from "react";
import { apiFetch } from "../lib/api";
import { getToken } from "../lib/auth";

interface ProfileModalProps {
  onClose: () => void;
}

export default function ProfileModal({ onClose }: ProfileModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiFetch("/api/user/me/password", {
        method: "PUT",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (res.status === 204) {
        setSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else if (res.status === 422) {
        setError("Current password is incorrect.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Could not connect to the server.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose} />
      <div className="modal d-block" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-4">
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-bold">Profile</h5>
              <button className="btn-close" onClick={onClose} aria-label="Close" />
            </div>
            <div className="modal-body pt-2">
              <h6 className="fw-semibold mb-3">Change Password</h6>

              {error && (
                <div className="alert alert-danger alert-dismissible py-2" role="alert">
                  {error}
                  <button type="button" className="btn-close" onClick={() => setError(null)} aria-label="Close" />
                </div>
              )}
              {success && (
                <div className="alert alert-success alert-dismissible py-2" role="alert">
                  Password changed successfully.
                  <button type="button" className="btn-close" onClick={() => setSuccess(false)} aria-label="Close" />
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label htmlFor="currentPassword" className="form-label fw-semibold">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    className="form-control"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label fw-semibold">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    className="form-control"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label fw-semibold">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary w-100"
                >
                  {isLoading ? "Saving…" : "Change Password"}
                  {isLoading && (
                    <span className="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true" />
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
