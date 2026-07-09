import { COLORS } from "../../constants";

export default function EmptyState({ icon: Icon, title, body }) {
  return (
    <div
      className="flex flex-col items-center text-center gap-2 py-14 px-6"
      style={{ border: `1px dashed ${COLORS.border}`, borderRadius: 12, color: COLORS.inkMuted }}
    >
      <Icon size={28} strokeWidth={1.5} />
      <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: COLORS.ink }}>{title}</p>
      <p className="text-sm max-w-sm">{body}</p>
    </div>
  );
}
