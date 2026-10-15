import { baseApi } from '../baseApi';

export const communicationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET /api/members/segmented - Get members categorized into 4 tabs (new, expiring, inactive, expired) with wa.me links
        getSegmentedMembers: builder.query({
            query: (params) => ({
                url: '/members/segmented',
                method: 'GET',
                params,
            }),
            providesTags: ['Communication', 'Members'],
        }),
        // GET /api/message-templates - Get WhatsApp templates per category
        getMessageTemplates: builder.query({
            query: () => ({
                url: '/message-templates',
                method: 'GET',
            }),
            providesTags: ['Communication'],
        }),
        // PUT /api/message-templates/{id} - Edit message template text (Owner only)
        updateMessageTemplate: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/message-templates/${id}`,
                method: 'PUT',
                body: patch,
            }),
            invalidatesTags: ['Communication'],
        }),
    }),
});

export const {
    useGetSegmentedMembersQuery,
    useGetMessageTemplatesQuery,
    useUpdateMessageTemplateMutation,
} = communicationApi;
