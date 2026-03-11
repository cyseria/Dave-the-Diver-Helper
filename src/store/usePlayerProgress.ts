import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PlayerProgressState {
  storyProgress: number;
  weaponLevel: number;
  capturedFishIds: string[];
  unlockedRecipeIds: string[];
  hiredStaffIds: string[];
  ownedWeaponIds: string[];
  fishStarRatings: Record<string, number>; // custom per-fish star rating
  toggleFishCaptured: (id: string) => void;
  toggleRecipeUnlocked: (id: string) => void;
  toggleStaffHired: (id: string) => void;
  toggleWeaponOwned: (id: string) => void;
  setStoryProgress: (value: number) => void;
  setWeaponLevel: (value: number) => void;
  setFishStarRating: (id: string, stars: number) => void;
}

export const usePlayerProgress = create<PlayerProgressState>()(
  persist(
    (set, get) => ({
      storyProgress: 35,
      weaponLevel: 2,
      capturedFishIds: ["clownfish", "blue_tang", "pufferfish"],
      unlockedRecipeIds: ["clownfish_sushi", "blue_tang_salad", "salmon_bowl"],
      hiredStaffIds: [],
      ownedWeaponIds: ["rifle_base"],
      fishStarRatings: {},
      toggleFishCaptured: (id) => {
        const { capturedFishIds } = get();
        set({
          capturedFishIds: capturedFishIds.includes(id)
            ? capturedFishIds.filter((f) => f !== id)
            : [...capturedFishIds, id],
        });
      },
      toggleRecipeUnlocked: (id) => {
        const { unlockedRecipeIds } = get();
        set({
          unlockedRecipeIds: unlockedRecipeIds.includes(id)
            ? unlockedRecipeIds.filter((r) => r !== id)
            : [...unlockedRecipeIds, id],
        });
      },
      toggleStaffHired: (id) => {
        const { hiredStaffIds } = get();
        set({
          hiredStaffIds: hiredStaffIds.includes(id)
            ? hiredStaffIds.filter((s) => s !== id)
            : [...hiredStaffIds, id],
        });
      },
      toggleWeaponOwned: (id) => {
        const { ownedWeaponIds } = get();
        set({
          ownedWeaponIds: ownedWeaponIds.includes(id)
            ? ownedWeaponIds.filter((w) => w !== id)
            : [...ownedWeaponIds, id],
        });
      },
      setStoryProgress: (value) => set({ storyProgress: value }),
      setWeaponLevel: (value) => set({ weaponLevel: value }),
      setFishStarRating: (id, stars) => {
        const { fishStarRatings } = get();
        set({ fishStarRatings: { ...fishStarRatings, [id]: stars } });
      },
    }),
    { name: "dave-helper-progress" },
  ),
);
