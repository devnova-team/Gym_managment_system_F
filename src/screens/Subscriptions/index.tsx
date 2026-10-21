import { Box, Stack } from '@mantine/core';
import { useSubscriptionsPage } from './hooks/useSubscriptionsPage';
import SubscriptionsHeader from './components/SubscriptionsHeader';
import SubscriptionsFilters from './components/SubscriptionsFilters';
import SubscriptionsErrorState from './components/SubscriptionsErrorState';
import SubscriptionsTable from './table';
import SubscriptionFormModal from './form';

const Subscriptions = () => {
    const {
        subscriptions,
        totalCount,
        hasAnySubscription,
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
                <SubscriptionsHeader onCreate={openCreateForm} />

                {isError ? (
                    <SubscriptionsErrorState onRetry={refetch} isRetrying={isFetching} />
                ) : (
                    <>
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
                            page={page}
                            setPage={setPage}
                            totalPages={totalPages}
                            totalCount={totalCount}
                            onRenew={openRenewForm}
                            onCreate={openCreateForm}
                        />
                    </>
                )}
            </Stack>

            <SubscriptionFormModal
                opened={form.opened}
                mode={form.mode}
                subscription={form.subscription}
                onClose={closeForm}
            />
        </Box>
    );
};

export default Subscriptions;
