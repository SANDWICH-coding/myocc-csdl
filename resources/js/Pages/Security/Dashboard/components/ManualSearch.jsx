import { Loader2 } from 'lucide-react';
import { isValidStudentId } from '../../../../utils/validator';

export default function ManualSearch({ value, onChange, onSubmit, error, loading }) {
    const isValid = isValidStudentId(value); // check format

    return (
        <div className="flex flex-col max-w-md gap-1">
            <div className="flex gap-3 sm:flex-row">
                <input
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && isValid && !loading && onSubmit()}
                    placeholder="0000-0-00000"
                    className={`flex-1 rounded-lg border px-3 py-2 text-sm
                        focus:outline-none focus:ring-2 focus:ring-indigo-500
                        ${error ? 'border-red-500' : 'border-gray-300'}`}
                    disabled={loading} // optional: disable input while loading
                />

                <button
                    onClick={onSubmit}
                    disabled={!isValid || loading} // disable if invalid or loading
                    className={`px-4 py-2 rounded-lg text-white transition active:scale-95
                        ${isValid && !loading
                            ? 'bg-emerald-600 hover:bg-emerald-700'
                            : 'bg-gray-300 cursor-not-allowed'}`}
                >
                    {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin text-white" />
                    ) : (
                        'Confirm'
                    )}
                </button>
            </div>

            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        </div>
    );
}
