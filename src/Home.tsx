import './Home.css'
import CountdownTimer, {type TimerData} from "./components/Timer.tsx";
import {useState} from "react";
import SettingModal from "./components/SettingModal.tsx";
import LabelSelector from "./components/LabelSelector.tsx";

const initialSeconds: number = 5

function Home() {
    const [timestamp] = useState<number>(() => Date.now());

    const [options, setOptions] = useState<string[]>(['Active', 'Paused', 'Delayed', 'Canceled'])
    const [status, setStatus] = useState(options[0]);

    const handleStatusChange = (selectedValue: string) => {
        if (selectedValue === 'ADD_NEW') {
            const newOption: string | null = window.prompt("Enter a new label name:", "Label");

            if (newOption && newOption.trim() !== "") {
                setOptions((prev) => [...prev, newOption]);
                setStatus(newOption);
            }
        } else {
            setStatus(selectedValue);
        }
    };

    const handleTimerFinish = (data: TimerData) => {
        console.log(`Time is up for ${data.label}!`);
    };

    const handleTimerReset = (data: TimerData) => {
        console.log(`User reset the timer: ${data.label}`);
    };

    return (
        <div>
            <CountdownTimer
                timeAmount={initialSeconds}
                label="Sprint 1"
                timestamp={timestamp}
                onFinish={handleTimerFinish}
                onReset={handleTimerReset}
            />
            <LabelSelector
                value={status}
                onChange={handleStatusChange}
                options={options}
            />
            <SettingModal/>
        </div>
    );
}

export default Home
