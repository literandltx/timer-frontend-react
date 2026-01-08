import {useState, useEffect, useRef} from "react";
import {NavLink} from "react-router";

import type {TimerData} from "../components/Timer.tsx";
import HistoryList from "../components/HistoryList.tsx";

function History() {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [finishedTimers, setFinishedTimers] = useState<TimerData[]>(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved: string | null = localStorage.getItem('timerHistory');
                return saved ? JSON.parse(saved) : [];
            } catch (error) {
                console.error("Failed to parse history:", error);
                return [];
            }
        }
        return [];
    });

    useEffect((): void => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('timerHistory', JSON.stringify(finishedTimers));
        }
    }, [finishedTimers]);

    const exportToCSV = (): void => {
        if (finishedTimers.length === 0) {
            alert("No history to export.");
            return;
        }

        const headers: string[] = ["Label", "Time Amount (s)", "Timestamp (Raw)", "Date Formatted"];
        const rows: string[] = finishedTimers.map(timer => {
            const safeLabel = `"${timer.label.replace(/"/g, '""')}"`;
            const dateStr = `"${new Date(timer.timestamp).toLocaleString()}"`;

            return [
                safeLabel,
                timer.timeAmount,
                timer.timestamp,
                dateStr
            ].join(",");
        });

        const csvContent = [headers.join(","), ...rows].join("\n");
        const blob: Blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
        const url: string = URL.createObjectURL(blob);
        const link: HTMLAnchorElement = document.createElement("a");
        const fileName = `timer_history_${new Date().toISOString().slice(0, 10)}.csv`;

        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const importFromCsv = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file: File | undefined = event.target.files?.[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            if (!text) return;

            const lines = text.split('\n');
            const newTimers: TimerData[] = [];

            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;

                const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

                if (parts.length >= 3) {
                    let label = parts[0].trim();
                    if (label.startsWith('"') && label.endsWith('"')) {
                        label = label.slice(1, -1).replace(/""/g, '"');
                    }

                    const timeAmount = parseInt(parts[1], 10);
                    const timestamp = parseInt(parts[2], 10);

                    if (!isNaN(timeAmount) && !isNaN(timestamp)) {
                        newTimers.push({label, timeAmount, timestamp});
                    }
                }
            }

            if (newTimers.length > 0) {
                setFinishedTimers(prev => {
                    const combined = [...prev, ...newTimers];

                    const unique = combined.filter((item, index, self) =>
                            index === self.findIndex((t) => (
                                t.timestamp === item.timestamp
                            ))
                    );

                    return unique.sort((a, b) => b.timestamp - a.timestamp);
                });
                alert(`Successfully imported ${newTimers.length} entries.`);
            } else {
                alert("Could not parse any valid timer data from this file.");
            }
        };

        reader.readAsText(file);
        event.target.value = '';
    };

    const clearAllHistory = () => {
        if (confirm("Are you sure you want to delete ALL history?")) {
            setFinishedTimers([]);
        }
    };

    const clearTodaysHistory = () => {
        if (confirm("Are you sure you want to delete today's history?")) {
            const todayString: string = new Date().toDateString();

            setFinishedTimers(prevTimers => {
                return prevTimers.filter(timer => {
                    const timerDate: string = new Date(timer.timestamp).toDateString();
                    return timerDate !== todayString;
                });
            });
        }
    };

    const deleteOneHistoryEntry = (indexToDelete: number) => {
        setFinishedTimers(prev => prev.filter((_, index) => index !== indexToDelete));
    };

    const editHistoryEntry = (index: number, newTimeInSeconds: number) => {
        setFinishedTimers(prev => {
            const copy = [...prev];
            // Update only the timeAmount for the specific item
            copy[index] = { ...copy[index], timeAmount: newTimeInSeconds };
            return copy;
        });
    };

    return (
        <div>
            <NavLink to={"/"} className={"absolute top-[2%] left-[2%]"}>Home</NavLink>

            <div className="absolute top-[2%] right-[2%] flex gap-2">
                <input
                    type="file"
                    accept=".csv"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />

                <div className="flex flex-col gap-2">
                    <button onClick={importFromCsv}>
                        Import CSV
                    </button>
                    <button onClick={exportToCSV}>
                        Export CSV
                    </button>
                </div>
            </div>

            <HistoryList
                history={finishedTimers}
                onClearAll={clearAllHistory}
                onClearToday={clearTodaysHistory}
                onDeleteEntry={deleteOneHistoryEntry}
                onEditEntry={editHistoryEntry}
            />
        </div>
    )
}

export default History;