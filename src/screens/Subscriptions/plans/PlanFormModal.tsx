import { useTranslation } from 'react-i18next';
import { RiCheckLine, RiVipDiamondLine } from 'react-icons/ri';
import { DynamicFormModal } from '../../../components/DynamicForm';
import { usePlanForm } from './usePlanForm';

const PlanFormModal = ({ opened, plan, onClose }) => {
    const { t } = useTranslation();
    const form = usePlanForm({ plan, onSuccess: onClose });

    return (
        <DynamicFormModal
            opened={opened}
            onClose={onClose}
            title={t(form.isEdit ? 'plans.editTitle' : 'plans.createTitle')}
            subtitle={t('plans.formSubtitle')}
            icon={<RiVipDiamondLine size={20} className="text-[#85F40F]" />}
            fields={form.fields}
            validationSchema={form.validationSchema}
            defaultValues={form.defaultValues}
            onSubmit={form.onSubmit}
            isLoading={form.isLoading}
            submitText={t(form.isEdit ? 'common.save' : 'plans.create')}
            submitIcon={<RiCheckLine size={18} />}
            cancelText={t('common.cancel')}
        />
    );
};

export default PlanFormModal;
