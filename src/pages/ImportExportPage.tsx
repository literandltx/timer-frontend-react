import {useRef} from "react";

import {useTimerHistory} from "../hooks/useTimerHistory.ts";
import {exportHistoryToCSV, parseHistoryFromCSV} from "../utils/csvUtils.ts";

import type {TimerData} from "../types/timer.ts";

function ImportExportPage() {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        history,
        importHistory
    } = useTimerHistory();

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
        <div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 flex gap-2">
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
        </div>
    )
}

export default ImportExportPage;