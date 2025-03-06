import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:3001/api/v1" });

API.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token"); // Retrieve the token from local storage
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`; // Add Authorization header
      }
      return config;
    },
    (error) => {
      console.error("Request error:", error);
      return Promise.reject(error);
    }
  );

  API.interceptors.response.use(
    (response) => response, // Pass through if no error
    async (error) => {
      if (error.response && error.response.status === 401) {
        console.warn("Token expired, logging out...");
  
        // Dispatch logout action to Redux store
        // await store.dispatch(logoutUser());
  
        // Redirect to login
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );

export default API;