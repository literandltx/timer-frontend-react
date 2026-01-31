import {useState, useEffect, useCallback} from "react";
import type {TimerData} from "../types/timer.ts";
import type {Label} from "../types/labels.ts";

const LOCAL_STORAGE_KEY_HISTORY = 'timerHistory';

export function useTimerHistory() {
    const [history, setHistory] = useState<TimerData[]>(() => {
        if (typeof window === 'undefined') return [];
        try {
            const saved: string | null = localStorage.getItem(LOCAL_STORAGE_KEY_HISTORY);
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error("Failed to parse history:", error);
            return [];
        }
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(LOCAL_STORAGE_KEY_HISTORY, JSON.stringify(history));
        }
    }, [history]);

    const addTimer = useCallback((timer: TimerData) => {
        setHistory((prev) => [...prev, timer]);
    }, []);

    const addManualEntry = useCallback((label: Label, durationMinutes: number, timestamp: number) => {
        const newEntry: TimerData = {
            label: label,
            timeAmount: durationMinutes * 60,
            timestamp: timestamp
        };
        setHistory(prev => {
            const updated = [...prev, newEntry];
            return updated.sort((a, b) => b.timestamp - a.timestamp);
        });
    }, []);

    const removeEntry = useCallback((indexToDelete: number) => {
        setHistory(prev => prev.filter((_, index) => index !== indexToDelete));
    }, []);

    const updateEntry = useCallback((index: number, newTimeInSeconds: number, newLabel: Label, newTimestamp: number) => {
        setHistory(prev => {
            const copy = [...prev];
            copy[index] = {
                ...copy[index],
                timeAmount: newTimeInSeconds,
                label: newLabel,
                timestamp: newTimestamp
            };
            return copy;
        });
    }, []);

    const clearHistory = useCallback(() => {
        if (confirm("Are you sure you want to delete ALL history?")) {
            setHistory([]);
        }
    }, []);

    const clearToday = useCallback(() => {
        if (confirm("Are you sure you want to delete today's history?")) {
            const todayString = new Date().toDateString();
            setHistory(prev => prev.filter(timer =>
                new Date(timer.timestamp).toDateString() !== todayString
            ));
        }
    }, []);

    const importHistory = useCallback((newTimers: TimerData[]) => {
        setHistory(prev => {
            const combined = [...prev, ...newTimers];

            const seen = new Set();
            const unique: TimerData[] = [];

            for (const item of combined) {
                const signature = `${item.timestamp}-${item.label.name}-${item.timeAmount}`;

                if (!seen.has(signature)) {
                    seen.add(signature);
                    unique.push(item);
                }
            }

            return unique.sort((a, b) => b.timestamp - a.timestamp);
        });
    }, []);

    return {
        history,
        addTimer,
        addManualEntry,
        removeEntry,
        updateEntry,
        clearHistory,
        clearToday,
        importHistory
    };
}