import React, { HTMLAttributes } from "react";

import styles from "./styles.module.scss";

interface MessageInfoProps extends HTMLAttributes<HTMLDivElement> {
  titleInfo?: React.ReactNode | string;
  content?: React.ReactNode | string;
  icon?: React.ReactNode;
}

export const MessageInfo: React.FC<MessageInfoProps> = ({
  titleInfo,
  content,
  icon,
  ...props
}) => {
  return (
    <div {...props} className={`${styles.container} ${props.className || ""}`}>
      {icon && <span className={styles.iconContainer}>{icon}</span>}

      <p className={styles.content}>
        {titleInfo && <strong>{titleInfo}</strong>}
        {content}
      </p>
    </div>
  );
};
