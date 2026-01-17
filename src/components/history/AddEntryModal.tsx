import {Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle} from '@headlessui/react';
import {type FormEvent, useState} from 'react';

interface AddEntryModalProps {
    availableLabels: string[];
    onSave: (label: string, durationMinutes: number, timestamp: number) => void;
}

export default function AddEntryModal({availableLabels, onSave}: AddEntryModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    const [label, setLabel] = useState(availableLabels[0] || 'Focus');
    const [duration, setDuration] = useState('25');
    const [date, setDate] = useState(() => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    });

    function open() {
        setIsOpen(true);
    }

    function close() {
        setIsOpen(false);
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const durationNum = parseFloat(duration);
        const timestamp = new Date(date).getTime();

        if (isNaN(durationNum) || durationNum <= 0 || isNaN(timestamp)) {
            alert("Please enter valid duration and date");
            return;
        }

        onSave(label, durationNum, timestamp);

        close();
        setDuration('25');
    };

    return (
        <>
            <Button
                onClick={open}
                className="rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-black/30"
            >
                Add Entry
            </Button>

            <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={close} __demoMode>
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm transition duration-300 ease-out data-[closed]:opacity-0"
                />
                <div className="fixed inset-0 z-50 w-screen overflow-y-auto">

                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            transition
                            className="w-full max-w-sm rounded-xl bg-[#2a2a2a] p-6 shadow-xl border border-white/10 duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                        >
                            <DialogTitle as="h3" className="text-xl font-bold text-white mb-6">
                                Add Manual Entry
                            </DialogTitle>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-white/70">Label</label>
                                    <div className="relative">
                                        <select
                                            value={label}
                                            onChange={(e) => setLabel(e.target.value)}
                                            className="block w-full appearance-none rounded-lg border-none bg-white/5 py-2.5 px-3 text-sm/6 text-white focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                                        >
                                            {availableLabels.map(lbl => (
                                                <option key={lbl} value={lbl} className="bg-[#2a2a2a] text-white">
                                                    {lbl}
                                                </option>
                                            ))}
                                        </select>
                                        <div
                                            className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/50">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                                 viewBox="0 0 20 20">
                                                <path
                                                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-white/70">Duration (Minutes)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        className="block w-full rounded-lg border-none bg-white/5 py-2.5 px-3 text-sm/6 text-white focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-white/70">Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="block w-full rounded-lg border-none bg-white/5 py-2.5 px-3 text-sm/6 text-white focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25 [color-scheme:dark]"
                                    />
                                </div>

                                <div className="flex gap-3 mt-4">
                                    <Button
                                        type="button"
                                        onClick={close}
                                        className="flex-1 rounded-md bg-white/10 py-2 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-white/20 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1 rounded-md bg-sky-600 py-2 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-sky-500 data-[open]:bg-sky-700 data-[focus]:outline-1 data-[focus]:outline-white"
                                    >
                                        Save
                                    </Button>
                                </div>
                            </form>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>
    );
}