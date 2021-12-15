import { MouseEvent } from "react";
import { MdClose } from "react-icons/md";

import { Button } from "../Button";

import styles from "./styles.module.scss";

interface ModalProps {
  title?: string;
  opened: boolean;
  onClose?: (ev?: MouseEvent<HTMLButtonElement>) => void;
}

export const Modal: React.FC<ModalProps> = ({
  title = "",
  opened,
  onClose,
  children,
}) => {
  return (
    <div
      className={styles.overlay}
      onClick={() => onClose && onClose()}
      style={{ display: opened ? "flex" : "none" }}
    >
      <div className={styles.container} onClick={(ev) => ev.stopPropagation()}>
        <div className={styles.titleContainer}>
          {title && <h4 className={styles.title}>{title}</h4>}

          <Button title="Fechar" icon={<MdClose />} onClick={onClose} />
        </div>

        {children}
      </div>
    </div>
  );
};
