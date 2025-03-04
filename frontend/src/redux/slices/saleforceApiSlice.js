import { SALES_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const tagsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendSalesForm: builder.mutation({
      query: (data) => ({
        url: `${SALES_URL}/create-account`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useSendSalesFormMutation } = tagsApiSlice;
