import {NavLink} from "react-router";
import SettingModal from "./SettingModal.tsx";
import type {TimerOption} from "../../types/settings.ts";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    selectedOption: TimerOption;
    availableOptions: TimerOption[];
    onSelect: (option: TimerOption) => void;
    onAddCustom: (minutes: number) => void;
    onRemove: (id: number) => void;
}

function Sidebar({
                     isOpen,
                     onClose,
                     selectedOption,
                     availableOptions,
                     onSelect,
                     onAddCustom,
                     onRemove
                 }: SidebarProps) {
    return (
        <>
            <div
                className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
                onClick={onClose}
                style={{margin: 0}}
            />

            <div
                className={`fixed top-0 left-0 h-full w-80 bg-[#252525] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="p-8 flex flex-col h-full">
                    <div
                        className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
a                        <h2 className="text-2xl font-bold text-white">Info</h2>
                        <button onClick={onClose}
                                className="text-gray-400 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                 viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                 strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <nav>
                        <ul className="flex flex-col gap-6">
                            <li>
                                <NavLink to="/history" onClick={onClose}>
                                    <span className="text-base">History</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/">
                                    Preferences
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/">

                                </NavLink>
                            </li>
                            <li>
                                <SettingModal
                                    selectedOption={selectedOption}
                                    availableOptions={availableOptions}
                                    onSelect={onSelect}
                                    onAddCustom={onAddCustom}
                                    onRemove={onRemove}
                                />
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    );
}

export default Sidebar;
