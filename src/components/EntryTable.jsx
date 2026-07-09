import { useState, useMemo } from "react";
import { Pencil, Trash2, ChevronUp, ChevronDown, ArrowUpDown, Table2 } from "lucide-react";
import { COLORS, SECTIONS } from "../constants";
import { fmtDate, fmtNum, fmtPct } from "../lib/format";
import SectionBadge from "./ui/SectionBadge";
import EmptyState from "./ui/EmptyState";
import { inputStyle } from "./ui/FieldLabel";

const TABLE_COLUMNS = [
  { key: "date", label: "Date" },
  { key: "source", label: "Source" },
  { key: "section", label: "Section" },
  { key: "totalMarks", label: "Marks" },
  { key: "overallAccuracy", label: "Acc%" },
  { key: "attemptRate", label: "Attempt%" },
  { key: "percentile", label: "%ile" },
];

export default function EntryTable({ entries, onEdit, onDelete }) {
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [filterSection, setFilterSection] = useState("All");
  const [filterSource, setFilterSource] = useState("All");

  const sources = useMemo(() => ["All", ...Array.from(new Set(entries.map((e) => e.source))).sort()], [entries]);

  const rows = useMemo(() => {
    let r = entries.filter((e) => (filterSection === "All" || e.section === filterSection) && (filterSource === "All" || e.source === filterSource));
    r = [...r].sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey];
      if (av === null || av === undefined) av = -Infinity;
      if (bv === null || bv === undefined) bv = -Infinity;
      if (typeof av === "string") return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortDir === "asc" ? av - bv : bv - av;
    });
    return r;
  }, [entries, filterSection, filterSource, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  if (entries.length === 0) {
    return <EmptyState icon={Table2} title="No entries yet" body="Log your first mock in the Log Mock tab and it'll show up here." />;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3 items-center">
        <select value={filterSection} onChange={(e) => setFilterSection(e.target.value)} style={{ ...inputStyle(false), width: "auto", fontFamily: "'Inter', sans-serif" }}>
          <option>All</option>
          {SECTIONS.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={filterSource} onChange={(e) => setFilterSource(e.target.value)} style={{ ...inputStyle(false), width: "auto", fontFamily: "'Inter', sans-serif" }}>
          {sources.map((s) => <option key={s}>{s}</option>)}
        </select>
        <span className="text-xs" style={{ color: COLORS.inkMuted }}>{rows.length} of {entries.length} entries</span>
      </div>

      <div className="overflow-x-auto" style={{ border: `1px solid ${COLORS.border}`, borderRadius: 12 }}>
        <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: COLORS.surface2, borderBottom: `1px solid ${COLORS.border}` }}>
              {TABLE_COLUMNS.map((c) => (
                <th key={c.key} onClick={() => toggleSort(c.key)}
                  className="text-left px-3 py-2 cursor-pointer select-none whitespace-nowrap"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: COLORS.ink }}>
                  <span className="flex items-center gap-1">
                    {c.label}
                    {sortKey === c.key ? (sortDir === "asc" ? <ChevronUp size={13} /> : <ChevronDown size={13} />) : <ArrowUpDown size={12} style={{ opacity: 0.35 }} />}
                  </span>
                </th>
              ))}
              <th className="px-3 py-2 text-left" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>Wrong M/T</th>
              <th className="px-3 py-2 text-right" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e, i) => (
              <tr key={e.id} style={{ borderBottom: `1px solid ${COLORS.border}`, background: i % 2 ? COLORS.surface : COLORS.surface2 }}>
                <td className="px-3 py-2 whitespace-nowrap" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{fmtDate(e.date)}</td>
                <td className="px-3 py-2 whitespace-nowrap">{e.source}</td>
                <td className="px-3 py-2"><SectionBadge section={e.section} size="sm" /></td>
                <td className="px-3 py-2" style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{fmtNum(e.totalMarks, 0)}</td>
                <td className="px-3 py-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{fmtPct(e.overallAccuracy)}</td>
                <td className="px-3 py-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{fmtPct(e.attemptRate)}</td>
                <td className="px-3 py-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{e.percentile ?? "—"}</td>
                <td className="px-3 py-2 whitespace-nowrap" style={{ fontFamily: "'JetBrains Mono', monospace", color: COLORS.inkMuted }}>{e.wrongMCQ}/{e.wrongTITA}</td>
                <td className="px-3 py-2">
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => onEdit(e.id)} title="Edit" style={{ color: COLORS.inkMuted }}><Pencil size={15} /></button>
                    <button onClick={() => onDelete(e.id)} title="Delete" style={{ color: COLORS.danger }}><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
