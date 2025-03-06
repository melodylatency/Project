import { JIRA_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const tagsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserTickets: builder.query({
      query: () => ({
        url: JIRA_URL,
        method: "GET",
        providesTags: ["Ticket"],
      }),
    }),
    createTicket: builder.mutation({
      query: (data) => ({
        url: JIRA_URL,
        method: "POST",
        body: data,
        invalidatesTags: ["Ticket"],
      }),
    }),
  }),
});

export const { useGetUserTicketsQuery, useCreateTicketMutation } = tagsApiSlice;
