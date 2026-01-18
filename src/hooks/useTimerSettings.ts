import {useState} from 'react';
import {type TimerOption, type UserSettings, DEFAULT_OPTIONS} from '../types/settings';

const STORAGE_KEY = 'user_timer_pref_v4';

function createDefaultSettings(): UserSettings {
    return {
        id: crypto.randomUUID(),
        lastUpdated: Date.now(),
        preference: DEFAULT_OPTIONS[1],
        options: DEFAULT_OPTIONS
    };
}

export function useTimerSettings() {
    const [activeSettings, setActiveSettings] = useState<UserSettings>(() => {
        if (typeof window === 'undefined') {
            return createDefaultSettings();
        }
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                return {
                    ...parsed,
                    id: parsed.id || crypto.randomUUID(),
                    options: parsed.options || DEFAULT_OPTIONS
                };
            }
        } catch (e) {
            console.warn('Error parsing settings', e);
        }
        return createDefaultSettings();
    });

    const persist = (newSettings: UserSettings) => {
        setActiveSettings(newSettings);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    };

    const savePreference = (option: TimerOption) => {
        persist({...activeSettings, preference: option, lastUpdated: Date.now()});
    };

    const addCustomOption = (minutes: number) => {
        if (activeSettings.options.some(o => o.value === minutes)) return;

        const newOption: TimerOption = {
            id: Date.now(),
            value: minutes,
            label: `${minutes} Min`
        };

        const updatedOptions = [...activeSettings.options, newOption]
            .sort((a, b) => a.value - b.value);

        persist({
            ...activeSettings,
            options: updatedOptions,
            lastUpdated: Date.now()
        });
    };

    const removeOption = (id: number) => {
        if (activeSettings.options.length <= 1) return;

        const newOptions = activeSettings.options.filter(o => o.id !== id);

        let newPreference = activeSettings.preference;
        if (activeSettings.preference.id === id) {
            newPreference = newOptions[0];
        }

        persist({
            ...activeSettings,
            preference: newPreference,
            options: newOptions,
            lastUpdated: Date.now()
        });
    };

    return {
        settingsId: activeSettings.id,
        selectedOption: activeSettings.preference,
        availableOptions: activeSettings.options,
        savePreference,
        addCustomOption,
        removeOption
    };
}
