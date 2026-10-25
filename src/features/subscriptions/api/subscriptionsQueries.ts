import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { apiRequest } from '../../../Service/httpClient';
import { baseApi } from '../../../Service/baseApi';
import { toList } from '../../../utils/apiResponse';

export const subscriptionKeys = {
    all: ['subscriptions'] as const,
    list: () => [...subscriptionKeys.all, 'list'] as const,
    detail: (id) => [...subscriptionKeys.all, 'detail', String(id)] as const,
};

// Member lookup for the subscription form (members are still managed by membersApi elsewhere).
export const memberLookupKeys = {
    search: (search) => ['members', 'lookup', search ?? ''] as const,
};

// ---------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------

// GET /api/subscriptions - List subscriptions with their member and plan
export const useSubscriptionsQuery = () => useQuery({
    queryKey: subscriptionKeys.list(),
    queryFn: ({ signal }) => apiRequest('/subscriptions', { signal }),
    select: (response) => toList(response?.data?.subscriptions),
});

// GET /api/subscriptions/{id} - Get subscription details
export const useSubscriptionQuery = (id) => useQuery({
    queryKey: subscriptionKeys.detail(id),
    queryFn: ({ signal }) => apiRequest(`/subscriptions/${encodeURIComponent(id)}`, { signal }),
    select: (response) => response?.data?.subscription ?? null,
    enabled: Boolean(id),
});

// GET /api/members?search= - Member options for the subscription form (searched on the server)
export const useMemberLookupQuery = (search, { enabled = true } = {}) => useQuery({
    queryKey: memberLookupKeys.search(search),
    queryFn: ({ signal }) => apiRequest('/members', { params: { search }, signal }),
    select: (response) => toList(response?.data?.members),
    placeholderData: keepPreviousData, // keep the last results visible while typing
    enabled,
});

// ---------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------

// Refreshes the subscriptions cache, plus RTK Query screens whose data depends on subscriptions.
const useInvalidateSubscriptions = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return (subscriptionId?) => {
        queryClient.invalidateQueries({ queryKey: subscriptionKeys.list() });
        if (subscriptionId) queryClient.invalidateQueries({ queryKey: subscriptionKeys.detail(subscriptionId) });
        dispatch(baseApi.util.invalidateTags(['Members', 'Dashboard', 'Reports']));
    };
};

// POST /api/subscriptions - Create subscription (payment_method: "cash")
export const useCreateSubscriptionMutation = () => {
    const invalidate = useInvalidateSubscriptions();

    return useMutation({
        mutationFn: (subscriptionData: Record<string, unknown>) => apiRequest('/subscriptions', { method: 'POST', body: subscriptionData }),
        onSuccess: () => invalidate(),
    });
};

// POST /api/subscriptions/renew - Renew subscription
export const useRenewSubscriptionMutation = () => {
    const invalidate = useInvalidateSubscriptions();

    return useMutation({
        mutationFn: (renewalData: Record<string, unknown>) => apiRequest('/subscriptions/renew', { method: 'POST', body: renewalData }),
        onSuccess: (_response, { subscription_id }) => invalidate(subscription_id),
    });
};
