import { useEffect, useRef, useState } from 'react';
import { QrCodeIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function SearchDropdown({ onScan, onType }) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAction = (action) => {
        action();
        setOpen(false);
    };

    return (
        <div ref={dropdownRef} className="relative w-full sm:w-auto">
            {/* Trigger Button */}
            <button
                onClick={() => setOpen(true)}
                className="flex w-full sm:w-auto items-center justify-center gap-2
                           rounded-lg bg-blue-600 px-5 py-3 sm:py-2
                           text-base sm:text-sm font-semibold text-white shadow
                           hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400
                           active:scale-[0.98] transition"
            >
                <MagnifyingGlassIcon className="h-5 w-5" />
                Search
            </button>

            {/* ===== Desktop Dropdown ===== */}
            <div
                className={`hidden sm:block absolute left-0 mt-2 w-56 rounded-xl bg-white shadow-lg ring-1 ring-black/5
                z-50 transition-all duration-150 origin-top
                ${open ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}
            >
                <MenuItems onScan={onScan} onType={onType} onSelect={handleAction} />
            </div>

            {/* ===== Mobile Bottom Sheet ===== */}
            <div
                className={`sm:hidden fixed inset-0 z-50 transition-opacity duration-200
        ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/40"
                    onClick={() => setOpen(false)}
                />

                {/* Sheet */}
                <div
                    className={`absolute bottom-0 left-0 right-0
            rounded-t-2xl bg-white shadow-xl
            transform transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)]
            ${open ? 'translate-y-0' : 'translate-y-full'}`}
                >
                    <div className="flex items-center justify-between px-4 py-3 border-b">
                        <span className="font-semibold text-gray-700">
                            Search Options
                        </span>
                        <button onClick={() => setOpen(false)}>
                            <XMarkIcon className="h-6 w-6 text-gray-500" />
                        </button>
                    </div>

                    <div className="p-2">
                        <MenuItems
                            onScan={onScan}
                            onType={onType}
                            onSelect={handleAction}
                            mobile
                        />
                    </div>
                </div>
            </div>

        </div>
    );
}

/* Reusable menu items */
function MenuItems({ onScan, onType, onSelect, mobile }) {
    const base =
        "flex w-full items-center gap-4 rounded-xl px-4 py-4 text-base font-medium transition";

    return (
        <>
            <button
                onClick={() => onSelect(onScan)}
                className={`${base}
                    ${mobile
                        ? 'hover:bg-blue-50'
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'}`}
            >
                <QrCodeIcon className="h-6 w-6 text-blue-600" />
                Scan QR Code
            </button>

            <button
                onClick={() => onSelect(onType)}
                className={`${base}
                    ${mobile
                        ? 'hover:bg-blue-50'
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'}`}
            >
                <MagnifyingGlassIcon className="h-6 w-6 text-blue-600" />
                Type ID No.
            </button>
        </>
    );
}
