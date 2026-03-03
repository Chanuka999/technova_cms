import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as userService from "../../services/userService";

const initialState = {
  users: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

// Get all users
export const getUsers = createAsyncThunk(
  "user/getAll",
  async (token, thunkAPI) => {
    try {
      return await userService.getUsers(token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

// Create user
export const createUser = createAsyncThunk(
  "user/create",
  async ({ userData, token }, thunkAPI) => {
    try {
      return await userService.createUser(userData, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

// Update user
export const updateUser = createAsyncThunk(
  "user/update",
  async ({ id, userData, token }, thunkAPI) => {
    try {
      return await userService.updateUser(id, userData, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

// Delete user
export const deleteUser = createAsyncThunk(
  "user/delete",
  async ({ id, token }, thunkAPI) => {
    try {
      return await userService.deleteUser(id, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

// Toggle user status
export const toggleUserStatus = createAsyncThunk(
  "user/toggleStatus",
  async ({ id, token }, thunkAPI) => {
    try {
      return await userService.toggleUserStatus(id, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    // Get users
    builder
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = action.payload.data;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.error || "Failed to fetch users";
      });

    // Create user
    builder
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users.push(action.payload.data);
        state.message = action.payload.message || "User created successfully";
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.error || "Failed to create user";
      });

    // Update user
    builder
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.users.findIndex(
          (u) => u._id === action.payload.data._id,
        );
        if (index > -1) {
          state.users[index] = action.payload.data;
        }
        state.message = action.payload.message || "User updated successfully";
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.error || "Failed to update user";
      });

    // Delete user
    builder
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message || "User deleted successfully";
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.error || "Failed to delete user";
      });

    // Toggle status
    builder
      .addCase(toggleUserStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.users.findIndex(
          (u) => u._id === action.payload.data._id,
        );
        if (index > -1) {
          state.users[index] = action.payload.data;
        }
        state.message = action.payload.message || "User status updated";
      })
      .addCase(toggleUserStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.error || "Failed to update status";
      });
  },
});

export const { reset } = userSlice.actions;
export default userSlice.reducer;
