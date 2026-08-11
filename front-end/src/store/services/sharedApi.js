import { api } from "./api";

export const sharedApi = api.injectEndpoints({
    endpoints: (builder) => ({
        updateProfilePassword: builder.mutation({
             query: (formValues) => ({
                url: "/auth/profile/update-password",
                method: "PATCH",
                body: formValues
            })
        }),

        deleteProfile: builder.mutation({
            query: () => ({
                url: "/auth/profile/delete",
                method: "DELETE"
            })
        })
    })
})

export const {
    useUpdateProfilePasswordMutation,
    useDeleteProfileMutation
}= sharedApi;