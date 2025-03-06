import { JIRA_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const tagsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserTickets: builder.query({
      query: () => ({
        url: JIRA_URL,
        method: "GET",
      }),
    }),
    createTicket: builder.mutation({
      query: (data) => ({
        url: JIRA_URL,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useGetUserTicketsQuery, useCreateTicketMutation } = tagsApiSlice;
