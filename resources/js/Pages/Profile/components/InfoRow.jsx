export default function InfoRow({ icon, label, value }) {
    return (
        <div className="flex items-start gap-3">
            <div className="text-indigo-500 mt-1">{icon}</div>
            <div>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm font-medium text-gray-700">{value}</p>
            </div>
        </div>
    );
}