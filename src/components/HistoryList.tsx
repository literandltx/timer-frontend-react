import type {TimerData} from "./Timer.tsx";

interface HistoryListProps {
    history: TimerData[];
    onClear: () => void;
}

export default function HistoryList({history, onClear}: HistoryListProps) {
    if (history.length === 0) {
        return <p className="text-gray-500 text-sm mt-4">No history yet.</p>;
    }

    return (
        <div>
            <div>
                <h2>Session History</h2>
                <button
                    onClick={onClear}
                >
                    Clear All
                </button>
            </div>

            <div>
                {history.slice().reverse().map((item, index) => (
                    <div key={index}>
                        <div>
                            <p>{item.label}</p>
                            <p>{new Date(item.timestamp).toLocaleString()}</p>
                        </div>

                        <div className="text-right">
                            {formatTime(item.timeAmount)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function formatTime(seconds: number) {
    const m: number = Math.floor(seconds / 60);
    const s: number = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}