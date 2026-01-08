import type {TimerData} from "./Timer.tsx";

type HistoryListProps = {
    history: TimerData[];
    onClearAll: () => void;
    onClearToday: () => void;
    onDeleteEntry: (timestamp: number) => void;
};

export default function HistoryList({history, onClearAll, onClearToday, onDeleteEntry}: HistoryListProps) {
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
                    <li key={`${item.timestamp}-${index}`}
                        className="flex justify-between items-center border transition-colors duration-200 border-neutral-700 p-3 rounded bg-neutral-800 hover:bg-sky-900/30 group">

                        <div className="flex flex-col pl-2">
                            <span className="font-bold text-lg">{item.label}</span>
                            <span className="text-sm text-gray-300">{(item.timeAmount / 60).toFixed(1)} min</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-400 text-right">
                                {new Date(item.timestamp).toLocaleString()}
                            </span>

                            <button
                                onClick={() => onDeleteEntry(index)}
                                className="text-neutral-500 hover:text-red-500 transition-colors p-1 rounded hover:bg-white/10"
                                title="Delete entry"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                                </svg>
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
