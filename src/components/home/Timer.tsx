import {useState, useEffect, useRef} from 'react';
import styles from './Timer.module.css';

import {formatTime} from '../../utils/timeUtils';
import type {TimerData} from "../../types/timer.ts";
import type {Label} from "../../types/labels.ts";

type CountdownTimerProps = {
    timeAmount: number;
    label: Label;
    timestamp: number;

    onFinish: (data: TimerData) => void;
    onReset: (data: TimerData) => void;
};

function Timer({timeAmount, label, timestamp, onFinish, onReset}: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState<number>(timeAmount);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [endTime, setEndTime] = useState<number | null>(null);
    const timerPropsRef = useRef({label, timeAmount, timestamp, onFinish});

    useEffect(() => {
        timerPropsRef.current = {label, timeAmount, timestamp, onFinish};
    }, [label, timeAmount, timestamp, onFinish]);

    useEffect(() => {
        if (!isRunning || !endTime) {
            return;
        }

        const intervalId: number = window.setInterval((): void => {
            const remaining = Math.round((endTime - Date.now()) / 1000);

            if (remaining <= 0) {
                const {label, timeAmount, timestamp, onFinish} = timerPropsRef.current;
                onFinish({label, timeAmount, timestamp});

                clearInterval(intervalId);
                setIsRunning(false);
                setTimeLeft(timeAmount);
            } else {
                setTimeLeft(remaining);
            }
        }, 500);

        return () => clearInterval(intervalId);
    }, [isRunning, endTime]);

    const handleClick = () => {
        if (timeLeft > 0) {
            if (!isRunning) {
                setEndTime(Date.now() + timeLeft * 1000);
                setIsRunning(true);
            } else {
                setIsRunning(false);
            }
        }
    };

    const handleDoubleClick = () => {
        onReset({label, timeAmount: timeAmount - timeLeft, timestamp});

        setIsRunning(false);
        setEndTime(null);
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
