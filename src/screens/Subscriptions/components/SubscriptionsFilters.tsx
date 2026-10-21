import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import SearchInput from '../../../components/SearchInput';
import SelectField from '../../../components/Forms/SelectField';
import { SUBSCRIPTION_STATUSES } from '../utils/subscriptionStatus';

const SubscriptionsFilters = ({ search, onSearchChange, status, onStatusChange }) => {
    const { t } = useTranslation();

    const statusOptions = useMemo(
        () => [
            { value: 'all', label: t('common.all') },
            ...SUBSCRIPTION_STATUSES.map((value) => ({ value, label: t(`subscriptions.status.${value}`) })),
        ],
        [t],
    );

    return (
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <SearchInput
                id="subscriptions-search"
                name="subscriptions-search"
                className="sm:col-span-8"
                placeholder={t('subscriptions.searchPlaceholder')}
                clearLabel={t('common.clearSearch')}
                value={search}
                onChange={(event) => onSearchChange(event.currentTarget.value)}
                onClear={() => onSearchChange('')}
            />
            <SelectField
                name="subscriptions-status"
                containerClassName="sm:col-span-4"
                aria-label={t('common.status')}
                data={statusOptions}
                value={status}
                onChange={onStatusChange}
                allowDeselect={false}
            />
        </div>
    );
};

export default SubscriptionsFilters;
