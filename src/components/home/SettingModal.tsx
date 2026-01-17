import {Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle, Input} from '@headlessui/react';
import {useState} from 'react';
import {useTimerSettings} from '../../hooks/useTimerSettings';
import {type TimerOption} from '../../types/settings';

interface SettingModalProps {
    onTimeChange: (minutes: number) => void;
}

function SettingModal({onTimeChange}: SettingModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [customValue, setCustomValue] = useState('');
    const {selectedOption, availableOptions, savePreference, addCustomOption} = useTimerSettings();

    function handleSelect(option: TimerOption) {
        savePreference(option);
        onTimeChange(option.value);
    }

    function handleAddCustom() {
        const minutes = parseInt(customValue, 10);
        if (!isNaN(minutes) && minutes > 0) {
            addCustomOption(minutes);
            setCustomValue('');
        }
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
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm duration-300 ease-out data-[closed]:opacity-0"
                />

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            transition
                            className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
                        >
                            <DialogTitle as="div" className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium text-white">Timer Settings</h3>
                            </DialogTitle>

                            <div>
                                <p className="text-sm text-white/50 mb-3">Duration (Minutes)</p>
                                <div className="grid grid-cols-4 gap-3">
                                    {availableOptions.map((option) => (
                                        <Button
                                            key={option.id}
                                            onClick={() => handleSelect(option)}
                                            className={`
                                                rounded-lg px-2 py-2 text-sm font-semibold shadow-inner shadow-white/10 focus:outline-none transition-all
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

                            <div className="mt-6 pt-6 border-t border-white/10">
                                <p className="text-sm text-white/50 mb-3">Add Custom Duration</p>
                                <div className="flex gap-3">
                                    <Input
                                        type="number"
                                        placeholder="Min"
                                        value={customValue}
                                        onChange={(e) => setCustomValue(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
                                        className="w-full rounded-lg border-none bg-white/10 py-1.5 px-3 text-sm/6 text-white focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25 placeholder:text-white/30"
                                    />
                                    <Button
                                        onClick={handleAddCustom}
                                        className="rounded-lg bg-white/10 py-1.5 px-4 text-sm font-semibold text-white hover:bg-white/20 shadow-inner shadow-white/10 focus:outline-none"
                                    >
                                        Add
                                    </Button>
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