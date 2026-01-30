import {useState} from "react";
import AddEntryModal from "./AddEntryModal.tsx";
import EditableListItem from "../common/EditableListItem";
import type {TimerData} from "../../types/timer.ts";
import type {Label} from "../../types/labels.ts";

type HistoryListProps = {
    history: TimerData[];
    availableLabels: Label[];
    onAddEntry: (label: Label, durationMinutes: number, timestamp: number) => void;
    onClearAll: () => void;
    onClearToday: () => void;
    onDeleteEntry: (index: number) => void;
    onEditEntry: (index: number, newTime: number, newLabel: Label, newTimestamp: number) => void;
};

export default function HistoryList({
                                        history,
                                        availableLabels,
                                        onAddEntry,
                                        onClearAll,
                                        onClearToday,
                                        onDeleteEntry,
                                        onEditEntry
                                    }: HistoryListProps) {
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editValue, setEditValue] = useState<string>("");
    const [editLabelId, setEditLabelId] = useState<string>("");
    const [editDate, setEditDate] = useState<string>("");

    if (history.length === 0) {
        return <div className="p-4 text-center text-white/50">No history available.</div>;
    }

    const sortedHistory = history
        .map((item, index) => ({...item, originalIndex: index}))
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const handleStartEdit = (index: number, currentSeconds: number, currentLabelName: string, currentTimestamp: number) => {
        setEditingIndex(index);
        const minutes: number = Math.round((currentSeconds / 60) * 100) / 100;
        setEditValue(minutes.toString());

        const matchingLabel = availableLabels.find(l => l.name === currentLabelName);
        const initialId = matchingLabel ? matchingLabel.id : (availableLabels[0]?.id || '');
        setEditLabelId(initialId);

        const date = new Date(currentTimestamp);
        const offset = date.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(date.getTime() - offset)).toISOString().slice(0, 16);
        setEditDate(localISOTime);
    };

    const handleSaveEdit = (index: number) => {
        const minutes = parseFloat(editValue);
        const newTimestamp = new Date(editDate).getTime();

        const selectedLabelObj = availableLabels.find(l => l.id === editLabelId);

        if (!isNaN(minutes) && minutes >= 0 && !isNaN(newTimestamp) && selectedLabelObj) {
            onEditEntry(index, Math.round(minutes * 60), selectedLabelObj, newTimestamp);
        } else if (!selectedLabelObj) {
            alert("Please select a valid label.");
            return;
        }

        handleCancelEdit();
    };

    const handleCancelEdit = () => {
        setEditingIndex(null);
        setEditValue("");
        setEditLabelId("");
        setEditDate("");
    };

    return (
        <div className="flex flex-col items-center gap-4 p-4 w-full">
            <h2 className="text-xl font-bold">Timer History</h2>

            <div className="flex gap-4">
                <AddEntryModal
                    availableLabels={availableLabels}
                    onSave={onAddEntry}
                />
                <button onClick={onClearToday}>Clear Today</button>
                <button onClick={onClearAll}>Clear All</button>
            </div>

            <ul className="w-full max-w-2xl space-y-2">
                {sortedHistory.map((item) => {
                    const {originalIndex, ...data} = item;
                    const isEditing: boolean = editingIndex === originalIndex;

                    return (
                        <EditableListItem
                            key={`${data.timestamp}-${originalIndex}`}
                            isEditing={isEditing}
                            onEdit={() => handleStartEdit(originalIndex, data.timeAmount, data.label.name, data.timestamp)}
                            onDelete={() => onDeleteEntry(originalIndex)}
                            onSave={() => handleSaveEdit(originalIndex)}
                            onCancel={handleCancelEdit}
                        >
                            <div className="flex justify-between items-center w-full">
                                <div className="flex flex-col">
                                    {isEditing ? (
                                        <div className="flex items-center gap-2 mt-1">
                                            <input
                                                type="number"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                className="w-20 px-1 py-0.5 text-sm text-white bg-transparent rounded border border-white/30 focus:border-white focus:outline-none"
                                            />
                                            <span className="text-xs text-gray-400">min</span>
                                        </div>
                                    ) : (
                                        <span className="font-bold text-lg text-white">
                                            {Math.max(1, data.timeAmount / 60).toFixed(0)} min
                                        </span>
                                    )}

                                    {isEditing ? (
                                        <div className="flex flex-col gap-1 mb-1 mt-2">
                                            <select
                                                value={editLabelId}
                                                onChange={(e) => setEditLabelId(e.target.value)}
                                                className="bg-neutral-700 text-white text-sm rounded px-1 py-0.5 border border-neutral-600 focus:outline-none focus:border-sky-500"
                                            >
                                                {availableLabels.map(opt => (
                                                    <option key={opt.id} value={opt.id}>
                                                        {opt.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    ) : (
                                        <span className="text-sm text-gray-300">
                                            {data.label.name}
                                        </span>
                                    )}
                                </div>

                                <div className="mr-2">
                                    {isEditing ? (
                                        <input
                                            type="datetime-local"
                                            value={editDate}
                                            onChange={(e) => setEditDate(e.target.value)}
                                            className="bg-neutral-700 text-white text-xs p-1 rounded border border-neutral-600"
                                        />
                                    ) : (
                                        <span className="text-sm text-gray-400 text-right">
                                            {new Date(data.timestamp).toLocaleString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </EditableListItem>
                    );
                })}
            </ul>
        </div>
    );
}