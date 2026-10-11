import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { RiCalendarCheckLine, RiCalendarLine, RiCheckLine, RiTimerLine, RiToolsLine } from 'react-icons/ri';
import { DynamicFormModal } from '../../../components/DynamicForm';
import TextInputField from '../../../components/Forms/TextInputField';
import DateField from '../../../components/Forms/DateField';
import { useToast } from '../../../Context/ToastContext';
import { useLanguage } from '../../../Context/LanguageContext';
import { applyServerFieldErrors, getApiErrorMessage } from '../../../utils/apiErrors';
import { formatISODate, todayISO } from '../../../utils/dateOnly';
import { EQUIPMENT_FIELDS, EQUIPMENT_RULES } from '../constants/equipmentConstants';
import { getNextMaintenanceDue } from '../utils/maintenance';
import { getEquipmentValidationSchema } from './validationSchema';
import { getEquipmentDefaultValues, toEquipmentPayload } from './equipmentFormValues';

const EquipmentFormModal = ({ opened, onClose, equipment, onSave, isSaving }) => {
    const { t } = useTranslation();
    const { language } = useLanguage();
    const { toast } = useToast();
    const isEditMode = Boolean(equipment?.id);
    const today = todayISO();

    const validationSchema = useMemo(() => getEquipmentValidationSchema(t, today), [t, today]);
    const defaultValues = useMemo(() => getEquipmentDefaultValues(equipment), [equipment]);

    const fields = useMemo(
        () => [
            {
                name: 'name',
                colSpan: 12,
                component: ({ field, error }) => (
                    <TextInputField
                        {...field}
                        label={t('equipment.name', 'Equipment name')}
                        placeholder={t('equipment.namePlaceholder', 'e.g. Treadmill T-900')}
                        maxLength={EQUIPMENT_RULES.NAME_MAX}
                        error={error}
                        required
                        leftSection={<RiToolsLine size={16} className="text-slate-400" />}
                    />
                ),
            },
            {
                name: 'purchase_date',
                colSpan: 6,
                deps: ['last_maintenance_date'],
                component: ({ field, error }) => (
                    <DateField
                        {...field}
                        label={t('equipment.purchaseDate', 'Purchase Date')}
                        minDate={EQUIPMENT_RULES.MIN_DATE}
                        maxDate={today}
                        error={error}
                        required
                        leftSection={<RiCalendarLine size={16} className="text-slate-400" />}
                    />
                ),
            },
            {
                name: 'last_maintenance_date',
                colSpan: 6,
                component: ({ field, error, formValues }) => (
                    <DateField
                        {...field}
                        label={t('equipment.lastMaintenance', 'Last Service Date')}
                        description={t('equipment.lastMaintenanceHint', 'Leave empty if it was never serviced')}
                        minDate={formValues?.purchase_date || EQUIPMENT_RULES.MIN_DATE}
                        maxDate={today}
                        error={error}
                        leftSection={<RiCalendarCheckLine size={16} className="text-slate-400" />}
                    />
                ),
            },
            {
                name: 'maintenance_interval_days',
                colSpan: 12,
                component: ({ field, error, formValues }) => {
                    const nextDue = error ? null : getNextMaintenanceDue(formValues ?? {});
                    return (
                        <TextInputField
                            {...field}
                            inputMode="numeric"
                            label={t('equipment.interval', 'Maintenance interval')}
                            placeholder="90"
                            description={
                                nextDue
                                    ? t('equipment.nextDuePreview', {
                                          date: formatISODate(nextDue, language),
                                          defaultValue: 'Next maintenance will be due on {{date}}',
                                      })
                                    : t('equipment.intervalHint', 'How often this machine needs servicing')
                            }
                            error={error}
                            required
                            leftSection={<RiTimerLine size={16} className="text-slate-400" />}
                            rightSection={
                                <span className="text-[11px] font-bold text-slate-400 pe-2">
                                    {t('common.days', 'days')}
                                </span>
                            }
                            rightSectionWidth={56}
                        />
                    );
                },
            },
        ],
        [t, today, language]
    );

    const handleSubmit = async (values, { setError }) => {
        try {
            await onSave(toEquipmentPayload(values), equipment?.id);
            onClose();
        } catch (error) {
            if (!applyServerFieldErrors(error, setError, EQUIPMENT_FIELDS)) {
                toast.error(getApiErrorMessage(error, t('common.errorOccurred', 'An error occurred. Please try again.')));
            }
        }
    };

    return (
        <DynamicFormModal
            opened={opened}
            onClose={onClose}
            title={isEditMode ? t('equipment.editEquipment', 'Edit Equipment') : t('equipment.addEquipment', 'Add Machine/Equipment')}
            subtitle={t('equipment.formSubtitle', 'Track purchase and service dates to know when maintenance is due.')}
            icon={<RiToolsLine size={20} className="text-[#85F40F]" />}
            fields={fields}
            validationSchema={validationSchema}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            isLoading={isSaving}
            submitText={isEditMode ? t('common.saveChanges', 'Save Changes') : t('equipment.addEquipment', 'Add Machine/Equipment')}
            submitIcon={<RiCheckLine size={18} />}
            cancelText={t('common.cancel', 'Cancel')}
        />
    );
};

export default EquipmentFormModal;
