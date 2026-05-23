import { configureStore } from "@reduxjs/toolkit";
import { api } from "./services/api";
import authReducer from "./Slices/UserSlice.js";
import adminReducer from "./Slices/AdminSlice.js";

export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        auth: authReducer,       // poster & worker state → state.auth
        adminAuth: adminReducer, // admin state          → state.adminAuth
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
});