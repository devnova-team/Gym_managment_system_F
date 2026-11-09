import { useTranslation } from 'react-i18next';
import { Box, Stack } from '@mantine/core';
import { useSubscriptionsPage } from '@/features/subscriptions/screens/Subscriptions/hooks/useSubscriptionsPage';
import SubscriptionsHeader from '@/features/subscriptions/screens/Subscriptions/components/SubscriptionsHeader';
import SubscriptionsFilters from '@/features/subscriptions/screens/Subscriptions/components/SubscriptionsFilters';
import SubscriptionsErrorState from '@/features/subscriptions/screens/Subscriptions/components/SubscriptionsErrorState';
import SubscriptionsTable from '@/features/subscriptions/screens/Subscriptions/table/index';
import SubscriptionFormModal from '@/features/subscriptions/screens/Subscriptions/form/index';

const Subscriptions = () => {
    const { t } = useTranslation();

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

    return (
        <Box className="w-full pb-10">
            <Stack gap="xl">
                <SubscriptionsHeader
                    actionLabel={canManageSubscriptions ? t('subscriptions.create') : undefined}
                    onAction={canManageSubscriptions ? openCreateForm : undefined}
                />
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
