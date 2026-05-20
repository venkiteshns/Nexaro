// import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query'
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const usersApi = createApi({
    reducerPath:'usersApi',
    baseQuery:fetchBaseQuery({
        baseUrl:'https://dummyjson.com'
    }),
    endpoints:(builder) => ({
        getAllUsers:builder.query({
            query:() => '/users'
        })
    })
})

export const {useGetAllUsersQuery} = usersApi;