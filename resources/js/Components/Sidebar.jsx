import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    HomeIcon,
    UserGroupIcon,
    CheckIcon,
    ChevronRightIcon,
    ChevronLeftIcon,
} from '@heroicons/react/24/outline';
import { CalendarRange, LayoutDashboard, ListTodo, ListX, MapPinned, ScanQrCode, Ticket, Tickets, Users } from 'lucide-react';
import { Loader } from 'lucide-react';

export default function Sidebar({ user, mobileOpen, setMobileOpen }) {
    const { url } = usePage();
    const [collapsed, setCollapsed] = useState(false);
    const [loadingHref, setLoadingHref] = useState(null);

    // Persist collapsed state
    useEffect(() => {
        const stored = localStorage.getItem('sidebar-collapsed');
        if (stored) setCollapsed(stored === 'true');
    }, []);

    const toggleCollapse = () => {
        const newCollapsed = !collapsed;
        setCollapsed(newCollapsed);
        localStorage.setItem('sidebar-collapsed', newCollapsed);
    };

    useEffect(() => {
        const removeStart = router.on('start', (event) => {
            setLoadingHref(event.detail.visit.url.pathname);
        });

        const removeFinish = router.on('finish', () => {
            setLoadingHref(null);
        });

        const removeError = router.on('error', () => {
            setLoadingHref(null);
        });

        return () => {
            removeStart();
            removeFinish();
            removeError();
        };
    }, []);



    const role = user?.user_role || 'guest';
    let links = [];

    if (role === 'admin') {
        links = [
            {
                label: 'Menu',
                items: [{ name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard }],
            },
            {
                label: 'Setup',
                items: [
                    { name: 'Violation', href: '/setup-violation', icon: ListTodo },
                    { name: 'Sanction', href: '/setup-sanction', icon: ListX },
                    { name: 'Location', href: '/setup-location', icon: MapPinned },
                ],
            },
            {
                label: 'Manage',
                items: [
                    { name: 'Events', href: '/manage-event', icon: CalendarRange },
                    { name: 'Users', href: '/manage-user', icon: Users },
                    { name: 'Violation Records', href: '/manage-violation-records', icon: Tickets },
                ],
            },
        ];
    } else if (role === 'security') {
        links = [
            {
                label: 'Menu',
                items: [
                    { name: 'Dashboard', href: '/security/dashboard', icon: LayoutDashboard },
                ],
            },
            { name: 'Violations', href: '/security/violations', icon: CheckIcon },
        ];
    } else if (role === 'student') {
        links = [
            {
                label: 'Menu',
                items: [
                    { name: 'Home', href: '/student/dashboard', icon: HomeIcon },
                ],
            },

            {
                label: 'Records',
                items: [
                    { name: 'Violation', href: '/student/violations', icon: Tickets },
                ],
            },
        ];
    }

    const sidebarClass = collapsed ? 'w-20' : 'w-64';

    return (
        <>
            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <aside
                className={`fixed z-40 h-screen border-r-2 border-gray-200 transition-all duration-300 bg-white text-gray-700 flex flex-col lg:relative ${sidebarClass} ${mobileOpen ? 'left-0' : '-left-64'
                    } lg:left-0`}
            >
                {/* Header */}
                <div
                    className={`flex items-center p-4 transition-all ${collapsed ? 'justify-center' : 'justify-between'
                        }`}
                >
                    {!collapsed && (
                        <Link
                            href="/"
                            className="flex items-center space-x-2 group"
                            aria-label="Go to Home"
                        >
                            <img
                                src="/favicon.png"
                                alt="Logo"
                                className="h-6 w-6 object-contain transition group-hover:scale-105"
                            />
                            <span className="text-xl font-bold leading-none text-blue-700">
                                myOCC
                            </span>
                        </Link>
                    )}


                    <button
                        onClick={toggleCollapse}
                        className="p-1 rounded hover:bg-gray-200 transition-colors"
                    >
                        {collapsed ? (
                            <ChevronRightIcon className="h-5 w-5 text-gray-700" />
                        ) : (
                            <ChevronLeftIcon className="h-5 w-5 text-gray-700" />
                        )}
                    </button>
                </div>

                {/* Links */}
                <nav className="flex-1 flex flex-col mt-4 overflow-auto">
                    {links.map((group) => (
                        <div key={group.label || Math.random()} className="mb-4">
                            {!collapsed && group.label && (
                                <p className="px-4 text-xs text-gray-400 uppercase tracking-wider mb-2">
                                    {group.label}
                                </p>
                            )}

                            {group.items?.map((link) => {
                                const Icon = link.icon;
                                const isActive = url.startsWith(link.href);
                                const isLoading = loadingHref === link.href;

                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => {
                                            setMobileOpen(false);
                                            setLoadingHref(link.href);
                                        }}
                                        className={`flex items-center transition-colors rounded-lg ml-4 mr-4
            ${collapsed ? 'justify-center px-0 py-3' : 'justify-start px-4 py-3'}
            ${isActive ? 'bg-blue-700 text-white' : 'text-gray-700 hover:bg-blue-100 hover:text-blue-700'}
            `}
                                    >
                                        {isLoading ? (
                                            <Loader className="h-6 w-6 animate-spin" />
                                        ) : (
                                            <Icon className={`h-6 w-6 ${isActive ? 'text-white' : 'text-gray-700'}`} />
                                        )}

                                        {!collapsed && <span className="ml-3">{link.name}</span>}
                                    </Link>
                                );
                            })}

                        </div>
                    ))}
                </nav>
            </aside>
        </>
    );
}
