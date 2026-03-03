import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/activity-logs`;

// Get all activity logs
export const getActivityLogs = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters);
    const response = await axios.get(`${API_URL}?${params}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get activity logs by role
export const getLogsByRole = async (role, limit = 30, page = 1) => {
  try {
    const response = await axios.get(
      `${API_URL}/by-role/${role}?limit=${limit}&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get activity logs by user
export const getLogsByUser = async (userId, limit = 30, page = 1) => {
  try {
    const response = await axios.get(
      `${API_URL}/user/${userId}?limit=${limit}&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get activity statistics
export const getActivityStats = async (days = 7) => {
  try {
    const response = await axios.get(
      `${API_URL}/stats/dashboard?days=${days}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get today's activity summary
export const getTodayActivitySummary = async () => {
  try {
    const response = await axios.get(`${API_URL}/summary/today`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete old activity logs
export const deleteActivityLogs = async (days = 90) => {
  try {
    const response = await axios.delete(`${API_URL}?days=${days}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
