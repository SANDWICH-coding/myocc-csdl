import { User, IdCardLanyard, Cake, VenusAndMars, AtSign, Phone, MapPinHouse, CircleSmall, Calendar, Mail } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";

export default function StudentEnrollmentModal({ open, onClose, data, loading }) {

    const [activeTab, setActiveTab] = useState("personal");

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [onClose]);

    if (!open) return null;

    const student = data?.[0];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-xl w-full max-w-3xl p-6 relative shadow-xl transform transition-transform scale-95 animate-scaleIn">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-200 transition"
                    aria-label="Close Modal"
                >
                    ✕
                </button>

                {loading && (
                    <div className="flex flex-col items-center py-10 space-y-2">
                        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-10 w-10"></div>
                        <p className="text-gray-500">Loading user data…</p>
                    </div>
                )}

                {!loading && student && (
                    <>
                        {/* Student Info */}
                        <div className="border-b pb-4">
                            <div className="flex items-start gap-4">
                                <div className="flex items-center gap-6">
                                    {/* Avatar */}
                                    <div className="relative shrink-0">
                                        <div className="h-20 w-20 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center
                  ring-2 ring-blue-500 ring-offset-4 ring-offset-white">
                                            {student.avatar ? (
                                                <img
                                                    src={student.avatar}
                                                    alt="Student Avatar"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <User className="h-10 w-10 text-gray-400" />
                                            )}
                                        </div>
                                    </div>


                                    {/* Name */}
                                    <div className="flex flex-col">

                                        {/* Middle + Last Name */}
                                        <p className="text-2xl font-bold text-gray-900 leading-tight">
                                            {student.last_name}
                                        </p>

                                        {/* First Name */}
                                        <h2 className="text-lg font-semibold text-gray-600 ">
                                            {student.first_name} {student.middle_name && `${student.middle_name} `}
                                        </h2>
                                    </div>
                                </div>

                            </div>
                        </div>


                        {/* Tabs */}
                        <div className="flex border-b mb-6">
                            {[
                                { key: "personal", label: "Basic Info" },
                                { key: "enrollment", label: "Current Enrollment" },
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`
                px-4 py-2 text-sm font-medium border-b-2 transition
                ${activeTab === tab.key
                                            ? "border-blue-600 text-blue-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700"
                                        }
            `}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {activeTab === "personal" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="flex items-start gap-3">
                                    <div className="text-indigo-500 mt-1"><IdCardLanyard /></div>
                                    <div>
                                        <p className="text-xs text-gray-400">ID No</p>
                                        <p className="text-sm font-medium text-gray-700">{student.user_id_no}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="text-indigo-500 mt-1"><Calendar /></div>
                                    <div>
                                        <p className="text-xs text-gray-400">Birthday</p>
                                        <p className="text-sm font-medium text-gray-700">{student.birthday}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="text-indigo-500 mt-1"><VenusAndMars /></div>
                                    <div>
                                        <p className="text-xs text-gray-400">Gender</p>
                                        <p className="text-sm font-medium text-gray-700">{student.gender}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="text-indigo-500 mt-1"><Mail /></div>
                                    <div>
                                        <p className="text-xs text-gray-400">Email</p>
                                        <p className="text-sm font-medium text-gray-700">{student.email_address}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="text-indigo-500 mt-1"><Phone /></div>
                                    <div>
                                        <p className="text-xs text-gray-400">Contact Number</p>
                                        <p className="text-sm font-medium text-gray-700">{student.contact_number}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="text-indigo-500 mt-1"><MapPinHouse /></div>
                                    <div>
                                        <p className="text-xs text-gray-400">Present Address</p>
                                        <p className="text-sm font-medium text-gray-700">{student.present_address} {student.zip_code}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "enrollment" && (
                            <>

                                {(() => {
                                    const currentEnrollments =
                                        student.enrolled_students?.filter(
                                            (enroll) =>
                                                enroll.year_section.school_year?.is_current === 1
                                        ) || [];

                                    if (currentEnrollments.length === 0) {
                                        return (
                                            <p className="text-gray-400 text-center py-4">
                                                Not enrolled in the current semester
                                            </p>
                                        );
                                    }

                                    return (
                                        <div className="space-y-4 max-h-72 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                            {currentEnrollments.map((enroll) => {
                                                const course = enroll.year_section.course;
                                                const department = course.department;
                                                const yearLevel = enroll.year_section.year_level;
                                                const schoolYear = enroll.year_section.school_year;

                                                return (
                                                    <div
                                                        key={enroll.id}
                                                        className="relative bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200"
                                                    >
                                                        {/* Top Section */}
                                                        <div className="relative z-10 space-y-2">
                                                            {/* Department */}
                                                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                                                                Department
                                                            </p>
                                                            <h3 className="text-base font-semibold text-gray-800">
                                                                {department.department_name}
                                                            </h3>

                                                            {/* Divider */}
                                                            <div className="border-t my-2"></div>

                                                            {/* Info Grid */}
                                                            <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                                                                <div>
                                                                    <p className="text-xs text-gray-400">Course</p>
                                                                    <p className="font-medium text-gray-700">
                                                                        {course.course_name_abbreviation}
                                                                    </p>
                                                                </div>

                                                                <div>
                                                                    <p className="text-xs text-gray-400">Year Level</p>
                                                                    <p className="font-medium text-gray-700">
                                                                        {yearLevel.year_level_name}
                                                                    </p>
                                                                </div>

                                                                <div>
                                                                    <p className="text-xs text-gray-400">Semester</p>
                                                                    <p className="font-medium text-gray-700">
                                                                        {schoolYear.semester?.semester_name}
                                                                    </p>
                                                                </div>

                                                                <div>
                                                                    <p className="text-xs text-gray-400">Section</p>
                                                                    <p className="font-medium text-gray-700">
                                                                        {enroll.year_section.section}
                                                                    </p>
                                                                </div>



                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>


                                    );
                                })()}
                            </>
                        )}
                    </>
                )}
            </div>

            {/* Spinner Styles */}
            <style>{`
    .loader {
        border-top-color: #6366f1;
        animation: spin 1s linear infinite;
    }
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    .animate-scaleIn {
        animation: scaleIn 0.15s ease-out forwards;
    }
    @keyframes scaleIn {
        0% { opacity: 0; transform: scale(0.95); }
        100% { opacity: 1; transform: scale(1); }
    }
`}</style>

        </div >
    );
}
