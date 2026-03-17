import { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EncyclopediaLayout } from "../../components/EncyclopediaLayout";
import { TabBar } from "../../components/TabBar";
import type { TabItem } from "../../components/TabBar";
import { recipeData } from "../../data/recipesNamed";
import { getRecipeImageUrl } from "../../utils/recipeImage";
import { usePlayerProgress } from "../../store/usePlayerProgress";
import type { Recipe } from "../../types";
import { RecipeTips } from "./RecipeTips";
import styles from "./Recipes.module.css";

type RecipesPageTab = "guide" | "tips";
const PAGE_TABS: TabItem<RecipesPageTab>[] = [
  { id: "tips", label: "推荐", emoji: "⭐" },
  { id: "guide", label: "食谱图鉴", emoji: "📖" },
];

type RecipeSortKey = "obtained" | "sellPrice" | "tastiness";

// ── Component ─────────────────────────────────────────────────────────────────

export function Recipes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pageTab, setPageTab] = useState<RecipesPageTab>("tips");
  const [sortKey, setSortKey] = useState<RecipeSortKey>("obtained");
  const { recipeEnhanceLevels, setRecipeEnhanceLevel, capturedFishIds } =
    usePlayerProgress();

  const selected = id ? recipeData.find((r) => r.id === id) ?? null : null;

  const isObtained = selected
    ? (recipeEnhanceLevels[selected.id] ?? 0) >= 1
    : false;

  const sortedRecipes = useMemo<Recipe[]>(() => {
    const copy = [...recipeData];
    if (sortKey === "obtained") {
      copy.sort((a, b) => {
        const ha = (recipeEnhanceLevels[a.id] ?? 0) >= 1 ? 1 : 0;
        const hb = (recipeEnhanceLevels[b.id] ?? 0) >= 1 ? 1 : 0;
        if (hb !== ha) return hb - ha;
        return a.name.localeCompare(b.name, "zh-Hans-CN");
      });
    } else if (sortKey === "sellPrice") {
      copy.sort((a, b) => {
        if (b.sellPrice !== a.sellPrice) return b.sellPrice - a.sellPrice;
        return a.name.localeCompare(b.name, "zh-Hans-CN");
      });
    } else {
      copy.sort((a, b) => {
        if (b.tastiness !== a.tastiness) return b.tastiness - a.tastiness;
        return a.name.localeCompare(b.name, "zh-Hans-CN");
      });
    }
    return copy;
  }, [sortKey, recipeEnhanceLevels]);

  // Default select first recipe when entering guide tab
  useEffect(() => {
    if (pageTab !== "guide") return;
    if (id) return;
    const first = sortedRecipes[0];
    if (!first) return;
    navigate(`/recipes/${first.id}`, { replace: true });
  }, [pageTab, id, sortedRecipes, navigate]);

  // Summary: how many obtained (level >= 1)
  const obtainedCount = useMemo(
    () => recipeData.filter((r) => (recipeEnhanceLevels[r.id] ?? 0) >= 1).length,
    [recipeEnhanceLevels],
  );

  // ── List panel ──────────────────────────────────────────────────────────────
  const listPanel = (
    <div className={styles.listWrap}>
      <div className={styles.listHeader}>
        <div className={styles.listHeaderLeft}>
          <span className={styles.listTitle}>食谱图鉴</span>
          <span className={styles.listCount}>
            <span className={styles.countHighlight}>{obtainedCount}</span>
            {" / "}
            {recipeData.length}
          </span>
        </div>
        <label className={styles.sortWrap}>
          <span className={styles.sortLabel}>排序</span>
          <select
            className={styles.sortSelect}
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as RecipeSortKey)}
          >
            <option value="obtained">已获得优先</option>
            <option value="sellPrice">出售价格（高→低）</option>
            <option value="tastiness">美味度（高→低）</option>
          </select>
        </label>
      </div>
      <div className={styles.grid}>
        {sortedRecipes.map((recipe) => {
          const hasIt = (recipeEnhanceLevels[recipe.id] ?? 0) >= 1;
          const isSelected = recipe.id === id;
          return (
            <div
              key={recipe.id}
              className={`${styles.card} ${isSelected ? styles.cardSelected : ""} ${hasIt ? styles.cardOwned : ""}`}
              onClick={() => navigate(`/recipes/${recipe.id}`)}
              onKeyDown={(e) =>
                e.key === "Enter" && navigate(`/recipes/${recipe.id}`)
              }
              // biome-ignore lint/a11y/noNoninteractiveTabindex: card is a clickable list item
              tabIndex={0}
            >
              <div className={styles.cardImg}>
                {(() => {
                  const imgUrl = getRecipeImageUrl(recipe.name);
                  return imgUrl ? (
                    <img src={imgUrl} alt="" className={styles.cardImgPhoto} />
                  ) : (
                    <span className={styles.cardEmoji}>{recipe.emoji}</span>
                  );
                })()}
                {!hasIt && <span className={styles.lockOverlay}>🔒</span>}
                {hasIt && <span className={styles.obtainedBadge}>✓</span>}
              </div>
              <div className={styles.cardFooter}>
                <span className={styles.cardName}>{recipe.name}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── Detail panel ────────────────────────────────────────────────────────────
  const detailPanel = selected ? (
    <div className={styles.detail}>
      {/* ── Header ── */}
      <div className={styles.detailTop}>
        <div className={styles.detailImgBox}>
          {(() => {
            const imgUrl = getRecipeImageUrl(selected.name);
            return imgUrl ? (
              <img src={imgUrl} alt="" className={styles.detailImgPhoto} />
            ) : (
              <span className={styles.detailEmoji}>{selected.emoji}</span>
            );
          })()}
        </div>
        <div className={styles.detailMeta}>
          <h1 className={styles.detailName}>{selected.name}</h1>

          {/* Info badges: artisan flame + current price */}
          <div className={styles.detailBadges}>
            {selected.artisanFlameCost !== undefined && (
              <span className={styles.flameBadge}>
                🔥 {selected.artisanFlameCost} 工匠之火
              </span>
            )}
            {isObtained && (
              <span className={styles.priceBadge}>
                💰 {selected.sellPrice} 金
              </span>
            )}
          </div>

          <p className={styles.detailDesc}>{selected.description}</p>
          <div className={styles.obtainRow}>
            <span className={styles.obtainIcon}>📖</span>
            <span className={styles.obtainVal}>{selected.obtainMethod}</span>
          </div>
        </div>

        {/* ── 已获得/未获得 切换 ── */}
        <button
          type="button"
          className={isObtained ? styles.obtainedToggle : styles.notObtainedToggle}
          onClick={() =>
            setRecipeEnhanceLevel(selected.id, isObtained ? 0 : 1)
          }
        >
          {isObtained ? "✓ 已获得" : "未获得"}
        </button>
      </div>

      {/* ── Ingredients first ── */}
      <div className={styles.ingredSection}>
        <h3 className={styles.sectionTitle}>🥘 所需食材（每份）</h3>
        <div className={styles.ingredList}>
          {selected.ingredients.map((ing) => {
            const hasFish = ing.fishId
              ? capturedFishIds.includes(ing.fishId)
              : true;
            return (
              <button
                type="button"
                key={`base-${ing.id}`}
                className={`${styles.ingredRow} ${!hasFish ? styles.ingredMissing : ""}`}
                onClick={() => {
                  if (ing.fishId) navigate(`/fish/${ing.fishId}`);
                }}
                disabled={!ing.fishId}
              >
                <span className={styles.ingredEmoji}>{ing.emoji}</span>
                <div className={styles.ingredInfo}>
                  <span className={styles.ingredName}>{ing.name}</span>
                  <span className={styles.ingredLocation}>📍 {ing.location}</span>
                </div>
                <div className={styles.ingredRight}>
                  <span className={styles.ingredQty}>×{ing.quantity}</span>
                  {!hasFish && <span className={styles.missingTag}>缺</span>}
                </div>
              </button>
            );
          })}
        </div>
        {selected.ingredients.some(
          (ing) => ing.fishId && !capturedFishIds.includes(ing.fishId),
        ) && (
          <div className={styles.missingAlert}>
            ⚠️ 有食材尚未捕获，点击食材行可前往对应鱼类图鉴查看。
          </div>
        )}
      </div>

    </div>
  ) : null;

  return (
    <div className={styles.recipesPage}>
      <TabBar
        tabs={PAGE_TABS}
        value={pageTab}
        onChange={setPageTab}
        aria-label="食谱页面切换"
      />
      {pageTab === "guide" ? (
        <EncyclopediaLayout
          listPanel={listPanel}
          detailPanel={detailPanel}
          hasSelection={!!selected}
          emptyMessage="← 从左侧选择一个食谱查看详情"
        />
      ) : (
        <RecipeTips />
      )}
    </div>
  );
}
