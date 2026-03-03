import axios from "axios";
import { API_BASE_URL } from "./apiBase";

const API_URL = API_BASE_URL;

const getAuthConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Get all users
export const getUsers = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/users`, getAuthConfig(token));
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get single user
export const getUser = async (id, token) => {
  try {
    const response = await axios.get(
      `${API_URL}/users/${id}`,
      getAuthConfig(token),
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create user
export const createUser = async (userData, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/users`,
      userData,
      getAuthConfig(token),
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update user
export const updateUser = async (id, userData, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/users/${id}`,
      userData,
      getAuthConfig(token),
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete user
export const deleteUser = async (id, token) => {
  try {
    const response = await axios.delete(
      `${API_URL}/users/${id}`,
      getAuthConfig(token),
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Toggle user status
export const toggleUserStatus = async (id, token) => {
  try {
    const response = await axios.patch(
      `${API_URL}/users/${id}/toggle-status`,
      {},
      getAuthConfig(token),
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
