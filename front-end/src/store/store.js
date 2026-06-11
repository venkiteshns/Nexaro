import { configureStore } from "@reduxjs/toolkit";
import { api } from "./services/api";
import authReducer from "./Slices/UserSlice.js";
import adminReducer from "./Slices/AdminSlice.js";

export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        auth: authReducer,       
        adminAuth: adminReducer, 
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
});