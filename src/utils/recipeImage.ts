/**
 * 菜谱图片：cropped 目录下按菜名命名的图片
 */
const recipeImages = import.meta.glob<string>(
  "../images/recipes/cropped/*.{jpg,jpeg,png,webp}",
  { as: "url", eager: true }
);

const byName = (() => {
  const map = new Map<string, string>();
  for (const [path, url] of Object.entries(recipeImages)) {
    const match = path.match(/[/\\]([^/\\]+)\.(jpg|jpeg|png|webp)$/i);
    if (match) map.set(match[1], url);
  }
  return map;
})();

export function getRecipeImageUrl(recipeName: string): string | null {
  return byName.get(recipeName) ?? null;
}
