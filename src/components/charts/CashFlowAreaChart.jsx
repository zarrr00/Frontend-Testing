import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
export default function CashFlowAreaChart({ data, isMobile = false }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={isMobile ? { top: 10, right: 15, left: -5, bottom: 15 } : { top: 10, right: 20, left: 10, bottom: 0 }}>
        <defs>
          <linearGradient id={isMobile ? "fillIncomeMobile" : "colorIncome"} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={isMobile ? 0.3 : 0.2}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id={isMobile ? "fillExpenseMobile" : "colorExpense"} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f43f5e" stopOpacity={isMobile ? 0.3 : 0.2}/>
            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isMobile ? "currentColor" : "var(--border)"} className={isMobile ? "opacity-10" : ""} opacity={isMobile ? undefined : 0.6} />
        <XAxis dataKey={isMobile ? "day" : "month"} axisLine={false} tickLine={false} tick={{fill: 'currentColor', fontSize: isMobile ? 10 : 11}} className={isMobile ? "opacity-50" : "text-muted-foreground"} dy={10} />
        <YAxis axisLine={false} tickLine={false} tick={{fill: 'currentColor', fontSize: isMobile ? 10 : 11}} className={isMobile ? "opacity-50" : "text-muted-foreground"} dx={isMobile ? 0 : -5} tickFormatter={(val) => isMobile ? `${val/1000000}M` : `Rp${val/1000}k`} />
        <Tooltip 
          contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)', borderRadius: '8px', fontSize: '12px' }}
        />
        <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill={`url(#${isMobile ? "fillIncomeMobile" : "colorIncome"})`} />
        <Area type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill={`url(#${isMobile ? "fillExpenseMobile" : "colorExpense"})`} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
