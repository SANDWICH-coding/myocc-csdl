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

      <div className="mb-4">
        <h2 className="text-base md:text-lg font-semibold text-gray-800">
          Violation Statistics Per Department
        </h2>
        <p className="text-xs text-gray-500">
          Comparison of violations by department
        </p>
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
