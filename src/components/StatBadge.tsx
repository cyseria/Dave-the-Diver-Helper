import styles from "./StatBadge.module.css";

interface StatBadgeProps {
  label: string;
  value: string;
  icon?: string;
  variant?: "default" | "depth" | "weapon" | "rarity";
}

export function StatBadge({
  label,
  value,
  icon,
  variant = "default",
}: StatBadgeProps) {
  return (
    <div className={`${styles.badge} ${styles[variant]}`}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <div className={styles.text}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{value}</span>
      </div>
    </div>
  );
}
