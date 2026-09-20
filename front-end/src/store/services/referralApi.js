import { REFERRAL } from "../../constants/urls";
import { api } from "./api";

export const referralApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getReferralStats: builder.query({
      query: () => ({
        url: REFERRAL.GET_STATS,
        method: "GET",
      }),
      providesTags: ["Referral_Stats"],
    }),

    validateReferralCode: builder.query({
      query: (code) => ({
        url: `${REFERRAL.VALIDATE_CODE}/${encodeURIComponent(code)}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetReferralStatsQuery,
  useValidateReferralCodeQuery,
  useLazyValidateReferralCodeQuery,
} = referralApi;
