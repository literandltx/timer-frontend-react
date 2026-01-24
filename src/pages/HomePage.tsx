import './Home.css';
import { useState } from "react";
import Timer from "../components/home/Timer.tsx";
import LabelSelector from "../components/home/LabelSelector.tsx";
import { useLabels } from "../hooks/useLabels";
import { useTimerSettings } from "../hooks/useTimerSettings";
import { useTimerHistory } from "../hooks/useTimerHistory";
import { useTabNotification } from "../hooks/useTabNotification";
import type { TimerData } from "../types/timer.ts";
import TimerConfigModal from "../components/home/TimerConfigModal.tsx";
import {NavLink} from "react-router-dom";

const SECONDS_PER_MINUTE = 60;

function HomePage() {
    const [timestamp] = useState<number>((): number => Date.now());
    const {startBlinking, stopBlinking} = useTabNotification("timer");

    const {
        selectedOption,
        availableOptions,
        savePreference,
    } = useTimerSettings();
    const {addTimer} = useTimerHistory();

    const timeAmount: number = selectedOption.value * SECONDS_PER_MINUTE;
    const {labels, activeLabel, handleLabelChange} = useLabels();

    const handleTimerFinish = (data: TimerData): void => {
        addTimer(data);
        startBlinking();
        console.log("Notification!");
    };

    const handleTimerReset = (data: TimerData): void => {
        addTimer(data);
        stopBlinking();
    };

    return (
        <div
            // className="fixed inset-0 w-screen h-screen bg-[#1a1a1a] text-white overflow-hidden"
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Timer
                key={timeAmount}
                timeAmount={timeAmount}
                label={activeLabel}
                timestamp={timestamp}
                onFinish={handleTimerFinish}
                onReset={handleTimerReset}
            />
            <div className="absolute top-6 right-6">
                <NavLink
                    to="/history"
                    className="flex items-center gap-2 px-5 py-2.5 bg-black/20 hover:bg-black/30 text-white rounded-lg shadow-md transition-all duration-200"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </NavLink>
            </div>

            <div className="absolute bottom-[2%] left-[2%] flex items-center gap-2">
                <TimerConfigModal
                    selectedOption={selectedOption}
                    availableOptions={availableOptions}
                    onSelect={savePreference}
                />
            </div>
            <div className="absolute bottom-[2%] right-[2%] flex items-center gap-2">
                <LabelSelector
                    value={activeLabel}
                    onChange={handleLabelChange}
                    options={labels}
                />
            </div>
        </div>
    );
}

export default HomePage;
