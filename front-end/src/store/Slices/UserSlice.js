
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : null,

    accessToken: localStorage.getItem("token")
        ? localStorage.getItem("token")
        : null,

    refreshToken: localStorage.getItem("refreshToken")
        ? localStorage.getItem("refreshToken")
        : null,
};

const userSlice = createSlice({
    name: "userAuth",

    initialState,

    reducers: {
        setCredentials: (state, action) => {
            const { user, accessToken, refreshToken } = action.payload;

            state.user = user;
            state.accessToken = accessToken;

            if (refreshToken !== undefined) {
                state.refreshToken = refreshToken;
                localStorage.setItem("refreshToken", refreshToken);
            }

            if (user !== undefined) {
                localStorage.setItem("user", JSON.stringify(user));
            }
            if (accessToken !== undefined) {
                localStorage.setItem("token", accessToken);
            }
        },


        logOut: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;

            localStorage.removeItem("user");
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
        },
    },
});

export const { setCredentials, logOut } = userSlice.actions;

export default userSlice.reducer;