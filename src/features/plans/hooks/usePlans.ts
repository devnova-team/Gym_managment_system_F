'use client';

import { usePermissions } from '../../../hooks/usePermissions';
import {
    useCreatePlanMutation,
    useDeletePlanMutation,
    usePlansQuery,
    useUpdatePlanMutation,
} from '../api/plansQueries';

/**
 * Everything a screen needs to read and manage plans.
 *
 * const { plans, createPlan, canManagePlans } = usePlans();
 * await createPlan({ name: 'Monthly', type: 'daily', duration_days: 30, price: 350, absence_threshold_days: 5 });
 *
 * Mutations return promises that reject with ApiError (use getApiErrorMessage to show it).
 */
export const usePlans = ({ enabled = true } = {}) => {
    const { can } = usePermissions();
    const plansQuery = usePlansQuery({ enabled });
    const createMutation = useCreatePlanMutation();
    const updateMutation = useUpdatePlanMutation();
    const deleteMutation = useDeletePlanMutation();

    return {
        plans: plansQuery.data ?? [],
        isLoading: plansQuery.isPending && enabled,
        isFetching: plansQuery.isFetching,
        isError: plansQuery.isError,
        refetch: plansQuery.refetch,

        createPlan: createMutation.mutateAsync,
        updatePlan: updateMutation.mutateAsync,
        deletePlan: deleteMutation.mutateAsync,
        isSaving: createMutation.isPending || updateMutation.isPending,
        isDeleting: deleteMutation.isPending,

        canManagePlans: can('managePlans'),
    };
};
