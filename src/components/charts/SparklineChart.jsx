import { ResponsiveContainer, LineChart, Line } from "recharts";
export default function SparklineChart({ data, color }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <Line 
          type="monotone" 
          dataKey="v" 
          stroke={color} 
          strokeWidth={2.5} 
          dot={false} 
          isAnimationActive={false} 
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
