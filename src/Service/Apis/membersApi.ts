import { baseApi } from "../baseApi";

export const membersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/members - Fetch members with search and filter
    getMembers: builder.query({
      query: (params) => ({
        url: "/members",
        method: "GET",
        params,
      }),
      providesTags: ["Members"],
    }),
    // POST /api/members - Add new member (name, phone, birth_date, photo)
    createMember: builder.mutation({
      query: (memberData) => ({
        url: "/members",
        method: "POST",
        body: memberData,
      }),
      invalidatesTags: ["Members", "Dashboard"],
    }),
    // GET /api/members/{id} - Get member details
    getMemberById: builder.query({
      query: (id) => ({
        url: `/members/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Members", id }],
    }),
    // PUT /api/members/{id} - Update member details
    updateMember: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/members/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Members", id },
        "Members",
      ],
    }),
    // DELETE /api/members/{id} - Soft delete member
    deleteMember: builder.mutation({
      query: (id) => ({
        url: `/members/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Members", "Dashboard"],
    }),
    // GET /api/plans - Fetch all available subscription plans
    getPlans: builder.query({
      query: () => ({
        url: "/plans",
        method: "GET",
      }),
      providesTags: ["Plans"],
    }),
    // POST /api/plans - Add new plan (Owner only)
    createPlan: builder.mutation({
      query: (planData) => ({
        url: "/plans",
        method: "POST",
        body: planData,
      }),
      invalidatesTags: ["Plans"],
    }),
    // PUT /api/plans/{id} - Edit plan
    updatePlan: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/plans/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: ["Plans"],
    }),
    // DELETE /api/plans/{id} - Delete plan (fails if linked to active subscriptions)
    deletePlan: builder.mutation({
      query: (id) => ({
        url: `/plans/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Plans"],
    }),
    // POST /api/subscriptions - Add subscription for member (payment_method: "cash")
    createSubscription: builder.mutation({
      query: (subscriptionData) => ({
        url: "/subscriptions",
        method: "POST",
        body: { ...subscriptionData, payment_method: "cash" },
      }),
      invalidatesTags: ["Subscriptions", "Members", "Dashboard", "Reports"],
    }),
    // POST /api/subscriptions/renew - Renew subscription (supports early renewal from old end_date)
    renewSubscription: builder.mutation({
      query: (renewalData) => ({
        url: "/subscriptions/renew",
        method: "POST",
        body: renewalData,
      }),
      invalidatesTags: ["Subscriptions", "Members", "Dashboard", "Reports"],
    }),
  }),
});

export const {
  useGetMembersQuery,
  useCreateMemberMutation,
  useGetMemberByIdQuery,
  useUpdateMemberMutation,
  useDeleteMemberMutation,
  useGetPlansQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
  useCreateSubscriptionMutation,
  useRenewSubscriptionMutation,
} = membersApi;
