import {NavLink} from "react-router-dom";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

function Sidebar({isOpen, onClose}: SidebarProps) {
    return (
        <>
            <div
                className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
                    isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
                }`}
                onClick={onClose}
            />

            <div
                className={`fixed top-0 left-0 h-full w-80 bg-[#252525] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="p-8 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
                        <h2 className="text-2xl font-bold text-white">
                            <NavLink to="/" onClick={onClose}>
                                Timer
                            </NavLink>
                        </h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
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
                                    History
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/settings/labels" onClick={onClose}>
                                    Labels
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/settings/timers" onClick={onClose}>
                                    Timers
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="auth/register" onClick={onClose}>
                                    Register / Login
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/data" onClick={onClose}>
                                    Import / Export
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    );
}

export default Sidebar;
