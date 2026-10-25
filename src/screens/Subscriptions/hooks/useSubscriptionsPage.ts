import { useCallback, useMemo, useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useSubscriptionsQuery } from '../../../features/subscriptions/api/subscriptionsQueries';
import { getSubscriptionStatus } from '../utils/subscriptionStatus';

const PAGE_SIZE = 10;

const matchesSearch = (subscription, query) => {
    if (!query) return true;
    const { name = '', phone = '' } = subscription.member ?? {};
    return name.toLowerCase().includes(query) || phone.includes(query);
};

const matchesStatus = (subscription, status) => (
    status === 'all' || getSubscriptionStatus(subscription.end_date) === status
);

export const useSubscriptionsPage = () => {
    const { data: subscriptions = [], isPending: isLoading, isFetching, isError, refetch } = useSubscriptionsQuery();

    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('all');
    const [page, setPage] = useState(1);
    // `mode` is kept after closing so the modal content doesn't change during its close animation.
    const [form, setForm] = useState({ opened: false, mode: 'create', subscription: null });
    const [debouncedSearch] = useDebouncedValue(search.trim().toLowerCase(), 250);

    const filteredSubscriptions = useMemo(
        () => subscriptions.filter((item) => matchesSearch(item, debouncedSearch) && matchesStatus(item, status)),
        [subscriptions, debouncedSearch, status],
    );

    const totalPages = Math.max(1, Math.ceil(filteredSubscriptions.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const pageItems = filteredSubscriptions.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const handleSearchChange = useCallback((value) => {
        setSearch(value);
        setPage(1);
    }, []);

    const handleStatusChange = useCallback((value) => {
        setStatus(value || 'all');
        setPage(1);
    }, []);

    return {
        subscriptions: pageItems,
        totalCount: filteredSubscriptions.length,
        hasAnySubscription: subscriptions.length > 0,
        isLoading,
        isFetching,
        isError,
        refetch,
        search,
        status,
        page: currentPage,
        totalPages,
        setPage,
        handleSearchChange,
        handleStatusChange,
        form,
        openCreateForm: useCallback(() => setForm({ opened: true, mode: 'create', subscription: null }), []),
        openRenewForm: useCallback((subscription) => setForm({ opened: true, mode: 'renew', subscription }), []),
        closeForm: useCallback(() => setForm((current) => ({ ...current, opened: false })), []),
    };
};
