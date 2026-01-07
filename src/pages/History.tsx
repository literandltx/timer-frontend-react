import HistoryList from "../components/HistoryList.tsx";
import {useState} from "react";
import type {TimerData} from "../components/Timer.tsx";
import {NavLink} from "react-router";

function History() {
    const [finishedTimers, setFinishedTimers] = useState<TimerData[]>(() => {
        if (typeof window !== 'undefined') {
            const saved: string | null = localStorage.getItem('timerHistory');
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });

    const clearHistory = () => {
        if (confirm("Are you sure you want to delete all history?")) {
            setFinishedTimers([]);
        }
    };

    return (
        <div>
            <NavLink to={"/"} className={"absolute top-[2%] left-[2%]"}>Home</NavLink>
            <HistoryList
                history={finishedTimers}
                onClear={clearHistory}
            />
        </div>
    )
}

export default History;
