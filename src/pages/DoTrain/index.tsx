import { MdPerson } from "react-icons/md";
import { GoArrowUp } from "react-icons/go";
import { IoSettingsSharp } from "react-icons/io5";
import { NavLink } from "react-router-dom";

import { ExperienceBar } from "../../components/ExperienceBar";
import { MessageInfo } from "../../components/MessageInfo";
import { CurrentTaskCard } from "../../components/CurrentTaskCard";
import { TrainingStatus } from "../../components/TrainingStatus";
import { ExercisesProvider } from "../../context/ExercisesContext";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

import styles from "./styles.module.scss";
import { Button } from "../../components/Button";
import { FiLogOut } from "react-icons/fi";

export const DoTrain: React.FC = () => {
  const { user, signOut } = useContext(AuthContext);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.buttonsGroup}>
          {user?.is_trainer && (
            <NavLink
              to="/management"
              className={styles.navigate}
              title="Gerenciar"
            >
              <IoSettingsSharp />
            </NavLink>
          )}

          <Button
            className={styles.navigate}
            title="Sair"
            icon={<FiLogOut />}
            color="#eb326a"
            background="#eb326a"
            onClick={signOut}
            outlined
          />
        </div>

        <ExperienceBar />
      </header>

      <div className={styles.content}>
        <MessageInfo
          className={styles.profile}
          icon={<MdPerson />}
          titleInfo={`${user?.first_name || ""} ${user?.last_name || ""} #${
            user?.code || ""
          }`}
          content={
            <span>
              <GoArrowUp color="#09d687" /> Level {user?.level} -{" "}
              {user?.experience?.name}
            </span>
          }
        />

        <ExercisesProvider>
          <CurrentTaskCard />

          <TrainingStatus />
        </ExercisesProvider>
      </div>
    </div>
  );
};
