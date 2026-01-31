import {Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle} from '@headlessui/react';
import {useState} from 'react';
import {type Label} from '../../types/labels';

interface LabelConfigModalProps {
    selectedLabel: Label | undefined;
    labels: Label[];
    onSelect: (labelId: string) => void;
}

function LabelConfigModal({
                              selectedLabel,
                              labels,
                              onSelect,
                          }: LabelConfigModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    function handleSelect(label: Label) {
        onSelect(label.id);
        setIsOpen(false);
    }

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                title={selectedLabel ? `Selected: ${selectedLabel.name}` : "Select Label"}
                className="rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white hover:bg-black/30 transition-colors flex items-center gap-2"
            >
                {selectedLabel && (
                    <span
                        className="w-2 h-2 rounded-full shadow-sm"
                        style={{backgroundColor: selectedLabel.color || '#fff'}}
                    />
                )}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                     strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z"/>
                </svg>
            </Button>

            <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none"
                    onClose={() => setIsOpen(false)}>
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm 75 ease-out data-[closed]:opacity-0"
                />

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            transition
                            className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl 75 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
                        >
                            <DialogTitle as="div"
                                         className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-white">
                                    Select Label
                                </h3>
                            </DialogTitle>

                            <div>
                                <div className="grid grid-cols-2 gap-3">
                                    {labels.map((label) => {
                                        const isSelected = selectedLabel?.id === label.id;
                                        return (
                                            <div key={label.id} className="relative group">
                                                <Button
                                                    onClick={() => handleSelect(label)}
                                                    className={`
                                                        w-full rounded-lg px-3 py-2 text-sm font-medium transition-all
                                                        flex items-center gap-3 justify-start border
                                                        ${isSelected
                                                        ? 'bg-white/10 border-white/30 text-white'
                                                        : 'bg-transparent border-neutral-800 text-neutral-400 hover:bg-white/5 hover:text-neutral-200'
                                                    }`}
                                                >
                                                    <span
                                                        className={`w-3 h-3 rounded-full flex-shrink-0 ${isSelected ? 'ring-2 ring-white/20' : ''}`}
                                                        style={{backgroundColor: label.color || '#6b7280'}}
                                                    />

                                                    <span className="truncate">{label.name}</span>
                                                </Button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default LabelConfigModal;
