import DataTable from "../../../Components/DataTable";
import AppLayout from "../../../Layouts/AppLayout";
import { router } from "@inertiajs/react";
import Modal from "../../../Components/Modal";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import StudentEnrollmentModal from "../../../Components/StudentEnrollmentModal";

export default function Index({ auth, violations, filters }) {
    const user = auth?.user;

    useEffect(() => {
        setViolationsData(violations);
    }, [violations]);

    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [receiptData, setReceiptData] = useState(null);
    const [violationsData, setViolationsData] = useState(violations);

    const [modalOpen, setModalOpen] = useState(false);
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(false);

    const openStudentModal = async (userIdNo) => {
        setModalOpen(true);
        setLoading(true);
        setStudentData(null);

        try {
            const res = await axios.get("/admin/student-enrollment", {
                params: {
                    user_id_no: userIdNo,
                },
            });

            setStudentData(res.data);
        } catch (e) {
            console.error(e);
            toast.error("Failed to fetch student details.");
        } finally {
            setLoading(false);
        }
    };


    const handleStatusChange = (row) => async (e) => {
        const newStatus = e.target.value;

        toast.promise(
            axios.put(`/manage-violation-records/${row.id}/update-status`, { status: newStatus }),
            {
                loading: "Updating status...",
                success: "Status updated successfully!",
                error: "Failed to update status.",
            }
        );

        setViolationsData((prev) => ({
            ...prev,
            data: prev.data.map((v) =>
                v.id === row.id ? { ...v, status: newStatus } : v
            ),
        }));

    };



    const openReceiptModal = (row) => {
        setReceiptData(row);
        setShowReceiptModal(true);
    };

    const handleSearch = (value) => {
        router.get(
            "/manage-violation-records",
            { search: value },
            { preserveState: true, replace: true }
        );
    };

    const columns = [
        {
            key: "issued_date_time",
            label: "Issued Date",
            render: (row) => (
                <span>
                    {new Date(row.issued_date_time).toLocaleString()}
                </span>
            ),
        },
        {
            key: "reference_no",
            label: "Reference No",
            render: (row) => (
                <button
                    className="text-left text-blue-600 hover:underline"
                    onClick={() => openReceiptModal(row)}
                >
                    {row.reference_no}
                </button>
            ),
        },
        {
            key: "user",
            label: "Student",
            render: (row) => (
                <div
                    onClick={() => openStudentModal(row.user?.user_id_no)}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition"
                >
                    <img
                        src={
                            row.user?.profile_photo
                                ? `/storage/${row.user.profile_photo}`
                                : "/default-avatar.png"
                        }
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover border"
                    />
                    <div>
                        <div className="font-medium text-blue-600 hover:underline">
                            {row.user?.user_id_no}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            key: "violation_codes",
            label: "Violation(s)",
            render: (row) => (
                <div className="flex flex-wrap gap-2">
                    {row.violation_codes?.map((code, i) => (
                        <span
                            key={i}
                            className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full"
                        >
                            {code}
                        </span>
                    ))}
                </div>
            ),
        },
        {
            key: "sanction",
            label: "Sanction",
            render: (row) => {
                const sanction = row.sanction;

                if (!sanction) return "—";

                return (
                    <span className="text-sm font-medium">
                        {sanction.sanction_type === "monetary" && sanction.monetary_amount && (
                            <span className="text-xs px-2 py-1 rounded-full text-green-700">
                                ₱ {Number(sanction.monetary_amount).toLocaleString()} - {sanction.sanction_name}
                            </span>
                        )}

                        {sanction.sanction_type === "service" && sanction.service_time && (
                            <span className="text-xs px-2 py-1 rounded-full text-blue-700">
                                {sanction.service_time} {sanction.service_time_type} - {sanction.sanction_name}
                            </span>
                        )}
                    </span>
                );
            },
        }
        ,
        {
            key: "status",
            label: "Status",
            render: (row) => (
                <select
                    value={row.status}
                    onChange={handleStatusChange(row)}
                    className={`px-2 py-1 text-xs uppercase rounded-full font-medium ${row.status === "settled"
                        ? "bg-green-100 text-green-700"
                        : row.status === "void"
                            ? "bg-gray-100 text-gray-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                >
                    <option value="unsettled">Unsettled</option>
                    <option value="settled">Settled</option>
                    <option value="void">Void</option>
                </select>
            ),
        }

    ];

    return (
        <AppLayout
            user={user}
            breadcrumbs={["Manage", "Violations Records"]}
        >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-6 shadow-lg mb-8">
                <h1 className="text-3xl font-bold tracking-tight">
                    Violations Records Management
                </h1>
                <p className="text-blue-100 mt-1">
                    View and manage all user violation records.
                </p>
            </div>

            <DataTable
                columns={columns}
                data={violationsData}
                search={filters?.search}
                onSearch={handleSearch}
                searchPlaceholder="Search reference number or student..."
            />

            <Modal
                isOpen={showReceiptModal}
                onClose={() => setShowReceiptModal(false)}
                title=""
            >
                {receiptData && (
                    <div className="max-w-md mx-auto bg-white rounded-lg shadow-xs border overflow-hidden text-sm">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-5">
                            <h2 className="text-lg font-semibold tracking-wide">
                                Violation Receipt
                            </h2>
                            <p className="text-xs opacity-80 mt-1">
                                Official Record Confirmation
                            </p>
                        </div>

                        {/* Body */}
                        <div className="p-5 space-y-5">
                            {/* Reference + Status */}
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-gray-500">Reference No</p>
                                    <p className="font-semibold text-gray-800">
                                        #{receiptData.reference_no}
                                    </p>
                                </div>

                                <span className={`px-3 py-1 text-xs rounded-full uppercase font-medium ${receiptData.status === "settled"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                    }`}>
                                    {receiptData.status}
                                </span>
                            </div>

                            <div className="border-t border-dashed"></div>

                            {/* User Info */}
                            <div>
                                <p className="text-xs text-gray-500">User ID No</p>
                                <p className="font-medium text-gray-800">
                                    {receiptData.user?.user_id_no}
                                </p>

                                <p className="text-xs text-gray-500 mt-3">Issued Date</p>
                                <p className="font-medium text-gray-800">
                                    {new Date(receiptData.issued_date_time).toLocaleString()}
                                </p>

                                <p className="text-xs text-gray-500 mt-3">Issued By</p>
                                <p className="font-medium text-gray-800">
                                    {receiptData.issuer?.user_id_no ?? "Unknown"}
                                </p>

                            </div>

                            <div className="border-t border-dashed"></div>

                            {/* Violations */}
                            <div>
                                <p className="font-semibold text-gray-800 mb-3">
                                    Violations
                                </p>

                                <div className="space-y-2">
                                    {receiptData.violation_codes.map((code, index) => (
                                        <div
                                            key={index}
                                            className="flex justify-between items-center bg-red-100 rounded-sm px-3 py-2 shadow-sm"
                                        >
                                            <span className="text-red-700 font-medium">
                                                {code}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="border-t pt-4 text-center text-xs text-gray-400">
                                This document serves as an official violation record.
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            <div>
                <StudentEnrollmentModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    data={studentData}
                    loading={loading}
                />
            </div>

        </AppLayout>
    );
}
