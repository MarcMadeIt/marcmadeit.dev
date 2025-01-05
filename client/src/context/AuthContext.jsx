import { createContext, useState, useEffect } from "react";
import { login, getCurrentUser, logout } from "../utils/authUtils";

export const AuthContext = createContext({});

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");

    const initializeUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        if (error.message === "Unauthorized: User is not logged in.") {
          try {
            await refreshToken(); // Attempt to refresh the token
            const currentUser = await getCurrentUser();
            setUser(currentUser);
          } catch (refreshError) {
            console.error("Failed to refresh token:", refreshError);
            localStorage.removeItem("isAuthenticated");
            setUser(null);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated === "true") {
      initializeUser();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = async (username, password) => {
    try {
      await login(username, password);
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      localStorage.setItem("isAuthenticated", "true");
    } catch (error) {
      console.error("Error in handleLogin:", error);
      throw error;
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      localStorage.removeItem("isAuthenticated");
    } catch (error) {
      console.error("Error in handleLogout:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}
