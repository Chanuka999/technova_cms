import axios from "axios";
import { API_BASE_URL } from "./apiBase";

const API_URL = API_BASE_URL;

// Login user
const login = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/login`, userData);

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data.user));
    localStorage.setItem("token", response.data.token);
  }

  return response.data;
};

// Register user
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data.user));
    localStorage.setItem("token", response.data.token);
  }

  return response.data;
};

// Logout user
const logout = async () => {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      await axios.post(
        `${API_URL}/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      console.error("Logout API call failed:", error.message);
    }
  }

  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

const authService = {
  login,
  register,
  logout,
};

export default authService;
