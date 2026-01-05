import './Home.css'
import CountdownTimer, {type TimerData} from "./components/Timer.tsx";
import {useState} from "react";

const initialSeconds: number = 5

function Home() {
    const [timestamp] = useState<number>(() => Date.now());

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
        </div>
    );
}

export default Home
