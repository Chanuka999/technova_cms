import axios from "axios";
import { API_BASE_URL } from "./apiBase";

const API_URL = API_BASE_URL;

const getAuthConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const getCustomers = async (token) => {
  const response = await axios.get(
    `${API_URL}/customers`,
    getAuthConfig(token),
  );
  return response.data.data;
};

const getCustomer = async (id, token) => {
  const response = await axios.get(
    `${API_URL}/customers/${id}`,
    getAuthConfig(token),
  );
  return response.data.data;
};

const createCustomer = async (customerData, token) => {
  const response = await axios.post(
    `${API_URL}/customers`,
    customerData,
    getAuthConfig(token),
  );
  return response.data.data;
};

const updateCustomer = async (id, customerData, token) => {
  const response = await axios.put(
    `${API_URL}/customers/${id}`,
    customerData,
    getAuthConfig(token),
  );
  return response.data.data;
};

const deleteCustomer = async (id, token) => {
  const response = await axios.delete(
    `${API_URL}/customers/${id}`,
    getAuthConfig(token),
  );
  return { id };
};

const customerService = {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};

export default customerService;
