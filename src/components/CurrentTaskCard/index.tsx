import { useCallback, useContext, useEffect, useState } from "react";

import { GiStrong } from "react-icons/gi";
import { BiTimer } from "react-icons/bi";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { IoReload } from "react-icons/io5";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Button } from "../Button";
import { MessageInfo } from "../MessageInfo";
import { ICurrentExercise } from "../../models/ICurrentExercise";
import { ExercisesContext } from "../../context/ExercisesContext";

import styles from "./styles.module.scss";

export const CurrentTaskCard: React.FC = () => {
  const { activeCurrent, skipExercise, finishExercise, resetExercise } =
    useContext(ExercisesContext);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [totalLength, setTotalLength] = useState<number | null>(null);
  const [currentExercise, setCurrentExercise] =
    useState<ICurrentExercise | null>(null);

  const nextExercise = useCallback(() => {
    setActiveIndex((prev) =>
      totalLength && prev < totalLength ? prev + 1 : prev
    );
  }, [totalLength]);

  const previousExercise = useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  useEffect(() => {
    if (!activeCurrent?.currentExercises) {
      setCurrentExercise(null);
      setActiveIndex(0)
      setTotalLength(0)
    } else {
      const currentExercise = activeCurrent.currentExercises[activeIndex];

      setCurrentExercise(currentExercise || null);
    }
  }, [activeCurrent, activeIndex]);

  useEffect(() => {
    if (activeCurrent?.currentExercises)
      setTotalLength(activeCurrent.currentExercises.length);
    else setTotalLength(null);
  }, [activeCurrent]);

  return (
    <>
      {!activeCurrent ? (
        false
      ) : (
        <div className={styles.container}>
          <h3 className={styles.header}>
            {activeCurrent.training?.name}{" "}
            {activeCurrent.started_at && (
              <span>
                [Iniciado às{" "}
                {format(new Date(activeCurrent.started_at), "HH:mm", {
                  locale: ptBR,
                })}
                h]
              </span>
            )}
          </h3>

          <h4 className={styles.title}>
            {currentExercise?.exercise?.name} (
            {currentExercise?.exercise?.xp_amount}xp)
            <span>
              {activeIndex + 1} / {totalLength}
            </span>
          </h4>

          <div className={styles.content}>
            <Button
              title="Anterior"
              icon={<BsChevronLeft />}
              disabled={activeIndex === 0}
              onClick={previousExercise}
            />

            {currentExercise ? (
              <div className={styles.currentExercise}>
                <MessageInfo
                  icon={<GiStrong />}
                  titleInfo="Categoria"
                  content={currentExercise.exercise?.category?.name}
                />

                <MessageInfo
                  icon={<BiTimer />}
                  titleInfo="Série"
                  content={`${currentExercise.series}x${currentExercise.times}`}
                />
              </div>
            ) : (
              <span className={styles.noContent}>
                Não foi possível carregar o exercício
              </span>
            )}

            <Button
              title="Próximo"
              icon={<BsChevronRight />}
              disabled={activeIndex === (totalLength || 0) - 1}
              onClick={nextExercise}
            />
          </div>

          {currentExercise?.concluded_at || currentExercise?.exited_at ? (
            <div className={`${styles.currentStatus}`}>
              {currentExercise.concluded_at && (
                <p>
                  <FiCheckCircle color="#09d687" size={28} /> Atividade
                  concluída{" "}
                  <span>+ {currentExercise.exercise?.xp_amount || 0}xp</span>
                </p>
              )}

              {currentExercise.exited_at && (
                <p>
                  <FiXCircle color="#eb326a" size={28} /> Atividade ignorada
                </p>
              )}

              <Button
                title="Restaurar exercício"
                icon={<IoReload />}
                onClick={() =>
                  currentExercise && resetExercise(currentExercise)
                }
              />
            </div>
          ) : (
            <div className={styles.buttonsContainer}>
              <Button
                title="Desistir deste exercício"
                text="Pular"
                background="#eb326a"
                color="white"
                onClick={() => currentExercise && skipExercise(currentExercise)}
              />
              <Button
                title="Concluir exercício"
                text="Finalizar"
                background="#09d687"
                color="white"
                onClick={() =>
                  currentExercise && finishExercise(currentExercise)
                }
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};
