import type { Recipe } from "../types";

// Mock 数据：由 npm run mock-recipes-from-named 生成，与 named/cropped 目录对应
import mockRaw from "./mock-recipes.json";

interface MockIngredient {
  name: string;
  location: string;
  quantity: number;
}

interface MockRecipe {
  id: string;
  name: string;
  emoji: string;
  description: string;
  ingredients: MockIngredient[];
}

function toRecipe(raw: MockRecipe): Recipe {
  return {
    ...raw,
    level: 1,
    sellPrice: 500,
    tastiness: 200,
    servings: 10,
    obtainMethod: "待补充",
    ingredients: raw.ingredients.map((ing, i) => ({
      id: `${raw.id}_ing_${i}`,
      name: ing.name,
      emoji: "🐟",
      quantity: ing.quantity,
      location: ing.location,
    })),
  };
}

export const recipeData: Recipe[] = (mockRaw as MockRecipe[]).map(toRecipe);
