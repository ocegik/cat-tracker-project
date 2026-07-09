import { useState, useRef } from "react";
import { COLORS, FONT_IMPORT } from "./constants";
import { useMockEntries } from "./hooks/useMockEntries";
import Header from "./components/layout/Header";
import TabNav from "./components/layout/TabNav";
import ImportErrorBanner from "./components/ImportErrorBanner";
import Toast from "./components/ui/Toast";
import LogTab from "./components/tabs/LogTab";
import TableTab from "./components/tabs/TableTab";
import TrendsTab from "./components/tabs/TrendsTab";
import InsightsTab from "./components/tabs/InsightsTab";

export default function CATMockTracker() {
  const [activeTab, setActiveTab] = useState("log");
  const [editingId, setEditingId] = useState(null);
  const fileInputRef = useRef(null);

  const {
    entries, entriesWithComputed, sectionStats, weakestAnalysis, mocks,
    marksSeries, attemptRateSeries, percentileSeries, hardnessSeries,
    hasPercentile, hasTopper, toast, importError, setImportError,
    addEntry, updateEntry, deleteEntry, exportEntries, importEntries, loadSample, clearAll,
  } = useMockEntries();

  const editingEntry = editingId ? entries.find((e) => e.id === editingId) : null;

  const handleTabChange = (key) => {
    setActiveTab(key);
    if (key !== "log") setEditingId(null);
  };

  const handleUpdate = (form) => {
    updateEntry(editingId, form);
    setEditingId(null);
    setActiveTab("table");
  };

  const handleEdit = (id) => { setEditingId(id); setActiveTab("log"); };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleImportFile = (ev) => {
    const file = ev.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => importEntries(reader.result);
    reader.readAsText(file);
    ev.target.value = "";
  };

  return (
    <div style={{ background: COLORS.bg, minHeight: "100%", color: COLORS.ink, fontFamily: "'Inter', sans-serif" }} className="w-full">
      <style>{`
        ${FONT_IMPORT}
        * { box-sizing: border-box; }
        input:focus, select:focus, button:focus-visible { outline: 2px solid ${COLORS.ink}; outline-offset: 1px; }
        button { cursor: pointer; }
        ::-webkit-scrollbar { height: 8px; width: 8px; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 4px; }
      `}</style>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
        <Header onImportClick={handleImportClick} onExport={exportEntries} fileInputRef={fileInputRef} onImportFile={handleImportFile} />

        <ImportErrorBanner message={importError} onDismiss={() => setImportError(null)} />

        <TabNav activeTab={activeTab} onChange={handleTabChange} />

        {activeTab === "log" && (
          <LogTab
            entries={entries}
            editingEntry={editingEntry}
            editingId={editingId}
            onAdd={addEntry}
            onUpdate={handleUpdate}
            onCancelEdit={() => setEditingId(null)}
            onLoadSample={loadSample}
          />
        )}

        {activeTab === "table" && (
          <TableTab entries={entries} entriesWithComputed={entriesWithComputed} onEdit={handleEdit} onDelete={deleteEntry} onClearAll={clearAll} />
        )}

        {activeTab === "trends" && (
          <TrendsTab mocks={mocks} marksSeries={marksSeries} attemptRateSeries={attemptRateSeries} sectionStats={sectionStats} />
        )}

        {activeTab === "insights" && (
          <InsightsTab
            entriesWithComputed={entriesWithComputed}
            mocks={mocks}
            marksSeries={marksSeries}
            attemptRateSeries={attemptRateSeries}
            percentileSeries={percentileSeries}
            hardnessSeries={hardnessSeries}
            hasPercentile={hasPercentile}
            hasTopper={hasTopper}
            weakestAnalysis={weakestAnalysis}
          />
        )}
      </div>

      <Toast message={toast} />
    </div>
  );
}
