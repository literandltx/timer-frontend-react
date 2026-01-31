import {useMemo, useState} from "react";
import type {TimerData} from "../../types/timer.ts";

interface HistoryChartProps {
    data: TimerData[];
}

interface ChartDayData {
    dateLabel: string;
    monthDay: string;
    fullDate: string;
    totalMinutes: number;
    segments: {
        labelName: string;
        color: string;
        minutes: number;
    }[];
}

export default function HistoryChart({data}: HistoryChartProps) {
    const [weekOffset, setWeekOffset] = useState(0);

    const chartData = useMemo<ChartDayData[]>(() => {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() - (weekOffset * 7));

        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(endDate);
            d.setDate(d.getDate() - i);
            days.push(d);
        }

        return days.map(day => {
            const dayString = day.toDateString();

            // 1. Filter timers for this specific day
            const daysTimers = data.filter(item =>
                new Date(item.timestamp).toDateString() === dayString
            );

            // 2. Group by Label
            const labelMap = new Map<string, { name: string, color: string, seconds: number }>();

            daysTimers.forEach(timer => {
                const labelId = timer.label.id;
                if (!labelMap.has(labelId)) {
                    labelMap.set(labelId, {
                        name: timer.label.name,
                        color: timer.label.color || '#6b7280', // Fallback color
                        seconds: 0
                    });
                }
                const entry = labelMap.get(labelId)!;
                entry.seconds += timer.timeAmount;
            });

            // 3. Create Segments Array
            const segments = Array.from(labelMap.values())
                .map(item => ({
                    labelName: item.name,
                    color: item.color,
                    minutes: Math.floor(item.seconds / 60)
                }))
                .filter(seg => seg.minutes > 0) // Only show segments with actual minutes
                .sort((a, b) => b.minutes - a.minutes); // Sort largest to bottom/top

            const totalSeconds = daysTimers.reduce((acc, curr) => acc + curr.timeAmount, 0);

            return {
                dateLabel: day.toLocaleDateString('en-US', {weekday: 'short'}),
                monthDay: day.toLocaleDateString('en-US', {month: 'short', day: 'numeric'}),
                fullDate: day.toLocaleDateString(),
                totalMinutes: Math.floor(totalSeconds / 60),
                segments: segments
            };
        });
    }, [data, weekOffset]);

    const averageMinutes = useMemo(() => {
        const total = chartData.reduce((acc, curr) => acc + curr.totalMinutes, 0);
        return Math.round(total / 7);
    }, [chartData]);

    const dateRangeLabel = `${chartData[0].monthDay} – ${chartData[6].monthDay}`;

    const maxMinutes: number = Math.max(...chartData.map(d => d.totalMinutes));

    // Dynamic Step Size Calculation
    let stepSize: number = 60;
    if (maxMinutes <= 60) stepSize = 10;
    else if (maxMinutes <= 120) stepSize = 30;
    else if (maxMinutes <= 300) stepSize = 60;
    else stepSize = 120;

    const yMax = Math.max(stepSize, Math.ceil(maxMinutes / stepSize) * stepSize);
    const yTicks = [];
    for (let i = stepSize; i <= yMax; i += stepSize) {
        yTicks.push(i);
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-10 bg-white/5 rounded-lg border border-gray-200/20 shadow-sm mt-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-200">
                        {weekOffset === 0 ? "Last 7 Days" : `${weekOffset} Week${weekOffset > 1 ? 's' : ''} Ago`}
                    </h2>
                    <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                        <span>{dateRangeLabel}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                        <span>Daily average: <span
                            className="text-gray-200 font-medium">{averageMinutes} min</span></span>
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setWeekOffset(prev => prev + 1)}
                        className="p-1.5 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        title="Previous Week"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                             viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                             strokeLinecap="round" strokeLinejoin="round">
                            <path d="m15 18-6-6 6-6"/>
                        </svg>
                    </button>
                    <button
                        onClick={() => setWeekOffset(prev => Math.max(0, prev - 1))}
                        disabled={weekOffset === 0}
                        className={`p-1.5 rounded-md transition-colors ${weekOffset === 0 ? "text-gray-700 cursor-not-allowed" : "hover:bg-white/10 text-gray-400 hover:text-white"}`}
                        title="Next Week"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                             viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                             strokeLinecap="round" strokeLinejoin="round">
                            <path d="m9 18 6-6-6-6"/>
                        </svg>
                    </button>
                </div>
            </div>

            <div className="relative h-64 w-full flex">
                <div className="flex flex-col justify-between h-full pr-2 text-xs text-gray-500 py-6 pb-8"></div>

                <div className="relative flex-1 h-full border-l border-b border-gray-700/50">
                    {yTicks.map((tick) => {
                        const bottomPct = (tick / yMax) * 100;
                        return (
                            <div key={tick} className="absolute w-full flex items-center"
                                 style={{bottom: `${bottomPct}%`}}>
                                <span
                                    className="absolute -left-8 text-[10px] text-gray-500 w-6 text-right">
                                    {tick}
                                </span>
                                <div
                                    className="w-full border-t border-dashed border-gray-700/30"></div>
                            </div>
                        );
                    })}

                    <div className="absolute inset-0 flex items-end justify-between px-2 z-10 pt-4">
                        {chartData.map((day, index) => {
                            const heightPercent = Math.round((day.totalMinutes / yMax) * 100);

                            return (
                                <div key={index}
                                     className="flex flex-col items-center w-full group h-full justify-end">
                                    <div
                                        className="relative w-full flex-1 flex items-end justify-center pb-[1px]">

                                        <div
                                            style={{height: day.totalMinutes > 0 ? `${heightPercent}%` : '0px'}}
                                            className={`
                                                w-full max-w-[30px] rounded-t-sm relative flex flex-col-reverse overflow-hidden
                                                ${day.totalMinutes > 0 ? 'min-h-[4px]' : ''}
                                            `}
                                        >
                                            {day.segments.map((segment, i) => {
                                                const segmentPct = (segment.minutes / day.totalMinutes) * 100;
                                                return (
                                                    <div
                                                        key={i}
                                                        style={{
                                                            height: `${segmentPct}%`,
                                                            backgroundColor: segment.color
                                                        }}
                                                        className="w-full transition-opacity hover:opacity-80"
                                                    />
                                                );
                                            })}

                                            {day.totalMinutes > 0 && (
                                                <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 left-1/2 -translate-x-1/2
                                                                bg-gray-900 border border-gray-700 text-white text-xs py-2 px-3
                                                                rounded shadow-xl pointer-events-none whitespace-nowrap transition-opacity z-20 min-w-[100px]">
                                                    <div
                                                        className="font-bold border-b border-gray-700 pb-1 mb-1 text-center">
                                                        {day.totalMinutes} min Total
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        {day.segments.map((s, idx) => (
                                                            <div key={idx}
                                                                 className="flex items-center justify-between gap-3">
                                                                <div
                                                                    className="flex items-center gap-1.5">
                                                                    <div
                                                                        className="w-2 h-2 rounded-full"
                                                                        style={{backgroundColor: s.color}}></div>
                                                                    <span
                                                                        className="text-gray-300">{s.labelName}</span>
                                                                </div>
                                                                <span
                                                                    className="font-mono">{s.minutes}m</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div
                                                        className="text-[10px] text-gray-500 mt-1 text-center border-t border-gray-800 pt-1">
                                                        {day.fullDate}
                                                    </div>
                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-500 font-medium h-4 block absolute -bottom-6">
                                        {day.dateLabel}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
