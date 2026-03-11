import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapMarker } from "../components/MapMarker";
import { fishData } from "../data/fish";
import { mapLocationData } from "../data/mapLocations";
import type { MapLocation, MarkerType } from "../types";
import styles from "./Map.module.css";

const MAX_DEPTH = 130;

const DEPTH_ZONES = [
  {
    label: "浅海 0–50m",
    depthMin: 0,
    depthMax: 50,
    color: "var(--color-depth-shallow, #B8DCEA)",
    pct: (50 / MAX_DEPTH) * 100,
  },
  {
    label: "中层 50–80m",
    depthMin: 50,
    depthMax: 80,
    color: "var(--color-depth-middle, #5E9BB5)",
    pct: (30 / MAX_DEPTH) * 100,
  },
  {
    label: "深海 80–130m",
    depthMin: 80,
    depthMax: 130,
    color: "var(--color-depth-deep, #2B5F80)",
    pct: (50 / MAX_DEPTH) * 100,
  },
];

type DepthFilter = "0-50" | "50-80" | "80-130" | "all";

export function MapPage() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<MarkerType | "all">("all");
  const [depthFilter, setDepthFilter] = useState<DepthFilter>("all");

  const selected = selectedId
    ? mapLocationData.find((l) => l.id === selectedId)
    : null;

  const filteredLocations = mapLocationData.filter((loc) => {
    if (typeFilter !== "all" && loc.type !== typeFilter) return false;
    if (depthFilter === "0-50" && loc.depth > 50) return false;
    if (depthFilter === "50-80" && (loc.depth < 50 || loc.depth > 80))
      return false;
    if (depthFilter === "80-130" && loc.depth < 80) return false;
    return true;
  });

  function getMarkerTop(depth: number): string {
    return `${(depth / MAX_DEPTH) * 100}%`;
  }

  function renderInfoPanel(loc: MapLocation) {
    const relatedFish = fishData.filter((f) =>
      loc.relatedFishIds.includes(f.id),
    );

    return (
      <div className={styles.infoPanel}>
        <div className={styles.infoPanelHeader}>
          <span className={styles.infoTypeIcon}>
            {{ fish: "🐟", treasure: "💎", boss: "☠️" }[loc.type]}
          </span>
          <div>
            <h3 className={styles.infoName}>{loc.name}</h3>
            <span className={styles.infoDepth}>深度 {loc.depth}m</span>
          </div>
        </div>
        <p className={styles.infoDesc}>{loc.description}</p>
        {relatedFish.length > 0 && (
          <div className={styles.infoFish}>
            <span className={styles.infoFishLabel}>相关鱼类</span>
            <div className={styles.infoFishList}>
              {relatedFish.map((f) => (
                <button
                  type="button"
                  key={f.id}
                  className={styles.infoFishBtn}
                  onClick={() => navigate(`/fish/${f.id}`)}
                >
                  {f.emoji} {f.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarSection}>
          <h3 className={styles.sidebarTitle}>深度过滤</h3>
          {[
            { value: "all" as DepthFilter, label: "全部深度" },
            { value: "0-50" as DepthFilter, label: "浅海 0–50m" },
            { value: "50-80" as DepthFilter, label: "中层 50–80m" },
            { value: "80-130" as DepthFilter, label: "深海 80–130m" },
          ].map(({ value, label }) => (
            <button
              type="button"
              key={value}
              className={`${styles.filterBtn} ${depthFilter === value ? styles.filterActive : ""}`}
              onClick={() => setDepthFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className={styles.sidebarSection}>
          <h3 className={styles.sidebarTitle}>标记类型</h3>
          {[
            { value: "all" as MarkerType | "all", label: "全部", icon: "🔍" },
            { value: "fish" as MarkerType, label: "鱼类", icon: "🐟" },
            { value: "treasure" as MarkerType, label: "宝藏", icon: "💎" },
            { value: "boss" as MarkerType, label: "Boss", icon: "☠️" },
          ].map(({ value, label, icon }) => (
            <button
              type="button"
              key={value}
              className={`${styles.filterBtn} ${typeFilter === value ? styles.filterActive : ""}`}
              onClick={() => setTypeFilter(value)}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        {selected && renderInfoPanel(selected)}
      </aside>

      <main className={styles.mapArea}>
        <div className={styles.mapTitle}>
          <span className={styles.pixel}>🌊 蓝洞地图</span>
          <span className={styles.depthLabel}>0 — {MAX_DEPTH}m</span>
        </div>

        <div className={styles.mapCanvas}>
          {DEPTH_ZONES.map((zone) => (
            <div
              key={zone.label}
              className={styles.depthZone}
              style={{
                height: `${zone.pct}%`,
                background: zone.color,
              }}
            >
              <span className={styles.zoneLabel}>{zone.label}</span>
            </div>
          ))}

          {filteredLocations.map((loc) => (
            <div
              key={loc.id}
              className={styles.markerWrap}
              style={{
                top: getMarkerTop(loc.depth),
                left: `${loc.x}%`,
              }}
            >
              <MapMarker
                type={loc.type}
                label={loc.name}
                active={loc.id === selectedId}
                onClick={() =>
                  setSelectedId(loc.id === selectedId ? null : loc.id)
                }
              />
            </div>
          ))}

          <div className={styles.depthRuler}>
            {[0, 25, 50, 75, 100, 130].map((d) => (
              <div
                key={d}
                className={styles.rulerTick}
                style={{ top: `${(d / MAX_DEPTH) * 100}%` }}
              >
                <span>{d}m</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
