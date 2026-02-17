import { useEffect, useState } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import StatsBarChart from '../../Components/StatsBarChart';
import DashboardStats from '../../Components/DashboardStats';

export default function Dashboard({
    auth,
    totalUsers,
    unsettledViolations,
    violationChartData
}) {

    const user = auth?.user;
    const colors = ["#2563eb", "#f97316", "#dc2626", "#10b981", "#efef04", "#8b5cf6"];

    return (
        <AppLayout user={user} breadcrumbs={["Dashboard"]}>
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

                {/* STATISTICS */}
                <DashboardStats
                    totalUsers={totalUsers}
                    unsettledViolations={unsettledViolations}
                />

                {/* CHART */}
                <div className="space-y-2">
                    <div className="fw-semibold text-sm md:text-base text-gray-700">
                        Violation Code Statistics
                    </div>
                    <div className="border rounded-lg shadow-xs bg-white p-3 md:p-4">
                        <StatsBarChart
                            data={violationChartData}
                            xKey="violation_code"
                            barKey="count"
                            height={320}
                            colors={colors}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}