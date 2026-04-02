import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Label } from "recharts";
import { useMode } from "@/contexts/ModeContext";
export default function CategoryPieChart({ data }) {
  const { theme } = useMode();
  // Warna teks label tengah: Putih buat dark mode, Hitam buat light mode
  const textColor = theme === "dark" ? "#ffffff" : "#000000";
  // Mapping data kategori biar namanya otomatis berubah bahasa
  const translatedData = data.map(item => ({
    ...item,
    name: item.name === 'Operasional' ? "Operasional" : 
          item.name === 'Bahan Baku' ? "Bahan Baku" : "Lain-lain"
  }));
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={translatedData}
          cx="50%"
          cy="50%"
          innerRadius={65}
          outerRadius={85}
          paddingAngle={5}
          dataKey="value"
          stroke="none"
        >
          {translatedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
          {/* INI PERBAIKANNYA: Label tengah yang warnanya dinamis */}
          <Label
            value={translatedData[0]?.name || ""}
            position="center"
            fill={textColor}
            style={{ fontSize: '12px', fontWeight: 'bold' }}
          />
        </Pie>
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'var(--card)', 
            borderColor: 'var(--border)', 
            color: 'var(--foreground)', 
            borderRadius: '8px', 
            fontSize: '12px' 
          }} 
          itemStyle={{ color: 'var(--foreground)' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}