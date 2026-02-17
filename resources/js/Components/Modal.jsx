import { useEffect } from "react";

export default function Modal({ isOpen, onClose, title, children }) {
    // Lock background scroll
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => (document.body.style.overflow = "");
    }, [isOpen]);

    // Close on ESC
    useEffect(() => {
        const esc = (e) => e.key === "Escape" && isOpen && onClose();
        window.addEventListener("keydown", esc);
        return () => window.removeEventListener("keydown", esc);
    }, [isOpen, onClose]);

    return (
        <div
            className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center
                transition-opacity duration-200
                ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div
                className={`
                    relative w-full
                    h-[100dvh] sm:h-auto
                    sm:max-h-[90vh] sm:max-w-lg
                    bg-white shadow-2xl flex flex-col
                    rounded-t-2xl sm:rounded-xl
                    transform transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)]
                    ${isOpen
                        ? "translate-y-0 sm:scale-100 sm:opacity-100"
                        : "translate-y-full sm:scale-95 sm:opacity-0"}
                `}
            >
                {/* Header */}
                <div className="shrink-0 px-4 py-3 border-b flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-4 py-4">
                    {children}
                </div>
            </div>
        </div>
    );
}
