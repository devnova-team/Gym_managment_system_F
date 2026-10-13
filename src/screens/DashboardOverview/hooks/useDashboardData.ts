import { useState, useCallback } from 'react';
import { mockDashboardData, mockEmptyDashboardData } from '../constants/mockDashboardData';

export const useDashboardData = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isEmptyMode, setIsEmptyMode] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState('month'); // 'today' | 'week' | 'month'

    const toggleEmptyMode = useCallback(() => {
        setIsLoading(true);
        setTimeout(() => {
            setIsEmptyMode(prev => !prev);
            setIsLoading(false);
        }, 350);
    }, []);

    const currentData = isEmptyMode ? mockEmptyDashboardData : mockDashboardData;

    const hasNoData = isEmptyMode || (currentData.summary?.activeMembers?.value === 0 && (currentData.recentActivities?.length || 0) === 0);

    return {
        data: currentData,
        hasNoData,
        isLoading,
        setIsLoading,
        isEmptyMode,
        toggleEmptyMode,
        selectedPeriod,
        setSelectedPeriod
    };
};

export default useDashboardData;
