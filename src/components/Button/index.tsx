import { ButtonHTMLAttributes } from "react";

import styles from "./styles.module.scss";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  text?: string;
  icon?: React.ReactNode | string;
  background?: string;
  color?: string;
  iconBackground?: string;
  iconColor?: string;
  outlined?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  text,
  icon,
  background = "white",
  color = "#444444",
  iconBackground,
  iconColor,
  outlined,
  ...props
}) => {
  return (
    <button
      {...props}
      title={title}
      className={`${styles.container} ${props.className || ""}`}
      style={{
        background: outlined ? "transparent" : background,
        color,
        border: outlined ? `1px solid ${color}` : 0,
        ...props.style,
      }}
    >
      {icon && (
        <span
          className={styles.iconContainer}
          style={{ color: iconColor, background: iconBackground }}
        >
          {icon}
        </span>
      )}

      {(text || !icon) && <span className={styles.content}>{text}</span>}
    </button>
  );
};
