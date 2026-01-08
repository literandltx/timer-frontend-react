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
                <button onClick={onClearToday}>
                    Clear Today
                </button>
                <button onClick={onClearAll}>
                    Clear All
                </button>
            </div>

            <ul className="w-full max-w-md space-y-2">
                {history.map((item, index) => (
                    <li key={index}
                        className="flex justify-between items-center border transition-colors duration-200 border-neutral-700 p-3 rounded bg-neutral-800 hover:bg-sky-900/30">
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
