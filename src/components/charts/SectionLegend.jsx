import { SECTIONS, SECTION_META } from "../../constants";

export default function SectionLegend() {
  return (
    <div className="flex gap-4 text-xs mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
      {SECTIONS.map((s) => (
        <span key={s} className="flex items-center gap-1.5">
          <span style={{ width: 10, height: 10, borderRadius: 3, background: SECTION_META[s].color, display: "inline-block" }} />
          {s}
        </span>
      ))}
    </div>
  );
}
