import { useState, useMemo, useCallback, useRef } from "react";
import { SECTIONS } from "../constants";
import { computeDerived, byDateAsc, rollingSeries, buildMockPivot, buildSeries, analyzeWeakest } from "../lib/compute";
import { formToEntry } from "../lib/formSchema";
import { downloadJSON, normalizeImported } from "../lib/importExport";
import { makeSampleData } from "../lib/sampleData";

/**
 * Owns the mock-entry dataset plus every derived/memoized view of it
 * (rolling stats, chart series, weakest-section analysis) and every
 * mutation (add/update/delete/import/export/sample/clear).
 *
 * Keeping this in one hook means UI components never touch raw state —
 * they just call the functions this returns.
 */
export function useMockEntries() {
  const [entries, setEntries] = useState([]);
  const [toast, setToast] = useState(null);
  const [importError, setImportError] = useState(null);
  const toastTimer = useRef(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  }, []);

  const entriesWithComputed = useMemo(() => entries.map(computeDerived), [entries]);

  const sectionStats = useMemo(() => {
    const out = {};
    SECTIONS.forEach((sec) => {
      const list = rollingSeries(entriesWithComputed.filter((e) => e.section === sec).sort(byDateAsc));
      out[sec] = { list, latest: list.length ? list[list.length - 1] : null };
    });
    return out;
  }, [entriesWithComputed]);

  const weakestAnalysis = useMemo(() => analyzeWeakest(entriesWithComputed), [entriesWithComputed]);

  const mocks = useMemo(() => buildMockPivot(entriesWithComputed), [entriesWithComputed]);
  const marksSeries = useMemo(() => buildSeries(mocks, (e) => e.totalMarks), [mocks]);
  const attemptRateSeries = useMemo(
    () => buildSeries(mocks, (e) => (e.attemptRate !== null ? +(e.attemptRate * 100).toFixed(1) : null)),
    [mocks]
  );
  const percentileSeries = useMemo(() => buildSeries(mocks, (e) => e.percentile), [mocks]);
  const hardnessSeries = useMemo(
    () => buildSeries(mocks, (e) => (e.hardnessRatio !== null ? +(e.hardnessRatio * 100).toFixed(1) : null)),
    [mocks]
  );

  const hasPercentile = entriesWithComputed.some((e) => e.percentile !== null);
  const hasTopper = entriesWithComputed.some((e) => e.topperScore !== null);

  const addEntry = useCallback((form) => {
    setEntries((prev) => [...prev, formToEntry(form)]);
    showToast("Mock entry added");
  }, [showToast]);

  const updateEntry = useCallback((id, form) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? formToEntry(form, e) : e)));
    showToast("Entry updated");
  }, [showToast]);

  const deleteEntry = useCallback((id) => {
    if (window.confirm("Delete this entry? This can't be undone unless you re-import a backup.")) {
      setEntries((prev) => prev.filter((e) => e.id !== id));
      showToast("Entry deleted");
    }
  }, [showToast]);

  const exportEntries = useCallback(() => {
    if (entries.length === 0) { showToast("Nothing to export yet"); return; }
    downloadJSON(entries);
    showToast("scores.json downloaded");
  }, [entries, showToast]);

  /** Accepts the raw text of an uploaded JSON file. */
  const importEntries = useCallback((rawText) => {
    try {
      const parsed = JSON.parse(rawText);
      const normalized = normalizeImported(parsed);
      if (
        entries.length > 0 &&
        !window.confirm(`Import ${normalized.length} entries and replace the ${entries.length} currently loaded? Export first if you want a backup.`)
      ) {
        return;
      }
      setEntries(normalized);
      setImportError(null);
      showToast(`Imported ${normalized.length} entries`);
    } catch (err) {
      setImportError(err.message || "Could not parse that file.");
    }
  }, [entries, showToast]);

  const loadSample = useCallback(() => {
    setEntries(makeSampleData());
    showToast("Sample data loaded");
  }, [showToast]);

  const clearAll = useCallback(() => {
    if (window.confirm("Clear all entries from this session?")) {
      setEntries([]);
      showToast("Cleared");
    }
  }, [showToast]);

  return {
    entries, entriesWithComputed, sectionStats, weakestAnalysis, mocks,
    marksSeries, attemptRateSeries, percentileSeries, hardnessSeries,
    hasPercentile, hasTopper,
    toast, importError, setImportError,
    addEntry, updateEntry, deleteEntry, exportEntries, importEntries, loadSample, clearAll,
  };
}
