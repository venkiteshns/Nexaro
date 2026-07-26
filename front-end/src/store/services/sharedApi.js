import { api } from "./api";

export const sharedApi = api.injectEndpoints({
    endpoints: (builder) => ({
        updateProfilePassword: builder.mutation({
             query: (formValues) => ({
                url: "/auth/profile/update-password",
                method: "PATCH",
                body: formValues
            })
        })
    })
})

export const {
    useUpdateProfilePasswordMutation
}= sharedApi;