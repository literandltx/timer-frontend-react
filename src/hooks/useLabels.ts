import {useEffect, useMemo} from "react";
import {useLocalStorage} from "./useLocalStorage";
import {type Label} from "../types/labels";

export const LOCAL_STORAGE_KEY_LABEL_OPTIONS = 'timer_label_options';
export const LOCAL_STORAGE_KEY_ACTIVE_ID = 'timer_active_label_id';

interface UseLabelsReturn {
    labels: Label[];
    activeLabel: Label;
    setActiveLabel: (labelId: string) => void;
}

const createLabel = (name: string, color: string): Label => ({
    id: crypto.randomUUID(),
    name,
    color: color
});

const DEFAULT_LABELS: Label[] = [
    createLabel('Focus', '#ef4444'),
    createLabel('Learn', '#22c55e'),
    createLabel('Recharge', '#3b82f6')
];

export function useLabels(initialDefaults: Label[] = DEFAULT_LABELS): UseLabelsReturn {
    const [labels] = useLocalStorage<Label[]>(
        LOCAL_STORAGE_KEY_LABEL_OPTIONS,
        initialDefaults
    );

    const [activeLabelId, setActiveLabelId] = useLocalStorage<string>(
        LOCAL_STORAGE_KEY_ACTIVE_ID,
        initialDefaults.length > 0 ? initialDefaults[0].id : ''
    );

    const activeLabel = useMemo(() => {
        return labels.find(l => l.id === activeLabelId) || labels[0];
    }, [labels, activeLabelId]);

    useEffect(() => {
        if (labels.length > 0) {
            const isValidId = labels.some(l => l.id === activeLabelId);
            if (!isValidId) {
                setActiveLabelId(labels[0].id);
            }
        }
    }, [labels, activeLabelId, setActiveLabelId]);

    const setActiveLabel = (labelId: string): void => {
        setActiveLabelId(labelId);
    };

    return {
        labels,
        activeLabel,
        setActiveLabel
    };
}
