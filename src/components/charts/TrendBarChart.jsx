import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
export default function TrendBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'currentColor', fontSize: 10}} interval={0} className="opacity-50" dy={10} />
        <YAxis axisLine={false} tickLine={false} tick={{fill: 'currentColor', fontSize: 12}} className="opacity-50" dx={0} tickFormatter={(val) => `${val/1000000}M`} />
        <Tooltip cursor={{fill: 'currentColor', opacity: 0.1}} contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)', borderRadius: '8px', fontSize: '13px' }} />
        <Bar dataKey="lastMonth" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Bulan Lalu" className="opacity-40" />
        <Bar dataKey="thisMonth" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Bulan Ini" />
      </BarChart>
    </ResponsiveContainer>
  );
}
