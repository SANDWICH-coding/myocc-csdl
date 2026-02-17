import { useState } from "react";
import { router } from "@inertiajs/react";
import AppLayout from "../../../Layouts/AppLayout";
import DataTable from "../../../Components/DataTable";
import { PlusIcon } from "@heroicons/react/20/solid";
import Create from "./Create";
import Update from "./Update"; // New import
import Modal from "../../../Components/Modal";
import toast from "react-hot-toast";

export default function Index({ auth, violations, filters, sanctions, defaultSanction }) {
    const user = auth?.user;
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedViolation, setSelectedViolation] = useState(null);

    const columns = [
        { key: "violation_code", label: "Code" },
        { key: "violation_description", label: "Description" },
    ];

    const handleSearch = (value) => {
        router.get(window.route("setup.violation.index"), { search: value }, { preserveState: true });
    };

    const handleSuccess = () => {
        setShowCreateModal(false);
        setShowUpdateModal(false);
        setSelectedViolation(null);
        router.reload({ only: ['violations', 'filters'] });
    };

    const handleEdit = (row) => {
        setSelectedViolation(row);
        setShowUpdateModal(true);
    };


    const [selectedDefault, setSelectedDefault] = useState(defaultSanction?.id || "");
    const [isUpdating, setIsUpdating] = useState(false);

    const handleDefaultChange = (e) => {
        const newId = e.target.value;

        // Optimistic update
        setSelectedDefault(newId);
        setIsUpdating(true);

        router.patch(
            `/sanctions/${newId}/set-default`,
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    toast.success("Default sanction updated successfully!");
                },
                onError: () => {
                    toast.error("Failed to update default sanction.");
                    setSelectedDefault(defaultSanction?.id || "");
                },
                onFinish: () => setIsUpdating(false),
            }
        );

    };


    return (
        <AppLayout user={user} breadcrumbs={["Setup", "Violations"]}>

            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-6 shadow-lg mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Setup Violations</h1>
                        <p className="text-blue-100 mt-1">
                            Configure and manage all violation types and rules.
                        </p>
                    </div>

                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-xl text-sm md:text-base font-semibold shadow-md flex items-center gap-2 transition-all duration-200">
                        <PlusIcon className="h-5 w-5" />
                        Create New
                    </button>
                </div>
            </div>

            <div className="bg-yellow-50 p-6 rounded-2xl mb-8 shadow-sm border border-yellow-200 max-w-md">
                <form className="space-y-6">

                    {/* Header */}
                    <div>
                        <h2 className="text-lg font-semibold text-yellow-900">
                            Default Sanction
                        </h2>
                        <p className="text-sm text-yellow-700 mt-1">
                            Set the default sanction that will automatically apply to new tickets.
                        </p>
                    </div>

                    {/* Dropdown Field */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="defaultSanction"
                            className="text-sm font-medium text-yellow-900"
                        >
                            Select Sanction
                        </label>

                        <select
                            value={selectedDefault}
                            onChange={handleDefaultChange}
                            disabled={isUpdating}
                            className={`w-full rounded-xl border px-4 py-3 text-sm shadow-sm transition duration-150 ease-in-out
    ${isUpdating
                                    ? "bg-yellow-100 border-yellow-400 cursor-not-allowed"
                                    : "bg-white border-yellow-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"}
    `}
                        >
                            <option value="" disabled>
                                Choose a sanction
                            </option>

                            {sanctions.map((sanction) => (
                                <option key={sanction.id} value={sanction.id}>
                                    {sanction.sanction_name}
                                </option>
                            ))}
                        </select>


                        {/* Helper Info */}
                        <div className="bg-yellow-100 border border-yellow-200 text-yellow-800 text-xs rounded-lg px-3 py-2 mt-1">
                            This is the default selection. You can still change it for individual tickets.
                        </div>

                        {isUpdating && (
                            <div className="text-xs text-yellow-700 flex items-center gap-2 mt-1">
                                <span className="animate-spin h-3 w-3 border-2 border-yellow-600 border-t-transparent rounded-full"></span>
                                Updating default sanction...
                            </div>
                        )}

                    </div>
                </form>
            </div>



            <DataTable
                columns={columns}
                data={violations}
                search={filters?.search || ""}
                onSearch={handleSearch}
                searchPlaceholder="Search violations..."
                actions={(row) => (
                    <div className="flex justify-end">
                        <button
                            onClick={() => handleEdit(row)}
                            className="text-blue-600 hover:underline text-sm"
                        >
                            Update
                        </button>
                    </div>
                )}
            />
            {/* Create Modal */}
            <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Violation">
                <Create auth={auth} onSuccess={handleSuccess} />
            </Modal>
            {/* Update Modal */}
            <Modal isOpen={showUpdateModal} onClose={() => setShowUpdateModal(false)} title="Update Violation">
                {selectedViolation && (
                    <Update auth={auth} violation={selectedViolation} onSuccess={handleSuccess} />
                )}
            </Modal>
        </AppLayout>
    );
}