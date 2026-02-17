import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function StatsBarChart({
  data = [],
  xKey = "violation_code",
  barKey = "count",
  height = 300,
  colors = ["#2563eb", "#efef04", "#dc2626", "#10b981", "#f97316", "#8b5cf6"],
}) {
  return (
    <div className="w-full p-2" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          <XAxis
            dataKey={xKey}
            tick={{ fontSize: 12 }}
            padding={{ left: 10, right: 10 }}
          />

          <YAxis tick={{ fontSize: 12 }} width={40} />

          <Tooltip />

          <Bar
            dataKey={barKey}
            radius={[4, 4, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
