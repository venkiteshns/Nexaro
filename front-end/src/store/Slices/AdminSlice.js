import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    admin: localStorage.getItem("admin")
        ? JSON.parse(localStorage.getItem("admin"))
        : null,

    accessToken: localStorage.getItem("adminToken")
        ? localStorage.getItem("adminToken")
        : null,

    refreshToken: localStorage.getItem("adminRefreshToken")
        ? localStorage.getItem("adminRefreshToken")
        : null,
    sideBarOpen: true,
    activePage: 'Dashboard'
};

const adminSlice = createSlice({
    name: "adminAuth",

    initialState,

    reducers: {
        setAdminCredentials: (state, action) => {
            const { admin, accessToken, refreshToken } = action.payload;

            state.admin = admin;
            state.accessToken = accessToken;

            if (refreshToken !== undefined) {
                state.refreshToken = refreshToken;
                localStorage.setItem("adminRefreshToken", refreshToken);
            }
            if (admin !== undefined) {
                localStorage.setItem("admin", JSON.stringify(admin));
            }
            if (accessToken !== undefined) {
                localStorage.setItem("adminToken", accessToken);
            }
        },

        adminLogOut: (state) => {
            state.admin = null;
            state.accessToken = null;
            state.refreshToken = null;

            localStorage.removeItem("admin");
            localStorage.removeItem("adminToken");
            localStorage.removeItem("adminRefreshToken");
        },
        setSideBar: (state, action) => {
            state.sideBarOpen = action.payload
        },
        setActivePage: (state, action) => {
            state.activePage = action.payload
        }
    },
});

export const { setAdminCredentials, adminLogOut, setSideBar, setActivePage } = adminSlice.actions;

export default adminSlice.reducer;
