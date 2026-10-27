import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { RiUserLine, RiVipCrownLine, RiMoneyDollarCircleLine } from 'react-icons/ri';
import SelectField from '../../../components/Forms/SelectField';
import { useToast } from '../../../Context/ToastContext';
import { useMemberLookupQuery } from '../../../features/subscriptions/api/subscriptionsQueries';
import { useSubscriptions } from '../../../features/subscriptions/hooks/useSubscriptions';
import { usePlans } from '../../../features/plans/hooks/usePlans';
import {
    PAYMENT_STATUSES,
    createSubscriptionSchema,
    renewSubscriptionSchema,
} from '../../../features/subscriptions/validation/subscriptionValidation';
import { formatCurrency } from '../../../utils/formatters';
import { getApiErrorMessage } from '../../../utils/apiErrors';

const inputClasses = {
    input: 'bg-slate-50! dark:bg-white/5! border-slate-200! dark:border-white/10! text-slate-900! dark:text-white! rounded-xl!',
    label: 'text-xs! font-bold! text-slate-700! dark:text-slate-200! mb-1.5!',
    description: 'text-[11px] text-slate-400 mb-1',
    dropdown: 'bg-white! dark:bg-[#0e1517]! border border-slate-200! dark:border-white/10! rounded-xl! shadow-xl',
    option: 'text-xs! font-medium! hover:bg-slate-100! dark:hover:bg-white/10! rounded-lg!',
};

const getDefaultValues = (isRenew, subscription) => (isRenew
    ? {
        subscription_id: subscription?.id,
        plan_id: subscription?.plan?.id ? String(subscription.plan.id) : '',
        payment_status: 'paid',
    }
    : { member_id: '', plan_id: '', payment_status: 'paid' });

/**
 * Builds the DynamicForm config for creating (mode "create") or renewing (mode "renew") a subscription.
 * Validation reuses the same yup schemas the server route handlers enforce.
 */
export const useSubscriptionForm = ({ opened, mode, subscription, onSuccess }) => {
    const { t, i18n } = useTranslation();
    const { toast } = useToast();
    const locale = i18n.dir() === 'rtl' ? 'ar-EG' : 'en-US';
    const isRenew = mode === 'renew';

    // Members are searched on the server (the list endpoint is paginated).
    const [memberSearch, setMemberSearch] = useState('');
    const [debouncedMemberSearch] = useDebouncedValue(memberSearch.trim(), 300);
    const {
        data: members = [],
        isFetching: isFetchingMembers,
        isError: isMembersError,
    } = useMemberLookupQuery(debouncedMemberSearch, { enabled: opened && !isRenew });
    const { plans, isLoading: isLoadingPlans } = usePlans({ enabled: opened });
    const { createSubscription, renewSubscription, isCreating, isRenewing } = useSubscriptions();

    const memberOptions = useMemo(
        () => members.map((member) => ({
            value: String(member.id),
            label: `${member.name} · ${member.phone}`,
        })),
        [members],
    );

    const planOptions = useMemo(
        () => plans.map((plan) => ({
            value: String(plan.id),
            label: `${plan.name} · ${t(`subscriptions.planTypes.${plan.type}`, { defaultValue: plan.type })} · ${formatCurrency(plan.price, 'EGP', locale)}`,
        })),
        [plans, t, locale],
    );

    const paymentStatusOptions = useMemo(
        () => PAYMENT_STATUSES.map((value) => ({ value, label: t(`subscriptions.paymentStatus.${value}`) })),
        [t],
    );

    const isSearchingMembers = isFetchingMembers || memberSearch.trim() !== debouncedMemberSearch;
    const memberEmptyMessage = isSearchingMembers
        ? t('common.loading')
        : isMembersError
            ? t('common.errorOccurred')
            : t('subscriptions.fields.noMembersFound');

    // Selecting an option fires a search with its label; ignore it so the selected member stays listed.
    const handleMemberSearch = useCallback((value) => {
        if (!memberOptions.some((option) => option.label === value)) setMemberSearch(value);
    }, [memberOptions]);

    const defaultValues = useMemo(() => getDefaultValues(isRenew, subscription), [isRenew, subscription]);

    const onSubmit = useCallback(async (values, { reset }) => {
        try {
            if (isRenew) {
                await renewSubscription(values);
            } else {
                await createSubscription(values);
            }
            toast.success(t(isRenew ? 'subscriptions.renewSuccess' : 'subscriptions.createSuccess'));
            reset();
            onSuccess?.();
        } catch (error) {
            toast.error(getApiErrorMessage(error, t));
        }
    }, [isRenew, renewSubscription, createSubscription, toast, t, onSuccess]);

    const memberField = {
        name: 'member_id',
        component: ({ field, error }) => (
            <SelectField
                {...field}
                label={t('subscriptions.fields.member')}
                placeholder={t('subscriptions.fields.memberPlaceholder')}
                data={memberOptions}
                searchable
                onSearchChange={handleMemberSearch}
                nothingFoundMessage={memberEmptyMessage}
                error={error && t(error)}
                required
                leftSection={<RiUserLine size={16} className="text-slate-400" />}
                classNames={inputClasses}
            />
        ),
    };

    const planField = {
        name: 'plan_id',
        component: ({ field, error }) => (
            <SelectField
                {...field}
                label={t('subscriptions.fields.plan')}
                placeholder={t('subscriptions.fields.planPlaceholder')}
                data={planOptions}
                disabled={isLoadingPlans}
                error={error && t(error)}
                required
                leftSection={<RiVipCrownLine size={16} className="text-slate-400" />}
                classNames={inputClasses}
            />
        ),
    };

    const paymentStatusField = {
        name: 'payment_status',
        colSpan: 6,
        component: ({ field, error }) => (
            <SelectField
                {...field}
                label={t('subscriptions.fields.paymentStatus')}
                data={paymentStatusOptions}
                allowDeselect={false}
                error={error && t(error)}
                required
                leftSection={<RiMoneyDollarCircleLine size={16} className="text-emerald-500" />}
                classNames={inputClasses}
            />
        ),
    };

    const paymentMethodField = {
        name: 'payment_method_display',
        colSpan: 6,
        component: () => (
            <TextInput
                label={t('subscriptions.fields.paymentMethod')}
                description={t('subscriptions.fields.cashOnly')}
                value={t('subscriptions.paymentMethod.cash')}
                readOnly
                disabled
                radius="md"
                classNames={inputClasses}
            />
        ),
    };

    return {
        fields: isRenew
            ? [planField, paymentStatusField, paymentMethodField]
            : [memberField, planField, paymentStatusField, paymentMethodField],
        validationSchema: isRenew ? renewSubscriptionSchema : createSubscriptionSchema,
        defaultValues,
        onSubmit,
        isLoading: isCreating || isRenewing,
    };
};
