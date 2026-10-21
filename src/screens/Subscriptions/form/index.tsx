import { useTranslation } from 'react-i18next';
import { RiCheckLine, RiRefreshLine, RiVipCrownLine } from 'react-icons/ri';
import { DynamicFormModal } from '../../../components/DynamicForm';
import { formatDate } from '../../../utils/formatters';
import { useSubscriptionForm } from './useSubscriptionForm';

const SubscriptionFormModal = ({ opened, mode, subscription, onClose }) => {
    const { t, i18n } = useTranslation();
    const locale = i18n.dir() === 'rtl' ? 'ar-EG' : 'en-US';
    const isRenew = mode === 'renew';

    const form = useSubscriptionForm({ opened, mode, subscription, onSuccess: onClose });

    const subtitle = isRenew
        ? t('subscriptions.renewSubtitle', {
            member: subscription?.member?.name ?? '',
            endDate: formatDate(subscription?.end_date, locale),
        })
        : t('subscriptions.createSubtitle');

    return (
        <DynamicFormModal
            opened={opened}
            onClose={onClose}
            title={t(isRenew ? 'subscriptions.renewTitle' : 'subscriptions.createTitle')}
            subtitle={subtitle}
            icon={isRenew
                ? <RiRefreshLine size={20} className="text-[#85F40F]" />
                : <RiVipCrownLine size={20} className="text-[#85F40F]" />}
            fields={form.fields}
            validationSchema={form.validationSchema}
            defaultValues={form.defaultValues}
            onSubmit={form.onSubmit}
            isLoading={form.isLoading}
            submitText={t(isRenew ? 'subscriptions.renew' : 'subscriptions.create')}
            submitIcon={<RiCheckLine size={18} />}
            cancelText={t('common.cancel')}
        />
    );
};

export default SubscriptionFormModal;
