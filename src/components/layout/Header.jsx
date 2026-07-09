import { Upload, Download } from "lucide-react";
import { COLORS } from "../../constants";

export default function Header({ onImportClick, onExport, fileInputRef, onImportFile }) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "22px" }}>CAT Mock Tracker</h1>
        <p className="text-sm" style={{ color: COLORS.inkMuted }}>Sectional performance across VARC · DILR · Quant</p>
      </div>
      <div className="flex gap-2 flex-wrap">
        <button onClick={onImportClick} className="flex items-center gap-1.5 px-3 py-2 text-sm"
          style={{ border: `1px solid ${COLORS.border}`, borderRadius: 8, background: COLORS.surface, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>
          <Upload size={14} /> Import
        </button>
        <input ref={fileInputRef} type="file" accept="application/json,.json" onChange={onImportFile} style={{ display: "none" }} />
        <button onClick={onExport} className="flex items-center gap-1.5 px-3 py-2 text-sm"
          style={{ border: `1px solid ${COLORS.border}`, borderRadius: 8, background: COLORS.surface, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>
          <Download size={14} /> Export
        </button>
      </div>
    </header>
  );
}
