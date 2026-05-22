import { createSlice } from "@reduxjs/toolkit";

let initialState = {
    user:localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    accessToken:localStorage.getItem('token') ? localStorage.getItem('token') : null,
}
console.log("state", initialState);

const userSlice = createSlice({
    name:"userAuth",
    initialState,
    reducers:{
        setCredentials:(state, action) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
        },
        logOut: (state) => {
            state.user = null;
            state.accessToken = null;
        }
    }
})

export const {setCredentials, logOut} = userSlice.actions;

export default userSlice.reducer;