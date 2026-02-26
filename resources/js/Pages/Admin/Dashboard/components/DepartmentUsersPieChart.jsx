import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import { useRef, useState } from "react";
import * as htmlToImage from "html-to-image";
import toast from "react-hot-toast";
import { Clipboard, Copy } from "lucide-react";

export default function DepartmentUsersPieChart({
    data = [],
    usersWithProfilePhoto = 0,
    usersWithFaceEnrolled = 0
}) {
    const componentRef = useRef(null);

    const COLORS = [
        "#800000",
        "#2563eb",
        "#facc15",
        "#10b981",
        "#8b5cf6"
    ];

    const totalUsers = data.reduce(
        (sum, item) => sum + (item.student_count || 0),
        0
    );

    const profilePercentage = totalUsers
        ? ((usersWithProfilePhoto / totalUsers) * 100).toFixed(1)
        : 0;

    const facePercentage = totalUsers
        ? ((usersWithFaceEnrolled / totalUsers) * 100).toFixed(1)
        : 0;

    /* ================= EXPORT FUNCTIONS ================= */

    const exportOptions = {
        pixelRatio: 2,
        backgroundColor: "#ffffff"
    };

    const [isExporting, setIsExporting] = useState(false);

    const handleCopyImage = async () => {
        if (!componentRef.current) return;

        try {
            setIsExporting(true);

            const toastId = toast.loading("Copying...");

            // Allow UI update before capture
            await new Promise((resolve) => setTimeout(resolve, 100));

            const blob = await htmlToImage.toBlob(
                componentRef.current,
                exportOptions
            );

            await navigator.clipboard.write([
                new ClipboardItem({
                    "image/png": blob
                })
            ]);

            toast.success("Copied to clipboard!", {
                id: toastId
            });

        } catch (err) {
            console.error("Copy failed:", err);

            toast.error("Failed to copy.");
        } finally {
            setIsExporting(false);
        }
    };



    /* ================= COMPONENT ================= */

    return (
        <div className="">

            {/* EXPORTABLE AREA */}
            <div
                ref={componentRef}
                className="bg-white rounded-3xl
                           border border-gray-200 p-6"
            >
                {/* HEADER */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Users Overview
                        </h2>
                        <p className="text-sm text-gray-500">
                            Department distribution & engagement metrics
                        </p>
                    </div>

                    {/* ACTION BUTTONS */}
                    {!isExporting && (
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={handleCopyImage}>
                                <Copy size={18} />
                            </button>
                        </div>
                    )}

                </div>

                <div className="flex flex-col lg:flex-row gap-10">

                    {/* ================= GLASS DONUT ================= */}
                    <div className="relative w-full max-w-[360px] aspect-square mx-auto">

                        <div className="absolute inset-0">
                            <div className="relative w-full h-full p-4 sm:p-6">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={data}
                                            dataKey="student_count"
                                            nameKey="department_name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius="55%"
                                            outerRadius="80%"
                                            paddingAngle={4}
                                            stroke="none"
                                            isAnimationActive
                                            animationDuration={900}
                                        >
                                            {data.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={COLORS[index % COLORS.length]}
                                                />
                                            ))}
                                        </Pie>

                                        <Tooltip
                                            contentStyle={{
                                                backdropFilter: "blur(10px)",
                                                background: "rgba(255,255,255,0.85)",
                                                borderRadius: "12px",
                                                border: "1px solid rgba(0,0,0,0.05)"
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* CENTER TOTAL */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                                    {totalUsers}
                                </p>
                                <p className="text-[10px] sm:text-xs uppercase tracking-widest text-gray-600">
                                    Total Users
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ================= DEPARTMENT CARDS ================= */}
                    <div className="flex-1">

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {data.map((dept, index) => {
                                const percentage = totalUsers
                                    ? (
                                        (dept.student_count / totalUsers) *
                                        100
                                    ).toFixed(1)
                                    : 0;

                                const baseColor =
                                    COLORS[index % COLORS.length];

                                return (
                                    <div
                                        key={dept.department_id}
                                        className="relative rounded-3xl p-6 
                                                   border border-gray-200 
                                                   shadow-sm overflow-hidden"
                                        style={{
                                            background: `linear-gradient(135deg, ${baseColor}20, #ffffff)`
                                        }}
                                    >
                                        <div
                                            className="absolute -top-10 -right-10 
                                                       w-32 h-32 rounded-full 
                                                       blur-3xl opacity-30"
                                            style={{
                                                backgroundColor: baseColor
                                            }}
                                        />

                                        <div className="relative z-10">
                                            <div className="flex justify-between items-center">
                                                <h4 className="text-sm font-semibold text-gray-800">
                                                    {dept.department_name}
                                                </h4>

                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            baseColor
                                                    }}
                                                />
                                            </div>

                                            <div className="mt-6">
                                                <p className="text-4xl font-bold text-gray-900">
                                                    {dept.student_count}
                                                </p>
                                                <p className="text-xs text-gray-600 mt-1">
                                                    {percentage}% of total
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
