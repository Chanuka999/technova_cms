import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customerService from "../../services/customerService";

const initialState = {
  customers: [],
  customer: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

export const getCustomers = createAsyncThunk(
  "customers/getAll",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await customerService.getCustomers(token);
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const createCustomer = createAsyncThunk(
  "customers/create",
  async (customerData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await customerService.createCustomer(customerData, token);
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const updateCustomer = createAsyncThunk(
  "customers/update",
  async ({ id, customerData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await customerService.updateCustomer(id, customerData, token);
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const deleteCustomer = createAsyncThunk(
  "customers/delete",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      await customerService.deleteCustomer(id, token);
      return id;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const customerSlice = createSlice({
  name: "customers",
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
    builder
      .addCase(getCustomers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCustomers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.customers = action.payload;
      })
      .addCase(getCustomers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createCustomer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.customers.push(action.payload);
        state.message = "Customer created successfully";
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateCustomer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.customers.findIndex(
          (c) => c._id === action.payload._id,
        );
        if (index > -1) {
          state.customers[index] = action.payload;
        }
        state.message = "Customer updated successfully";
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteCustomer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.customers = state.customers.filter(
          (c) => c._id !== action.payload,
        );
        state.message = "Customer deleted successfully";
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = customerSlice.actions;
export default customerSlice.reducer;
