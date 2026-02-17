// resources/js/Components/DashboardStats.jsx
import CountUp from 'react-countup';

export default function DashboardStats({ totalUsers, unsettledViolations, }) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">

                {/* Users */}
                <div className="border bg-white rounded-lg p-4 shadow-xs">
                    <div className="text-xs tracking-wider text-gray-500">
                        TOTAL USERS
                    </div>
                    <div className="text-xl md:text-2xl font-bold text-gray-800">
                        <CountUp
                            start={0}
                            end={totalUsers}
                            duration={2.5}
                            delay={0}
                            separator=","
                        />
                    </div>
                </div>

                {/* Violations */}
                <div className="border bg-white rounded-lg p-4 shadow-xs">
                    <div className="text-xs tracking-wider text-gray-500">
                        UNSETTLED VIOLATIONS
                    </div>
                    <div className="text-xl md:text-2xl font-bold text-red-600">
                        <CountUp
                            start={0}
                            end={unsettledViolations}
                            duration={2.5}
                            delay={0}
                            separator=","
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
