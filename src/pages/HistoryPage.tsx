import {useRef} from "react";
import {NavLink} from "react-router";

import HistoryList from "../components/history/HistoryList.tsx";
import HistoryChart from "../components/history/HistoryChart.tsx";
import {useTimerHistory} from "../hooks/useTimerHistory";
import {useLabels} from "../hooks/useLabels.ts";

import {exportHistoryToCSV, parseHistoryFromCSV} from "../utils/csvUtils";
import type {TimerData} from "../types/timer.ts";

function HistoryPage() {
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

    const exportToCSV = () => {
        exportHistoryToCSV(history);
    };

    const importFromCSV = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file: File | undefined = event.target.files?.[0];
        if (!file) {
            return;
        }

        try {
            const newTimers: TimerData[] = await parseHistoryFromCSV(file);

            if (newTimers.length > 0) {
                importHistory(newTimers);
                alert(`Successfully imported ${newTimers.length} entries.`);
            } else {
                alert("Could not parse any valid timer data from this file.");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred while reading the file.");
        } finally {
            event.target.value = '';
        }
    };

    return (
        <div
            // className="fixed inset-0 w-screen h-screen bg-[#1a1a1a] text-white overflow-hidden"
        >
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
    );
}

export default HistoryPage;

