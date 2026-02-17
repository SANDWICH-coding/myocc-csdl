import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Create({ auth, onSuccess }) {
    const [data, setData] = useState({
        user_id_no: "",
        first_name: "",
        last_name: "",
        middle_name: "",
        email_address: "",
        user_role: "",
    });

    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        const promise = axios.post("/manage-user/store", data);

        toast.promise(promise, {
            loading: "Creating user...",
            success: "User created successfully!",
            error: "Failed to create user",
        });

        try {
            await promise;
            onSuccess?.();
            setData({
                user_id_no: "",
                first_name: "",
                last_name: "",
                middle_name: "",
                email_address: "",
                user_role: "",
            });
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                console.error(error);
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">

            {/* First & Middle Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        First Name
                    </label>
                    <input
                        type="text"
                        value={data.first_name}
                        onChange={(e) => setData({ ...data, first_name: e.target.value })}
                        className={`w-full uppercase placeholder:normal-case px-3.5 py-2.5 text-sm border ${errors.first_name ? "border-red-300" : "border-gray-300"
                            } rounded-lg`}
                        placeholder="Enter first name"
                    />
                    {errors.first_name && (
                        <p className="mt-1.5 text-sm text-red-600">
                            {errors.first_name[0]}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Middle Name
                    </label>
                    <input
                        type="text"
                        value={data.middle_name}
                        onChange={(e) => setData({ ...data, middle_name: e.target.value })}
                        className="w-full uppercase placeholder:normal-case px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg"
                        placeholder="Enter middle name"
                    />
                </div>
            </div>

            {/* Last Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Last Name
                </label>
                <input
                    type="text"
                    value={data.last_name}
                    onChange={(e) => setData({ ...data, last_name: e.target.value })}
                    className={`w-full uppercase placeholder:normal-case px-3.5 py-2.5 text-sm border ${errors.last_name ? "border-red-300" : "border-gray-300"
                        } rounded-lg`}
                    placeholder="Enter last name"
                />
                {errors.last_name && (
                    <p className="mt-1.5 text-sm text-red-600">
                        {errors.last_name[0]}
                    </p>
                )}
            </div>

            {/* Email */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address
                </label>
                <input
                    type="email"
                    value={data.email_address}
                    onChange={(e) => setData({ ...data, email_address: e.target.value })}
                    className={`w-full px-3.5 py-2.5 text-sm border ${errors.email_address ? "border-red-300" : "border-gray-300"
                        } rounded-lg`}
                    placeholder="Enter email address"
                />
                {errors.email_address && (
                    <p className="mt-1.5 text-sm text-red-600">
                        {errors.email_address[0]}
                    </p>
                )}
            </div>

            {/* User ID & User Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* User ID */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        User ID No
                    </label>
                    <input
                        type="text"
                        value={data.user_id_no}
                        onChange={(e) => setData({ ...data, user_id_no: e.target.value })}
                        className={`w-full uppercase placeholder:normal-case px-3.5 py-2.5 text-sm border ${errors.user_id_no ? "border-red-300" : "border-gray-300"
                            } rounded-lg`}
                        placeholder="Enter user ID number"
                    />
                    {errors.user_id_no && (
                        <p className="mt-1.5 text-sm text-red-600">
                            {errors.user_id_no[0]}
                        </p>
                    )}
                </div>

                {/* User Role */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        User Role
                    </label>
                    <select
                        value={data.user_role}
                        onChange={(e) => setData({ ...data, user_role: e.target.value })}
                        className={`w-full px-3.5 py-2.5 text-sm border ${errors.user_role ? "border-red-300" : "border-gray-300"
                            } rounded-lg`}
                    >
                        <option value="" disabled>Select role</option>
                        <option value="security">Security Personnel</option>
                        <option value="admin">Administrator</option>
                        <option value="student">Student</option>
                    </select>
                    {errors.user_role && (
                        <p className="mt-1.5 text-sm text-red-600">
                            {errors.user_role[0]}
                        </p>
                    )}
                </div>

            </div>


            <button
                type="submit"
                disabled={processing}
                className="w-full px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
                {processing ? "Saving..." : "Save User"}
            </button>
        </form>
    );
}
