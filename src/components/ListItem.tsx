import styles from "./ListItem.module.css";

interface ListItemProps {
  emoji: string;
  name: string;
  subtext: string;
  checked?: boolean;
  selected?: boolean;
  rarityColor?: string;
  onClick?: () => void;
  onCheckChange?: () => void;
}

export function ListItem({
  emoji,
  name,
  subtext,
  checked = false,
  selected = false,
  rarityColor,
  onClick,
  onCheckChange,
}: ListItemProps) {
  return (
    <button
      type="button"
      className={`${styles.item} ${selected ? styles.selected : ""}`}
      onClick={onClick}
    >
      {rarityColor && (
        <div className={styles.rarityBar} style={{ background: rarityColor }} />
      )}
      <span className={styles.emoji}>{emoji}</span>
      <div className={styles.info}>
        <span className={`${styles.name} ${checked ? styles.captured : ""}`}>
          {name}
        </span>
        <span className={styles.subtext}>{subtext}</span>
      </div>
      <button
        type="button"
        className={`${styles.checkbox} ${checked ? styles.checkboxChecked : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          onCheckChange?.();
        }}
        aria-label={checked ? "标记为未捕获" : "标记为已捕获"}
      >
        {checked ? "✓" : ""}
      </button>
    </button>
  );
}
