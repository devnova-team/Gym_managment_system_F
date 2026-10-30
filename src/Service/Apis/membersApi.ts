import { baseApi } from "../baseApi";

const PAGE_SIZE = 100;

const getMemberPage = (response) => {
  const payload = response?.data ?? response;
  const collection = payload?.members ?? payload;
  const items = Array.isArray(collection)
    ? collection
    : Array.isArray(collection?.data)
      ? collection.data
      : [];
  const pagination = response?.pagination
    ?? response?.meta
    ?? payload?.pagination
    ?? payload?.meta
    ?? collection?.meta
    ?? collection;
  const links = response?.links ?? payload?.links ?? collection?.links;

  return { items, pagination, links };
};

export const membersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllMembers: builder.query({
      async queryFn(_arg, _api, _extraOptions, fetchWithBQ) {
        const allMembers = [];
        const seenIds = new Set();
        let page = 1;

        while (true) {
          const result = await fetchWithBQ({
            url: "/members",
            method: "GET",
            params: { page, per_page: PAGE_SIZE },
          });

          if (result.error) return { error: result.error };

          const { items, pagination, links } = getMemberPage(result.data);
          const newMembers = items.filter((member) => {
            const id = String(member.id ?? JSON.stringify(member));
            if (seenIds.has(id)) return false;
            seenIds.add(id);
            return true;
          });

          if (items.length && !newMembers.length) {
            return {
              error: {
                status: "CUSTOM_ERROR",
                error: "The members API pagination did not return new records.",
              },
            };
          }

          allMembers.push(...newMembers);

          const currentPage = Number(
            pagination?.current_page ?? pagination?.currentPage ?? pagination?.page ?? page,
          );
          const totalPages = Number(
            pagination?.last_page
              ?? pagination?.total_pages
              ?? pagination?.totalPages
              ?? (pagination?.total != null
                ? Math.ceil(Number(pagination.total) / Number(pagination.per_page ?? PAGE_SIZE))
                : NaN),
          );
          const hasMore = pagination?.has_more ?? pagination?.hasMore;
          const nextLink = links?.next;
          const shouldContinue = Number.isFinite(totalPages)
            ? currentPage < totalPages
            : hasMore != null
              ? Boolean(hasMore)
              : nextLink != null
                ? true
                : items.length === PAGE_SIZE;

          if (!shouldContinue) break;
          page += 1;
        }

        return { data: allMembers };
      },
      providesTags: ["Members"],
    }),
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
        url: `/members/${encodeURIComponent(id)}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Members", id }],
    }),
    // PUT /api/members/{id} - Update member details
    updateMember: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/members/${encodeURIComponent(id)}`,
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
        url: `/members/${encodeURIComponent(id)}`,
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
  }),
});

export const {
  useGetAllMembersQuery,
  useGetMembersQuery,
  useCreateMemberMutation,
  useGetMemberByIdQuery,
  useUpdateMemberMutation,
  useDeleteMemberMutation,
  useGetPlansQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
} = membersApi;
