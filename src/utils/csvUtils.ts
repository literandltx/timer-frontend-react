import type {TimerData} from "../types/timer";
import type {Label} from "../types/labels";

export const exportHistoryToCSV = (history: TimerData[]): void => {
    if (history.length === 0) {
        alert("No history to export.");
        return;
    }

    const headers: string[] = ["Label", "Color", "Time Amount (s)", "Timestamp (Raw)", "Date Formatted"];

    const rows: string[] = history.map(timer => {
        const safeLabel: string = `"${timer.label.name.replace(/"/g, '""')}"`;
        const color: string = timer.label.color || "#6b7280";
        const dateStr: string = `"${new Date(timer.timestamp).toLocaleString()}"`;

        return [safeLabel, color, timer.timeAmount, timer.timestamp, dateStr].join(",");
    });

    const csvContent: string = [headers.join(","), ...rows].join("\n");
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

export const parseHistoryFromCSV = (file: File): Promise<TimerData[]> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const text = e.target?.result as string;
            if (!text) {
                resolve([]);
                return;
            }

            const lines: string[] = text.split('\n');
            const newTimers: TimerData[] = [];

            const DEFAULT_COLOR = "#555";

            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;

                const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

                if (parts.length >= 3) {
                    let labelName = parts[0].trim();
                    if (labelName.startsWith('"') && labelName.endsWith('"')) {
                        labelName = labelName.slice(1, -1).replace(/""/g, '"');
                    }

                    let color: string = DEFAULT_COLOR;
                    let timeAmount: number = 0;
                    let timestamp: number = 0;

                    const secondColAsNum: number = parseInt(parts[1], 10);

                    if (!isNaN(secondColAsNum)) {
                        timeAmount = secondColAsNum;
                        timestamp = parseInt(parts[2], 10);
                    } else {
                        color = parts[1].trim();
                        timeAmount = parseInt(parts[2], 10);
                        timestamp = parseInt(parts[3], 10);
                    }

                    if (!isNaN(timeAmount) && !isNaN(timestamp)) {
                        const newLabel: Label = {
                            id: `import-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
                            name: labelName,
                            color: color,
                        };

                        newTimers.push({
                            label: newLabel,
                            timeAmount,
                            timestamp
                        });
                    }
                }
            }
            resolve(newTimers);
        };

        reader.onerror = () => {
            reject(new Error("Failed to read file"));
        };

        reader.readAsText(file);
    });
};