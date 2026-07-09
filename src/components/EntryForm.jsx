import { useState } from "react";
import { Plus } from "lucide-react";
import { COLORS, SECTIONS } from "../constants";
import { EMPTY_FORM, validateForm } from "../lib/formSchema";
import { FieldLabel, inputStyle } from "./ui/FieldLabel";

export default function EntryForm({ initial, mode, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState(false);

  const set = (k) => (ev) => setForm((f) => ({ ...f, [k]: ev.target.value }));

  const handleSubmit = (ev) => {
    ev.preventDefault();
    setTouched(true);
    const errs = validateForm(form);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      onSubmit(form);
      if (mode === "add") {
        setForm({ ...EMPTY_FORM, date: form.date, source: form.source, section: form.section });
        setTouched(false);
      }
    }
  };

  const numField = (key, label, opts = {}) => (
    <div className="flex flex-col gap-1">
      <FieldLabel htmlFor={key} optional={opts.optional}>{label}</FieldLabel>
      <input
        id={key} type="number" step={opts.step || "1"} min="0" value={form[key]} onChange={set(key)}
        placeholder={opts.placeholder || "0"} style={inputStyle(touched && errors[key])}
      />
      {touched && errors[key] && <span className="text-xs" style={{ color: COLORS.danger }}>{errors[key]}</span>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <FieldLabel htmlFor="date">Date</FieldLabel>
          <input id="date" type="date" value={form.date} onChange={set("date")} style={inputStyle(touched && errors.date)} />
          {touched && errors.date && <span className="text-xs" style={{ color: COLORS.danger }}>{errors.date}</span>}
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel htmlFor="source">Source</FieldLabel>
          <input id="source" type="text" value={form.source} onChange={set("source")} placeholder="TIME / IMS / Actual CAT Mock #3"
            style={inputStyle(touched && errors.source)} />
          {touched && errors.source && <span className="text-xs" style={{ color: COLORS.danger }}>{errors.source}</span>}
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel htmlFor="section">Section</FieldLabel>
          <select id="section" value={form.section} onChange={set("section")} style={{ ...inputStyle(false), fontFamily: "'Inter', sans-serif" }}>
            {SECTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div>
        <p className="text-xs uppercase mb-2" style={{ color: COLORS.inkMuted, letterSpacing: "0.08em", fontFamily: "'Inter', sans-serif" }}>MCQ</p>
        <div className="grid grid-cols-3 gap-4">
          {numField("attemptedMCQ", "Attempted")}
          {numField("rightMCQ", "Right")}
          {numField("wrongMCQ", "Wrong")}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase mb-2" style={{ color: COLORS.inkMuted, letterSpacing: "0.08em", fontFamily: "'Inter', sans-serif" }}>TITA</p>
        <div className="grid grid-cols-3 gap-4">
          {numField("attemptedTITA", "Attempted")}
          {numField("rightTITA", "Right")}
          {numField("wrongTITA", "Wrong")}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {numField("totalQuestions", "Total Questions in Section")}
        {numField("percentile", "Percentile", { optional: true, step: "0.01", placeholder: "e.g. 92.5" })}
        {numField("topperScore", "Topper Score", { optional: true, placeholder: "e.g. 58" })}
      </div>

      <div className="flex gap-3 pt-1">
        <button type="submit" className="flex items-center gap-2 px-4 py-2"
          style={{ background: COLORS.ink, color: COLORS.bg, borderRadius: 8, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>
          <Plus size={16} /> {mode === "edit" ? "Save changes" : "Add mock entry"}
        </button>
        {mode === "edit" && (
          <button type="button" onClick={onCancel} className="px-4 py-2"
            style={{ border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.inkMuted, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
