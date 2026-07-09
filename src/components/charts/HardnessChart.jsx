import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { COLORS, SECTIONS, SECTION_META } from "../../constants";
import ChartFrame from "./ChartFrame";
import SectionLegend from "./SectionLegend";

export default function HardnessChart({ data, empty }) {
  return (
    <ChartFrame title="Exam hardness indicator" note="Your score as % of that mock's topper score" empty={empty}>
      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
            <CartesianGrid stroke={COLORS.border} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fontFamily: "'Inter', sans-serif", fill: COLORS.inkMuted }} />
            <YAxis tick={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fill: COLORS.inkMuted }} tickFormatter={(v) => `${v}%`} />
            <Tooltip formatter={(v) => (v === null ? "—" : `${v}%`)} contentStyle={{ fontFamily: "'Inter', sans-serif", borderRadius: 8, border: `1px solid ${COLORS.border}` }} />
            <ReferenceLine y={100} stroke={COLORS.inkMuted} strokeDasharray="4 4" label={{ value: "Topper", position: "insideTopRight", fill: COLORS.inkMuted, fontSize: 11 }} />
            {SECTIONS.map((s) => (
              <Line key={s} type="monotone" dataKey={s} stroke={SECTION_META[s].color} strokeWidth={2.5} dot={{ r: 3 }} connectNulls name={s} />
            ))}
          </LineChart>
        </ResponsiveContainer>
        <SectionLegend />
      </div>
    </ChartFrame>
  );
}
