import { useState } from 'react';
import Sidebar from '../Components/Sidebar';
import Navbar from '../Components/Navbar';
import { Toaster } from 'react-hot-toast';

export default function AppLayout({ children, user, breadcrumbs = [] }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar
                user={user}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            <div className="flex-1 flex flex-col">
                <Navbar
                    user={user}
                    breadcrumbs={breadcrumbs}
                    onMobileMenu={() => setMobileOpen(!mobileOpen)}
                />

                <main className="flex-1 p-4 md:p-8 overflow-auto pb-20 lg:pb-8">
                    {children}
                </main>
            </div>

            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 3000,
                }}
            />
        </div>
    );
}
