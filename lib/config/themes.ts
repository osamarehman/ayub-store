/**
 * Theme configurations for Bin Ayub General Store
 * Switch between different luxury themes
 */

export const themes = {
  elegantBlue: {
    name: "Elegant Blue",
    value: "elegant-blue",
    description: "Classic blue from the Bin Ayub logo",
    preview: {
      primary: "#2563EB",
      secondary: "#202020",
    },
  },
  royalGold: {
    name: "Royal Gold",
    value: "royal-gold",
    description: "Luxurious gold with deep purple accents",
    preview: {
      primary: "#f59e0b",
      secondary: "#7c2d92",
    },
  },
  roseLuxury: {
    name: "Rose Luxury",
    value: "rose-luxury",
    description: "Elegant rose pink with purple undertones",
    preview: {
      primary: "#ec4899",
      secondary: "#9333ea",
    },
  },
  emeraldPrestige: {
    name: "Emerald Prestige",
    value: "emerald-prestige",
    description: "Prestigious emerald green with teal",
    preview: {
      primary: "#10b981",
      secondary: "#0891b2",
    },
  },
  midnightBlack: {
    name: "Midnight Black",
    value: "midnight-black",
    description: "Dark elegant theme with blue and gold accents",
    preview: {
      primary: "#3b82f6",
      secondary: "#f59e0b",
    },
  },
} as const;

export type ThemeName = keyof typeof themes;

export function setTheme(themeName: ThemeName) {
  if (typeof window === "undefined") return;

  const themeValue = themes[themeName].value;

  // Remove all theme data attributes
  document.documentElement.removeAttribute("data-theme");

  // Set new theme (if not default)
  if (themeValue !== "elegant-blue") {
    document.documentElement.setAttribute("data-theme", themeValue);
  }

  // Save to localStorage
  localStorage.setItem("bin-ayub-theme", themeValue);
}

export function getTheme(): ThemeName {
  if (typeof window === "undefined") return "elegantBlue";

  const saved = localStorage.getItem("bin-ayub-theme");

  // Find theme by value
  const theme = Object.entries(themes).find(
    ([_, config]) => config.value === saved
  );

  return (theme?.[0] as ThemeName) || "elegantBlue";
}

export function initTheme() {
  if (typeof window === "undefined") return;

  const currentTheme = getTheme();
  setTheme(currentTheme);
}
