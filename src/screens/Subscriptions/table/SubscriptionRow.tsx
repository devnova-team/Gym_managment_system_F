import { useTranslation } from 'react-i18next';
import { Button, Table } from '@mantine/core';
import { RiRefreshLine } from 'react-icons/ri';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import {
    PAYMENT_STATUS_STYLES,
    SUBSCRIPTION_STATUS_STYLES,
    getDaysLeft,
    getSubscriptionStatus,
} from '../utils/subscriptionStatus';

const Badge = ({ className, children }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${className}`}>
        {children}
    </span>
);

const SubscriptionRow = ({ item, locale, onRenew }) => {
    const { t } = useTranslation();
    const { member, plan } = item;
    const status = getSubscriptionStatus(item.end_date);
    const daysLeft = getDaysLeft(item.end_date);

    return (
        <Table.Tr className="hover:bg-slate-50/70 dark:hover:bg-white/4 transition-colors text-xs border-b border-slate-100 dark:border-white/5">
            {/* Member */}
            <Table.Td className="p-3.5">
                <div className="font-bold text-slate-900 dark:text-slate-100">{member?.name ?? '-'}</div>
                <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-0.5" dir="ltr">
                    {member?.phone}
                </div>
            </Table.Td>

            {/* Plan */}
            <Table.Td className="p-3.5">
                <div className="font-bold text-slate-800 dark:text-white">{plan?.name ?? '-'}</div>
                {plan && (
                    <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                        {t(`subscriptions.planTypes.${plan.type}`, { defaultValue: plan.type })} · {formatCurrency(plan.price, 'EGP', locale)}
                    </div>
                )}
            </Table.Td>

            {/* Period */}
            <Table.Td className="p-3.5 text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">
                {formatDate(item.start_date, locale)} – {formatDate(item.end_date, locale)}
            </Table.Td>

            {/* Status */}
            <Table.Td className="p-3.5 whitespace-nowrap">
                <Badge className={SUBSCRIPTION_STATUS_STYLES[status]}>
                    {t(`subscriptions.status.${status}`)}
                </Badge>
                <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                    {daysLeft >= 0
                        ? t('subscriptions.daysLeft', { count: daysLeft })
                        : t('subscriptions.daysAgo', { count: Math.abs(daysLeft) })}
                </div>
            </Table.Td>

            {/* Payment */}
            <Table.Td className="p-3.5 whitespace-nowrap">
                <Badge className={PAYMENT_STATUS_STYLES[item.payment_status] ?? PAYMENT_STATUS_STYLES.unpaid}>
                    {t(`subscriptions.paymentStatus.${item.payment_status}`, { defaultValue: item.payment_status })}
                </Badge>
            </Table.Td>

            {/* Actions */}
            <Table.Td className="p-3.5 text-center! whitespace-nowrap">
                <Button
                    size="xs"
                    radius="md"
                    variant="light"
                    color="lime"
                    leftSection={<RiRefreshLine size={14} />}
                    onClick={() => onRenew(item)}
                    className="font-bold cursor-pointer"
                >
                    {t('subscriptions.renew')}
                </Button>
            </Table.Td>
        </Table.Tr>
    );
};

export default SubscriptionRow;
