import { TriangleAlert, X } from "lucide-react";
import { COLORS } from "../constants";

export default function ImportErrorBanner({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-2 p-3 text-sm" style={{ background: COLORS.varcSoft, color: COLORS.varc, borderRadius: 8 }}>
      <TriangleAlert size={16} className="mt-0.5 shrink-0" />
      <span>{message}</span>
      <button onClick={onDismiss} className="ml-auto"><X size={14} /></button>
    </div>
  );
}
