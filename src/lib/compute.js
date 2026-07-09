import { SECTIONS } from "../constants";
import { fmtDate, fmtPct } from "./format";

export function computeDerived(e) {
  const attempted = e.attemptedMCQ + e.attemptedTITA;
  const right = e.rightMCQ + e.rightTITA;
  const unattempted = e.totalQuestions - attempted;
  const totalMarks = e.rightMCQ * 3 + e.rightTITA * 3 - e.wrongMCQ * 1 + e.wrongTITA * 0;
  const overallAccuracy = attempted > 0 ? right / attempted : null;
  const mcqAccuracy = e.attemptedMCQ > 0 ? e.rightMCQ / e.attemptedMCQ : null;
  const titaAccuracy = e.attemptedTITA > 0 ? e.rightTITA / e.attemptedTITA : null;
  const attemptRate = e.totalQuestions > 0 ? attempted / e.totalQuestions : null;
  const marksPerAttempt = attempted > 0 ? totalMarks / attempted : null;
  const negMarksLost = e.wrongMCQ * 1;
  const hardnessRatio = e.topperScore ? totalMarks / e.topperScore : null;
  return {
    ...e, attempted, unattempted, totalMarks, overallAccuracy, mcqAccuracy,
    titaAccuracy, attemptRate, marksPerAttempt, negMarksLost, hardnessRatio,
  };
}

export const byDateAsc = (a, b) => (a.date === b.date ? a.createdAt - b.createdAt : a.date < b.date ? -1 : 1);

export function rollingSeries(sortedEntries, window = 5) {
  return sortedEntries.map((e, i, arr) => {
    const slice = arr.slice(Math.max(0, i - (window - 1)), i + 1);
    const avg = (key) => {
      const vals = slice.map((s) => s[key]).filter((v) => v !== null && v !== undefined && !isNaN(v));
      return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
    };
    return {
      ...e,
      rollAccuracy: avg("overallAccuracy"),
      rollAttemptRate: avg("attemptRate"),
      rollMcqAccuracy: avg("mcqAccuracy"),
      rollTitaAccuracy: avg("titaAccuracy"),
      rollMarks: avg("totalMarks"),
    };
  });
}

export function buildMockPivot(entries) {
  const map = new Map();
  entries.forEach((e) => {
    const key = `${e.date}||${e.source}`;
    if (!map.has(key)) map.set(key, { key, date: e.date, source: e.source, createdAt: e.createdAt });
    map.get(key)[e.section] = e;
    map.get(key).createdAt = Math.min(map.get(key).createdAt, e.createdAt);
  });
  const mocks = Array.from(map.values()).sort((a, b) => (a.date === b.date ? a.createdAt - b.createdAt : a.date < b.date ? -1 : 1));
  return mocks.map((m) => ({ ...m, label: `${fmtDate(m.date)} · ${m.source}` }));
}

export function buildSeries(mocks, accessor) {
  return mocks.map((m) => ({
    label: m.label,
    VARC: m.VARC ? accessor(m.VARC) : null,
    DILR: m.DILR ? accessor(m.DILR) : null,
    Quant: m.Quant ? accessor(m.Quant) : null,
  }));
}

export function analyzeWeakest(entriesWithComputed) {
  const perSection = {};
  SECTIONS.forEach((sec) => {
    const list = rollingSeries(entriesWithComputed.filter((e) => e.section === sec).sort(byDateAsc));
    perSection[sec] = { list, latest: list.length ? list[list.length - 1] : null };
  });
  const withData = SECTIONS.filter((s) => perSection[s].latest);
  if (withData.length === 0) return null;

  const scored = withData.map((s) => {
    const l = perSection[s].latest;
    const acc = l.rollAccuracy ?? 0;
    const ar = l.rollAttemptRate ?? 0;
    return { section: s, score: acc * ar, acc, ar, mcqAcc: l.rollMcqAccuracy, titaAcc: l.rollTitaAccuracy };
  });
  const bySc = [...scored].sort((a, b) => a.score - b.score);
  const weakest = bySc[0];
  const lowestAcc = [...scored].sort((a, b) => a.acc - b.acc)[0];
  const lowestAR = [...scored].sort((a, b) => a.ar - b.ar)[0];

  let driver = "a combined effect";
  if (lowestAcc.section === weakest.section && lowestAR.section === weakest.section) driver = "both an accuracy problem and an attempt-rate problem";
  else if (lowestAcc.section === weakest.section) driver = "primarily an accuracy problem";
  else if (lowestAR.section === weakest.section) driver = "primarily an attempt-rate problem";

  let subtype = null;
  if (weakest.mcqAcc !== null && weakest.titaAcc !== null) subtype = weakest.mcqAcc <= weakest.titaAcc ? "MCQ" : "TITA";
  else if (weakest.mcqAcc !== null) subtype = "MCQ";
  else if (weakest.titaAcc !== null) subtype = "TITA";

  let trendNote = "";
  const list = perSection[weakest.section].list;
  if (subtype && list.length >= 2) {
    const key = subtype === "MCQ" ? "rollMcqAccuracy" : "rollTitaAccuracy";
    const recent = list[list.length - 1][key];
    const priorIdx = Math.max(0, list.length - 4);
    const prior = list[priorIdx][key];
    if (recent !== null && prior !== null && priorIdx !== list.length - 1) {
      if (recent < prior - 0.03) trendNote = ` ${subtype} accuracy has slipped over the last few mocks (${fmtPct(prior)} → ${fmtPct(recent)}).`;
      else if (recent > prior + 0.03) trendNote = ` ${subtype} accuracy is actually trending up (${fmtPct(prior)} → ${fmtPct(recent)}), even though it's still the softest spot.`;
      else trendNote = ` ${subtype} accuracy has held steady around ${fmtPct(recent)}.`;
    }
  }

  const note = `${weakest.section} is the weakest section right now — rolling accuracy of ${fmtPct(weakest.acc)} and attempt rate of ${fmtPct(weakest.ar)} suggest ${driver}${subtype ? `, with ${subtype} being the weaker half.` : "."}${trendNote}`;
  return { weakestSection: weakest.section, scored, note };
}
