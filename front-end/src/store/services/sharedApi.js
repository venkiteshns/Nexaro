import { SHARED } from "../../constants/urls";
import { api } from "./api";

export const sharedApi = api.injectEndpoints({
    endpoints: (builder) => ({
        updateProfilePassword: builder.mutation({
             query: (formValues) => ({
                url: SHARED.UPDATE_PROFILE_PASSWORD,
                method: "PATCH",
                body: formValues
            })
        }),

        deleteProfile: builder.mutation({
            query: () => ({
                url: SHARED.DELETE_PROFILE,
                method: "DELETE"
            })
        })
    })
})

export const {
    useUpdateProfilePasswordMutation,
    useDeleteProfileMutation
}= sharedApi;