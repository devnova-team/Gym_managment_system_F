import { baseApi } from '../baseApi';

const SUBSCRIPTION_SIDE_EFFECT_TAGS = ['Subscriptions', 'Members', 'Dashboard', 'Reports'] as const;

export const subscriptionsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET /api/subscriptions - List subscriptions with their member and plan
        getSubscriptions: builder.query({
            query: () => ({
                url: '/subscriptions',
                method: 'GET',
            }),
            transformResponse: (response) => {
                const payload = response?.data ?? response;
                const subscriptions = payload?.subscriptions ?? payload;
                if (Array.isArray(subscriptions)) return subscriptions;
                return Array.isArray(subscriptions?.data) ? subscriptions.data : [];
            },
            providesTags: ['Subscriptions'],
        }),
        // GET /api/subscriptions/{id} - Get subscription details
        getSubscriptionById: builder.query({
            query: (id) => ({
                url: `/subscriptions/${id}`,
                method: 'GET',
            }),
            transformResponse: (response) => response?.data?.subscription ?? null,
            providesTags: (_result, _error, id) => [{ type: 'Subscriptions', id }],
        }),
        // POST /api/subscriptions - Create subscription (payment_method: "cash")
        createSubscription: builder.mutation({
            query: (subscriptionData) => ({
                url: '/subscriptions',
                method: 'POST',
                body: subscriptionData,
            }),
            invalidatesTags: [...SUBSCRIPTION_SIDE_EFFECT_TAGS],
        }),
        // POST /api/subscriptions/renew - Renew subscription (supports early renewal from old end_date)
        renewSubscription: builder.mutation({
            query: (renewalData) => ({
                url: '/subscriptions/renew',
                method: 'POST',
                body: renewalData,
            }),
            invalidatesTags: (_result, _error, { subscription_id }) => [
                { type: 'Subscriptions', id: subscription_id },
                ...SUBSCRIPTION_SIDE_EFFECT_TAGS,
            ],
        }),
    }),
});

export const {
    useGetSubscriptionsQuery,
    useGetSubscriptionByIdQuery,
    useCreateSubscriptionMutation,
    useRenewSubscriptionMutation,
} = subscriptionsApi;
