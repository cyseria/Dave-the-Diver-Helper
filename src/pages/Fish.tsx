import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EncyclopediaLayout } from "../components/EncyclopediaLayout";
import { TabBar } from "../components/TabBar";
import { fishData } from "../data/fish";
import { fishGuideModules } from "../data/fishGuideModules";
import { recipeData } from "../data/recipes";
import { usePlayerProgress } from "../store/usePlayerProgress";
import styles from "./Fish.module.css";

const WEAPON_LABELS: Record<string, string> = {
  harpoon: "🔱 鱼叉",
  spear_gun: "🎯 鱼枪",
  net: "🕸️ 渔网",
  rifle: "🔫 步枪",
  none: "—",
};

const FISH_MODULE_EMOJI: Record<string, string> = {
  "blue-hole-entrance": "🌊",
  "blue-hole-mid": "🛳️",
  "blue-hole-depths": "🐙",
  "night-only": "🌙",
  "glacier-passage": "🧊",
  "glacial-area": "❄️",
  "hydrothermal-vents": "🌋",
  seahorses: "🐴",
  "fish-trap": "🦞",
};

const STAR_POSITIONS = [1, 2, 3] as const;

function StarRating({
  stars,
  captured,
  size = "sm",
  onRate,
}: {
  stars: number;
  captured: boolean;
  size?: "sm" | "lg";
  onRate?: (n: number) => void;
}) {
  const [animStar, setAnimStar] = useState<number | null>(null);
  const [hoverStar, setHoverStar] = useState<number | null>(null);

  const isUncaptureHint = captured && hoverStar === stars;

  const getSpanClass = (pos: number): string => {
    if (animStar === pos) return styles.starFilled;
    if (isUncaptureHint) {
      return pos <= stars ? styles.starWarning : styles.starGray;
    }
    if (hoverStar !== null) {
      return pos <= hoverStar ? styles.starPreview : styles.starGray;
    }
    return captured && pos <= stars ? styles.starFilled : styles.starGray;
  };

  const getTitle = (pos: number): string => {
    if (!captured) return `捕获并评为 ${pos} 星`;
    if (pos === stars) return "再次点击 → 取消捕获";
    return `改为 ${pos} 星`;
  };

  const handleClick = (pos: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setAnimStar(pos);
    onRate?.(pos);
    setTimeout(() => setAnimStar(null), 500);
  };

  const sizeClass = size === "lg" ? styles.starLg : styles.starSm;

  return (
    <div
      className={`${styles.starsTrack} ${size === "lg" ? styles.starsTrackLg : ""}`}
      onMouseLeave={() => setHoverStar(null)}
    >
      {STAR_POSITIONS.map((pos) => (
        <button
          key={pos}
          type="button"
          className={`${styles.starBtn} ${sizeClass} ${hoverStar !== null && pos <= hoverStar ? styles.starBtnHovered : ""} ${isUncaptureHint && pos <= stars ? styles.starBtnWarn : ""}`}
          onClick={(e) => handleClick(pos, e)}
          onMouseEnter={() => setHoverStar(pos)}
          title={getTitle(pos)}
        >
          <span
            className={`${getSpanClass(pos)} ${animStar === pos ? styles.starAnim : ""}`}
          >
            ★
          </span>
        </button>
      ))}
    </div>
  );
}

