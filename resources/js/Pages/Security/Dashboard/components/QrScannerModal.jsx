import QrScanner from './QrScanner';

export default function QrScannerModal({
    open,
    onClose,
    onResult,
    loading
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl p-6">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
                >
                    ✕
                </button>

                <QrScanner
                    active={open}
                    loading={loading}
                    onResult={async (id) => {
                        await onResult(id);
                        onClose(); // close scanner after scan
                    }}
                />
            </div>
        </div>
    );
}
