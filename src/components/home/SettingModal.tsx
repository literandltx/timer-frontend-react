import {Button, Dialog, DialogPanel, DialogTitle} from '@headlessui/react'
import {useState} from 'react'

const OPTIONS: number[] = [20, 40, 60, 90]

interface SettingModalProps {
    onTimeChange: (minutes: number) => void;
}

function SettingModal({onTimeChange}: SettingModalProps) {
    const [isOpen, setIsOpen] = useState(false)

    const [selectedValue, setSelectedValue] = useState((): number => {
        if (typeof window !== 'undefined') {
            const saved: string | null = localStorage.getItem('user_timer_preference')
            return saved ? parseInt(saved, 10) : 40
        }
        return 40
    })

    function open(): void {
        setIsOpen(true)
    }

    function close(): void {
        setIsOpen(false)
    }

    function handleSelect(value: number): void {
        setSelectedValue(value)
        localStorage.setItem('user_timer_preference', value.toString())

        onTimeChange(value)
    }

    return (
        <>
            <Button
                onClick={open}
                className="rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-black/30"
            >
                Settings
            </Button>

            <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={close} __demoMode>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            transition
                            className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
                        >
                            <DialogTitle as="h3" className="text-base/7 font-medium text-white">
                                Settings
                            </DialogTitle>

                            <div className="mt-6">
                                <p className="text-sm/6 text-white/50 mb-3">Select Duration (Minutes)</p>
                                <div className="flex gap-4">
                                    {OPTIONS.map((option) => (
                                        <Button
                                            key={option}
                                            onClick={() => handleSelect(option)}
                                            className={`
                                                flex-1 rounded-lg px-4 py-2 text-sm font-semibold shadow-inner shadow-white/10 focus:outline-none
                                                ${selectedValue === option
                                                ? 'bg-white text-black'
                                                : 'bg-white/10 text-white hover:bg-white/20'
                                            }
                                            `}
                                        >
                                            {option}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-8">
                                <Button
                                    className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/4 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                                    onClick={close}
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
