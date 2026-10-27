import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Chip, Group } from '@mantine/core';
import { RiPriceTag3Line, RiTimerLine, RiMoneyDollarCircleLine, RiUserUnfollowLine, RiListCheck2 } from 'react-icons/ri';
import TextInputField from '../../../components/Forms/TextInputField';
import SelectField from '../../../components/Forms/SelectField';
import { useToast } from '../../../Context/ToastContext';
import { usePlans } from '../../../features/plans/hooks/usePlans';
import {
    DURATION_PRESETS,
    PLAN_TYPES,
    createPlanSchema,
} from '../../../features/plans/validation/planValidation';
import { getApiErrorMessage } from '../../../utils/apiErrors';

const inputClasses = {
    input: 'bg-slate-50! dark:bg-white/5! border-slate-200! dark:border-white/10! text-slate-900! dark:text-white! rounded-xl!',
    label: 'text-xs! font-bold! text-slate-700! dark:text-slate-200! mb-1.5!',
    description: 'text-[11px] text-slate-400 mb-1',
    dropdown: 'bg-white! dark:bg-[#0e1517]! border border-slate-200! dark:border-white/10! rounded-xl! shadow-xl',
    option: 'text-xs! font-medium! hover:bg-slate-100! dark:hover:bg-white/10! rounded-lg!',
};

const toInputValue = (value) => (value === undefined || value === null ? '' : String(value));

const getDefaultValues = (plan) => ({
    id: plan?.id,
    name: plan?.name ?? '',
    type: plan?.type ?? 'daily',
    duration_days: toInputValue(plan?.duration_days ?? 30),
    price: toInputValue(plan?.price !== undefined ? Number(plan.price) : ''),
    absence_threshold_days: toInputValue(plan?.absence_threshold_days ?? 5),
});

/**
 * DynamicForm config for adding (no plan) or editing (plan given) a plan.
 * Validation reuses the schema the server route handler enforces.
 */
export const usePlanForm = ({ plan, onSuccess }) => {
    const { t } = useTranslation();
    const { toast } = useToast();
    const { createPlan, updatePlan, isSaving } = usePlans({ enabled: false });
    const isEdit = Boolean(plan?.id);

    const typeOptions = useMemo(
        () => PLAN_TYPES.map((value) => ({ value, label: t(`subscriptions.planTypes.${value}`) })),
        [t],
    );

    const defaultValues = useMemo(() => getDefaultValues(plan), [plan]);

    const onSubmit = useCallback(async ({ id, ...values }, { reset }) => {
        try {
            if (isEdit) {
                await updatePlan({ id, ...values });
            } else {
                await createPlan(values);
            }
            toast.success(t(isEdit ? 'plans.updateSuccess' : 'plans.createSuccess'));
            reset();
            onSuccess?.();
        } catch (error) {
            toast.error(getApiErrorMessage(error, t));
        }
    }, [isEdit, updatePlan, createPlan, toast, t, onSuccess]);

    const textField = ({ name, label, icon, ...props }) => ({
        name,
        colSpan: props.colSpan,
        component: ({ field, error, setValue, formValues }) => (
            <>
                <TextInputField
                    {...field}
                    value={field.value ?? ''}
                    label={label}
                    error={error && t(error)}
                    required
                    leftSection={icon}
                    classNames={inputClasses}
                    {...props.inputProps}
                />
                {props.renderBelow?.({ setValue, formValues })}
            </>
        ),
    });

    const durationPresets = ({ setValue, formValues }) => (
        <Chip.Group
            value={formValues?.duration_days ? String(formValues.duration_days) : ''}
            onChange={(days) => setValue('duration_days', days, { shouldValidate: true, shouldDirty: true })}
        >
            <Group gap={6} mt={8}>
                {DURATION_PRESETS.map(({ key, days }) => (
                    <Chip key={key} value={String(days)} size="xs" radius="md" color="lime" variant="light">
                        {t(`plans.durations.${key}`)}
                    </Chip>
                ))}
            </Group>
        </Chip.Group>
    );

    return {
        fields: [
            textField({
                name: 'name',
                label: t('plans.fields.name'),
                icon: <RiPriceTag3Line size={16} className="text-slate-400" />,
                inputProps: { placeholder: t('plans.fields.namePlaceholder') },
            }),
            {
                name: 'type',
                colSpan: 6,
                component: ({ field, error }) => (
                    <SelectField
                        {...field}
                        label={t('plans.fields.type')}
                        data={typeOptions}
                        allowDeselect={false}
                        error={error && t(error)}
                        required
                        leftSection={<RiListCheck2 size={16} className="text-slate-400" />}
                        classNames={inputClasses}
                    />
                ),
            },
            textField({
                name: 'price',
                colSpan: 6,
                label: t('plans.fields.price'),
                icon: <RiMoneyDollarCircleLine size={16} className="text-emerald-500" />,
                inputProps: {
                    inputMode: 'decimal',
                    placeholder: '0',
                    rightSection: <span className="text-[11px] font-bold text-slate-400 pe-2">{t('common.currency')}</span>,
                },
            }),
            textField({
                name: 'duration_days',
                colSpan: 6,
                label: t('plans.fields.duration'),
                icon: <RiTimerLine size={16} className="text-slate-400" />,
                inputProps: { inputMode: 'numeric', description: t('plans.fields.durationHint') },
                renderBelow: durationPresets,
            }),
            textField({
                name: 'absence_threshold_days',
                colSpan: 6,
                label: t('plans.fields.absenceThreshold'),
                icon: <RiUserUnfollowLine size={16} className="text-slate-400" />,
                inputProps: { inputMode: 'numeric', description: t('plans.fields.absenceHint') },
            }),
        ],
        // The edit form always sends every field, so the create schema (all required) applies to both.
        validationSchema: createPlanSchema,
        defaultValues,
        onSubmit,
        isLoading: isSaving,
        isEdit,
    };
};
