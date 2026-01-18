import {useRef} from "react";
import {NavLink} from "react-router";

import type {TimerData} from "../components/home/Timer.tsx";
import HistoryList from "../components/history/HistoryList.tsx";
import HistoryChart from "../components/history/HistoryChart.tsx";
import {useTimerHistory} from "../hooks/useTimerHistory";
import {useLabels} from "../hooks/useLabels.ts";

function History() {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        history,
        clearHistory,
        clearToday,
        removeEntry,
        updateEntry,
        addManualEntry,
        importHistory
    } = useTimerHistory();
    const {labels} = useLabels();

    const exportToCSV = (): void => {
        if (history.length === 0) {
            alert("No history to export.");
            return;
        }

        const headers: string[] = ["Label", "Time Amount (s)", "Timestamp (Raw)", "Date Formatted"];
        const rows: string[] = history.map(timer => {
            const safeLabel = `"${timer.label.replace(/"/g, '""')}"`;
            const dateStr = `"${new Date(timer.timestamp).toLocaleString()}"`;
            return [safeLabel, timer.timeAmount, timer.timestamp, dateStr].join(",");
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

    const importFromCSV = () => {
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
                importHistory(newTimers);
                alert(`Successfully imported ${newTimers.length} entries.`);
            } else {
                alert("Could not parse any valid timer data from this file.");
            }
        };

        reader.readAsText(file);
        event.target.value = '';
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
                    <button onClick={importFromCSV}>Import CSV</button>
                    <button onClick={exportToCSV}>Export CSV</button>
                </div>
            </div>

            <h1 className="text-2xl font-bold text-center mt-8 mb-0">History Chart</h1>
            <div className="flex flex-col gap-2">
                <HistoryChart data={history}/>
                <HistoryList
                    history={history}
                    availableLabels={labels}
                    onClearAll={clearHistory}
                    onClearToday={clearToday}
                    onAddEntry={addManualEntry}
                    onDeleteEntry={removeEntry}
                    onEditEntry={updateEntry}
                />
            </div>
        </div>
    )
}

export default History
