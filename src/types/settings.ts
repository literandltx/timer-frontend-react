export interface TimerOption {
    id: number;
    value: number;
}

export interface UserSettings {
    id: string;
    lastUpdated: number;
    preference: TimerOption;
    options: TimerOption[];
}

export const DEFAULT_OPTIONS: TimerOption[] = [
    {
        id: 1,
        value: 20,
    },
    {
        id: 2,
        value: 40,
    },
    {
        id: 3,
        value: 60,
    },
    {
        id: 4,
        value: 90,
    },
];
