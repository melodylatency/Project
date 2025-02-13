import { TEMPLATES_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const templatesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTemplates: builder.query({
      query: () => ({
        url: TEMPLATES_URL,
        method: "GET",
        providesTags: ["Template"],
      }),
      keepUnusedDataFor: 60,
    }),
    getTemplateById: builder.query({
      query: (templateId) => ({
        url: `${TEMPLATES_URL}/${templateId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 60,
    }),
    createTemplate: builder.mutation({
      query: (data) => ({
        url: `${TEMPLATES_URL}/create`,
        method: "POST",
        body: data,
        invalidatesTags: ["Template"],
      }),
    }),
    createTemplateReview: builder.mutation({
      query: (data) => ({
        url: `${TEMPLATES_URL}/${data.templateId}/reviews`,
        method: "POST",
        body: data,
        invalidatesTags: ["Template"],
      }),
    }),
  }),
});

export const {
  useGetTemplatesQuery,
  useGetTemplateByIdQuery,
  useCreateTemplateMutation,
  useCreateTemplateReviewMutation,
} = templatesApiSlice;
