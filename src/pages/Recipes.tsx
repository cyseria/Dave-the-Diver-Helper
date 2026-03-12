import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EncyclopediaLayout } from "../components/EncyclopediaLayout";
import { TabBar } from "../components/TabBar";
import type { TabItem } from "../components/TabBar";
import { recipeData } from "../data/recipes";
import { usePlayerProgress } from "../store/usePlayerProgress";
import { RecipeTips } from "./RecipeTips";
import styles from "./Recipes.module.css";

type RecipesPageTab = "guide" | "tips";

const PAGE_TABS: TabItem<RecipesPageTab>[] = [
  { id: "guide", label: "食谱图鉴", emoji: "📖" },
  { id: "tips", label: "推荐", emoji: "⭐" },
];

type RecipeSortKey = "unlocked" | "sellPrice" | "tastiness";

export function Recipes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pageTab, setPageTab] = useState<RecipesPageTab>("guide");
  const [sortKey, setSortKey] = useState<RecipeSortKey>("unlocked");
  const { unlockedRecipeIds, capturedFishIds, toggleRecipeUnlocked } =
    usePlayerProgress();

  const selected = id ? recipeData.find((r) => r.id === id) : null;

  const sortedRecipes = useMemo(() => {
    const withMeta = recipeData.map((r) => ({
      r,
      unlocked: unlockedRecipeIds.includes(r.id),
    }));

    withMeta.sort((a, b) => {
      if (sortKey === "unlocked") {
        if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1;
        return a.r.name.localeCompare(b.r.name, "zh-Hans-CN");
      }
      if (sortKey === "sellPrice") {
        if (b.r.sellPrice !== a.r.sellPrice) return b.r.sellPrice - a.r.sellPrice;
        return a.r.name.localeCompare(b.r.name, "zh-Hans-CN");
      }
      if (b.r.tastiness !== a.r.tastiness) return b.r.tastiness - a.r.tastiness;
      return a.r.name.localeCompare(b.r.name, "zh-Hans-CN");
    });

    return withMeta.map((x) => x.r);
  }, [sortKey, unlockedRecipeIds]);

  const listPanel = (
    <div className={styles.listWrap}>
      <div className={styles.listHeader}>
        <div className={styles.listHeaderLeft}>
          <span className={styles.listTitle}>食谱图鉴</span>
          <span className={styles.listCount}>
            <span className={styles.countUnlocked}>
              {unlockedRecipeIds.length}
            </span>
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
            <option value="unlocked">是否已解锁（默认）</option>
            <option value="sellPrice">出售价格（高 → 低）</option>
            <option value="tastiness">美味度（高 → 低）</option>
          </select>
        </label>
      </div>
      <div className={styles.grid}>
        {sortedRecipes.map((recipe) => {
          const unlocked = unlockedRecipeIds.includes(recipe.id);
          const isSelected = recipe.id === id;
          return (
            <div
              key={recipe.id}
              className={`${styles.card} ${isSelected ? styles.cardSelected : ""} ${unlocked ? styles.cardUnlocked : ""}`}
              onClick={() => navigate(`/recipes/${recipe.id}`)}
              onKeyDown={(e) =>
                e.key === "Enter" && navigate(`/recipes/${recipe.id}`)
              }
              // biome-ignore lint/a11y/noNoninteractiveTabindex: card with nested toggle button
              tabIndex={0}
            >
              <div className={styles.cardImg}>
                <button
                  type="button"
                  className={`${styles.cardCornerToggle} ${unlocked ? styles.cardCornerToggleOn : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleRecipeUnlocked(recipe.id);
                  }}
                  title={unlocked ? "取消解锁" : "标记已解锁"}
                >
                  {unlocked ? "✓" : ""}
                </button>
                <span className={styles.cardEmoji}>{recipe.emoji}</span>
                {!unlocked && <span className={styles.lockOverlay}>🔒</span>}
              </div>
              <div className={styles.cardFooter}>
                <span className={styles.cardLevelTag}>Lv.{recipe.level}</span>
                <span className={styles.cardName}>{recipe.name}</span>
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
        <div className={styles.detailMeta}>
          <div className={styles.levelBadge}>Lv.{selected.level}</div>
          <h1 className={styles.detailName}>{selected.name}</h1>

          <div className={styles.priceRow}>
            <span className={styles.priceIcon}>💰</span>
            <span className={styles.priceVal}>{selected.sellPrice}</span>
            <span className={styles.priceCur}>金</span>
          </div>

          <div className={styles.metaStats}>
            <div className={styles.metaStat}>
              <span>😋</span>
              <span className={styles.metaStatLabel}>美味度</span>
              <span className={styles.metaStatVal}>{selected.tastiness}</span>
            </div>
            <div className={styles.metaStat}>
              <span>🍽️</span>
              <span className={styles.metaStatLabel}>出餐量</span>
              <span className={styles.metaStatVal}>{selected.servings}</span>
            </div>
            <div className={styles.metaStat}>
              <span>🔥</span>
              <span className={styles.metaStatLabel}>工匠之火</span>
              <span className={styles.metaStatVal}>
                {selected.artisanFlameCost ?? "—"}
              </span>
            </div>
          </div>
        </div>
        <button
          type="button"
          className={`${styles.unlockBtn} ${unlockedRecipeIds.includes(selected.id) ? styles.unlockBtnOn : ""}`}
          onClick={() => toggleRecipeUnlocked(selected.id)}
        >
          {unlockedRecipeIds.includes(selected.id) ? "✓ 已解锁" : "标记已解锁"}
        </button>
      </div>

      {/* Description */}
      <p className={styles.description}>{selected.description}</p>

      {/* Obtain method */}
      <div className={styles.obtainRow}>
        <span className={styles.obtainIcon}>📖</span>
        <div>
          <span className={styles.obtainLabel}>获取方式</span>
          <span className={styles.obtainVal}>{selected.obtainMethod}</span>
        </div>
      </div>

      {/* Ingredients */}
      <div className={styles.ingredSection}>
        <h3 className={styles.sectionTitle}>所需食材</h3>
        <div className={styles.ingredList}>
          {selected.ingredients.map((ing) => {
            const hasFish = ing.fishId
              ? capturedFishIds.includes(ing.fishId)
              : true;
            return (
              <button
                type="button"
                key={ing.id}
                className={`${styles.ingredRow} ${!hasFish ? styles.ingredMissing : ""}`}
                onClick={() => {
                  if (ing.fishId) navigate(`/fish/${ing.fishId}`);
                }}
                disabled={!ing.fishId}
              >
                <span className={styles.ingredEmoji}>{ing.emoji}</span>
                <div className={styles.ingredInfo}>
                  <span className={styles.ingredName}>{ing.name}</span>
                  <span className={styles.ingredLocation}>
                    📍 {ing.location}
                  </span>
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
