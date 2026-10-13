import { useTranslation } from 'react-i18next';
import { Card, Stack, Text, Title, ThemeIcon, Button, Group } from '@mantine/core';
import { RiFileList3Line, RiCalendarCheckLine } from 'react-icons/ri';

const FinancialEmptyState = ({ onSelectMonthly, isDarkMode }) => {
    const { t } = useTranslation();

    return (
        <Card
            radius="xl"
            p={{ base: 'lg', sm: '2xl' }}
            style={{
                backgroundColor: isDarkMode ? '#0e1517' : '#ffffff',
                borderColor: isDarkMode ? 'rgba(51, 65, 85, 0.8)' : '#e2e8f0',
                borderRadius: '20px',
                boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)'
            }}
            className="border text-center max-w-xl mx-auto my-6"
        >
            <Stack align="center" gap="md">
                <ThemeIcon
                    radius="lg"
                    size={58}
                    style={{
                        backgroundColor: 'rgba(245, 158, 11, 0.15)',
                        color: '#f59e0b',
                        borderRadius: '18px'
                    }}
                    className="shadow-md shadow-amber-500/10 mx-auto"
                >
                    <RiFileList3Line size={30} />
                </ThemeIcon>

                <Stack gap={4} className="max-w-md mx-auto">
                    <Title
                        order={3}
                        style={{
                            color: isDarkMode ? '#ffffff' : '#1e293b',
                            fontFamily: 'Inter, sans-serif'
                        }}
                        className="text-base sm:text-lg font-black"
                    >
                        {t('finance.noFinancialData', 'Not enough data for this period')}
                    </Title>
                    <Text
                        size="xs"
                        style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}
                        className="leading-relaxed"
                    >
                        {t('finance.noFinancialDataDesc', 'No subscription payments or expenses were found for the selected period.')}
                    </Text>
                </Stack>

                <Button
                    onClick={onSelectMonthly}
                    size="sm"
                    radius="md"
                    leftSection={<RiCalendarCheckLine size={17} />}
                    style={{
                        backgroundColor: '#85F40F',
                        color: '#020617',
                        borderRadius: '12px',
                        boxShadow: '0 4px 14px rgba(133, 244, 15, 0.3)'
                    }}
                    className="font-black hover:opacity-95 cursor-pointer mt-2"
                >
                    {t('finance.monthly', 'Switch to October 2026')}
                </Button>
            </Stack>
        </Card>
    );
};

export default FinancialEmptyState;
