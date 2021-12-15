import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

import styles from "./styles.module.scss";

export const ExperienceBar: React.FC = () => {
  const { user } = useContext(AuthContext);

  const [xpPercent, setXpPercent] = useState<number>(0);

  useEffect(() => {
    if (user?.xp_to_next_level && user?.current_xp)
      setXpPercent((user.current_xp * 100) / user.xp_to_next_level);
  }, [user?.xp_to_next_level, user?.current_xp]);

  return (
    <div className={styles.container}>
      <span>0 xp</span>
      <div>
        <div style={{ width: `${xpPercent}%` }} />

        {Boolean(xpPercent) && (
          <span
            className={styles.currentExperience}
            style={{ left: `${xpPercent}%` }}
          >
            {user?.current_xp} xp
          </span>
        )}
      </div>

      <span>{user?.xp_to_next_level} xp</span>
    </div>
  );
};
