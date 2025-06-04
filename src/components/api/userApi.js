import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const userApi = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Function to set JWT token for subsequent requests
export const setAuthToken = (token) => {
  if (token) {
    userApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    // Optionally, store the token in localStorage for persistence across sessions
    // localStorage.setItem('authToken', token);
  } else {
    delete userApi.defaults.headers.common['Authorization'];
    // Optionally, remove the token from localStorage
    // localStorage.removeItem('authToken');
  }
};

// Optional: Check for a token in localStorage when the app loads
// const storedToken = localStorage.getItem('authToken');
// if (storedToken) {
//   setAuthToken(storedToken);
// }

export const registerUser = async (userData) => {
    try {
        const response = await userApi.post("/usuario/registrar-admin", userData);
        return response.data;
    } catch (error) {
        console.error('API Error in registerUser:', error.response?.data || error.message);
        throw error.response?.data || error; // Re-throw more specific error info if available
    }
};

export const loginUser = async (credentials) => { // Changed userData to credentials for clarity
    try {
        console.log("credentials" + credentials)
        // Ensure the endpoint matches your backend for login, e.g., /usuario/login-supabase or /usuario/login
        const response = await userApi.post("/usuario/login", credentials);
        if (response.data && response.data.token) {
            console.log("response.data.token" + response.data.token)
            setAuthToken(response.data.token); // Set token for subsequent requests
        }
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error('API Error in loginUser:', error.response?.data || error.message);
        throw error.response?.data || error; // Re-throw more specific error info if available
    }
};

// You might not need to export userApi if all API calls are encapsulated in functions here.
// If you do need to use the instance directly elsewhere, uncomment the line below.
// export default userApi;