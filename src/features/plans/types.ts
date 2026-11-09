export type PlanType = 'limited' | 'unlimited';

export type Plan = {
    id: number | string;
    name: string;
    type: PlanType;
    duration_days: number;
    total_sessions: number | string | null;
    price: number | string;
    absence_threshold_days: number;
    created_at?: string;
};

export type PlanInput = {
    name: string;
    type: PlanType;
    duration_days: number | string;
    total_sessions: number | string | null;
    price: number | string;
    absence_threshold_days: number | string;
};
