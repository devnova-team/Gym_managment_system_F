import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfirmModal from '../../../components/ConfirmModal';
import { useToast } from '../../../Context/ToastContext';
import { usePlans } from '../../../features/plans/hooks/usePlans';
import { getApiErrorMessage } from '../../../utils/apiErrors';
import SubscriptionsErrorState from '../components/SubscriptionsErrorState';
import PlanFormModal from './PlanFormModal';
import PlansTable from './PlansTable';

// A 422 without field errors on delete means the plan still has active subscriptions.
const getDeleteErrorMessage = (error, t) => (
    error?.status === 422 && !error?.data?.errors
        ? t('plans.errors.hasActiveSubscriptions')
        : getApiErrorMessage(error, t)
);

/**
 * Plans list. Everyone can read it; only roles with "managePlans" (Owner) can add, edit, or delete.
 * The form modal is controlled by the parent so its "New Plan" button can live in the page header.
 */
const PlansPanel = ({ form, onCreate, onEdit, onCloseForm }) => {
    const { t } = useTranslation();
    const { toast } = useToast();
    const { plans, isLoading, isFetching, isError, refetch, deletePlan, isDeleting, canManagePlans } = usePlans();
    const [planToDelete, setPlanToDelete] = useState(null);

    const handleConfirmDelete = async () => {
        try {
            await deletePlan(planToDelete.id);
            toast.success(t('plans.deleteSuccess'));
            setPlanToDelete(null);
        } catch (error) {
            toast.error(getDeleteErrorMessage(error, t));
        }
    };

    if (isError) {
        return (
            <SubscriptionsErrorState
                onRetry={refetch}
                isRetrying={isFetching}
                titleKey="plans.loadErrorTitle"
                descriptionKey="subscriptions.loadErrorDesc"
            />
        );
    }

    return (
        <>
            <PlansTable
                plans={plans}
                isLoading={isLoading}
                canManage={canManagePlans}
                onCreate={onCreate}
                onEdit={onEdit}
                onDelete={setPlanToDelete}
            />

            {canManagePlans && (
                <>
                    <PlanFormModal opened={form.opened} plan={form.plan} onClose={onCloseForm} />
                    <ConfirmModal
                        opened={Boolean(planToDelete)}
                        close={() => setPlanToDelete(null)}
                        title={t('plans.deleteTitle')}
                        description={t('plans.deleteDesc', { name: planToDelete?.name ?? '' })}
                        actionText={t('common.delete')}
                        cancelText={t('common.cancel')}
                        color="red"
                        isLoading={isDeleting}
                        handleConfirm={handleConfirmDelete}
                    />
                </>
            )}
        </>
    );
};

export default PlansPanel;
