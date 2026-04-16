import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const MainLayout = () => {
    return (
        <div className="flex min-h-screen font-sans text-slate-100 bg-transparent relative">
            {/* Base gradient is handled in body index.css */}
            <Sidebar />
            <div className="flex-1 ml-72 flex flex-col min-h-screen relative z-10">
                <Topbar />

                {/* Main Content Area */}
                <main className="flex-1 p-8 pb-16 z-10 w-full max-w-7xl mx-auto">
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Outlet />
                    </div>
                </main>

                {/* Overlay decorative blur for the bottom */}
                <div className="fixed bottom-0 left-72 right-0 h-24 bg-gradient-to-t from-slate-900/40 to-transparent pointer-events-none z-0"></div>
            </div>
        </div>
    );
};

export default MainLayout;
