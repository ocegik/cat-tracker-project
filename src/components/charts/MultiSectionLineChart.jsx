import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { COLORS, SECTIONS, SECTION_META } from "../../constants";
import SectionLegend from "./SectionLegend";

export default function MultiSectionLineChart({ data, suffix = "", domain }) {
  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
          <CartesianGrid stroke={COLORS.border} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11, fontFamily: "'Inter', sans-serif", fill: COLORS.inkMuted }} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fill: COLORS.inkMuted }}
            tickFormatter={(v) => `${v}${suffix}`} domain={domain || ["auto", "auto"]} />
          <Tooltip formatter={(v) => (v === null ? "—" : `${v}${suffix}`)}
            contentStyle={{ fontFamily: "'Inter', sans-serif", borderRadius: 8, border: `1px solid ${COLORS.border}` }} />
          {SECTIONS.map((s) => (
            <Line key={s} type="monotone" dataKey={s} stroke={SECTION_META[s].color} strokeWidth={2.5}
              dot={{ r: 3 }} connectNulls name={s} />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <SectionLegend />
    </div>
  );
}
