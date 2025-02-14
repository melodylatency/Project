import { FORMS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const formsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsersForms: builder.query({
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

export const {
  useGetUsersFormsQuery,
  useGetFormByIdQuery,
  useCreateFormMutation,
} = formsApiSlice;
