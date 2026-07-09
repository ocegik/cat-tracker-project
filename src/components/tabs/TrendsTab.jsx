import ChartFrame from "../charts/ChartFrame";
import MultiSectionLineChart from "../charts/MultiSectionLineChart";
import AccuracyComparisonChart from "../charts/AccuracyComparisonChart";

export default function TrendsTab({ mocks, marksSeries, attemptRateSeries, sectionStats }) {
  const noData = mocks.length === 0 ? "Log a few mocks to see the trend line." : null;
  return (
    <div className="flex flex-col gap-4">
      <ChartFrame title="Section-wise trend — total marks" note="Primary view for spotting who's lagging" empty={noData}>
        <MultiSectionLineChart data={marksSeries} />
      </ChartFrame>
      <AccuracyComparisonChart sectionStats={sectionStats} />
      <ChartFrame title="Attempt-rate trend" note="% of section questions attempted" empty={noData}>
        <MultiSectionLineChart data={attemptRateSeries} suffix="%" domain={[0, 100]} />
      </ChartFrame>
    </div>
  );
}
