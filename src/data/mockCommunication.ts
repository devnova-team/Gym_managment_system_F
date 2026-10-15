import { mockMembers } from './mockAttendance';

const STORAGE_KEY = 'gms_communication_templates';

export const defaultCommunicationTemplates = {
    new: { id: 'new', message: 'Hi {name}, welcome to the gym! We are glad to have you with us.' },
    expiring: { id: 'expiring', message: 'Hi {name}, your {plan} membership ends on {endDate}. Contact us to renew.' },
    inactive: { id: 'inactive', message: 'Hi {name}, we have missed you at the gym. We hope to see you again soon!' },
    expired: { id: 'expired', message: 'Hi {name}, your {plan} membership ended on {endDate}. We would love to welcome you back.' },
};

export const getCommunicationTemplates = () => {
    if (typeof window === 'undefined') return defaultCommunicationTemplates;

    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        return stored ? { ...defaultCommunicationTemplates, ...JSON.parse(stored) } : defaultCommunicationTemplates;
    } catch {
        return defaultCommunicationTemplates;
    }
};

export const saveCommunicationTemplates = (templates) => {
    if (typeof window !== 'undefined') {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
        } catch {
            return templates;
        }
    }
    return templates;
};

const parseDate = (value) => value ? new Date(`${value.slice(0, 10)}T00:00:00`) : null;

export const getCommunicationMembers = (category) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return mockMembers.filter((member) => {
        const endDate = parseDate(member.subscriptionEndDate);
        const joinDate = parseDate(member.joinDate);
        const lastAttendance = parseDate(member.lastAttendance);
        const daysUntilExpiry = endDate ? Math.ceil((endDate - today) / 86400000) : null;
        const daysSinceJoin = joinDate ? Math.floor((today - joinDate) / 86400000) : null;
        const daysSinceAttendance = lastAttendance ? Math.floor((today - lastAttendance) / 86400000) : null;

        if (category === 'new') return daysSinceJoin >= 0 && daysSinceJoin <= 30 && daysUntilExpiry >= 0;
        if (category === 'expiring') return daysUntilExpiry >= 0 && daysUntilExpiry <= 14;
        if (category === 'inactive') return daysUntilExpiry >= 0 && daysSinceAttendance >= 30;
        if (category === 'expired') return daysUntilExpiry < 0;
        return false;
    });
};

export const formatCommunicationMessage = (template, member, locale) => {
    const formatDate = (value) => value
        ? new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(parseDate(value))
        : '';

    return template.replace(/\{(name|plan|endDate)\}/g, (_, key) => ({
        name: member.name,
        plan: member.planName,
        endDate: formatDate(member.subscriptionEndDate),
    })[key] || '');
};