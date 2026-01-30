import type {Label} from "./labels.ts";

export interface TimerOption {
    id: number;
    value: number;
    label: Label;
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
        label: {
            id: `default-20`,
            name: '20 Min'
        }
    },
    {
        id: 2,
        value: 40,
        label: {
            id: 'default-40',
            name: '40 Min'
        }
    },
    {
        id: 3,
        value: 60,
        label: {
            id: 'default-60',
            name: '60 Min'
        }
    },
    {
        id: 4,
        value: 90,
        label: {
            id: 'default-90',
            name: '90 Min'
        }
    },
];
