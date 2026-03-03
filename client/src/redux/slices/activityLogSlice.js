import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as activityLogService from "../../services/activityLogService";

// Thunks
export const fetchActivityLogs = createAsyncThunk(
  "activityLogs/fetchAll",
  async (filters, { rejectWithValue }) => {
    try {
      const data = await activityLogService.getActivityLogs(filters);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchLogsByRole = createAsyncThunk(
  "activityLogs/fetchByRole",
  async ({ role, limit, page }, { rejectWithValue }) => {
    try {
      const data = await activityLogService.getLogsByRole(role, limit, page);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchLogsByUser = createAsyncThunk(
  "activityLogs/fetchByUser",
  async ({ userId, limit, page }, { rejectWithValue }) => {
    try {
      const data = await activityLogService.getLogsByUser(userId, limit, page);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchActivityStats = createAsyncThunk(
  "activityLogs/fetchStats",
  async (days = 7, { rejectWithValue }) => {
    try {
      const data = await activityLogService.getActivityStats(days);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchTodayActivitySummary = createAsyncThunk(
  "activityLogs/fetchTodaysSummary",
  async (_, { rejectWithValue }) => {
    try {
      const data = await activityLogService.getTodayActivitySummary();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const initialState = {
  logs: [],
  summary: null,
  stats: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    pages: 0,
    currentPage: 1,
  },
};

const activityLogSlice = createSlice({
  name: "activityLogs",
  initialState,
  reducers: {
    clearActivityLogs: (state) => {
      state.logs = [];
      state.error = null;
    },
    clearActivityError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all logs
      .addCase(fetchActivityLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivityLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload.data;
        state.pagination = {
          total: action.payload.total,
          pages: action.payload.pages,
          currentPage: action.payload.currentPage,
        };
      })
      .addCase(fetchActivityLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch by role
      .addCase(fetchLogsByRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLogsByRole.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload.data;
      })
      .addCase(fetchLogsByRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch by user
      .addCase(fetchLogsByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLogsByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload.data;
      })
      .addCase(fetchLogsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch stats
      .addCase(fetchActivityStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivityStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data;
      })
      .addCase(fetchActivityStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch today's summary
      .addCase(fetchTodayActivitySummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodayActivitySummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload.data;
      })
      .addCase(fetchTodayActivitySummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearActivityLogs, clearActivityError } =
  activityLogSlice.actions;
export default activityLogSlice.reducer;
