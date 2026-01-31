import {useMemo, useState} from "react";
import type {TimerData} from "../../types/timer.ts";

interface DistributionChartProps {
    data: TimerData[];
}

type TimeRange = 'today' | 'week' | 'month' | 'all';

interface ChartSegment {
    id: string;
    labelName: string;
    color: string;
    minutes: number;
    percentage: number;
    offset: number;
}

function DistributionChart({data}: DistributionChartProps) {
    const [range, setRange] = useState<TimeRange>('today');

    const {segments, totalMinutes} = useMemo(() => {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const filteredData = data.filter(item => {
            const itemDate = new Date(item.timestamp);

            if (range === 'today') {
                return itemDate >= startOfToday;
            } else if (range === 'week') {
                const weekAgo = new Date(now);
                weekAgo.setDate(now.getDate() - 7);
                return itemDate >= weekAgo;
            } else if (range === 'month') {
                const monthAgo = new Date(now);
                monthAgo.setDate(now.getDate() - 30);
                return itemDate >= monthAgo;
            }
            return true;
        });

        const labelMap = new Map<string, { name: string, color: string, minutes: number }>();
        let total = 0;

        filteredData.forEach(timer => {
            const minutes = timer.timeAmount / 60;
            total += minutes;

            const labelId = timer.label.id;
            if (!labelMap.has(labelId)) {
                labelMap.set(labelId, {
                    name: timer.label.name,
                    color: timer.label.color || '#6b7280',
                    minutes: 0
                });
            }
            labelMap.get(labelId)!.minutes += minutes;
        });

        let currentOffset = 0;
        const processedSegments: ChartSegment[] = Array.from(labelMap.entries())
            .map(([id, info]) => {
                const percentage = total > 0 ? (info.minutes / total) * 100 : 0;
                const segment = {
                    id,
                    labelName: info.name,
                    color: info.color,
                    minutes: info.minutes,
                    percentage,
                    offset: currentOffset
                };
                currentOffset += percentage;
                return segment;
            })
            .sort((a, b) => b.minutes - a.minutes);

        return {segments: processedSegments, totalMinutes: Math.floor(total)};
    }, [data, range]);

    const formatTime = (mins: number) => {
        if (mins < 60) return `${Math.floor(mins)}m`;
        const h = Math.floor(mins / 60);
        const m = Math.floor(mins % 60);
        return `${h}h ${m}m`;
    };

    const size = 180;
    const strokeWidth = 20;
    const center = size / 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    return (
        <div
            className="w-full max-w-md mx-auto bg-white/5 p-6 rounded-lg border border-gray-200/20 shadow-sm mt-8">
            <div className="flex flex-col gap-4 mb-6">
                <h2 className="text-lg font-semibold text-gray-200">Time Distribution</h2>
                <div className="flex p-1 bg-black/20 rounded-lg">
                    {(['today', 'week', 'month', 'all'] as TimeRange[]).map((r) => (
                        <button
                            key={r}
                            onClick={() => setRange(r)}
                            className={`flex-1 py-1 text-xs font-medium rounded-md capitalize transition-all ${
                                range === r
                                    ? 'bg-gray-700 text-white shadow-sm'
                                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                            }`}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            {totalMinutes === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                    <div
                        className="w-32 h-32 rounded-full border-4 border-gray-800 border-dashed mb-4 opacity-50"></div>
                    <p className="text-sm">No data for this period</p>
                </div>
            ) : (
                <div className="flex flex-col items-center">
                    <div className="relative mb-6">
                        <svg width={size} height={size} className="transform -rotate-90">
                            <circle
                                cx={center}
                                cy={center}
                                r={radius}
                                fill="transparent"
                                stroke="#1f2937"
                                strokeWidth={strokeWidth}
                            />

                            {segments.map((segment) => {
                                const strokeDasharray = `${(segment.percentage / 100) * circumference} ${circumference}`;
                                const strokeDashoffset = -1 * (segment.offset / 100) * circumference;

                                return (
                                    <circle
                                        key={segment.id}
                                        cx={center}
                                        cy={center}
                                        r={radius}
                                        fill="transparent"
                                        stroke={segment.color}
                                        strokeWidth={strokeWidth}
                                        strokeDasharray={strokeDasharray}
                                        strokeDashoffset={strokeDashoffset}
                                        strokeLinecap="butt"
                                        className="transition-all duration-500 ease-out hover:opacity-80"
                                    />
                                );
                            })}
                        </svg>

                        <div
                            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-2xl font-bold text-white">
                                {formatTime(totalMinutes)}
                            </span>
                            <span
                                className="text-xs text-gray-400 uppercase tracking-wider">Total</span>
                        </div>
                    </div>

                    <div className="w-full space-y-3">
                        {segments.map((segment) => (
                            <div key={segment.id}
                                 className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-3 h-3 rounded-full shadow-sm ring-2 ring-white/5"
                                        style={{backgroundColor: segment.color}}
                                    />
                                    <span className="text-sm text-gray-300 font-medium">
                                        {segment.labelName}
                                    </span>
                                </div>

                                <div className="flex items-center gap-4 text-sm">
                                    <span className="text-gray-400 font-mono">
                                        {formatTime(segment.minutes)}
                                    </span>
                                    <span
                                        className="text-xs font-bold text-gray-500 bg-white/5 px-1.5 py-0.5 rounded min-w-[3rem] text-center">
                                        {Math.round(segment.percentage)}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default DistributionChart;
