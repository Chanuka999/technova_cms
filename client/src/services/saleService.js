import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const getAuthConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const getSales = async (token) => {
  const response = await axios.get(`${API_URL}/sales`, getAuthConfig(token));
  return response.data.data;
};

const getSale = async (id, token) => {
  const response = await axios.get(
    `${API_URL}/sales/${id}`,
    getAuthConfig(token),
  );
  return response.data.data;
};

const createSale = async (saleData, token) => {
  const response = await axios.post(
    `${API_URL}/sales`,
    saleData,
    getAuthConfig(token),
  );
  return response.data.data;
};

const updateSale = async (id, saleData, token) => {
  const response = await axios.put(
    `${API_URL}/sales/${id}`,
    saleData,
    getAuthConfig(token),
  );
  return response.data.data;
};

const saleService = {
  getSales,
  getSale,
  createSale,
  updateSale,
};

export default saleService;
