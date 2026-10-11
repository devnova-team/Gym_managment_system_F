import * as yup from 'yup';
import { todayISO } from '../../../utils/dateOnly';
import { HAS_LETTER_PATTERN, integerFromInput, isoDateString } from '../../../utils/validationRules';
import { EQUIPMENT_RULES } from '../constants/equipmentConstants';

const { NAME_MIN, NAME_MAX, MIN_DATE, INTERVAL_MIN_DAYS, INTERVAL_MAX_DAYS } = EQUIPMENT_RULES;

export const getEquipmentValidationSchema = (t, today = todayISO()) => {
    const invalidDate = t('validation.invalidDate', 'Enter a valid date');
    const tooOld = t('validation.dateTooOld', { date: MIN_DATE, defaultValue: 'Date cannot be before {{date}}' });

    return yup.object({
        name: yup
            .string()
            .trim()
            .required(t('equipment.validation.nameRequired', 'Equipment name is required'))
            .min(NAME_MIN, t('equipment.validation.nameMin', { min: NAME_MIN, defaultValue: 'Name must be at least {{min}} characters' }))
            .max(NAME_MAX, t('equipment.validation.nameMax', { max: NAME_MAX, defaultValue: 'Name cannot exceed {{max}} characters' }))
            .matches(HAS_LETTER_PATTERN, t('validation.mustContainLetters', 'Must contain letters, not only numbers or symbols')),

        purchase_date: isoDateString(invalidDate)
            .required(t('equipment.validation.purchaseDateRequired', 'Purchase date is required'))
            .test('min-date', tooOld, (value) => !value || value >= MIN_DATE)
            .test(
                'not-future',
                t('equipment.validation.purchaseDateFuture', 'Purchase date cannot be in the future'),
                (value) => !value || value <= today
            ),

        // Optional: a brand-new machine may not have been serviced yet.
        last_maintenance_date: isoDateString(invalidDate)
            .test(
                'not-before-purchase',
                t('equipment.validation.maintenanceBeforePurchase', 'Last maintenance cannot be before the purchase date'),
                function notBeforePurchase(value) {
                    const { purchase_date: purchaseDate } = this.parent;
                    return !value || !purchaseDate || value >= purchaseDate;
                }
            )
            .test(
                'not-future',
                t('equipment.validation.maintenanceFuture', 'Last maintenance cannot be in the future'),
                (value) => !value || value <= today
            ),

        maintenance_interval_days: integerFromInput(
            t('equipment.validation.intervalNumber', 'Interval must be a number of days'),
            t('equipment.validation.intervalInteger', 'Interval must be whole days')
        )
            .required(t('equipment.validation.intervalRequired', 'Maintenance interval is required'))
            .min(
                INTERVAL_MIN_DAYS,
                t('equipment.validation.intervalMin', { min: INTERVAL_MIN_DAYS, defaultValue: 'Interval must be at least {{min}} day' })
            )
            .max(
                INTERVAL_MAX_DAYS,
                t('equipment.validation.intervalMax', { max: INTERVAL_MAX_DAYS, defaultValue: 'Interval cannot exceed {{max}} days' })
            ),
    });
};

export default getEquipmentValidationSchema;
