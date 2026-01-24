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

            <main>
                <Outlet context={{setSidebarOpen} satisfies MainLayoutContext}/>
            </main>
        </div>
    );
}

export default MainLayout;
