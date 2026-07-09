import { SECTIONS } from "../constants";
import { uid } from "./format";
import { REQUIRED_FIELDS } from "./formSchema";

export function toRaw(entries) {
  return entries.map(({ id, createdAt, date, source, section, attemptedMCQ, attemptedTITA, rightMCQ, rightTITA, wrongMCQ, wrongTITA, totalQuestions, percentile, topperScore }) => ({
    id, createdAt, date, source, section, attemptedMCQ, attemptedTITA, rightMCQ, rightTITA, wrongMCQ, wrongTITA, totalQuestions, percentile, topperScore,
  }));
}

export function downloadJSON(entries) {
  const blob = new Blob([JSON.stringify(toRaw(entries), null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `scores-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function normalizeImported(raw) {
  if (!Array.isArray(raw)) throw new Error('File must contain a JSON array of entries.');
  return raw.map((item, idx) => {
    for (const f of REQUIRED_FIELDS) {
      if (item[f] === undefined || item[f] === null || item[f] === "") {
        throw new Error(`Entry ${idx + 1} is missing "${f}".`);
      }
    }
    if (!SECTIONS.includes(item.section)) throw new Error(`Entry ${idx + 1} has an invalid section: "${item.section}".`);
    return {
      id: item.id || uid(),
      createdAt: item.createdAt || Date.now() + idx,
      date: item.date,
      source: String(item.source),
      section: item.section,
      attemptedMCQ: Number(item.attemptedMCQ),
      attemptedTITA: Number(item.attemptedTITA),
      rightMCQ: Number(item.rightMCQ),
      rightTITA: Number(item.rightTITA),
      wrongMCQ: Number(item.wrongMCQ),
      wrongTITA: Number(item.wrongTITA),
      totalQuestions: Number(item.totalQuestions),
      percentile: item.percentile === undefined || item.percentile === null || item.percentile === "" ? null : Number(item.percentile),
      topperScore: item.topperScore === undefined || item.topperScore === null || item.topperScore === "" ? null : Number(item.topperScore),
    };
  });
}
