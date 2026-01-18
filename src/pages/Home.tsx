import './Home.css';
import {useState} from "react";
import {NavLink} from "react-router";

import Timer from "../components/home/Timer.tsx";
import SettingModal from "../components/home/SettingModal.tsx";
import LabelSelector from "../components/home/LabelSelector.tsx";
import Counter from "../components/home/Counter.tsx";
import {useLabels} from "../hooks/useLabels";
import {useTimerSettings} from "../hooks/useTimerSettings";
import {useTimerHistory} from "../hooks/useTimerHistory";
import {useTabNotification} from "../hooks/useTabNotification"; // Import the new hook
import type {TimerData} from "../types/timer.ts";

const SECONDS_PER_MINUTE = 60;

function Home() {
    const [timestamp] = useState<number>((): number => Date.now());
    const {startBlinking, stopBlinking} = useTabNotification("timer");

    const {
        selectedOption,
        availableOptions,
        savePreference,
        addCustomOption,
        removeOption
    } = useTimerSettings();
    const {history, addTimer} = useTimerHistory();

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
        <div>
            <Timer
                key={timeAmount}
                timeAmount={timeAmount}
                label={activeLabel}
                timestamp={timestamp}
                onFinish={handleTimerFinish}
                onReset={handleTimerReset}
            />
            <div className="absolute bottom-[2%] right-[2%] flex items-center gap-2">
                <LabelSelector
                    value={activeLabel}
                    onChange={handleLabelChange}
                    options={labels}
                />
                <Counter count={history.length}/>
            </div>
            <div className="absolute bottom-[2%] left-[2%] flex items-center gap-2">
                <SettingModal
                    selectedOption={selectedOption}
                    availableOptions={availableOptions}
                    onSelect={savePreference}
                    onAddCustom={addCustomOption}
                    onRemove={removeOption}
                />
                <NavLink to={"/history"}>History</NavLink>
            </div>
        </div>
    );
}

export default Home
