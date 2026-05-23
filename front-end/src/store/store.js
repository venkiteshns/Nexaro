import { configureStore } from "@reduxjs/toolkit";
import { api } from "./services/api";
import authReducer from "./Slices/UserSlice.js";

export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        auth: authReducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
});