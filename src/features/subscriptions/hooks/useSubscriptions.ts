'use client';

import { useMemo } from 'react';
import { usePermissions } from '../../../hooks/usePermissions';
import {
    useCreateSubscriptionMutation,
    useRenewSubscriptionMutation,
    useSubscriptionsQuery,
} from '../api/subscriptionsQueries';
import { getDaysLeft, getSubscriptionStatus } from '../utils/subscriptionStatus';

/**
 * Everything a screen needs to read and manage subscriptions.
 *
 * const { subscriptions, createSubscription, renewSubscription } = useSubscriptions();
 * await createSubscription({ member_id: 5, plan_id: 2, payment_status: 'paid' });
 * await renewSubscription({ subscription_id: 1, plan_id: 2, payment_status: 'unpaid' });
 *
 * Mutations return promises that reject with ApiError (use getApiErrorMessage to show it).
 */
export const useSubscriptions = () => {
    const { can } = usePermissions();
    const subscriptionsQuery = useSubscriptionsQuery();
    const createMutation = useCreateSubscriptionMutation();
    const renewMutation = useRenewSubscriptionMutation();

    return {
        subscriptions: subscriptionsQuery.data ?? [],
        isLoading: subscriptionsQuery.isPending,
        isFetching: subscriptionsQuery.isFetching,
        isError: subscriptionsQuery.isError,
        refetch: subscriptionsQuery.refetch,

        createSubscription: createMutation.mutateAsync,
        renewSubscription: renewMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isRenewing: renewMutation.isPending,

        canManageSubscriptions: can('manageSubscriptions'),
    };
};

/**
 * The latest subscription of one member, with its status — e.g. for check-in or member details.
 *
 * const { subscription, status, daysLeft } = useMemberSubscription(member.id);
 * if (status === 'expired') showRenewalWarning();
 */
export const useMemberSubscription = (memberId) => {
    const { data: subscriptions = [], isPending, isError } = useSubscriptionsQuery();

    const subscription = useMemo(
        () => subscriptions
            .filter((item) => String(item.member?.id) === String(memberId))
            .sort((a, b) => String(b.end_date).localeCompare(String(a.end_date)))[0] ?? null,
        [subscriptions, memberId],
    );

    return {
        subscription,
        status: subscription ? getSubscriptionStatus(subscription.end_date) : null,
        daysLeft: subscription ? getDaysLeft(subscription.end_date) : null,
        isLoading: isPending,
        isError,
    };
};

export { getDaysLeft, getSubscriptionStatus };
