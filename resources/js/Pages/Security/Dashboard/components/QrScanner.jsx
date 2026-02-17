import { useState } from 'react';
import { useQrScanner } from '../hooks/useScanner';

export default function QrScanner({ active, onResult, loading }) {
    const [locked, setLocked] = useState(false);

    const { error } = useQrScanner({
        enabled: active && !locked,
        onScan: async (text) => {
            setLocked(true);
            await onResult(text);
        },
    });

    if (!active) return null;

    return (
        <div className="relative max-w-md bg-white space-y-3">
            <h3 className="font-semibold text-gray-700">
                Scan QR Code
            </h3>

            {/* Scanner */}
            <div
                id="qr-scanner"
                className="h-64 rounded-lg overflow-hidden bg-white/90"
            />

            {/* Loading Overlay */}
            {(locked || loading) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center
                                rounded-xl">
                    <div className="h-10 w-10 rounded-full border-4 border-black/30 border-t-black animate-spin" />
                    <p className="mt-3 text-sm text-blue font-medium">
                        Processing QR code…
                    </p>
                </div>
            )}

            {error && !locked && (
                <p className="text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}
