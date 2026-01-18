export const formatTime = (seconds: number): string => {
    const minutes: number = Math.floor(seconds / 60);
    const remainingSeconds: number = seconds % 60;

    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};
