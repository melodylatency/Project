import { TAGS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const tagsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTags: builder.query({
      query: () => ({
        url: TAGS_URL,
        method: "GET",
        providesTags: ["Tag"],
      }),
      keepUnusedDataFor: 60,
    }),
  }),
});

export const { useGetTagsQuery } = tagsApiSlice;
