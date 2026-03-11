import type { ReactNode } from "react";
import styles from "./Card.module.css";

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  variant?: "default" | "primary" | "secondary";
}

export function Card({
  title,
  children,
  className = "",
  variant = "default",
}: CardProps) {
  return (
    <div className={`${styles.card} ${styles[variant]} ${className}`}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <div className={styles.content}>{children}</div>
    </div>
  );
}
