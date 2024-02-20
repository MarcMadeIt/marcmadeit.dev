import React, { useState } from "react";
import "./PasswordPop.scss";

function PasswordPop({ showPasswordPop, handleClosePasswordPop, userId }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [passwordsMatchError, setPasswordsMatchError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if New Password and Confirm New Password match
    if (newPassword !== confirmPassword) {
      setPasswordsMatchError("Passwords do not match");
      setMessage(""); // Clear other message
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/user/updatepassword/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ newPassword, currentPassword }),
        }
      );

      const data = await response.json();

      setMessage(data.message);

      if (data.success) {
        // Optionally, you can handle success actions
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setMessage("Internal Server Error");
    }

    setNewPassword("");
    setConfirmPassword("");
    setCurrentPassword("");
  };

  return (
    <div className={`password-model ${showPasswordPop ? "show" : ""}`}>
      <h3>Change Password</h3>
      <div className="password-model-cont">
        <span className="close" onClick={handleClosePasswordPop}>
          &times;
        </span>
        <form onSubmit={handleSubmit}>
          <label for="current-password">
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
          <label for="new-password">
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
          <label for="confirm-password">
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
          <button type="submit">Update Password</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default PasswordPop;
