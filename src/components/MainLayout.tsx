import {useState} from "react";
import {Outlet} from "react-router-dom";
import Sidebar from "./navbar/Sidebar.tsx";

export interface MainLayoutContext {
    setSidebarOpen: (isOpen: boolean) => void;
}

function MainLayout() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div>
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {!isSidebarOpen && (
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="absolute top-6 left-6 z-50 p-2 rounded-full hover:bg-white/10 transition-colors"
                    aria-label="Open Menu"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="24"
                         viewBox="0 0 24 24"
                         fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                         strokeLinejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6"  x2="21" y2="6" ></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>
            )}

            <main>
                <Outlet context={{setSidebarOpen} satisfies MainLayoutContext}/>
            </main>
        </div>
    );
}

export default MainLayout;
