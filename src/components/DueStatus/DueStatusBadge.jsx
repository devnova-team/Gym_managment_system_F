import { useTranslation } from 'react-i18next';
import { DUE_STATUS_FALLBACK_LABELS, DUE_STATUS_STYLES } from './dueStatusConfig';

const DueStatusBadge = ({ status }) => {
    const { t } = useTranslation();
    const styles = DUE_STATUS_STYLES[status];
    if (!styles) return null;

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border whitespace-nowrap ${styles.badge}`}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
            {t(`common.dueStatus.${status}`, DUE_STATUS_FALLBACK_LABELS[status])}
        </span>
    );
};

export default DueStatusBadge;
