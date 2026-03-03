import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import productReducer from "./slices/productSlice";
import saleReducer from "./slices/saleSlice";
import customerReducer from "./slices/customerSlice";
import supplierReducer from "./slices/supplierSlice";
import userReducer from "./slices/userSlice";
import activityLogReducer from "./slices/activityLogSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    sales: saleReducer,
    customers: customerReducer,
    suppliers: supplierReducer,
    users: userReducer,
    activityLogs: activityLogReducer,
  },
});

export default store;
