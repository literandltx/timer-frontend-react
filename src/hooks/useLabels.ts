import {useEffect, useMemo} from "react";
import {useLocalStorage} from "./useLocalStorage";
import {LABEL_ACTIONS, type Label} from "../types/labels";

export const LOCAL_STORAGE_KEY_LABEL_OPTIONS = 'timer_label_options';
export const LOCAL_STORAGE_KEY_ACTIVE_ID = 'timer_active_label_id'; // Renamed to reflect it stores ID

interface UseLabelsReturn {
    labels: Label[];
    activeLabel: Label;
    handleLabelChange: (selectedValue: string) => void;
}

const createLabel = (name: string): Label => ({
    id: crypto.randomUUID(),
    name
});

const DEFAULT_LABELS: Label[] = [
    createLabel('Focus'),
    createLabel('Learn'),
    createLabel('Recharge')
];

export function useLabels(initialDefaults: Label[] = DEFAULT_LABELS): UseLabelsReturn {
    const [labels, setLabels] = useLocalStorage<Label[]>(
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

    const handleLabelChange = (selectedValue: string): void => {
        if (selectedValue === LABEL_ACTIONS.ADD_NEW) {
            const newName = window.prompt("Enter a new label name:", "New Label");

            if (newName && newName.trim() !== "") {
                const newLabel = createLabel(newName.trim());
                setLabels((prev) => [...prev, newLabel]);
                setActiveLabelId(newLabel.id);
            }
            return;
        }

        if (selectedValue === LABEL_ACTIONS.DELETE_CURRENT) {
            if (!activeLabel) return;

            const confirmDelete = window.confirm(`Are you sure you want to delete "${activeLabel.name}"?`);

            if (confirmDelete) {
                const newLabels = labels.filter((l) => l.id !== activeLabelId);
                setLabels(newLabels);
                if (newLabels.length > 0) {
                    setActiveLabelId(newLabels[0].id);
                } else {
                    setActiveLabelId("");
                }
            }
            return;
        }

        setActiveLabelId(selectedValue);
    };

    return {
        labels,
        activeLabel,
        handleLabelChange
    };
}
