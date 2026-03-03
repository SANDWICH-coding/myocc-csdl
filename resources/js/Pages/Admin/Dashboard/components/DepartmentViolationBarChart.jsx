import { Copy } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function DepartmentViolationBarChart({
  data = [],
  violationCodes = [],
}) {

  const COLORS = [
    "#2563eb",
    "#f97316",
    "#dc2626",
    "#000000",
    "#efef04",
    "#8b5cf6"
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Violation Records
          </h2>
          <p className="text-sm text-gray-500">
            Comparison of violation records across departments
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end mb-4">
          <button
          >
            <Copy size={18} />
          </button>
        </div>
      </div>

      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="department_name"
              tick={{ fontSize: 12 }}
            />

            <YAxis tick={{ fontSize: 12 }} />

            <Tooltip />

            <Legend />

            {violationCodes.map((code, index) => (
              <Bar
                key={code}
                dataKey={code}
                fill={COLORS[index % COLORS.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
