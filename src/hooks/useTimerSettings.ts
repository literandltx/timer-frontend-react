import {useState} from 'react';
import {TIMER_OPTIONS} from '../types/settings';
import type {TimerOption, UserSettings} from '../types/settings';

const STORAGE_KEY = 'user_timer_pref_v2';

export function useTimerSettings(): {
    selectedOption: TimerOption;
    availableOptions: TimerOption[];
    savePreference: (option: TimerOption) => void
} {
    const [activeSettings, setActiveSettings] = useState<UserSettings>(() => {
        if (typeof window === 'undefined') {
            return {lastUpdated: Date.now(), preference: TIMER_OPTIONS[1]};
        }

        try {
            const saved: string | null = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : {lastUpdated: Date.now(), preference: TIMER_OPTIONS[1]};
        } catch (error) {
            console.warn('Error reading settings', error);
            return {lastUpdated: Date.now(), preference: TIMER_OPTIONS[1]};
        }
    });

    const savePreference = (option: TimerOption) => {
        const newSettings: UserSettings = {
            lastUpdated: Date.now(),
            preference: option,
        };

        setActiveSettings(newSettings);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    };

    return {
        selectedOption: activeSettings.preference,
        availableOptions: TIMER_OPTIONS,
        savePreference,
    };
}
