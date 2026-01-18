import {useState, useEffect} from 'react';
import styles from './Timer.module.css';

import {formatTime} from '../../utils/timeUtils';
import type {TimerData} from "../../types/timer.ts";

type CountdownTimerProps = {
    timeAmount: number;
    label: string;
    timestamp: number;

    onFinish: (data: TimerData) => void;
    onReset: (data: TimerData) => void;
};

function Timer({timeAmount, label, timestamp, onFinish, onReset}: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState<number>(timeAmount);
    const [isRunning, setIsRunning] = useState<boolean>(false);

    useEffect(() => {
        if (!isRunning) {
            return;
        }

        const intervalId: number = setInterval((): void => {
            if (timeLeft > 1) {
                setTimeLeft((prev): number => prev - 1);
            } else {
                onFinish({label, timeAmount, timestamp});

                clearInterval(intervalId);
                setIsRunning(false);
                setTimeLeft(timeAmount);
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [isRunning, timeLeft, label, timeAmount, timestamp, onFinish]);

    const handleClick = () => {
        if (timeLeft > 0) {
            setIsRunning((prev) => !prev);
        }
    };

    const handleDoubleClick = () => {
        onReset({label, timeAmount: timeAmount - timeLeft, timestamp});

        setIsRunning(false);
        setTimeLeft(timeAmount);
    };

    return (
        <div
            className={styles.container}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
        >
            <h1 className={styles.timerText}>{formatTime(timeLeft)}</h1>
        </div>
    );
}

export default Timer;
