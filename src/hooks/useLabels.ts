import {useState, useEffect} from "react";
import {LABEL_ACTIONS} from "../types/labels.ts";

const LOCAL_STORAGE_KEY_LABEL_OPTIONS = 'timer_label_options';
const LOCAL_STORAGE_KEY_ACTIVE = 'timer_active_label';

interface UseLabelsReturn {
    labels: string[];
    activeLabel: string;
    handleLabelChange: (selectedValue: string) => void;
}

export function useLabels(initialDefaults: string[] = ['Focus', 'Learn', 'Recharge']): UseLabelsReturn {
    const [labels, setLabels] = useState<string[]>(() => {
        if (typeof window !== 'undefined') {
            const saved: string | null = localStorage.getItem(LOCAL_STORAGE_KEY_LABEL_OPTIONS);
            return saved ? JSON.parse(saved) : initialDefaults;
        }
        return initialDefaults;
    });

    const [activeLabel, setActiveLabel] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            const saved: string | null = localStorage.getItem(LOCAL_STORAGE_KEY_ACTIVE);
            if (saved !== null) {
                const parsedLabel = JSON.parse(saved);
                if (labels.includes(parsedLabel)) {
                    return parsedLabel;
                }
            }
        }

        return labels[0] || "";
    });

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY_LABEL_OPTIONS, JSON.stringify(labels));
    }, [labels]);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY_ACTIVE, JSON.stringify(activeLabel));
    }, [activeLabel]);

    const handleLabelChange = (selectedValue: string): void => {
        if (selectedValue === LABEL_ACTIONS.ADD_NEW) {
            const newLabel: string | null = window.prompt("Enter a new label name:", "Label");
            if (newLabel && newLabel.trim() !== "") {
                setLabels((prev) => [...prev, newLabel]);
                setActiveLabel(newLabel);
            }
            return;
        }

        if (selectedValue === LABEL_ACTIONS.DELETE_CURRENT) {
            if (!activeLabel) return;

            const confirmDelete: boolean = window.confirm(`Are you sure you want to delete "${activeLabel}"?`);
            if (confirmDelete) {
                const newLabels: string[] = labels.filter((opt) => opt !== activeLabel);
                setLabels(newLabels);
                setActiveLabel(newLabels.length > 0 ? newLabels[0] : "");
            }
            return;
        }

        setActiveLabel(selectedValue);
    };

    return {
        labels,
        activeLabel,
        handleLabelChange
    };
}
