import { RiCalendarEventLine } from 'react-icons/ri';
import { DUE_STATUS_STYLES, DueCountdown, DueStatusBadge } from '../../../components/DueStatus';
import { formatISODate } from '../../../utils/dateOnly';

const ReminderCard = ({ reminder, language }) => (
    <article className="relative flex gap-4 bg-white dark:bg-[#0e1517] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-smoothCard p-4 overflow-hidden">
        <span className={`absolute inset-y-0 start-0 w-1 ${DUE_STATUS_STYLES[reminder.status]?.dot ?? ''}`} />

        <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white wrap-break-word">{reminder.title}</h3>
                <DueStatusBadge status={reminder.status} />
            </div>

            {reminder.note && (
                <p className="text-xs text-slate-500 dark:text-slate-400 whitespace-pre-line wrap-break-word">
                    {reminder.note}
                </p>
            )}

            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <RiCalendarEventLine size={14} className="text-slate-400" />
                <span className="font-semibold">{formatISODate(reminder.due_date, language)}</span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <DueCountdown date={reminder.due_date} className="text-xs text-slate-500 dark:text-slate-400" />
            </div>
        </div>
    </article>
);

export default ReminderCard;
