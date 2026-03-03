import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";

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
const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

const authService = {
  login,
  register,
  logout,
};

export default authService;
