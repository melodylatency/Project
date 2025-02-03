import { TEMPLATES_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const templatesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTemplates: builder.query({
      query: () => ({
        url: TEMPLATES_URL,
      }),
      keepUnusedDataFor: 60,
    }),
    getTemplateDetails: builder.query({
      query: (templateId) => ({
        url: `${TEMPLATES_URL}/${templateId}`,
      }),
      keepUnusedDataFor: 60,
    }),
  }),
});

export const { useGetTemplatesQuery, useGetTemplateDetailsQuery } =
  templatesApiSlice;
