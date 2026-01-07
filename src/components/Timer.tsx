import {useState, useEffect} from 'react';
import styles from './CountdownTimer.module.css';

export type TimerData = {
    label: string;
    timeAmount: number;
    timestamp: number;
};

type CountdownTimerProps = {
    timeAmount: number;
    label: string;
    timestamp: number;

    onFinish: (data: TimerData) => void;
    onReset: (data: TimerData) => void;
};

function CountdownTimer({timeAmount, label, timestamp, onFinish, onReset}: CountdownTimerProps) {
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

    const formatTime = (seconds: number): string => {
        const minutes: number = Math.floor(seconds / 60);
        const remainingSeconds: number = seconds % 60;

        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

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

export default CountdownTimer;
