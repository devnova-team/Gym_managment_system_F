import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Bar } from 'react-chartjs-2';
import { Card, Box, Group, Stack, Text, Title, ThemeIcon, SegmentedControl, SimpleGrid } from '@mantine/core';
import { getChartBaseOptions, BRAND_COLORS } from '../../../utils/chartConfig';
import { formatNumberByLocale, parseMetricChange } from '../../../utils/formatters';
import { FiUsers, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const AttendanceChart = ({ attendanceData, isDarkMode }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === 'rtl';
    const lang = i18n.language === 'ar' ? 'ar' : 'en';
    const [viewMode, setViewMode] = useState('weekly'); // 'weekly' | 'hourly'

    const hourlyLabels = useMemo(() => {
        const raw = attendanceData?.hourly?.labels?.[lang] || attendanceData?.hourly?.labels?.en || (
            lang === 'ar'
                ? ['٠٦:٠٠ ص', '٠٩:٠٠ ص', '١٢:٠٠ م', '٠٣:٠٠ م', '٠٦:٠٠ م', '٠٩:٠٠ م', '١٢:٠٠ ص']
                : ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM', '12 AM']
        );
        if (lang === 'ar') {
            return raw.map(l => formatNumberByLocale(l, true));
        }
        return raw;
    }, [attendanceData?.hourly, lang]);

    const hourlyValues = useMemo(() => {
        return attendanceData?.hourly?.checkIns || [18, 35, 42, 58, 112, 94, 26];
    }, [attendanceData?.hourly]);

    const labels = useMemo(() => {
        if (viewMode === 'hourly') return hourlyLabels;
        return attendanceData?.labels?.[lang] || attendanceData?.labels?.en || [];
    }, [viewMode, hourlyLabels, attendanceData, lang]);

    const values = useMemo(() => {
        if (viewMode === 'hourly') return hourlyValues;
        return attendanceData?.checkIns || [];
    }, [viewMode, hourlyValues, attendanceData]);

    const activeTodayIndex = useMemo(() => {
        if (typeof attendanceData?.todayIndex === 'number') {
            return attendanceData.todayIndex;
        }
        return (new Date().getDay() + 1) % 7;
    }, [attendanceData?.todayIndex]);

    const totalToday = attendanceData?.checkIns?.[activeTodayIndex] ?? 87;
    const average = attendanceData?.averageCheckIns || 100;
    const capacityLimit = attendanceData?.capacityLimit || 140;
    const trendData = parseMetricChange(attendanceData?.changeVsLastWeek || '+14%', isRTL);

    const busiestDayName = useMemo(() => {
        const checkInsList = attendanceData?.checkIns || [];
        if (!checkInsList.length) return '';
        const maxIndex = checkInsList.indexOf(Math.max(...checkInsList));
        return attendanceData?.labels?.[lang]?.[maxIndex] || attendanceData?.labels?.en?.[maxIndex] || '';
    }, [attendanceData, lang]);

    const chartData = useMemo(() => {
        const peakHourlyIndex = hourlyValues.indexOf(Math.max(...hourlyValues));

        const backgroundColors = values.map((_, idx) => {
            if (viewMode === 'hourly') {
                return idx === peakHourlyIndex ? BRAND_COLORS.amber : BRAND_COLORS.cyan;
            }
            return idx === activeTodayIndex ? BRAND_COLORS.neonLime : (isDarkMode ? 'rgba(133, 244, 15, 0.25)' : 'rgba(133, 244, 15, 0.45)');
        });

        const hoverBackgroundColors = values.map((_, idx) => {
            if (viewMode === 'hourly') {
                return idx === peakHourlyIndex ? '#FBBF24' : '#22D3EE';
            }
            return idx === activeTodayIndex ? '#99F628' : BRAND_COLORS.neonLime;
        });

        return {
            labels,
            datasets: [
                {
                    label: viewMode === 'hourly'
                        ? t('dashboard.peakHoursLabel', 'Hourly Traffic')
                        : t('dashboard.checkIns', 'Daily Check-ins'),
                    data: values,
                    backgroundColor: backgroundColors,
                    hoverBackgroundColor: hoverBackgroundColors,
                    borderRadius: 4,
                    borderSkipped: false,
                    barThickness: 22,
                    maxBarThickness: 24,
                }
            ]
        };
    }, [labels, values, viewMode, activeTodayIndex, hourlyValues, isDarkMode, t]);

    const chartOptions = useMemo(() => {
        const base = getChartBaseOptions({ isDarkMode, isRTL });
        return {
            ...base,
            plugins: {
                ...base.plugins,
                legend: {
                    display: false,
                },
                tooltip: {
                    ...base.plugins.tooltip,
                    rtl: isRTL,
                    textDirection: isRTL ? 'rtl' : 'ltr',
                    titleAlign: 'left',
                    bodyAlign: isRTL ? 'right' : 'left',
                    footerAlign: 'left',
                    callbacks: {
                        label: (context) => {
                            const val = formatNumberByLocale(context.raw || 0, isRTL);
                            const suffix = t('attendance.membersUnit', 'members');
                            return `${context.dataset.label}: ${val} ${suffix}`;
                        }
                    }
                }
            },
            scales: {
                ...base.scales,
                x: {
                    ...base.scales.x,
                    grid: {
                        display: false,
                    },
                    ticks: {
                        ...base.scales.x.ticks,
                        font: {
                            family: 'Inter, sans-serif',
                            size: 11,
                            weight: '600',
                        }
                    }
                },
                y: {
                    ...base.scales.y,
                    suggestedMax: viewMode === 'hourly' ? 120 : capacityLimit + 20,
                    ticks: {
                        ...base.scales.y.ticks,
                        callback: (value) => formatNumberByLocale(value, isRTL)
                    }
                }
            }
        };
    }, [isDarkMode, isRTL, capacityLimit, viewMode, t]);

    return (
        <Card
            radius="lg"
            p="lg"
            style={{
                backgroundColor: isDarkMode ? '#0e1517' : '#ffffff',
                borderColor: isDarkMode ? 'rgba(51, 65, 85, 0.8)' : '#e2e8f0',
                borderRadius: '16px',
                boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)'
            }}
            className="border flex flex-col justify-between"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-4">
                <Stack gap={2} className="min-w-0">
                    <Group gap="xs" align="center" wrap="nowrap" className="min-w-0">
                        <ThemeIcon
                            radius="md"
                            size={32}
                            style={{
                                backgroundColor: 'rgba(133, 244, 15, 0.15)',
                                color: '#85F40F',
                                borderColor: 'rgba(133, 244, 15, 0.3)'
                            }}
                            className="border shrink-0"
                        >
                            <FiUsers size={18} />
                        </ThemeIcon>
                        <Title
                            order={3}
                            style={{
                                color: isDarkMode ? '#ffffff' : '#1e293b',
                                fontFamily: 'Inter, sans-serif'
                            }}
                            className="text-base font-bold min-w-0"
                        >
                            {t('dashboard.attendanceChart', 'Weekly Attendance Traffic')}
                        </Title>
                    </Group>
                    <Text
                        size="xs"
                        style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}
                    >
                        {t('dashboard.attendanceSubtitle', 'Daily check-in volume across the current week')}
                    </Text>
                </Stack>

                {/* View Mode Toggle with Active Tab Background & Radius */}
                <SegmentedControl
                    fullWidth
                    value={viewMode}
                    onChange={setViewMode}
                    size="xs"
                    radius="md"
                    data={[
                        { label: t('common.thisWeek', 'This Week'), value: 'weekly' },
                        { label: t('dashboard.peakHoursLabel', 'Peak Hours'), value: 'hourly' }
                    ]}
                    styles={{
                        root: {
                            backgroundColor: isDarkMode ? '#131b1e' : '#f1f5f9',
                            border: `1px solid ${isDarkMode ? '#243338' : '#cbd5e1'}`,
                            borderRadius: '12px',
                            padding: '3px'
                        },
                        indicator: {
                            backgroundColor: '#85F40F',
                            borderRadius: '9px',
                            boxShadow: '0 2px 8px rgba(133, 244, 15, 0.35)'
                        },
                        label: {
                            fontWeight: 700,
                            fontSize: '12px',
                            padding: '6px 12px'
                        }
                    }}
                    className="w-full! sm:w-auto! flex! [&_[data-active]]:text-slate-950! [&_[data-active]]:font-black! [&_label]:text-slate-400 dark:[&_label]:text-slate-400"
                />
            </div>

            {/* Quick Metrics Bar */}
            <div
                style={{
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : '#f8fafc',
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#f1f5f9',
                    borderRadius: '12px'
                }}
                className="flex flex-col sm:flex-row justify-around items-stretch sm:items-center gap-2 py-2.5 px-3 sm:px-4 mb-4 border text-center"
            >
                <div className="flex flex-row sm:flex-col justify-between sm:justify-center items-center w-full sm:w-auto px-2 sm:px-0 py-1 sm:py-0 gap-2 sm:gap-1">
                    <Text
                        size="xs"
                        style={{ color: isDarkMode ? '#64748b' : '#94a3b8' }}
                        className="text-xs sm:text-[10px] uppercase font-semibold"
                    >
                        {t('dashboard.presentToday', 'Today')}
                    </Text>
                    <Text
                        size="sm"
                        style={{ color: isDarkMode ? '#85F40F' : '#15803d' }}
                        className="font-black text-sm"
                    >
                        {formatNumberByLocale(totalToday, isRTL)}
                    </Text>
                </div>

                <div className="hidden sm:block w-px h-6 bg-slate-200 dark:bg-slate-800" />
                <div className="sm:hidden w-full h-px bg-slate-200/50 dark:bg-slate-800/50" />

                <div className="flex flex-row sm:flex-col justify-between sm:justify-center items-center w-full sm:w-auto px-2 sm:px-0 py-1 sm:py-0 gap-2 sm:gap-1">
                    <Text
                        size="xs"
                        style={{ color: isDarkMode ? '#64748b' : '#94a3b8' }}
                        className="text-xs sm:text-[10px] uppercase font-semibold"
                    >
                        {t('dashboard.average', 'Average')}
                    </Text>
                    <Text
                        size="sm"
                        style={{ color: isDarkMode ? '#e2e8f0' : '#334155' }}
                        className="font-black text-sm"
                    >
                        {formatNumberByLocale(average, isRTL)}
                    </Text>
                </div>

                <div className="hidden sm:block w-px h-6 bg-slate-200 dark:bg-slate-800" />
                <div className="sm:hidden w-full h-px bg-slate-200/50 dark:bg-slate-800/50" />

                <div className="flex flex-row sm:flex-col justify-between sm:justify-center items-center w-full sm:w-auto px-2 sm:px-0 py-1 sm:py-0 gap-2 sm:gap-1">
                    <Text
                        size="xs"
                        style={{ color: isDarkMode ? '#64748b' : '#94a3b8' }}
                        className="text-xs sm:text-[10px] uppercase font-semibold"
                    >
                        {t('dashboard.capacityLimit', 'Capacity Limit')}
                    </Text>
                    <Text
                        size="sm"
                        style={{ color: isDarkMode ? '#e2e8f0' : '#334155' }}
                        className="font-black text-sm"
                    >
                        {formatNumberByLocale(capacityLimit, isRTL)}
                    </Text>
                </div>
            </div>

            {/* Canvas */}
            <Box className="h-64 w-full relative">
                <Bar data={chartData} options={chartOptions} />
            </Box>

            {/* Footer Summary */}
            <Group
                justify="space-between"
                align="center"
                dir={isRTL ? 'rtl' : 'ltr'}
                className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-xs"
            >
                <Text
                    size="xs"
                    style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}
                >
                    {viewMode === 'hourly'
                        ? t('dashboard.peakOperatingWindow', 'فترة الذروة التشغيلية: ٠٦:٠٠ م - ٠٩:٠٠ م')
                        : `${t('dashboard.busiestDay', 'Busiest Day')}: ${busiestDayName}`
                    }
                </Text>
                {viewMode === 'weekly' && trendData && (
                    <Group gap={4} align="center">
                        {trendData.isNegative ? (
                            <FiTrendingDown className="text-rose-500" />
                        ) : (
                            <FiTrendingUp className="text-emerald-500" />
                        )}
                        <Text
                            component="span"
                            dir="ltr"
                            size="xs"
                            className={trendData.isNegative ? 'text-rose-500 font-bold' : 'text-emerald-500 font-bold'}
                        >
                            {trendData.sign}{trendData.numericPart}
                        </Text>
                        <Text
                            component="span"
                            size="xs"
                            style={{ color: isDarkMode ? '#64748b' : '#94a3b8' }}
                        >
                            {t('dashboard.vsLastWeek', 'vs last week')}
                        </Text>
                    </Group>
                )}
            </Group>
        </Card>
    );
};

export default AttendanceChart;