import { ClipboardList, Table2, LineChart as LineChartIcon, LayoutDashboard } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Design tokens                                                      */
/* ------------------------------------------------------------------ */

export const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600;700&display=swap');";

export const COLORS = {
  bg: "#F5F6F1",
  surface: "#FFFFFF",
  surface2: "#FBFBF8",
  border: "#DDE0D6",
  ink: "#1E2420",
  inkMuted: "#6E7568",
  varc: "#B8433D",
  varcSoft: "#F4DEDC",
  dilr: "#1F6E7F",
  dilrSoft: "#DCEBEC",
  quant: "#BD8420",
  quantSoft: "#F2E5C9",
  good: "#3F8F5F",
  danger: "#B8433D",
};

export const SECTIONS = ["VARC", "DILR", "Quant"];

export const SECTION_META = {
  VARC: { color: COLORS.varc, soft: COLORS.varcSoft, label: "VARC" },
  DILR: { color: COLORS.dilr, soft: COLORS.dilrSoft, label: "DILR" },
  Quant: { color: COLORS.quant, soft: COLORS.quantSoft, label: "Quant" },
};

export const TABS = [
  { key: "log", label: "Log mock", icon: ClipboardList },
  { key: "table", label: "Mock log", icon: Table2 },
  { key: "trends", label: "Trends", icon: LineChartIcon },
  { key: "insights", label: "Insights", icon: LayoutDashboard },
];
