import { LineChart as LineChartIcon } from "lucide-react";
import { COLORS } from "../../constants";
import EmptyState from "../ui/EmptyState";

export default function ChartFrame({ title, note, children, empty }) {
  return (
    <div className="p-4 flex flex-col gap-3" style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12 }}>
      <div className="flex items-baseline justify-between flex-wrap gap-2">
        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: COLORS.ink }}>{title}</h3>
        {note && <span className="text-xs" style={{ color: COLORS.inkMuted }}>{note}</span>}
      </div>
      {empty ? <EmptyState icon={LineChartIcon} title="Not enough data yet" body={empty} /> : children}
    </div>
  );
}
