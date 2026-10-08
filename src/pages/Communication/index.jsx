import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge, Button, Card, Tabs, Text, Textarea } from '@mantine/core';
import { FiMessageCircle, FiSave, FiX } from 'react-icons/fi';
import { createWhatsAppLink } from '../../utils/whatsapp';
import {
    defaultCommunicationTemplates,
    formatCommunicationMessage,
    getCommunicationMembers,
    getCommunicationTemplates,
    saveCommunicationTemplates,
} from '../../data/mockCommunication';

const categories = ['new', 'expiring', 'inactive', 'expired'];

const Communication = () => {
    const { t, i18n } = useTranslation();
    const language = i18n.resolvedLanguage || i18n.language || 'en';
    const locale = language.toLowerCase().startsWith('ar') ? 'ar-EG' : 'en-US';
    const [activeCategory, setActiveCategory] = useState('new');
    const [templates, setTemplates] = useState(getCommunicationTemplates);
    const [editingTemplate, setEditingTemplate] = useState(false);
    const [draftTemplate, setDraftTemplate] = useState('');
    const members = getCommunicationMembers(activeCategory);
    const template = templates[activeCategory]?.message || defaultCommunicationTemplates[activeCategory].message;

    const startEditing = () => {
        setDraftTemplate(template);


        setEditingTemplate(true);
    };

    const saveTemplate = () => {
        const nextTemplates = saveCommunicationTemplates({
            ...templates,
            [activeCategory]: { ...templates[activeCategory], message: draftTemplate },
        });
        setTemplates(nextTemplates);
        setEditingTemplate(false);
    };

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                    {t('communication.title')}
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    {t('communication.description')}
                </p>
            </div>

            <Tabs value={activeCategory} onChange={(value) => value && setActiveCategory(value)}>
                <Tabs.List className="border-b border-slate-200 dark:border-slate-700">
                    {categories.map((category) => (
                        <Tabs.Tab key={category} value={category}>
                            <span>{t(`communication.${category}`)}</span>
                            <Badge size="sm" variant="light" color={activeCategory === category ? 'lime' : 'gray'} className="ms-2">
                                {getCommunicationMembers(category).length}
                            </Badge>
                        </Tabs.Tab>
                    ))}
                </Tabs.List>
            </Tabs>

            {members.length === 0 ? (
                <Card className="rounded-xl border border-dashed border-slate-300 bg-white py-10 text-center dark:border-slate-700 dark:bg-[#0e1517]">
                    <Text fw={600} className="text-slate-700 dark:text-slate-200">{t('communication.noMembers')}</Text>
                    <Text size="sm" c="dimmed" className="mt-1">{t('communication.noMembersDescription')}</Text>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {members.map((member) => {
                        const displayName = language.toLowerCase().startsWith('ar') && member.nameAr ? member.nameAr : member.name;
                        const message = formatCommunicationMessage(template, { ...member, name: displayName }, locale);
                        const whatsappLink = createWhatsAppLink(member.phone, message);

                        return (
                            <Card key={member.id} className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0e1517]">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <Text fw={700} className="truncate text-slate-800 dark:text-white">{displayName}</Text>
                                        <Text size="sm" c="dimmed" dir="ltr" className="mt-1 text-start">{member.phone}</Text>
                                    </div>
                                    <Badge color={activeCategory === 'expired' ? 'red' : activeCategory === 'expiring' ? 'orange' : activeCategory === 'inactive' ? 'gray' : 'green'} variant="light">
                                        {t(`communication.${activeCategory}`)}
                                    </Badge>
                                </div>

                                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                                    <div>
                                        <dt className="text-slate-500 dark:text-slate-400">{t('communication.plan')}</dt>
                                        <dd className="mt-0.5 font-medium text-slate-800 dark:text-slate-200">{member.planName}</dd>
                                    </div>
                                    {activeCategory === 'new' && (
                                        <div>
                                            <dt className="text-slate-500 dark:text-slate-400">{t('communication.joinDate')}</dt>
                                            <dd className="mt-0.5 font-medium text-slate-800 dark:text-slate-200">{new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(`${member.joinDate}T00:00:00`))}</dd>
                                        </div>
                                    )}
                                    {['expiring', 'expired'].includes(activeCategory) && (
                                        <div>
                                            <dt className="text-slate-500 dark:text-slate-400">{t('communication.endDate')}</dt>
                                            <dd className="mt-0.5 font-medium text-slate-800 dark:text-slate-200">{new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(`${member.subscriptionEndDate}T00:00:00`))}</dd>
                                        </div>
                                    )}
                                    {activeCategory === 'expiring' && (
                                        <div>
                                            <dt className="text-slate-500 dark:text-slate-400">{t('communication.daysRemaining')}</dt>
                                            <dd className="mt-0.5 font-medium text-slate-800 dark:text-slate-200">{Math.ceil((new Date(`${member.subscriptionEndDate}T00:00:00`) - new Date(new Date().setHours(0, 0, 0, 0))) / 86400000)}</dd>
                                        </div>
                                    )}
                                    {activeCategory === 'inactive' && (
                                        <div>
                                            <dt className="text-slate-500 dark:text-slate-400">{t('communication.lastAttendance')}</dt>
                                            <dd className="mt-0.5 font-medium text-slate-800 dark:text-slate-200">{new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(`${member.lastAttendance}T00:00:00`))}</dd>
                                        </div>
                                    )}
                                    <div>
                                        <dt className="text-slate-500 dark:text-slate-400">{t('communication.status')}</dt>
                                        <dd className="mt-0.5 font-medium text-slate-800 dark:text-slate-200">{t(`communication.${member.memberStatus.toLowerCase()}`)}</dd>
                                    </div>
                                </dl>

                                <Button
                                    component="a"
                                    href={whatsappLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    leftSection={<FiMessageCircle size={16} />}
                                    variant="light"
                                    color="green"
                                    fullWidth
                                    className="mt-4"

                                 
                                    disabled={!member.phone}
                                >
                                    {t('communication.sendWhatsApp')}
                                </Button>
                            </Card>
                        );
                    })}
                </div>
            )}

            <Card className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0e1517]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <Text fw={700} className="text-slate-800 dark:text-white">{t('communication.messageTemplates')}</Text>
                        <Text size="sm" c="dimmed">{t(`communication.${activeCategory}`)}</Text>
                    </div>
                    {!editingTemplate && (
                        <Button variant="light" onClick={startEditing} leftSection={<FiMessageCircle size={16} />}>
                            {t('communication.editTemplate')}
                        </Button>
                    )}
                </div>
                {editingTemplate ? (
                    <div className="mt-4 space-y-3">
                        <Textarea
                            value={draftTemplate}
                            onChange={(event) => setDraftTemplate(event.currentTarget.value)}
                            minRows={3}
                            maxRows={7}
                            aria-label={t('communication.messageTemplates')}
                        />
                        <div className="flex justify-end gap-2">
                            <Button variant="default" onClick={() => setEditingTemplate(false)} leftSection={<FiX size={16} />}>
                                {t('common.cancel')}
                            </Button>
                            <Button onClick={saveTemplate} leftSection={<FiSave size={16} />} disabled={!draftTemplate.trim()}>
                                {t('common.save')}
                            </Button>
                        </div>
                    </div>
                ) : (
                    
                    
                    <Text size="sm" className="mt-4 whitespace-pre-wrap text-slate-700 dark:text-slate-300">{template}</Text>
                )}
            </Card>
                                <Text size="sm" className="mt-4 whitespace-pre-wrap text-slate-700 dark:text-slate-300">{template}</Text>

        </div>
    );
};

export default Communication;
