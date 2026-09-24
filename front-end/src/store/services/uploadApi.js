import { UPLOAD } from "../../constants/urls";
import { api } from "./api";

export const uploadApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getPresignedUrl: builder.mutation({
            query: ({ fileName, fileType, folder = "uploads" }) => ({
                url: UPLOAD.PRESIGN,
                method: "POST",
                body: { fileName, fileType, folder },
            }),
        }),

        getPresignedBatchUrls: builder.mutation({
            query: ({ files, folder = "uploads" }) => ({
                url: UPLOAD.PRESIGN_BATCH,
                method: "POST",
                body: { files, folder },
            }),
        }),

        uploadFallback: builder.mutation({
            query: (formData) => ({
                url: UPLOAD.FALLBACK,
                method: "POST",
                body: formData,
            }),
        }),
    }),
});

export const {
    useGetPresignedUrlMutation,
    useGetPresignedBatchUrlsMutation,
    useUploadFallbackMutation,
} = uploadApi;
