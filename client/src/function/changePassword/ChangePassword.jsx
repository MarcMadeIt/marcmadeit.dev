import React, { useState } from "react";
import "./ChangePassword.scss";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

function ChangePassword({ showPasswordPop, handleClosePasswordPop }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [passwordsMatchError, setPasswordsMatchError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setPasswordsMatchError("Passwords do not match");
      setMessage("");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/users/me/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error updating password");
      }

      const data = await response.json();
      setMessage("Password updated successfully!");
    } catch (error) {
      console.error("Error updating password:", error);
      setMessage(error.message || "Internal Server Error");
    }

    setNewPassword("");
    setConfirmPassword("");
    setCurrentPassword("");
  };

  return (
    <div className={`password-model ${showPasswordPop ? "show" : ""}`}>
      <div className="password-model-cont">
        <span className="close" onClick={handleClosePasswordPop}>
          &times;
        </span>
        <h3>Change Password</h3>
        <form onSubmit={handleSubmit}>
          <label htmlFor="current-password">
            <input
              type="password"
              name="current-password"
              id="current-password"
              autoComplete="current-password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </label>
          <label htmlFor="new-password">
            <input
              type="password"
              name="new-password"
              id="new-password"
              autoComplete="new-password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </label>
          <label htmlFor="confirm-password">
            <input
              type="password"
              name="confirm-password"
              id="confirm-password"
              autoComplete="new-password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setPasswordsMatchError("");
              }}
            />
            {passwordsMatchError && <p>{passwordsMatchError}</p>}
          </label>
          <button type="submit" className="btn">
            Update
          </button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default ChangePassword;
