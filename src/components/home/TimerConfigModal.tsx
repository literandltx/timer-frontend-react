import {Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle} from '@headlessui/react';
import {useState} from 'react';
import {type TimerOption} from '../../types/settings';

interface TimerSettingsModalProps {
    selectedOption: TimerOption;
    availableOptions: TimerOption[];
    onSelect: (option: TimerOption) => void;
}

function TimerConfigModal({
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
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.332.183-.582.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.217.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.583-.495.645-.869l.214-1.281z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
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

export default TimerConfigModal;
