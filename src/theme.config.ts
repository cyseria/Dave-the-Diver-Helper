export const theme = {
  colors: {
    background: "#F5F0E8",
    surface: "#FFFDF7",
    surfaceAlt: "#EDE8DC",
    border: "#3D2B1F",
    primary: "#E87040",
    primaryLight: "#FDE8DC",
    secondary: "#6BAF7A",
    secondaryLight: "#E0F0E4",
    text: "#2A1F14",
    textSecondary: "#7A6A5A",
    textMuted: "#ADA090",
    success: "#5AA469",
    warning: "#E8A040",
    danger: "#D94040",
    depthShallow: "#B8DCEA",
    depthMiddle: "#5E9BB5",
    depthDeep: "#2B5F80",
    depthAbyssal: "#0E2A40",
  },
  pixel: {
    border: "2px solid #3D2B1F",
    shadow: "3px 3px 0 #3D2B1F",
    shadowSm: "2px 2px 0 #3D2B1F",
    shadowInset: "inset 2px 2px 0 rgba(255,255,255,0.4)",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
  },
  fontSize: {
    xs: "10px",
    sm: "12px",
    md: "14px",
    lg: "17px",
    xl: "21px",
  },
  layout: {
    topbarHeight: "58px",
    listRatio: "32%",
    detailRatio: "68%",
    maxWidth: "1280px",
  },
  rarity: {
    common: "#7A6A5A",
    uncommon: "#5AA469",
    rare: "#4A8EC2",
    legendary: "#C27A2A",
  },
} as const;

export function applyTheme(): void {
  const root = document.documentElement;
  const c = theme.colors;

  const vars: [string, string][] = [
    ["--color-bg", c.background],
    ["--color-surface", c.surface],
    ["--color-surface-alt", c.surfaceAlt],
    ["--color-border", c.border],
    ["--color-primary", c.primary],
    ["--color-primary-light", c.primaryLight],
    ["--color-secondary", c.secondary],
    ["--color-secondary-light", c.secondaryLight],
    ["--color-text", c.text],
    ["--color-text-secondary", c.textSecondary],
    ["--color-text-muted", c.textMuted],
    ["--color-success", c.success],
    ["--color-warning", c.warning],
    ["--color-danger", c.danger],
    ["--color-depth-shallow", c.depthShallow],
    ["--color-depth-middle", c.depthMiddle],
    ["--color-depth-deep", c.depthDeep],
    ["--color-depth-abyssal", c.depthAbyssal],
    ["--topbar-height", theme.layout.topbarHeight],
    ["--pixel-border", theme.pixel.border],
    ["--pixel-shadow", theme.pixel.shadow],
    ["--pixel-shadow-sm", theme.pixel.shadowSm],
  ];

  for (const [key, value] of vars) {
    root.style.setProperty(key, value);
  }
}
