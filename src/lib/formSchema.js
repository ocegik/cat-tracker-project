import { uid } from "./format";

export const EMPTY_FORM = {
  date: "", source: "", section: "VARC",
  attemptedMCQ: "", attemptedTITA: "", rightMCQ: "", rightTITA: "",
  wrongMCQ: "", wrongTITA: "", totalQuestions: "", percentile: "", topperScore: "",
};

export function entryToForm(e) {
  return {
    date: e.date, source: e.source, section: e.section,
    attemptedMCQ: String(e.attemptedMCQ), attemptedTITA: String(e.attemptedTITA),
    rightMCQ: String(e.rightMCQ), rightTITA: String(e.rightTITA),
    wrongMCQ: String(e.wrongMCQ), wrongTITA: String(e.wrongTITA),
    totalQuestions: String(e.totalQuestions),
    percentile: e.percentile === null || e.percentile === undefined ? "" : String(e.percentile),
    topperScore: e.topperScore === null || e.topperScore === undefined ? "" : String(e.topperScore),
  };
}

export function formToEntry(form, existing) {
  return {
    id: existing?.id || uid(),
    createdAt: existing?.createdAt || Date.now(),
    date: form.date,
    source: form.source.trim(),
    section: form.section,
    attemptedMCQ: Number(form.attemptedMCQ),
    attemptedTITA: Number(form.attemptedTITA),
    rightMCQ: Number(form.rightMCQ),
    rightTITA: Number(form.rightTITA),
    wrongMCQ: Number(form.wrongMCQ),
    wrongTITA: Number(form.wrongTITA),
    totalQuestions: Number(form.totalQuestions),
    percentile: form.percentile === "" ? null : Number(form.percentile),
    topperScore: form.topperScore === "" ? null : Number(form.topperScore),
  };
}

export const REQUIRED_FIELDS = ["date", "source", "section", "attemptedMCQ", "attemptedTITA", "rightMCQ", "rightTITA", "wrongMCQ", "wrongTITA", "totalQuestions"];
export const NUMERIC_FIELDS = ["attemptedMCQ", "attemptedTITA", "rightMCQ", "rightTITA", "wrongMCQ", "wrongTITA", "totalQuestions"];

export function validateForm(form) {
  const errors = {};
  REQUIRED_FIELDS.forEach((f) => {
    if (form[f] === "" || form[f] === null || form[f] === undefined) errors[f] = "Required";
  });
  NUMERIC_FIELDS.forEach((f) => {
    if (form[f] !== "" && (isNaN(Number(form[f])) || Number(form[f]) < 0)) errors[f] = "Must be a number ≥ 0";
  });
  if (!errors.attemptedMCQ && !errors.rightMCQ && !errors.wrongMCQ) {
    const sum = Number(form.rightMCQ) + Number(form.wrongMCQ);
    if (sum !== Number(form.attemptedMCQ)) errors.attemptedMCQ = `Right + Wrong MCQ (${sum}) should equal Attempted MCQ`;
  }
  if (!errors.attemptedTITA && !errors.rightTITA && !errors.wrongTITA) {
    const sum = Number(form.rightTITA) + Number(form.wrongTITA);
    if (sum !== Number(form.attemptedTITA)) errors.attemptedTITA = `Right + Wrong TITA (${sum}) should equal Attempted TITA`;
  }
  if (!errors.totalQuestions && !errors.attemptedMCQ && !errors.attemptedTITA) {
    const attempted = Number(form.attemptedMCQ || 0) + Number(form.attemptedTITA || 0);
    if (attempted > Number(form.totalQuestions)) errors.totalQuestions = `Attempted (${attempted}) exceeds Total Questions`;
  }
  if (form.percentile !== "") {
    const p = Number(form.percentile);
    if (isNaN(p) || p < 0 || p > 100) errors.percentile = "Must be 0–100";
  }
  if (form.topperScore !== "") {
    if (isNaN(Number(form.topperScore)) || Number(form.topperScore) < 0) errors.topperScore = "Must be ≥ 0";
  }
  return errors;
}
