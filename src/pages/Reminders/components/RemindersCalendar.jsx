import { Calendar } from '@mantine/dates';
import { useTranslation } from 'react-i18next';
import 'dayjs/locale/ar';
import { useLanguage } from '../../../Context/LanguageContext';
import { DUE_STATUS_STYLES } from '../../../components/DueStatus';
import { todayISO } from '../../../utils/dateOnly';

const dayOfMonth = (isoDate) => Number(isoDate.slice(8, 10));

/**
 * Month view with a colored dot on days that have reminders.
 * Clicking a day filters the list to that date; clicking it again clears the filter.
 */
const RemindersCalendar = ({ dateMarkers, selectedDate, onSelectDate }) => {
    const { t } = useTranslation();
    const { language } = useLanguage();
    const today = todayISO();

    return (
        <div className="bg-white dark:bg-[#0e1517] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-smoothCard p-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                {t('reminders.calendarTitle', 'Calendar')}
            </h2>
            <div className="flex justify-center">
                <Calendar
                    locale={language}
                    defaultDate={selectedDate || today}
                    getDayProps={(date) => ({
                        selected: date === selectedDate,
                        onClick: () => onSelectDate(date),
                        'aria-label': date,
                    })}
                    renderDay={(date) => {
                        const status = dateMarkers[date];
                        return (
                            <div className="relative flex items-center justify-center w-full h-full">
                                <span className={date === today ? 'font-black text-[#6CC80A]' : undefined}>
                                    {dayOfMonth(date)}
                                </span>
                                {status && (
                                    <span
                                        className={`absolute bottom-0.5 w-1.5 h-1.5 rounded-full ${DUE_STATUS_STYLES[status].dot}`}
                                    />
                                )}
                            </div>
                        );
                    }}
                />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3 text-center">
                {t('reminders.calendarHint', 'Select a day to see its reminders.')}
            </p>
        </div>
    );
};

export default RemindersCalendar;
