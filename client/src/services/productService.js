import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const getAuthConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const getProducts = async (token) => {
  const response = await axios.get(`${API_URL}/products`, getAuthConfig(token));
  return response.data.data;
};

const getProduct = async (id, token) => {
  const response = await axios.get(
    `${API_URL}/products/${id}`,
    getAuthConfig(token),
  );
  return response.data.data;
};

const createProduct = async (productData, token) => {
  const response = await axios.post(
    `${API_URL}/products`,
    productData,
    getAuthConfig(token),
  );
  return response.data.data;
};

const updateProduct = async (id, productData, token) => {
  const response = await axios.put(
    `${API_URL}/products/${id}`,
    productData,
    getAuthConfig(token),
  );
  return response.data.data;
};

const deleteProduct = async (id, token) => {
  const response = await axios.delete(
    `${API_URL}/products/${id}`,
    getAuthConfig(token),
  );
  return { id };
};

const productService = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};

export default productService;
