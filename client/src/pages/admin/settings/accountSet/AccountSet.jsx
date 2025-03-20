import React, { useState, useEffect } from "react";
import "./AccountSet.scss";
import { IoLockClosed } from "react-icons/io5";
import axios from "axios";
import ChangePassword from "../../../../function/changePassword/ChangePassword.jsx";

const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function AccountSet() {
  const [userId, setUserId] = useState(null); // <-- store _id from /me
  const [username, setUsername] = useState("");
  const [showPasswordPop, setShowPasswordPop] = useState(false);
  const [message, setMessage] = useState("");
  const [usernameLength, setUsernameLength] = useState(0);

  useEffect(() => {
    axios
      .get(`${apiUrl}/users/me`, { withCredentials: true })
      .then((response) => {
        const currentUser = response.data;
        setUserId(currentUser._id); // set the user ID
        setUsername(currentUser.username);
        setUsernameLength(currentUser.username.length);
      })
      .catch((error) => {
        console.error("Error fetching current user:", error);
      });
  }, []);

  const handleOpenPasswordPop = () => {
    setShowPasswordPop(true);
  };

  const handleClosePasswordPop = () => {
    setShowPasswordPop(false);
  };

  const handleUsernameChange = (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    setUsernameLength(newUsername.length);
  };

  const isUsernameValid = () => {
    return usernameLength >= 4 && usernameLength <= 20;
  };

  const handleUpdateUser = async () => {
    try {
      const response = await axios.patch(
        `${apiUrl}/users/me/username`,
        { username },
        { withCredentials: true }
      );
      const updatedUser = response.data;
      setMessage(`Username updated successfully to ${updatedUser.username}`);
    } catch (error) {
      setMessage("Something went wrong!");
    }
  };

  return (
    <div className="account-set">
      <div className="account-title">
        <h3>Account Settings</h3>
        <p>{username}</p>
      </div>
      <div className="account-cont">
        <label>
          Password
          <button className="pw-button" onClick={handleOpenPasswordPop}>
            {" "}
            <IoLockClosed size={17} />
            Change Password
          </button>
        </label>
        <label htmlFor="username">
          Username
          <input
            id="username"
            type="text"
            value={username}
            onChange={handleUsernameChange}
            maxLength={20}
          />
          <span
            className={`username-counter ${
              isUsernameValid() ? "valid" : "invalid"
            }`}
          >
            {usernameLength}/20
          </span>
        </label>
        <button className="submut-btn" onClick={handleUpdateUser}>
          Update Username
        </button>
      </div>
      {message && <p>{message}</p>}

      {/* Pass the userId as a prop to ChangePassword */}
      <ChangePassword
        userId={userId}
        showPasswordPop={showPasswordPop}
        handleClosePasswordPop={handleClosePasswordPop}
      />
    </div>
  );
}

export default AccountSet;
