import { useEffect, useRef, useState } from 'react';

export function useQrScanner({ enabled, onScan }) {
    const ref = useRef(null);
    const [ready, setReady] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (window.Html5Qrcode) {
            setReady(true);
            return;
        }

        const script = document.createElement('script');
        script.src =
            'https://cdn.jsdelivr.net/npm/html5-qrcode/minified/html5-qrcode.min.js';
        script.onload = () => setReady(true);
        document.body.appendChild(script);
    }, []);

    useEffect(() => {
        if (!enabled || !ready) return;

        const qr = new window.Html5Qrcode('qr-scanner');
        ref.current = qr;

        qr.start(
            { facingMode: 'environment' },
            { fps: 6, qrbox: (w, h) => Math.min(w, h) * 0.7 },
            onScan
        ).catch(() => {
            setError('Camera access denied.');
        });

        return async () => {
            try {
                await qr.stop();
                await qr.clear();
            } catch {}
        };
    }, [enabled, ready]);

    return { error };
}
