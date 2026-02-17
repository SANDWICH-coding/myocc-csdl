import AppLayout from '@/Layouts/AppLayout';
import { useEffect, useState } from 'react';
import { useStudentLookup } from './hooks/useStudentLookUp';

import SearchDropdown from './components/SearchDropdown';
import ManualSearch from './components/ManualSearch';
import QrScannerModal from './components/QrScannerModal';
import StudentResultModal from './components/StudentResultModal';
import { Tickets } from 'lucide-react';

import CountUp from 'react-countup';

export default function Index({ auth, totalIssuedTicketToday }) {
    const { student, loading, error, lookup } = useStudentLookup();

    const [mode, setMode] = useState(null);
    const [manualId, setManualId] = useState('');
    const [resultOpen, setResultOpen] = useState(false);
    const [currentId, setCurrentId] = useState('');

    const [scannerOpen, setScannerOpen] = useState(false);

    const handleLookup = async (id) => {
        setCurrentId(id);
        await lookup(id);
        setResultOpen(true);
        setMode(null);
    };

    const [pstTime, setPstTime] = useState('');
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const formatted = new Intl.DateTimeFormat('en-PH', {
                timeZone: 'Asia/Manila',
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            }).format(now);

            setPstTime(formatted);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <AppLayout user={auth.user}>
            <div className="container space-y-6">
                <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="group relative overflow-hidden rounded-lg bg-white p-6 shadow-xs border transition-all duration-300 hover:shadow hover:-translate-y-1">
                            {/* Subtle gradient accent */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-60 pointer-events-none" />

                            <div className="relative flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 tracking-wide">
                                        Total Violation Issued Today
                                    </p>

                                    <h2 className="mt-2 text-3xl font-bold text-gray-900">
                                        <CountUp
                                            start={0}
                                            end={totalIssuedTicketToday}
                                            duration={2.5}
                                            delay={0}
                                            separator=","
                                        />
                                    </h2>
                                </div>

                                {/* Icon Container */}
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                    <Tickets className="h-6 w-6" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <SearchDropdown
                    onScan={() => setScannerOpen(true)}
                    onType={() => setMode('type')}
                />


                {mode === 'type' && (
                    <ManualSearch
                        value={manualId}
                        onChange={setManualId}
                        onSubmit={() => handleLookup(manualId)}
                        error={error}
                        loading={loading}
                    />
                )}

            </div>
            <StudentResultModal
                open={resultOpen}
                onClose={() => setResultOpen(false)}
                id={currentId}
                student={student}
                loading={loading}
                error={error}
            />

            <QrScannerModal
                open={scannerOpen}
                onClose={() => setScannerOpen(false)}
                onResult={handleLookup}
                loading={loading}
            />
        </AppLayout>
    );
}
