import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EncyclopediaLayout } from "../components/EncyclopediaLayout";
import { fishData } from "../data/fish";
import { recipeData } from "../data/recipes";
import { usePlayerProgress } from "../store/usePlayerProgress";
import { theme } from "../theme.config";
import styles from "./Fish.module.css";

const WEAPON_LABELS: Record<string, string> = {
  harpoon: "🔱 鱼叉",
  spear_gun: "🎯 鱼枪",
  net: "🕸️ 渔网",
  rifle: "🔫 步枪",
  none: "—",
};

const STAR_POSITIONS = [1, 2, 3] as const;

/**
 * Interactive star rating — pixel game style.
 *
 * States:
 * - uncaptured  : all gray; hovering shows preview; click = capture + rate
 * - captured    : colored per rating; hovering over top star = uncapture warning
 *
 * Hover preview: hovering over star N previews 1-N lit (so user knows what will happen)
 * Uncapture hint: hovering the current top star turns all to warning red
 */
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

  // Hovering the current top active star → shows uncapture warning
  const isUncaptureHint = captured && hoverStar === stars;

  const getSpanClass = (pos: number): string => {
    // While a click animation is playing, don't change the color mid-animation
    if (animStar === pos) return styles.starFilled;

    if (isUncaptureHint) {
      // All lit stars turn warning-red to signal "will remove"
      return pos <= stars ? styles.starWarning : styles.starGray;
    }
    if (hoverStar !== null) {
      // Preview: stars 1..hoverStar light up in preview-gold
      return pos <= hoverStar ? styles.starPreview : styles.starGray;
    }
    // Normal state
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

  // 0 means "cleared / no custom rating" → fall back to fish default
  const getStars = (fishId: string, defaultStars: number) =>
    fishStarRatings[fishId] || defaultStars;

  const listPanel = (
    <div className={styles.listWrap}>
      <div className={styles.listHeader}>
        <span className={styles.listTitle}>鱼类图鉴</span>
        <span className={styles.listCount}>
          <span style={{ color: theme.colors.success }}>
            {capturedFishIds.length}
          </span>
          {" / "}
          {fishData.length}
        </span>
      </div>
      <div className={styles.grid}>
        {fishData.map((fish) => {
          const captured = capturedFishIds.includes(fish.id);
          const isSelected = fish.id === id;
          const displayStars = getStars(fish.id, fish.stars);

          // Tier styling only applies when the fish is captured
          const tierClass = !captured
            ? styles.cardUncaptured
            : displayStars === 1
              ? styles.card1star
              : displayStars === 2
                ? styles.card2star
                : styles.card3star;

          return (
            <div
              key={fish.id}
              className={`${styles.card} ${tierClass} ${isSelected ? styles.cardSelected : ""}`}
              onClick={() => navigate(`/fish/${fish.id}`)}
              onKeyDown={(e) =>
                e.key === "Enter" && navigate(`/fish/${fish.id}`)
              }
              // biome-ignore lint/a11y/noNoninteractiveTabindex: card with nested interactive elements
              tabIndex={0}
            >
              <div className={styles.cardImg}>
                <span className={styles.cardEmoji}>{fish.emoji}</span>
                <div className={styles.starsOverlay}>
                  <StarRating
                    stars={displayStars}
                    captured={captured}
                    size="sm"
                    onRate={(n) => {
                      if (!captured) {
                        // First time: capture + set rating
                        toggleFishCaptured(fish.id);
                        setFishStarRating(fish.id, n);
                      } else if (displayStars === n) {
                        // Clicking current top star: remove capture + clear rating
                        toggleFishCaptured(fish.id);
                        setFishStarRating(fish.id, 0);
                      } else {
                        // Already captured, just change rating
                        setFishStarRating(fish.id, n);
                      }
                    }}
                  />
                </div>
              </div>
              <div className={styles.cardFooter}>
                <span className={styles.cardName}>{fish.name}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const detailPanel = selected ? (
    <div className={styles.detail}>
      {/* Header */}
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
          <p className={styles.detailDesc}>{selected.description}</p>
        </div>
        <button
          type="button"
          className={`${styles.captureBtn} ${capturedFishIds.includes(selected.id) ? styles.captureBtnOn : ""}`}
          onClick={() => toggleFishCaptured(selected.id)}
        >
          {capturedFishIds.includes(selected.id) ? "✓ 已捕获" : "标记已捕获"}
        </button>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <span className={styles.statIcon}>🌊</span>
          <span className={styles.statLabel}>深度范围</span>
          <span className={styles.statValue}>
            {selected.depthMin}–{selected.depthMax}m
          </span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statIcon}>❤️</span>
          <span className={styles.statLabel}>血量</span>
          <span className={styles.statValue}>{selected.hp}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statIcon}>⚡</span>
          <span className={styles.statLabel}>攻击力</span>
          <span className={styles.statValue}>{selected.attack}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statIcon}>🔫</span>
          <span className={styles.statLabel}>推荐武器</span>
          <span className={styles.statValue}>
            {WEAPON_LABELS[selected.recommendedWeapon] ?? "—"}
          </span>
        </div>
      </div>

      {/* Recipes */}
      {relatedRecipes.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>🍽️ 可制作料理</h3>
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

      {/* Map */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>📍 地图位置</h3>
        <button
          type="button"
          className={styles.mapBtn}
          onClick={() => navigate("/map")}
        >
          🗺️ 在地图中查看出没地点
        </button>
      </div>
    </div>
  ) : null;

  return (
    <EncyclopediaLayout
      listPanel={listPanel}
      detailPanel={detailPanel}
      hasSelection={!!selected}
      emptyMessage="← 从左侧选择一种鱼类查看详情"
    />
  );
}
