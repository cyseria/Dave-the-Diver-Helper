import styles from "./ProgressBar.module.css";

interface ProgressBarProps {
  label: string;
  value: number;
  max?: number;
  showValue?: boolean;
  variant?: "default" | "success" | "warning" | "info" | "primary";
}

export function ProgressBar({
  label,
  value,
  max = 100,
  showValue = true,
  variant = "default",
}: ProgressBarProps) {
  const pct = Math.round((value / max) * 100);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        {showValue && (
          <span className={styles.value}>
            {value} / {max}
          </span>
        )}
      </div>
      <div className={styles.track}>
        <div
          className={`${styles.fill} ${styles[variant]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
