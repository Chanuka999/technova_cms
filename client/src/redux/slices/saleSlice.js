import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import saleService from "../../services/saleService";

const initialState = {
  sales: [],
  sale: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

export const getSales = createAsyncThunk(
  "sales/getAll",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await saleService.getSales(token);
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const createSale = createAsyncThunk(
  "sales/create",
  async (saleData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await saleService.createSale(saleData, token);
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const saleSlice = createSlice({
  name: "sales",
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
      .addCase(getSales.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSales.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.sales = action.payload;
      })
      .addCase(getSales.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createSale.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createSale.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.sales.unshift(action.payload);
        // Message removed - handled in component for bill download coordination
      })
      .addCase(createSale.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = saleSlice.actions;
export default saleSlice.reducer;