export function Fish() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedModuleId, setSelectedModuleId] = useState<string>(
    fishGuideModules[0]?.id ?? "blue-hole-entrance",
  );
  const {
    capturedFishIds,
    fishStarRatings,
    toggleFishCaptured,
    setFishStarRating,
  } = usePlayerProgress();

  const selected = id ? fishData.find((f) => f.id === id) : null;
  const relatedRecipes = selected
    ? recipeData.filter((r) => selected.recipeIds.includes(r.id))
    : [];

  const selectedModule =
    fishGuideModules.find((m) => m.id === selectedModuleId) ??
    fishGuideModules[0];

  const moduleFish = selectedModule
    ? selectedModule.fishIds
        .map((fishId) => fishData.find((f) => f.id === fishId))
        .filter((f): f is NonNullable<typeof f> => !!f)
    : fishData;

  const getStars = (fishId: string, defaultStars: number) =>
    fishStarRatings[fishId] || defaultStars;

  const getTimeLabel = (time?: string) =>
    time === "night" ? "夜" : time === "day_night" ? "昼夜" : "昼";

  const getEstimatedStats = (fish: (typeof fishData)[number]) => {
    if (fish.hp !== undefined && fish.attack !== undefined) {
      return { hp: fish.hp, attack: fish.attack, estimated: false };
    }

    const base = Math.max(1, fish.stars);
    let hp = base * 120;
    let attack = base * 12;

    if (fish.category === "boss") {
      hp *= 4;
      attack *= 3;
    } else if (fish.category === "seahorse") {
      hp = 30;
      attack = 0;
    } else if (fish.category === "trap") {
      hp = 10;
      attack = 0;
    }

    return { hp, attack, estimated: true };
  };

  const getCaptureTip = () => {
    if (!selected) return null;
    if (selected.note) return selected.note;
    if (selected.category === "seahorse") return "需要虫网捕捉";
    if (selected.category === "trap") return "只能使用鱼笼/蟹笼捕获";
    if (selected.category === "boss")
      return "建议先麻醉或用渔网捕获，避免损伤提升三星率";
    return selectedModule?.tips?.[0] ?? null;
  };

  const listPanel = (
    <div className={styles.listWrap}>
      <div className={styles.grid}>
        {moduleFish.map((fish) => {
          const captured = capturedFishIds.includes(fish.id);
          const isSelected = fish.id === id;
          const depthText =
            fish.depthMin !== undefined && fish.depthMax !== undefined
              ? `${fish.depthMin}-${fish.depthMax}m`
              : "—";
          return (
            <div
              key={fish.id}
              className={`${styles.card} ${captured ? styles.cardCaptured : ""} ${isSelected ? styles.cardSelected : ""}`}
              onClick={() => navigate(`/fish/${fish.id}`)}
              onKeyDown={(e) =>
                e.key === "Enter" && navigate(`/fish/${fish.id}`)
              }
              title={fish.name}
              // biome-ignore lint/a11y/noNoninteractiveTabindex: card with nested toggle button
              tabIndex={0}
            >
              <div className={styles.cardImg}>
                <div className={styles.cardStarsOverlay}>
                  <StarRating
                    stars={getStars(fish.id, fish.stars)}
                    captured={captured}
                    size="sm"
                    onRate={(n) => {
                      const currentStars = getStars(fish.id, fish.stars);
                      if (!captured) {
                        toggleFishCaptured(fish.id);
                        setFishStarRating(fish.id, n);
                      } else if (currentStars === n) {
                        toggleFishCaptured(fish.id);
                        setFishStarRating(fish.id, 0);
                      } else {
                        setFishStarRating(fish.id, n);
                      }
                    }}
                  />
                </div>
                <span className={styles.cardEmoji}>{fish.emoji}</span>
              </div>
              <div className={styles.cardFooter}>
                <span className={styles.cardName}>{fish.name}</span>
                <div className={styles.cardMeta}>
                  <span className={styles.cardMetaItem}>{depthText}</span>
                  <span className={styles.cardMetaItem}>
                    {getTimeLabel(fish.time)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const detailPanel = selected ? (
    <div className={styles.detail}>
      <div className={styles.detailTop}>
        <div className={styles.detailImgBox}>
          <span className={styles.detailEmoji}>{selected.emoji}</span>
        </div>
        <div className={styles.detailInfo}>
          <StarRating
            stars={getStars(selected.id, selected.stars)}
            captured={capturedFishIds.includes(selected.id)}
            size="lg"
            onRate={(n) => {
              const isCaptured = capturedFishIds.includes(selected.id);
              const curStars = getStars(selected.id, selected.stars);
              if (!isCaptured) {
                toggleFishCaptured(selected.id);
                setFishStarRating(selected.id, n);
              } else if (curStars === n) {
                toggleFishCaptured(selected.id);
                setFishStarRating(selected.id, 0);
              } else {
                setFishStarRating(selected.id, n);
              }
            }}
          />
          <h1 className={styles.detailName}>{selected.name}</h1>
          <p className={styles.detailDesc}>
            {selected.description ?? "暂无描述"}
          </p>
        </div>
        <button
          type="button"
          className={`${styles.captureBtn} ${capturedFishIds.includes(selected.id) ? styles.captureBtnOn : ""}`}
          onClick={() => toggleFishCaptured(selected.id)}
        >
          {capturedFishIds.includes(selected.id) ? "✓ 已捕获" : "标记已捕获"}
        </button>
      </div>

      <div className={styles.infoGrid}>
        {(() => {
          const stats = getEstimatedStats(selected);
          return (
            <>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>
                  HP{stats.estimated ? " (估)" : ""}
                </span>
                <span className={styles.infoValue}>{stats.hp}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>
                  ATK{stats.estimated ? " (估)" : ""}
                </span>
                <span className={styles.infoValue}>{stats.attack}</span>
              </div>
            </>
          );
        })()}
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Region</span>
          <span className={styles.infoValue}>
            {selected.zones?.length
              ? selected.zones
                  .map((z) =>
                    fishGuideModules.find((m) => m.id === z)?.name ?? z,
                  )
                  .join(" / ")
              : "—"}
          </span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Depth</span>
          <span className={styles.infoValue}>
            {selected.depthMin !== undefined && selected.depthMax !== undefined
              ? `${selected.depthMin}–${selected.depthMax}m`
              : "—"}
          </span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Active Time</span>
          <span className={styles.infoValue}>
            {selected.time === "night"
              ? "Night"
              : selected.time === "day_night"
                ? "Day & Night"
                : "Day"}
          </span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Recommended Weapon</span>
          <span className={styles.infoValue}>
            {selected.recommendedWeapon
              ? WEAPON_LABELS[selected.recommendedWeapon] ?? "—"
              : "—"}
          </span>
        </div>
      </div>

      {getCaptureTip() ? (
        <div className={styles.tipCard}>
          <span className={styles.tipTitle}>⭐⭐⭐ 捕获技巧</span>
          <span className={styles.tipText}>{getCaptureTip()}</span>
        </div>
      ) : null}

      {relatedRecipes.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>🍽️ 关联食谱</h3>
          <div className={styles.recipeRow}>
            {relatedRecipes.map((r) => (
              <button
                type="button"
                key={r.id}
                className={styles.recipeChip}
                onClick={() => navigate(`/recipes/${r.id}`)}
              >
                <span>{r.emoji}</span>
                <span>{r.name}</span>
                <span className={styles.recipePrice}>{r.sellPrice}金</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {(selected.note || selected.habitat) && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>📝 备注</h3>
          <div className={styles.notesList}>
            {selected.note && <span>• {selected.note}</span>}
            {selected.habitat && <span>• {selected.habitat}</span>}
          </div>
        </div>
      )}

    </div>
  ) : null;

  const fishTabs = fishGuideModules.map((module) => {
    const moduleFishList = module.fishIds
      .map((fishId) => fishData.find((f) => f.id === fishId))
      .filter((f): f is NonNullable<typeof f> => !!f);
    const capturedCount = moduleFishList.filter((f) =>
      capturedFishIds.includes(f.id),
    ).length;
    return {
      id: module.id,
      label: module.name,
      emoji: FISH_MODULE_EMOJI[module.id] ?? "🐟",
      count: `${capturedCount}/${moduleFishList.length}`,
    };
  });

  return (
    <div className={styles.page}>
      <TabBar
        tabs={fishTabs}
        value={selectedModuleId}
        onChange={setSelectedModuleId}
        aria-label="鱼类图鉴区域"
      />
      <EncyclopediaLayout
        listPanel={listPanel}
        detailPanel={detailPanel}
        hasSelection={!!selected}
        emptyMessage="← 从左侧选择一条鱼查看详情"
      />
    </div>
  );
}
