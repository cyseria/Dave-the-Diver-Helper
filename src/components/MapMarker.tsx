import type { MarkerType } from "../types";
import styles from "./MapMarker.module.css";

const MARKER_CONFIG: Record<
  MarkerType,
  { emoji: string; color: string; label: string }
> = {
  fish: { emoji: "🐟", color: "#4A8EC2", label: "鱼类" },
  treasure: { emoji: "💎", color: "#C27A2A", label: "宝藏" },
  boss: { emoji: "☠️", color: "#D94040", label: "Boss" },
};

interface MapMarkerProps {
  type: MarkerType;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export function MapMarker({
  type,
  label,
  active = false,
  onClick,
}: MapMarkerProps) {
  const config = MARKER_CONFIG[type];

  return (
    <button
      type="button"
      className={`${styles.marker} ${active ? styles.active : ""}`}
      style={{ "--marker-color": config.color } as React.CSSProperties}
      onClick={onClick}
      title={label}
    >
      <span className={styles.emoji}>{config.emoji}</span>
    </button>
  );
}
