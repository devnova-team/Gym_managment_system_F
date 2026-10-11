import { useTranslation } from 'react-i18next';
import { DUE_STATUS_FALLBACK_LABELS, DUE_STATUS_ORDER, DUE_STATUS_STYLES } from './dueStatusConfig';

export const ALL_STATUSES = 'all';

const TabButton = ({ isActive, onClick, dotClass, label, count }) => (
    <button
        type="button"
        onClick={onClick}
        aria-pressed={isActive}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
            isActive
                ? 'bg-[#85F40F]/15 border-[#85F40F]/50 text-slate-900 dark:text-white'
                : 'bg-white dark:bg-[#0e1517] border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
        }`}
    >
        {dotClass && <span className={`w-2 h-2 rounded-full ${dotClass}`} />}
        {label}
        <span className="min-w-5 px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-[11px] text-center">
            {count}
        </span>
    </button>
);

/**
 * Filter tabs: All / Overdue / Due today / Upcoming, each with its record count.
 */
const DueStatusTabs = ({ value, onChange, counts, total }) => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-wrap items-center gap-2" role="group">
            <TabButton
                isActive={value === ALL_STATUSES}
                onClick={() => onChange(ALL_STATUSES)}
                label={t('common.all', 'All')}
                count={total}
            />
            {DUE_STATUS_ORDER.map((status) => (
                <TabButton
                    key={status}
                    isActive={value === status}
                    onClick={() => onChange(status)}
                    dotClass={DUE_STATUS_STYLES[status].dot}
                    label={t(`common.dueStatus.${status}`, DUE_STATUS_FALLBACK_LABELS[status])}
                    count={counts[status]}
                />
            ))}
        </div>
    );
};

export default DueStatusTabs;
