export const apiUrl = import.meta.env.VITE_API_BASE_URL;

export async function login(username, password) {
    try {
        const response = await fetch(`${apiUrl}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
            credentials: "include",
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Login failed");
        }

        const data = await response.json();

        if (data.accessToken) {
            console.log("Login successful:", data.accessToken);
            localStorage.setItem("access_token", data.accessToken);
        } else {
            throw new Error("No access token received");
        }

        return data;
    } catch (error) {
        console.error("Error during login:", error.message);
        throw error;
    }
}


export async function refreshToken() {
    try {
        const response = await fetch(`${apiUrl}/api/auth/refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // Ensure cookies are sent with the request
        });

        if (!response.ok) {
            throw new Error("Failed to refresh token");
        }

        const data = await response.json();

        if (data.accessToken) {
            console.log("Token refreshed:", data.accessToken); // Logging for verification
            localStorage.setItem("access_token", data.accessToken);
        } else {
            throw new Error("No access token received from refresh");
        }

        return data.accessToken; // Return the refreshed access token
    } catch (error) {
        console.error("Error refreshing token:", error);
        throw error;
    }
}
