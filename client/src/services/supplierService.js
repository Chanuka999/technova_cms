import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const getAuthConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const getSuppliers = async (token) => {
  const response = await axios.get(
    `${API_URL}/suppliers`,
    getAuthConfig(token),
  );
  return response.data.data;
};

const getSupplier = async (id, token) => {
  const response = await axios.get(
    `${API_URL}/suppliers/${id}`,
    getAuthConfig(token),
  );
  return response.data.data;
};

const createSupplier = async (supplierData, token) => {
  const response = await axios.post(
    `${API_URL}/suppliers`,
    supplierData,
    getAuthConfig(token),
  );
  return response.data.data;
};

const updateSupplier = async (id, supplierData, token) => {
  const response = await axios.put(
    `${API_URL}/suppliers/${id}`,
    supplierData,
    getAuthConfig(token),
  );
  return response.data.data;
};

const deleteSupplier = async (id, token) => {
  const response = await axios.delete(
    `${API_URL}/suppliers/${id}`,
    getAuthConfig(token),
  );
  return { id };
};

const supplierService = {
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};

export default supplierService;
