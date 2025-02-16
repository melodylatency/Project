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
    getUsersTemplates: builder.query({
      query: () => ({
        url: `${TEMPLATES_URL}/author`,
        method: "GET",
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
      query: ({ templateId, ...body }) => ({
        url: `${TEMPLATES_URL}/${templateId}/reviews`,
        method: "POST",
        body: { ...body, template_id: templateId },
        invalidatesTags: ["Template"],
      }),
    }),
    deleteTemplate: builder.mutation({
      query: (templateId) => ({
        url: `${TEMPLATES_URL}/${templateId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetTemplatesQuery,
  useGetTemplateByIdQuery,
  useGetUsersTemplatesQuery,
  useCreateTemplateMutation,
  useCreateTemplateReviewMutation,
  useDeleteTemplateMutation,
} = templatesApiSlice;
