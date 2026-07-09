import { COLORS } from "../../constants";
import EntryTable from "../EntryTable";

export default function TableTab({ entries, entriesWithComputed, onEdit, onDelete, onClearAll }) {
  return (
    <div className="flex flex-col gap-4">
      <EntryTable entries={entriesWithComputed} onEdit={onEdit} onDelete={onDelete} />
      {entries.length > 0 && (
        <button onClick={onClearAll} className="text-xs self-start" style={{ color: COLORS.inkMuted, textDecoration: "underline" }}>
          Clear all entries
        </button>
      )}
    </div>
  );
}
