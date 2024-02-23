import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../data/userContext.jsx";
import "./Login.scss";

const apiUrl = import.meta.env.VITE_BASE_URL;
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setUserInfo } = useContext(UserContext);
  const navigate = useNavigate(); // Brug useNavigate-hooket til at navigere til andre ruter

  async function login(ev) {
    ev.preventDefault();

    // Validation
    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);
    setError(null);

    let requestBody;

    try {
      requestBody = JSON.stringify({ username, password });

      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        body: requestBody,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();
      console.log("Server Response:", data);

      setUserInfo(data);
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (error) {
      console.error("Error during login:", error);
      setError(error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login">
      <form onSubmit={login}>
        <h4>Admin Login</h4>
        <div>
          <input
            id="username"
            type="text"
            autoComplete="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <input
            id="password"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <div style={{ color: "red", fontSize: "12px" }}>{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
