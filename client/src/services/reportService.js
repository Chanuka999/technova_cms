import axios from "axios";
import { API_BASE_URL } from "./apiBase";

const API_URL = `${API_BASE_URL}/reports`;

const getAuthConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Get sales report
const getSalesReport = async (token, startDate, endDate) => {
  const response = await axios.get(
    `${API_URL}/sales?startDate=${startDate}&endDate=${endDate}`,
    getAuthConfig(token),
  );
  return response.data.data;
};

// Get top products
const getTopProducts = async (token, limit = 10, startDate, endDate) => {
  const response = await axios.get(
    `${API_URL}/top-products?limit=${limit}&startDate=${startDate}&endDate=${endDate}`,
    getAuthConfig(token),
  );
  return response.data.data;
};

// Get inventory report
const getInventoryReport = async (token) => {
  const response = await axios.get(
    `${API_URL}/inventory`,
    getAuthConfig(token),
  );
  return response.data.data;
};

// Get profit & loss report
const getProfitLossReport = async (token, startDate, endDate) => {
  const response = await axios.get(
    `${API_URL}/profit-loss?startDate=${startDate}&endDate=${endDate}`,
    getAuthConfig(token),
  );
  return response.data.data;
};

// Get dashboard stats
const getDashboardStats = async (token) => {
  const response = await axios.get(
    `${API_URL}/dashboard`,
    getAuthConfig(token),
  );
  return response.data.data;
};

const reportService = {
  getSalesReport,
  getTopProducts,
  getInventoryReport,
  getProfitLossReport,
  getDashboardStats,
};

export default reportService;
