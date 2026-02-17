import Modal from '@/Components/Modal';
import { User } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ViolationModal({
    open,
    onClose,
    onSubmit,
    student,
    currentEnrollment,
    violations,
    loading,
    submitting,
}) {

    const [selected, setSelected] = useState([]);

    const toggleViolation = (id) => {
        setSelected(prev =>
            prev.includes(id)
                ? prev.filter(v => v !== id)
                : [...prev, id]
        );
    };

    useEffect(() => {
        if (!open) {
            setSelected([]);
        }
    }, [open]);


    return (
        <Modal isOpen={open} onClose={onClose} title="Select Violations">
            <div className="space-y-6">

                {/* Student Summary */}
                {student && (
                    <div className="rounded-xl  border bg-gray-50 p-4">
                        <div className="flex items-center gap-4">
                            {/* Avatar */}
                            <div className="shrink-0">
                                <div
                                    className="h-16 w-16 rounded-full bg-gray-100 overflow-hidden
                       flex items-center justify-center
                       ring-2 ring-blue-500 ring-offset-4 ring-offset-white"
                                >
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

                            {/* Text block */}
                            <div className="leading-tight">
                                <div className="text-lg font-semibold text-gray-900">
                                    {student.last_name}
                                </div>
                                <div className="text-sm text-gray-600">
                                    {student.first_name} {student.middle_name}
                                </div>
                                <div className="text-xs text-gray-500 font-mono">
                                    {student.user_id_no}
                                </div>
                            </div>
                            {/* 
                            <p className="font-medium text-gray-900">
                                {currentEnrollment.year_section.school_year.id}
                                {currentEnrollment.year_section.school_year.semester_id}
                            </p> */}
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {loading && (
                        <p className="text-sm text-gray-500">Loading violations…</p>
                    )}
                    {!loading && violations.map(v => {
                        const isSelected = selected.includes(v.id);

                        return (
                            <label
                                key={v.id}
                                className={`
                flex items-center gap-3 p-3 rounded-lg cursor-pointer transition
                border
                ${isSelected
                                        ? 'bg-violet-50 ring-1 ring-violet-300'
                                        : 'border-gray-200 hover:bg-gray-50'}
            `}
                            >
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => toggleViolation(v.id)}
                                    className="h-4 w-4 text-violet-600"
                                />

                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {v.violation_code}
                                    </p>
                                </div>
                            </label>
                        );
                    })}


                    <div className="flex justify-end gap-2 pt-4">

                        {/* Processing message replaces Cancel */}
                        {submitting ? (
                            <div className="px-4 py-2 text-sm text-gray-600">
                                Processing. Please don't close the app.
                            </div>
                        ) : (
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-sm rounded-lg border"
                            >
                                Cancel
                            </button>
                        )}

                        <button
                            disabled={selected.length === 0 || submitting}
                            onClick={() => onSubmit(selected)}
                            className="px-4 py-2 text-sm rounded-lg bg-violet-600 text-white disabled:opacity-50 flex items-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                "CONFIRM"
                            )}
                        </button>
                    </div>

                </div>

            </div>
        </Modal>
    );
}
