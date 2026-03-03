import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import supplierService from "../../services/supplierService";

const initialState = {
  suppliers: [],
  supplier: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

export const getSuppliers = createAsyncThunk(
  "suppliers/getAll",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await supplierService.getSuppliers(token);
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const createSupplier = createAsyncThunk(
  "suppliers/create",
  async (supplierData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await supplierService.createSupplier(supplierData, token);
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const updateSupplier = createAsyncThunk(
  "suppliers/update",
  async ({ id, supplierData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await supplierService.updateSupplier(id, supplierData, token);
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const deleteSupplier = createAsyncThunk(
  "suppliers/delete",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      await supplierService.deleteSupplier(id, token);
      return id;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const supplierSlice = createSlice({
  name: "suppliers",
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
      .addCase(getSuppliers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSuppliers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.suppliers = action.payload;
      })
      .addCase(getSuppliers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createSupplier.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createSupplier.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.suppliers.push(action.payload);
        state.message = "Supplier created successfully";
      })
      .addCase(createSupplier.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateSupplier.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateSupplier.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.suppliers.findIndex(
          (s) => s._id === action.payload._id,
        );
        if (index > -1) {
          state.suppliers[index] = action.payload;
        }
        state.message = "Supplier updated successfully";
      })
      .addCase(updateSupplier.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteSupplier.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.suppliers = state.suppliers.filter(
          (s) => s._id !== action.payload,
        );
        state.message = "Supplier deleted successfully";
      })
      .addCase(deleteSupplier.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = supplierSlice.actions;
export default supplierSlice.reducer;
