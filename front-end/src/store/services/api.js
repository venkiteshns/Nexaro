import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logOut } from "../Slices/UserSlice";
import { setAdminCredentials, adminLogOut } from "../Slices/AdminSlice";

const API_URL = import.meta.env.VITE_API_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,

  prepareHeaders: (headers, { getState, endpoint }) => {
    const state = getState();

    const adminToken =
      state.adminAuth?.accessToken || localStorage.getItem("adminToken");
    const userToken = state.auth?.accessToken || localStorage.getItem("token");

    const isAdminRequest = endpoint?.startsWith("admin");

    const token = isAdminRequest ? adminToken : userToken;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const isAdminRequest =
      extraOptions?.isAdmin === true ||
      (typeof args === "object" && args.url?.startsWith("/admin"));

    if (isAdminRequest) {
      const adminRefreshToken = localStorage.getItem("adminRefreshToken");

      if (adminRefreshToken) {
        const refreshResult = await baseQuery(
          {
            url: "/auth/refresh-token",
            method: "POST",
            body: { refreshToken: adminRefreshToken },
          },
          api,
          extraOptions,
        );

        if (refreshResult.data?.accessToken) {
          const newToken = refreshResult.data.accessToken;
          api.dispatch(
            setAdminCredentials({
              admin: api.getState().adminAuth.admin,
              accessToken: newToken,
            }),
          );
          localStorage.setItem("adminToken", newToken);
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(adminLogOut());
        }
      } else {
        api.dispatch(adminLogOut());
      }
    } else {
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        const refreshResult = await baseQuery(
          {
            url: "/auth/refresh-token",
            method: "POST",
            body: { refreshToken },
          },
          api,
          extraOptions,
        );

        if (refreshResult.data?.accessToken) {
          const newToken = refreshResult.data.accessToken;
          api.dispatch(
            setCredentials({
              user: api.getState().auth.user,
              accessToken: newToken,
            }),
          );
          localStorage.setItem("token", newToken);
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logOut());
        }
      } else {
        api.dispatch(logOut());
      }
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Users",
    "Tasks",
    "Worker_Tasks",
    "Worker_Bids",
    "Active_Job",
    "Poster_Profile",
  ],

  endpoints: (builder) => ({}),
});
