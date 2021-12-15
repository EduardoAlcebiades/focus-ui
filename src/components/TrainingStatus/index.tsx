import { useContext, useEffect, useState } from "react";
import { FiAlertOctagon } from "react-icons/fi";
import { MdCheck, MdClose } from "react-icons/md";

import { ExercisesContext } from "../../context/ExercisesContext";
import { AuthContext } from "../../context/AuthContext";
import { Button } from "../Button";

import styles from "./styles.module.scss";

export const TrainingStatus: React.FC = () => {
  const { user, signIn } = useContext(AuthContext);
  const {
    activeCurrent,
    lastFinishedCurrentDate,
    startNewCurrent,
    stopActiveCurrent,
    hasAvailableCurrent,
    refreshStatus,
  } = useContext(ExercisesContext);

  const [countDown, setCountDown] = useState<string | null>(null);

  function getCountDown(nextDate: Date) {
    const currentDate = new Date();

    if (currentDate > nextDate) return null;

    const distance = nextDate.getTime() - currentDate.getTime();

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    let data: string[] = [];

    if (days) data.push(`${days}d`);
    if (days || hours) data.push(`${hours}h`);
    if (hours || minutes) data.push(`${minutes}m`);
    if (minutes || seconds) data.push(`${seconds}s`);

    return data.join(" ");
  }

  useEffect(() => {
    if (!countDown || user?.id) refreshStatus();
  }, [countDown, user?.id, refreshStatus]);

  useEffect(() => {
    if (!activeCurrent && !hasAvailableCurrent && lastFinishedCurrentDate) {
      const dateToNextCurrent = lastFinishedCurrentDate;

      dateToNextCurrent.setMinutes(
        dateToNextCurrent.getMinutes() + (user?.training_frequency || 0)
      );

      const interval = setInterval(() => {
        const data = getCountDown(dateToNextCurrent);

        setCountDown(data);

        if (!data) return () => clearInterval(interval);
      }, 1000);

      return () => clearInterval(interval);
    } else setCountDown(null);
  }, [
    lastFinishedCurrentDate,
    user?.training_frequency,
    hasAvailableCurrent,
    activeCurrent,
  ]);

  if (activeCurrent)
    return (
      <Button
        className={styles.stopButton}
        title="Encerrar"
        text="Encerrar treino"
        icon={<MdClose />}
        onClick={() => {
          stopActiveCurrent(() => signIn(String(user?.phone_number)));
        }}
      />
    );

  if (hasAvailableCurrent)
    return (
      <Button
        className={styles.startButton}
        title="Iniciar"
        text="Iniciar treino"
        icon={<MdCheck />}
        onClick={() => startNewCurrent()}
      />
    );

  return (
    <div className={styles.noContent}>
      <FiAlertOctagon color="#f18b2b" size={36} />

      <p>Nenhum treino disponível no momento!</p>
      <span>Tente voltar mais tarde...</span>
      {countDown && (
        <span className={styles.lastStatus}>
          Próximo treino disponível em: <strong>{countDown}</strong>
        </span>
      )}
    </div>
  );
};
