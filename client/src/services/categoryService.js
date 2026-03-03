import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const getAuthConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const getCategories = async (token) => {
  const response = await axios.get(
    `${API_URL}/categories`,
    getAuthConfig(token),
  );
  return response.data.data;
};

const createCategory = async (categoryData, token) => {
  const response = await axios.post(
    `${API_URL}/categories`,
    categoryData,
    getAuthConfig(token),
  );
  return response.data.data;
};

const categoryService = {
  getCategories,
  createCategory,
};

export default categoryService;
