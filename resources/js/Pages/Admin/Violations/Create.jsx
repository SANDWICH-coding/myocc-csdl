import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Create({ onSuccess }) {
    const [data, setData] = useState({
        violation_code: "",
        violation_description: "",
        status: true,
    });

    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        // Use relative URL so it works in production
        const promise = axios.post("/setup/violation", data);

        toast.promise(promise, {
            loading: "Creating violation...",
            success: "Violation created successfully!",
            error: "Failed to create violation",
        });

        try {
            await promise;

            onSuccess?.(); // auto-close modal + refresh table

            // Reset form
            setData({
                violation_code: "",
                violation_description: "",
                status: true,
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

            {/* VIOLATION CODE */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Violation Code
                </label>
                <input
                    type="text"
                    value={data.violation_code}
                    onChange={(e) =>
                        setData({ ...data, violation_code: e.target.value })
                    }
                    placeholder="Enter violation code"
                    className={`w-full px-3.5 uppercase placeholder:normal-case py-2.5 text-sm border rounded-lg ${errors.violation_code ? "border-red-300" : "border-gray-300"
                        }`}
                />
                {errors.violation_code && (
                    <p className="text-red-600 text-sm mt-1.5">
                        {errors.violation_code[0]}
                    </p>
                )}
            </div>

            {/* DESCRIPTION */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Description
                </label>
                <textarea
                    rows={4}
                    value={data.violation_description}
                    onChange={(e) =>
                        setData({ ...data, violation_description: e.target.value })
                    }
                    placeholder="Optional description"
                    className={`w-full px-3.5 py-2.5 text-sm border rounded-lg ${errors.violation_description ? "border-red-300" : "border-gray-300"
                        }`}
                />
                {errors.violation_description && (
                    <p className="text-red-600 text-sm mt-1.5">
                        {errors.violation_description[0]}
                    </p>
                )}
            </div>

            {/* STATUS */}
            <input
                type="checkbox"
                hidden
                checked={data.status}
                onChange={(e) => setData({ ...data, status: e.target.checked })}
            />

            <button
                type="submit"
                disabled={processing}
                className="w-full px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 transition disabled:opacity-50"
            >
                {processing ? "Saving..." : "Save Violation"}
            </button>
        </form>
    );
}
