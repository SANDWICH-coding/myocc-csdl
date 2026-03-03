import { useState } from "react";

export default function ChangePasswordSection({ onSubmit, loading }) {
    const [show, setShow] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const isMismatch =
        newPassword && confirmPassword && newPassword !== confirmPassword;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(newPassword, confirmPassword);
        setNewPassword("");
        setConfirmPassword("");
    };

    return (
        <div className="bg-white rounded-lg border overflow-hidden">
            <button
                type="button"
                onClick={() => setShow(!show)}
                className="w-full p-5 text-left font-semibold"
            >
                Change Password
            </button>

            {show && (
                <form onSubmit={handleSubmit} className="p-5 space-y-3">
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full border rounded-md px-3 py-2"
                        required
                    />

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full border rounded-md px-3 py-2"
                        required
                    />

                    {isMismatch && (
                        <p className="text-red-500 text-sm">
                            Passwords do not match
                        </p>
                    )}

                    <button
                        disabled={loading || isMismatch}
                        className="w-full bg-indigo-600 text-white py-2 rounded-md disabled:opacity-50"
                    >
                        {loading ? "Changing..." : "Submit"}
                    </button>
                </form>
            )}
        </div>
    );
}