import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Group, Stack, Title, Text, Button } from '@mantine/core';
import { FiToggleLeft, FiToggleRight } from 'react-icons/fi';

const ReportsHeader = ({
    isEmptyMode,
    toggleEmptyMode,
    isDarkMode
}) => {
    const { t } = useTranslation();

    return (
        <Card
            radius="lg"
            p={{ base: 'md', sm: 'xl' }}
            style={{
                backgroundColor: isDarkMode ? '#0e1517' : '#ffffff',
                borderColor: isDarkMode ? 'rgba(133, 244, 15, 0.25)' : 'rgba(226, 232, 240, 0.8)',
                borderRadius: '16px'
            }}
            className="border shadow-[0_10px_30px_-5px_rgba(133,244,15,0.18),0_4px_15px_-3px_rgba(108,200,10,0.15)] dark:shadow-[0_12px_35px_-8px_rgba(133,244,15,0.22),0_4px_15px_-3px_rgba(108,200,10,0.2)]"
        >
            <Group justify="space-between" align="center" gap="md" wrap="wrap">
                {/* Left: Title & Subtitle */}
                <Stack gap={6} className="min-w-0">
                    <Title
                        style={{
                            color: isDarkMode ? '#ffffff' : '#1e293b',
                            fontFamily: 'Inter, sans-serif'
                        }}
                        className="text-xl sm:text-2xl font-black tracking-tight"
                    >
                        {t('finance.financialSummary', 'Executive Financial Health & Net Profit')}
                    </Title>
                    <Text
                        size="sm"
                        style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}
                        className="text-xs sm:text-sm font-medium"
                    >
                        {t('finance.financialSubtitle', 'Owner executive overview of cash revenue, store sales, and net profit margins.')}
                    </Text>
                </Stack>

                {/* Right: Test Empty State Button */}
                <div className="w-full md:w-auto flex items-center justify-end">
                    <Button
                        variant="default"
                        size="sm"
                        radius="md"
                        leftSection={
                            isEmptyMode ? (
                                <FiToggleRight size={16} className="text-[#85F40F]" />
                            ) : (
                                <FiToggleLeft size={16} className="text-slate-400" />
                            )
                        }
                        onClick={toggleEmptyMode}
                        style={{
                            backgroundColor: isDarkMode ? '#1e293b' : '#f1f5f9',
                            borderColor: isDarkMode ? '#334155' : '#cbd5e1',
                            color: isDarkMode ? '#e2e8f0' : '#334155',
                            borderRadius: '12px'
                        }}
                        className="w-full! md:w-auto! justify-center font-bold cursor-pointer"
                        title={t('dashboard.demoToggle', 'Toggle Empty State Demo')}
                    >
                        {isEmptyMode
                            ? t('dashboard.showLiveData', 'Show Live Data')
                            : t('dashboard.testEmptyState', 'Test Empty State')}
                    </Button>
                </div>
            </Group>
        </Card>
    );
};

export default ReportsHeader;
