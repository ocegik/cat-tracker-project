import { CircleCheck } from "lucide-react";
import { COLORS } from "../../constants";

export default function Toast({ message }) {
  if (!message) return null;
  return (
    <div
      className="fixed bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2.5 text-sm"
      style={{ background: COLORS.ink, color: COLORS.bg, borderRadius: 10, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, zIndex: 50 }}
    >
      <CircleCheck size={15} /> {message}
    </div>
  );
}
