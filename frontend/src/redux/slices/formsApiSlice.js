import { FORMS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const formsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getForms: builder.query({
      query: () => ({
        url: FORMS_URL,
        method: "GET",
      }),
      keepUnusedDataFor: 60,
    }),
    getFormById: builder.query({
      query: (templateId) => ({
        url: `${FORMS_URL}/${templateId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 60,
    }),
    createForm: builder.mutation({
      query: (data) => ({
        url: `${FORMS_URL}/create`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useGetFormsQuery, useGetFormByIdQuery, useCreateFormMutation } =
  formsApiSlice;
