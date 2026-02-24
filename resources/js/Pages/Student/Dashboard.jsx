import AppLayout from '../../Layouts/AppLayout';
import { useEffect, useState } from 'react';
import DigitalID from '../../Components/DigitalID';
import { AlertTriangle, ArrowRight, Newspaper } from 'lucide-react';
import CountUp from 'react-countup';
import { router } from '@inertiajs/react';

export default function Dashboard({ auth, unsettledViolations, unsettledCount }) {
    const user = auth?.user;
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
        <AppLayout user={user}>
            <div className="container px-3 py-4 space-y-6">
                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left">
                        <img
                            src="/assets/images/school-logo.png"
                            alt="Opol Community College Logo"
                            className="img-fluid"
                            style={{ width: '64px' }}
                        />

                        <div className="leading-tight">
                            <div className="fw-semibold text-gray-800 text-base">
                                Opol Community College
                            </div>

                            <div className="uppercase text-gray-500 font-medium text-xs border-t border-gray-300 mt-1 pt-1">
                                Center for Student Development and Leadership
                            </div>

                            <div className="text-sm text-gray-600 font-bold tracking-tight">
                                Office of the CSDL
                            </div>
                        </div>
                    </div>
                </div>

                {/* DIGITAL ID + STATS (Conditional) */}
                <div className="md:pt-6">

                    {user?.profile_photo ? (

                        /* =========================
                           SHOW NORMAL DASHBOARD
                        ========================== */

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            {/* LEFT: DIGITAL ID */}
                            <div className="flex justify-center md:justify-start">
                                <div className="w-full">
                                    <DigitalID
                                        userIdNo={user?.user_id_no || '0000-0-00000'}
                                    />
                                </div>
                            </div>

                            {/* RIGHT: STATS */}
                            <div className="flex flex-col gap-4">

                                <div
                                    onClick={() => router.visit('/student/violations')}
                                    className="group relative overflow-hidden rounded-lg bg-white p-5 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                                                Unsettled Violations
                                            </p>

                                            <div className="mt-2 flex items-end gap-2">
                                                <span className="text-3xl font-semibold text-gray-900">
                                                    <CountUp
                                                        start={0}
                                                        end={unsettledCount}
                                                        duration={2}
                                                        separator=","
                                                    />
                                                </span>

                                                {unsettledCount > 0 && (
                                                    <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                                                        Needs attention
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-red-50 text-red-500">
                                            <AlertTriangle size={20} />
                                        </div>
                                    </div>

                                    <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-red-400 to-red-600 opacity-80" />
                                </div>

                                <a
                                    href="https://sis.occph.com/enrollment-record"
                                    className="border rounded-lg p-4 shadow-sm bg-white"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                            SIS
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-800">
                                                Student Information System
                                            </div>
                                            <div className="text-sm text-gray-500 mt-1">
                                                Grades, enrollment status, and evaluations
                                            </div>
                                        </div>
                                    </div>
                                </a>

                                <a
                                    href="https://occ.edu.ph/news"
                                    className="border rounded-lg p-4 shadow-sm bg-white"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                            <Newspaper className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-800">
                                                Campus News & Updates
                                            </div>
                                            <div className="text-sm text-gray-500 mt-1">
                                                Announcements, events, and official notices
                                            </div>
                                        </div>
                                    </div>
                                </a>

                            </div>

                            {/* SERVICES */}
                            <div className="flex flex-col gap-4">
                                {/* Future services */}
                            </div>

                        </div>

                    ) : (

                        /* =========================
                           SHOW INSTRUCTION CARD
                        ========================== */

                        <div className="max-w-2xl mx-auto bg-white border border-yellow-200 shadow-sm rounded-xl p-8">

                            {/* ICON */}
                            <div className="flex justify-center mb-4">
                                <div className="w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center">
                                    <AlertTriangle className="w-7 h-7 text-yellow-600" />
                                </div>
                            </div>

                            {/* TITLE */}
                            <h2 className="text-xl font-semibold text-gray-800 text-center">
                                Profile Photo Required
                            </h2>

                            <p className="text-sm text-gray-600 mt-2 text-center">
                                To activate your QR Code and access all dashboard services,
                                please upload a proper profile photo following the instructions below.
                            </p>

                            {/* STEPS */}
                            <div className="mt-6 space-y-4 text-sm text-gray-700">

                                <div>
                                    <ul className="list-disc list-inside mt-2 text-gray-600">
                                        <li>Plain white or light background</li>
                                        <li>Face clearly visible</li>
                                        <li>No filters or heavy editing</li>
                                        <li>No sunglasses, caps, or obstructions</li>
                                    </ul>
                                </div>

                            </div>

                            {/* IMAGE REFERENCE */}
                            <div className="mt-8">
                                <p className="text-sm font-semibold text-gray-800 mb-3 text-center">
                                    Reference Example
                                </p>

                                <div className="flex justify-center">
                                    <img
                                        src="/assets/images/proper-profile-photo.jpg"
                                        alt="Proper Profile Photo Example"
                                        className="w-40 h-40 object-cover border border-gray-400 shadow"
                                    />
                                </div>
                            </div>

                            {/* WARNING NOTE */}
                            <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-700 font-medium">
                                    Important Notice:
                                </p>
                                <p className="text-sm text-red-600 mt-1">
                                    <span>Failure to follow the profile photo guidelines may result in </span>
                                    <span className="font-semibold">automatic account deactivation</span>.
                                </p>
                            </div>

                            {/* BUTTON */}
                            <div className="mt-8 text-center">
                                <button
                                    onClick={() => router.visit('/profile')}
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                                >
                                    Go to Profile <ArrowRight className="w-4 h-4 inline-block ml-1" />
                                </button>
                            </div>

                        </div>

                    )}

                </div>
            </div>
        </AppLayout>
    );
}
