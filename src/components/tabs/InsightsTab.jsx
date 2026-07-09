import { SECTIONS, SECTION_META } from "../../constants";
import StatCard from "../ui/StatCard";
import WeakestSectionCard from "../charts/WeakestSectionCard";
import ChartFrame from "../charts/ChartFrame";
import MultiSectionLineChart from "../charts/MultiSectionLineChart";
import SourceComparisonChart from "../charts/SourceComparisonChart";
import HardnessChart from "../charts/HardnessChart";

export default function InsightsTab({
  entriesWithComputed, mocks, marksSeries, attemptRateSeries, percentileSeries,
  hardnessSeries, hasPercentile, hasTopper, weakestAnalysis,
}) {
  const noMockData = mocks.length === 0 ? "Log mocks to populate this." : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Mocks logged" value={mocks.length} />
        {SECTIONS.map((s) => (
          <StatCard key={s} label={`${s} entries`} value={entriesWithComputed.filter((e) => e.section === s).length} accent={SECTION_META[s].color} />
        ))}
      </div>

      <WeakestSectionCard analysis={weakestAnalysis} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartFrame title="Section trend (marks)" empty={noMockData}>
          <MultiSectionLineChart data={marksSeries} />
        </ChartFrame>
        <ChartFrame title="Attempt-rate trend" empty={noMockData}>
          <MultiSectionLineChart data={attemptRateSeries} suffix="%" domain={[0, 100]} />
        </ChartFrame>
      </div>

      <SourceComparisonChart entriesWithComputed={entriesWithComputed} />

      <ChartFrame title="Percentile trend" note="Renders only where percentile was logged"
        empty={!hasPercentile ? "Add a percentile to any entry to unlock this chart." : null}>
        <MultiSectionLineChart data={percentileSeries} suffix="ile" domain={[0, 100]} />
      </ChartFrame>

      <HardnessChart data={hardnessSeries} empty={!hasTopper ? "Add a topper score to any entry to unlock this chart." : null} />
    </div>
  );
}
