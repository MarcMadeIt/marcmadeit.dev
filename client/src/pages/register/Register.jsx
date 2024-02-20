import React, { useState } from "react";
import "./Register.scss";

const apiUrl = import.meta.env.REACT_APP_BASE_URL || "http://localhost:8000";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function register(ev) {
    ev.preventDefault();

    // Input validation
    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        alert("Registration successful");
        // You may want to perform additional actions upon successful registration
      } else {
        const errorData = await response.json();
        setError(`Registration failed: ${errorData.message}`);
      }
    } catch (error) {
      console.log(e);
      console.error("Registration failed:", error);
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="register">
      <form onSubmit={register}>
        <h3>Register</h3>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
        />
        {error && <div style={{ color: "red", fontSize: "12px" }}>{error}</div>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}

export default Register;
