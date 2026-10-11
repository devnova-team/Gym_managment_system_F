import { useTranslation } from 'react-i18next';
import { diffInDays, todayISO } from '../../utils/dateOnly';

/** "3 days late" / "Today" / "In 5 days" relative to today. */
const DueCountdown = ({ date, className = 'text-[11px] text-slate-500 dark:text-slate-400' }) => {
    const { t } = useTranslation();
    const days = diffInDays(todayISO(), date);
    if (days === null) return null;

    let label;
    if (days === 0) label = t('common.dueToday', 'Today');
    else if (days < 0) label = t('common.daysLate', { count: -days, defaultValue: '{{count}} days late' });
    else label = t('common.inDays', { count: days, defaultValue: 'In {{count}} days' });

    return <span className={className}>{label}</span>;
};

export default DueCountdown;
