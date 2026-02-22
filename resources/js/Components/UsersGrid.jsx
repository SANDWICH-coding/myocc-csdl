import { useState } from "react";
import { router } from "@inertiajs/react";
import axios from "axios";
import { UserIcon } from "@heroicons/react/24/outline";
import StudentEnrollmentModal from "./StudentEnrollmentModal";

function getRoleBadgeColor(role) {
    switch (role?.toLowerCase()) {
        case "admin":
            return "bg-red-500";
        case "security":
            return "bg-green-500";
        case "student":
            return "bg-blue-500";
        case "moderator":
            return "bg-purple-500";
        default:
            return "bg-gray-400"; // fallback
    }
}


export default function UsersGrid({ users, filters }) {
    const [search, setSearch] = useState(filters.search || "");

    const handleSearch = (e) => {
        e.preventDefault();
        router.get("/manage-user", { search }, { preserveState: true });
    };

    const handlePageChange = (url) => {
        if (!url) return;
        router.get(url, {}, { preserveScroll: true, preserveState: true });
    };

    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [studentData, setStudentData] = useState(null);

    const openStudentModal = async (userIdNo) => {
        setModalOpen(true);
        setLoading(true);
        setStudentData(null);

        try {
            const res = await axios.get(
                "/admin/student-enrollment",
                {
                    params: {
                        "user_id_no[]": userIdNo
                    }
                }
            );

            setStudentData(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <div className="space-y-4">
                {/* Search */}
                <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border border-gray-300 px-4 py-2 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
                    >
                        Search
                    </button>
                </form>

                {/* GRID */}
                <div className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
                gap-4
            ">
                    {users.data.map((user) => (
                        <div
                            key={user.id}
                            onClick={() => {
                                if (user.user_role?.toLowerCase() === "student") {
                                    openStudentModal(user.user_id_no);
                                }
                            }}

                            className={`
    rounded-xl
    border
    bg-white
    p-4
    shadow-sm
    transition
    flex
    items-center
    gap-3
    ${user.user_role?.toLowerCase() === "student"
                                    ? "cursor-pointer hover:shadow-md"
                                    : "cursor-default opacity-70"
                                }
`}

                        >

                            {/* Avatar with border and padding */}
                            <div className="p-1 rounded-full border border-gray-300">
                                <div className="
        w-12
        h-12
        rounded-full
        bg-gray-100
        flex
        items-center
        justify-center
        text-gray-400
        shrink-0
    ">
                                    {user.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt="Avatar"
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <UserIcon className="w-6 h-6" />
                                    )}
                                </div>
                            </div>


                            {/* Info */}
                            <div className="min-w-0">
                                <div className="font-mono  text-md text-gray-800 truncate">
                                    {user.user_id_no}
                                </div>
                                <div>
                                    <span
                                        className={`
                inline-block
                text-[10px]
                text-white
                px-3
                py-1
                rounded-md
                capitalize
                ${getRoleBadgeColor(user.user_role)}
            `}
                                    >
                                        {user.user_role}
                                    </span>
                                </div>
                            </div>


                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {users.last_page > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-4">
                        <button
                            disabled={!users.prev_page_url}
                            onClick={() => handlePageChange(users.prev_page_url)}
                            className="px-4 py-2 rounded-xl border disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="px-2">
                            Page {users.current_page} of {users.last_page}
                        </span>
                        <button
                            disabled={!users.next_page_url}
                            onClick={() => handlePageChange(users.next_page_url)}
                            className="px-4 py-2 rounded-xl border disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            <div>
                <StudentEnrollmentModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    data={studentData}
                    loading={loading}
                />
            </div>

        </>

    );

}

