import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { apiRequest } from '../../../Service/httpClient';
import { baseApi } from '../../../Service/baseApi';
import { toList } from '../../../utils/apiResponse';

export const planKeys = {
    all: ['plans'] as const,
    list: () => [...planKeys.all, 'list'] as const,
};

// GET /api/plans - List the gym's plans
export const usePlansQuery = ({ enabled = true } = {}) => useQuery({
    queryKey: planKeys.list(),
    queryFn: ({ signal }) => apiRequest('/plans', { signal }),
    select: (response) => toList(response?.data?.plans),
    staleTime: 5 * 60 * 1000, // plans rarely change
    enabled,
});

// Plans are embedded in subscriptions, so changing a plan refreshes both caches,
// plus the RTK Query "Plans" tag used by membersApi.
const useInvalidatePlans = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return () => {
        queryClient.invalidateQueries({ queryKey: planKeys.all });
        queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
        dispatch(baseApi.util.invalidateTags(['Plans']));
    };
};

// POST /api/plans - Create plan (Owner only)
export const useCreatePlanMutation = () => {
    const invalidate = useInvalidatePlans();

    return useMutation({
        mutationFn: (planData: Record<string, unknown>) => apiRequest('/plans', { method: 'POST', body: planData }),
        onSuccess: invalidate,
    });
};

// PUT /api/plans/{id} - Update plan (Owner only)
export const useUpdatePlanMutation = () => {
    const invalidate = useInvalidatePlans();

    return useMutation({
        mutationFn: ({ id, ...planData }: { id: number | string; [field: string]: unknown }) => (
            apiRequest(`/plans/${encodeURIComponent(id)}`, { method: 'PUT', body: planData })
        ),
        onSuccess: invalidate,
    });
};

// DELETE /api/plans/{id} - Delete plan (Owner only; fails while it has active subscriptions)
export const useDeletePlanMutation = () => {
    const invalidate = useInvalidatePlans();

    return useMutation({
        mutationFn: (id: number | string) => apiRequest(`/plans/${encodeURIComponent(id)}`, { method: 'DELETE' }),
        onSuccess: invalidate,
    });
};
