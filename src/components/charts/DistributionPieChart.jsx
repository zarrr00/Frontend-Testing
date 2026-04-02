import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { formatIDR } from "@/utils/currency"; // we created this earlier! Wait, I should import formatIDR correctly
export default function DistributionPieChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={90}
          paddingAngle={5}
          dataKey="value"
          stroke="none"
        >
          {data.map((entry, index) => (
             <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value)}
          contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)', borderRadius: '8px', fontSize: '13px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
