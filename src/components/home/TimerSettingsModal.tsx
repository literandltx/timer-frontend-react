import {Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle} from '@headlessui/react';
import {useState} from 'react';
import {type TimerOption} from '../../types/settings';

interface TimerSettingsModalProps {
    selectedOption: TimerOption;
    availableOptions: TimerOption[];
    onSelect: (option: TimerOption) => void;
}

function TimerSettingsModal({
                          selectedOption,
                          availableOptions,
                          onSelect,
                      }: TimerSettingsModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    function handleSelect(option: TimerOption) {
        onSelect(option);
        setIsOpen(false);
    }

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                className="rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white hover:bg-black/30 transition-colors"
            >
                Timer Settings
            </Button>

            <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none"
                    onClose={() => setIsOpen(false)}>
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm duration-300 ease-out data-[closed]:opacity-0"
                />

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            transition
                            className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
                        >
                            <DialogTitle as="div" className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium text-white">
                                    Timer Settings <span
                                    className="text-sm text-gray-400 ml-1">(Experimental)</span>
                                </h3>
                            </DialogTitle>

                            <div>
                                <div className="grid grid-cols-4 gap-3">
                                    {availableOptions.map((option) => (
                                        <div key={option.id} className="relative group">
                                            <Button
                                                onClick={() => handleSelect(option)}
                                                className={`
                                                    w-full rounded-lg px-2 py-2 text-sm font-semibold shadow-inner shadow-white/10 focus:outline-none transition-all
                                                    ${selectedOption.id === option.id
                                                    ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'
                                                }`}
                                            >
                                                {option.value}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default TimerSettingsModal;
