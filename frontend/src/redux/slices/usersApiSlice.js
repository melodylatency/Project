import { USERS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
      }),
      providesTags: ["Users"],
      keepUnusedDataFor: 5,
    }),
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/register`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: "DELETE",
      }),
    }),
    blockUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}/block`,
        method: "PUT",
      }),
    }),
    unblockUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}/unblock`,
        method: "PUT",
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useDeleteUserMutation,
  useBlockUserMutation,
  useUnblockUserMutation,
  useProfileMutation,
} = usersApiSlice; // custom hook that calls the code block above
