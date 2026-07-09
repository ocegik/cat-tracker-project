import { Sparkles } from "lucide-react";
import { COLORS } from "../../constants";
import { EMPTY_FORM, entryToForm } from "../../lib/formSchema";
import EntryForm from "../EntryForm";

export default function LogTab({ entries, editingEntry, editingId, onAdd, onUpdate, onCancelEdit, onLoadSample }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="p-5" style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12 }}>
        <h2 className="mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}>
          {editingEntry ? "Edit mock entry" : "Log a mock — one section at a time"}
        </h2>
        <EntryForm
          key={editingId || "new"}
          initial={editingEntry ? entryToForm(editingEntry) : EMPTY_FORM}
          mode={editingEntry ? "edit" : "add"}
          onSubmit={editingEntry ? onUpdate : onAdd}
          onCancel={onCancelEdit}
        />
      </div>
      {entries.length === 0 && (
        <div className="flex items-center justify-between p-4 flex-wrap gap-3" style={{ background: COLORS.surface2, border: `1px dashed ${COLORS.border}`, borderRadius: 12 }}>
          <span className="text-sm" style={{ color: COLORS.inkMuted }}>Nothing logged yet — want to explore the dashboard with sample data first?</span>
          <button onClick={onLoadSample} className="flex items-center gap-1.5 px-3 py-1.5 text-sm"
            style={{ border: `1px solid ${COLORS.border}`, borderRadius: 8, background: COLORS.surface, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>
            <Sparkles size={14} /> Load sample data
          </button>
        </div>
      )}
    </div>
  );
}
