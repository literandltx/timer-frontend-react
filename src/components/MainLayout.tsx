import { Outlet } from "react-router-dom";

function MainLayout() {
    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            {/*<Sidebar />*/}

            <main style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                <Outlet />
            </main>
        </div>
    );
}

export default MainLayout;
