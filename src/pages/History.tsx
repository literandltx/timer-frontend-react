import HistoryList from "../components/HistoryList.tsx";
import {useState, useEffect} from "react";
import type {TimerData} from "../components/Timer.tsx";
import {NavLink} from "react-router";

function History() {
    const [finishedTimers, setFinishedTimers] = useState<TimerData[]>(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved: string | null = localStorage.getItem('timerHistory');
                return saved ? JSON.parse(saved) : [];
            } catch (error) {
                console.error("Failed to parse history:", error);
                return [];
            }
        }
        return [];
    });

    useEffect((): void => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('timerHistory', JSON.stringify(finishedTimers));
        }
    }, [finishedTimers]);

    const clearAllHistory = () => {
        if (confirm("Are you sure you want to delete ALL history?")) {
            setFinishedTimers([]);
        }
    };

    const clearTodaysHistory = () => {
        if (confirm("Are you sure you want to delete today's history?")) {
            const todayString: string = new Date().toDateString();

            setFinishedTimers(prevTimers => {
                return prevTimers.filter(timer => {
                    const timerDate: string = new Date(timer.timestamp).toDateString();
                    return timerDate !== todayString;
                });
            });
        }
    };

    return (
        <div>
            <NavLink to={"/"} className={"absolute top-[2%] left-[2%]"}>Home</NavLink>
            <HistoryList
                history={finishedTimers}
                onClearAll={clearAllHistory}
                onClearToday={clearTodaysHistory}
            />
        </div>
    )
}

export default History;
