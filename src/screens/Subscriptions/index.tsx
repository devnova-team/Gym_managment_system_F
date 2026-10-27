import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Stack, Tabs } from '@mantine/core';
import { RiVipCrownLine, RiVipDiamondLine } from 'react-icons/ri';
import { usePlans } from '../../features/plans/hooks/usePlans';
import { useSubscriptionsPage } from './hooks/useSubscriptionsPage';
import SubscriptionsHeader from './components/SubscriptionsHeader';
import SubscriptionsFilters from './components/SubscriptionsFilters';
import SubscriptionsErrorState from './components/SubscriptionsErrorState';
import SubscriptionsTable from './table';
import SubscriptionFormModal from './form';
import PlansPanel from './plans/PlansPanel';

const TABS = { subscriptions: 'subscriptions', plans: 'plans' };

const tabClassNames = {
    list: 'before:hidden! gap-1 border-b border-slate-200 dark:border-white/10',
    tab: 'font-bold! text-sm! data-[active=true]:text-brand-800! dark:data-[active=true]:text-[#85F40F]! data-[active=true]:border-[#85F40F]!',
};

const Subscriptions = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState(TABS.subscriptions);
    const { canManagePlans } = usePlans({ enabled: false });

    const {
        subscriptions,
        totalCount,
        hasAnySubscription,
        canManageSubscriptions,
        isLoading,
        isFetching,
        isError,
        refetch,
        search,
        status,
        page,
        totalPages,
        setPage,
        handleSearchChange,
        handleStatusChange,
        form,
        openCreateForm,
        openRenewForm,
        closeForm,
    } = useSubscriptionsPage();

    // Plan form state lives here so the header's "New Plan" button can open it.
    const [planForm, setPlanForm] = useState({ opened: false, plan: null });
    const openCreatePlan = useCallback(() => setPlanForm({ opened: true, plan: null }), []);
    const openEditPlan = useCallback((plan) => setPlanForm({ opened: true, plan }), []);
    const closePlanForm = useCallback(() => setPlanForm((current) => ({ ...current, opened: false })), []);

    const headerAction = activeTab === TABS.plans
        ? canManagePlans && { label: t('plans.create'), onClick: openCreatePlan }
        : canManageSubscriptions && { label: t('subscriptions.create'), onClick: openCreateForm };

    return (
        <Box className="w-full pb-10">
            <Stack gap="xl">
                <SubscriptionsHeader actionLabel={headerAction?.label} onAction={headerAction?.onClick} />

                <Tabs value={activeTab} onChange={(value) => setActiveTab(value ?? TABS.subscriptions)} classNames={tabClassNames}>
                    <Tabs.List>
                        <Tabs.Tab value={TABS.subscriptions} leftSection={<RiVipCrownLine size={16} />}>
                            {t('subscriptions.tabs.subscriptions')}
                        </Tabs.Tab>
                        <Tabs.Tab value={TABS.plans} leftSection={<RiVipDiamondLine size={16} />}>
                            {t('subscriptions.tabs.plans')}
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value={TABS.subscriptions} pt="lg">
                        {isError ? (
                            <SubscriptionsErrorState onRetry={refetch} isRetrying={isFetching} />
                        ) : (
                            <Stack gap="lg">
                                <SubscriptionsFilters
                                    search={search}
                                    onSearchChange={handleSearchChange}
                                    status={status}
                                    onStatusChange={handleStatusChange}
                                />
                                <SubscriptionsTable
                                    subscriptions={subscriptions}
                                    isLoading={isLoading}
                                    hasAnySubscription={hasAnySubscription}
                                    canManage={canManageSubscriptions}
                                    page={page}
                                    setPage={setPage}
                                    totalPages={totalPages}
                                    totalCount={totalCount}
                                    onRenew={openRenewForm}
                                    onCreate={openCreateForm}
                                />
                            </Stack>
                        )}
                    </Tabs.Panel>

                    <Tabs.Panel value={TABS.plans} pt="lg">
                        <PlansPanel
                            form={planForm}
                            onCreate={openCreatePlan}
                            onEdit={openEditPlan}
                            onCloseForm={closePlanForm}
                        />
                    </Tabs.Panel>
                </Tabs>
            </Stack>

            {canManageSubscriptions && (
                <SubscriptionFormModal
                    opened={form.opened}
                    mode={form.mode}
                    subscription={form.subscription}
                    onClose={closeForm}
                />
            )}
        </Box>
    );
};

export default Subscriptions;
