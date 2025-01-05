import axios from "axios";


const apiUrl = import.meta.env.VITE_API_BASE_URL;

const instance = axios.create({
    baseURL: apiUrl,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true, // Allow cookies to be included in requests
});

// Login function using the custom Axios instance
export async function login(username, password) {
    try {
        const response = await instance.post("/auth/login", {
            username,
            password,
        });
        return response.data || null;
    } catch (error) {

        console.error("Error during login:", error.response?.data || error.message);
        throw new Error(error.response?.data || "Login failed");
    }
}

// Refresh token function
export async function refreshToken() {
    try {
        const response = await instance.post("/auth/refresh");
        return response.data?.accessToken || null;
    } catch (error) {
        console.error("Error refreshing token:", error.response?.data || error.message);
        throw new Error(error.response?.data || "Failed to refresh token");
    }
}

export async function getCurrentUser() {
    try {
        const response = await instance.get("/auth/me");

        return response.data || null;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // Hvis brugeren ikke er logget ind, returnér null
            console.error("User is not authenticated or session expired.");
            throw new Error("Unauthorized: User is not logged in.");
        }
        console.error("Error fetching current user:", error.response?.data || error.message);
        throw new Error(error.response?.data || "Failed to fetch current user");
    }
}


// Logout function
export async function logout() {
    try {

        const response = await instance.post("/auth/logout");


        return response.data || null;
    } catch (error) {

        console.error("Error during logout:", error.response?.data || error.message);
        throw new Error(error.response?.data || "Failed to logout");
    }
}

instance.interceptors.response.use(
    (response) => response, // Pass through successful responses
    async (error) => {
        const originalRequest = error.config;

        // Skip interceptor for the refresh token endpoint
        if (originalRequest.url.includes("/auth/refresh")) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Prevent infinite retries
            try {
                const newAccessToken = await refreshToken(); // Attempt to refresh the token
                if (newAccessToken) {
                    // Update the Authorization header dynamically for this request
                    originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                    return instance(originalRequest); // Retry the original request
                }
            } catch (refreshError) {
                console.error("Failed to refresh token:", refreshError);
                // Log the user out if the refresh fails
                localStorage.removeItem("isAuthenticated");
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error); // Reject other errors
    }
);
