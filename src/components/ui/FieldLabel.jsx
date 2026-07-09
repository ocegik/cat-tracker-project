import { COLORS } from "../../constants";

export function FieldLabel({ children, optional, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="text-xs font-medium flex items-center gap-1.5" style={{ color: COLORS.inkMuted, fontFamily: "'Inter', sans-serif" }}>
      {children}
      {optional && (
        <span className="px-1.5 rounded" style={{ background: COLORS.surface2, border: `1px solid ${COLORS.border}`, fontSize: "10px", color: COLORS.inkMuted }}>
          optional
        </span>
      )}
    </label>
  );
}

export function inputStyle(hasError) {
  return {
    background: COLORS.surface,
    border: `1px solid ${hasError ? COLORS.danger : COLORS.border}`,
    borderRadius: 8,
    padding: "8px 10px",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "14px",
    color: COLORS.ink,
    width: "100%",
    outline: "none",
  };
}
