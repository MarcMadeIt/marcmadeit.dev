import React, { useState, useEffect } from "react";
import "./AccountSet.scss";
import PasswordPop from "../../../../function/passwordPop/PasswordPop.jsx";
import { IoLockClosed } from "react-icons/io5";
import { useParams } from "react-router-dom";

function AccountSet() {
  const { id } = useParams();
  const [username, setUsername] = useState("");
  const [showPasswordPop, setShowPasswordPop] = useState(false);
  const [message, setMessage] = useState("");
  const [usernameLength, setUsernameLength] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:8000/api/user/getusername`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        // Update the username state
        setUsername(data.username);
        setUsernameLength(data.username.length);
      })
      .catch((error) => {
        console.error("Error fetching username:", error);
      });
  }, []);

  const handleOpenPasswordPop = () => {
    setShowPasswordPop(true);
  };

  const handleClosePasswordPop = () => {
    setShowPasswordPop(false);
  };

  const handleUsernameChange = (e) => {
    // Update the username state on input change
    const newUsername = e.target.value;
    setUsername(newUsername);
    setUsernameLength(newUsername.length);
  };

  const isUsernameValid = () => {
    // Check if the username length is between 4 and 17
    return usernameLength >= 4 && usernameLength <= 20;
  };

  const handleUpdateUser = async () => {
    try {
      if (!isUsernameValid()) {
        setMessage("Username must be between 4 and 20 characters");
        return;
      }

      const response = await fetch(
        `http://localhost:8000/api/user/updateUsername/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            newUsername: username,
          }),
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        // Update was successful
        console.log("Username updated successfully");
        setMessage("Username updated successfully");
      } else {
        // Handle errors
        console.error("Error updating username:", responseData.error);
        setMessage("Internal Server Error");
      }
    } catch (error) {
      console.error("Error updating username:", error);
      setMessage("Internal Server Error");
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
        <label>
          Username
          <input
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
      <PasswordPop
        showPasswordPop={showPasswordPop}
        handleClosePasswordPop={handleClosePasswordPop}
      />
    </div>
  );
}

export default AccountSet;
