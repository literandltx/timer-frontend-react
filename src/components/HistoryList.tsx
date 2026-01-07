import type {TimerData} from "./Timer.tsx";

type HistoryListProps = {
    history: TimerData[];
    onClearAll: () => void;
    onClearToday: () => void;
};

export default function HistoryList({history, onClearAll, onClearToday}: HistoryListProps) {
    if (history.length === 0) {
        return <div className="p-4 text-center">No history available.</div>;
    }

    return (
        <div className="flex flex-col items-center gap-4 p-4">
            <h2 className="text-xl font-bold">Timer History</h2>

            <div className="flex gap-4">
                <button
                    onClick={onClearToday}
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                    Clear Today
                </button>
                <button
                    onClick={onClearAll}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Clear All
                </button>
            </div>

            <ul className="w-full max-w-md space-y-2">
                {history.map((item, index) => (
                    <li key={index} className="flex justify-between items-center border p-3 rounded bg-gray-600">
                        <div className="flex flex-col pl-2">
                            <span className="font-bold text-lg">{item.label}</span>
                            <span className="text-sm text-gray-300">{(item.timeAmount / 60).toFixed(1)} min</span>
                        </div>

                        <span className="text-sm text-gray-400 text-right">
                            {new Date(item.timestamp).toLocaleString()}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}