import 'chart.js/auto';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

// Register all necessary ChartJS modules once globally
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export const BRAND_COLORS = {
    neonLime: '#85F40F',
    neonLimeHover: '#95E913',
    neonLimeDim: 'rgba(133, 244, 15, 0.25)',
    neonLimeGlow: 'rgba(133, 244, 15, 0.45)',
    emerald: '#10B981',
    emeraldDim: 'rgba(16, 185, 129, 0.2)',
    amber: '#F59E0B',
    amberDim: 'rgba(245, 158, 11, 0.2)',
    rose: '#F43F5E',
    roseDim: 'rgba(244, 63, 94, 0.2)',
    cyan: '#06B6D4',
    cyanDim: 'rgba(6, 182, 212, 0.2)',
    violet: '#8B5CF6',
    violetDim: 'rgba(139, 92, 246, 0.2)',
    indigo: '#6366F1',
    slateDark: '#0e1517',
    slatePanel: '#1a2333',
};

export const getChartBaseOptions = ({ isDarkMode = true, isRTL = false } = {}) => {
    const textColor = isDarkMode ? '#94a3b8' : '#64748b';
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)';
    const tooltipBg = isDarkMode ? '#0e1517' : '#ffffff';
    const tooltipText = isDarkMode ? '#ffffff' : '#0f172a';
    const tooltipBorder = isDarkMode ? 'rgba(133, 244, 15, 0.3)' : 'rgba(226, 232, 240, 1)';

    return {
        responsive: true,
        maintainAspectRatio: false,
        rtl: isRTL,
        animation: {
            duration: 750,
            easing: 'easeInOutQuart'
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: tooltipBg,
                titleColor: tooltipText,
                bodyColor: tooltipText,
                borderColor: tooltipBorder,
                borderWidth: 1,
                padding: 12,
                boxPadding: 6,
                cornerRadius: 12,
                usePointStyle: true,
                rtl: isRTL,
                textDirection: isRTL ? 'rtl' : 'ltr',
                titleAlign: 'left',
                bodyAlign: isRTL ? 'right' : 'left',
                footerAlign: 'left',
                titleFont: {
                    family: 'Inter, sans-serif',
                    size: 13,
                    weight: 'bold'
                },
                bodyFont: {
                    family: 'Inter, sans-serif',
                    size: 12,
                    weight: 'normal'
                },
                shadowOffsetX: 0,
                shadowOffsetY: 8,
                shadowBlur: 16,
                shadowColor: 'rgba(0, 0, 0, 0.25)'
            }
        },
        scales: {
            x: {
                grid: {
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    color: textColor,
                    font: {
                        family: 'Inter, sans-serif',
                        size: 11
                    }
                }
            },
            y: {
                grid: {
                    color: gridColor,
                    drawBorder: false
                },
                ticks: {
                    color: textColor,
                    font: {
                        family: 'Inter, sans-serif',
                        size: 11
                    }
                }
            }
        }
    };
};

export default ChartJS;
