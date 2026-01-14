import {useState} from "react";
import type {TimerData} from "../home/Timer.tsx";

type HistoryListProps = {
    history: TimerData[];
    availableLabels: string[];
    onClearAll: () => void;
    onClearToday: () => void;
    onDeleteEntry: (index: number) => void;
    onEditEntry: (index: number, newTime: number, newLabel: string, newTimestamp: number) => void;
};

export default function HistoryList({
                                        history,
                                        availableLabels,
                                        onClearAll,
                                        onClearToday,
                                        onDeleteEntry,
                                        onEditEntry
                                    }: HistoryListProps) {
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editValue, setEditValue] = useState<string>("");
    const [editLabel, setEditLabel] = useState<string>("");
    const [editDate, setEditDate] = useState<string>("");

    if (history.length === 0) {
        return <div className="p-4 text-center">No history available.</div>;
    }

    const sortedHistory = history
        .map((item, index) => ({...item, originalIndex: index}))
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const handleStartEdit = (index: number, currentSeconds: number, currentLabel: string, currentTimestamp: number) => {
        setEditingIndex(index);
        const minutes: number = Math.round((currentSeconds / 60) * 100) / 100;
        setEditValue(minutes.toString());
        setEditLabel(currentLabel);

        const date = new Date(currentTimestamp);
        const offset = date.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(date.getTime() - offset)).toISOString().slice(0, 16);
        setEditDate(localISOTime);
    };

    const handleSaveEdit = (index: number) => {
        const minutes = parseFloat(editValue);
        const newTimestamp = new Date(editDate).getTime();

        if (!isNaN(minutes) && minutes >= 0 && !isNaN(newTimestamp)) {
            onEditEntry(index, Math.round(minutes * 60), editLabel, newTimestamp);
        }

        setEditingIndex(null);
        setEditValue("");
        setEditLabel("");
        setEditDate("");
    };

    const handleCancelEdit = () => {
        setEditingIndex(null);
        setEditValue("");
        setEditLabel("");
        setEditDate("");
    };

    return (
        <div className="flex flex-col items-center gap-4 p-4">
            <h2 className="text-xl font-bold">Timer History</h2>

            <div className="flex gap-4">
                <button onClick={onClearToday}>Clear Today</button>
                <button onClick={onClearAll}>Clear All</button>
            </div>

            <ul className="w-full max-w-2xl space-y-2">
                {sortedHistory.map((item) => {
                    const {originalIndex, ...data} = item;
                    const isEditing: boolean = editingIndex === originalIndex;

                    return (
                        <li key={`${data.timestamp}-${originalIndex}`}
                            className="flex justify-between items-center border transition-colors duration-200 border-neutral-700 p-3 rounded bg-neutral-800 hover:bg-sky-900/30 group">

                            <div className="flex flex-col pl-2">
                                {isEditing ? (
                                    <div className="flex flex-col gap-1 mb-1">
                                        <select
                                            value={editLabel}
                                            onChange={(e) => setEditLabel(e.target.value)}
                                            className="bg-neutral-700 text-white text-sm rounded px-1 py-0.5 border border-neutral-600 focus:outline-none focus:border-sky-500"
                                        >
                                            {!availableLabels.includes(editLabel) && editLabel && (
                                                <option value={editLabel}>{editLabel}</option>
                                            )}
                                            {availableLabels.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </div>
                                ) : (
                                    <span className="font-bold text-lg">{data.label}</span>
                                )}

                                {isEditing ? (
                                    <div className="flex items-center gap-2 mt-1">
                                        <input
                                            type="number"
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            className="w-20 px-1 py-0.5 text-sm text-black rounded"
                                        />
                                        <span className="text-xs text-gray-400">min</span>
                                    </div>
                                ) : (
                                    <span className="text-sm text-gray-300">
                                        {(data.timeAmount / 60).toFixed(2)} min
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
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

                                <div className="flex items-center gap-1">
                                    {isEditing ? (
                                        <>
                                            <button onClick={() => handleSaveEdit(originalIndex)}
                                                    className="text-green-500 hover:bg-white/10 p-1 rounded"
                                                    title="Save">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                     strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          d="m4.5 12.75 6 6 9-13.5"/>
                                                </svg>
                                            </button>
                                            <button onClick={handleCancelEdit}
                                                    className="text-red-400 hover:bg-white/10 p-1 rounded"
                                                    title="Cancel">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                     strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          d="M6 18 18 6M6 6l12 12"/>
                                                </svg>
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleStartEdit(originalIndex, data.timeAmount, data.label, data.timestamp)}
                                                className="text-neutral-500 hover:text-sky-400 transition-colors p-1 rounded hover:bg-white/10"
                                                title="Edit entry"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                     strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                                                </svg>
                                            </button>

                                            <button
                                                onClick={() => onDeleteEntry(originalIndex)}
                                                className="text-neutral-500 hover:text-red-500 transition-colors p-1 rounded hover:bg-white/10"
                                                title="Delete entry"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                     strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                                                </svg>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}