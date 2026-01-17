import {useEffect} from "react";
import {useLocalStorage} from "./useLocalStorage";
import {LABEL_ACTIONS} from "../types/labels.ts";

const LOCAL_STORAGE_KEY_LABEL_OPTIONS = 'timer_label_options';
const LOCAL_STORAGE_KEY_ACTIVE = 'timer_active_label';

interface UseLabelsReturn {
    labels: string[];
    activeLabel: string;
    handleLabelChange: (selectedValue: string) => void;
}

export function useLabels(initialDefaults: string[] = ['Focus', 'Learn', 'Recharge']): UseLabelsReturn {
    const [labels, setLabels] = useLocalStorage<string[]>(
        LOCAL_STORAGE_KEY_LABEL_OPTIONS,
        initialDefaults
    );

    const [activeLabel, setActiveLabel] = useLocalStorage<string>(
        LOCAL_STORAGE_KEY_ACTIVE,
        initialDefaults[0]
    );

    useEffect(() => {
        if (!labels.includes(activeLabel) && labels.length > 0) {
            setActiveLabel(labels[0]);
        }
    }, [labels, activeLabel, setActiveLabel]);

    const handleLabelChange = (selectedValue: string): void => {
        if (selectedValue === LABEL_ACTIONS.ADD_NEW) {
            const newLabel = window.prompt("Enter a new label name:", "Label");
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
