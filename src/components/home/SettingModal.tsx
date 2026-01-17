import {Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle} from '@headlessui/react';
import {useState} from 'react';
import {useTimerSettings} from '../../hooks/useTimerSettings';
import {type TimerOption} from '../../types/settings';

interface SettingModalProps {
    onTimeChange: (minutes: number) => void;
}

function SettingModal({onTimeChange}: SettingModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const {selectedOption, availableOptions, savePreference} = useTimerSettings();

    function handleSelect(option: TimerOption) {
        savePreference(option);
        onTimeChange(option.value);
    }

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                className="rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white hover:bg-black/30 transition-colors"
            >
                Settings
            </Button>

            <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none"
                    onClose={() => setIsOpen(false)}>
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm duration-0 ease-out data-[closed]:opacity-0"
                />

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            transition
                            className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
                        >
                            <DialogTitle as="h3" className="text-base font-medium text-white">
                                <p className="text-2l text-white/60 mb-4">Select Duration</p>
                            </DialogTitle>

                            <div className="mt-6">

                                <div className="flex gap-4">
                                    {availableOptions.map((option) => (
                                        <Button
                                            key={option.id}
                                            onClick={() => handleSelect(option)}
                                            className={`
                        flex-1 rounded-lg px-4 py-2 text-sm font-semibold shadow-inner shadow-white/10 focus:outline-none transition-all
                        ${selectedOption.id === option.id
                                                ? 'bg-white text-black scale-105'
                                                : 'bg-white/10 text-white hover:bg-white/20'
                                            }
                      `}
                                        >
                                            {option.value}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-8">
                                <Button
                                    className="w-full inline-flex items-center justify-center rounded-md bg-gray-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-gray-600"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Close
                                </Button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default SettingModal;
