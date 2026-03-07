/**
 * WoW / RPG rarity-tier color system — design palette reference
 *
 * Common     → grey
 * Uncommon   → green
 * Rare       → blue
 * Epic       → purple
 * Legendary  → orange
 */

export type RarityTier = "common" | "uncommon" | "rare" | "epic" | "legendary";

export const RARITY_COLORS: Record<RarityTier, string> = {
  common: "oklch(0.70 0.02 250)",
  uncommon: "oklch(0.68 0.18 150)",
  rare: "oklch(0.62 0.20 255)",
  epic: "oklch(0.58 0.24 300)",
  legendary: "oklch(0.75 0.18 55)",
};
