import AppLayout from "../../../Layouts/AppLayout";
import { PlusIcon } from "@heroicons/react/20/solid";
import UsersGrid from "@/Components/UsersGrid";
import { useState } from "react";
import Modal from "../../../Components/Modal";
import Create from "./Create";

export default function Index({ auth, users, filters }) {
    const user = auth?.user;
    const [showCreateModal, setShowCreateModal] = useState(false);

    const handleSuccess = () => {
        setShowCreateModal(false);
        setShowUpdateModal(false);
        setSelectedViolation(null);
        router.reload({ only: ['violations', 'filters'] });
    };

    return (
        <AppLayout user={user} breadcrumbs={["Manage", "Users"]}>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-6 shadow-lg mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            User Management
                        </h1>
                        <p className="text-blue-100 mt-1">
                            Configure and manage all users.
                        </p>
                    </div>

                    <button
                        onClick={() => setShowCreateModal(true)}

                        className="bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-xl font-semibold shadow-md flex items-center gap-2 transition">
                        <PlusIcon className="h-5 w-5" />
                        Create New
                    </button>
                </div>
            </div>

            {/* Users Grid */}
            <UsersGrid users={users} filters={filters} />

            <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create User">
                <Create auth={auth} onSuccess={handleSuccess} />
            </Modal>

        </AppLayout>
    );
}
