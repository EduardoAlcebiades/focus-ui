import { createContext, useCallback, useEffect, useState } from "react";

import { ICurrent } from "../models/ICurrent";
import { ICurrentExercise } from "../models/ICurrentExercise";
import CurrentService, { ICurrentStatus } from "../services/CurrentService";

interface IExercisesContext
  extends Omit<ICurrentStatus, "lastFinishedCurrentDate"> {
  lastFinishedCurrentDate: Date | null;
  startNewCurrent: (callback?: () => void) => void;
  stopActiveCurrent: (callback?: () => void) => void;
  finishExercise: (
    currentExercise: ICurrentExercise,
    callback?: () => void
  ) => void;
  skipExercise: (
    currentExercise: ICurrentExercise,
    callback?: () => void
  ) => void;
  resetExercise: (
    currentExercise: ICurrentExercise,
    callback?: () => void
  ) => void;
  refreshStatus: () => Promise<void>;
}

interface IExercisesProvider {}

export const ExercisesContext = createContext({} as IExercisesContext);

export const ExercisesProvider: React.FC<IExercisesProvider> = ({
  children,
}) => {
  const [activeCurrent, setActiveCurrent] = useState<ICurrent | null>(null);
  const [hasAvailableCurrent, setHasAvailableCurrent] =
    useState<boolean>(false);
  const [lastFinishedCurrentDate, setLastFinishedCurrentDate] =
    useState<Date | null>(null);

  function loadData(data: ICurrentStatus) {
    setActiveCurrent(data.activeCurrent);
    setHasAvailableCurrent(data.hasAvailableCurrent);
    setLastFinishedCurrentDate(
      data.lastFinishedCurrentDate
        ? new Date(data.lastFinishedCurrentDate)
        : null
    );
  }

  const refreshStatus = useCallback(async () => {
    const response = await CurrentService.getCurrentStatus();

    loadData(response.data);
  }, []);

  const startNewCurrent = useCallback((callback?: () => void) => {
    if (window.confirm("Deseja iniciar um novo treino?"))
      CurrentService.startCurrent()
        .then((response) => {
          loadData(response.data);
          callback && callback();
        })
        .catch((err) => {
          if (err.response?.status === 409)
            alert("J?? existe um treino ativo no momento");
          else if (err.response?.status === 404)
            alert("Nenhum treino dispon??vel foi encontrado");
          else alert("N??o foi poss??vel iniciar um novo treino");
        });
  }, []);

  const stopActiveCurrent = useCallback((callback?: () => void) => {
    if (window.confirm("Deseja finalizar o treino? Esta a????o ?? irrevers??vel!"))
      CurrentService.stopCurrent()
        .then((response) => {
          loadData(response.data);
          callback && callback();
        })
        .catch((err) => {
          if (err.response?.status === 404)
            alert("N??o foi encontrado nenhum treino ativo no momento");

          alert("N??o foi poss??vel finalizar o treino");
        });
  }, []);

  const finishExercise = useCallback(
    (currentExercise: ICurrentExercise, callback?: () => void) => {
      CurrentService.completeCurrentExercise(currentExercise.id)
        .then((response) => {
          loadData(response.data);
          callback && callback();
        })
        .catch((err) => {
          if (err.response?.status === 404)
            alert("Este exerc??cio n??o foi encontrado!");
          else if (err.response?.status === 409)
            alert("Este exerc??cio j?? foi conclu??do!");

          alert("Ocorreu um erro ao atualizar exerc??cio");
        });
    },
    []
  );

  const skipExercise = useCallback(
    (currentExercise: ICurrentExercise, callback?: () => void) => {
      CurrentService.skipCurrentExercise(currentExercise.id)
        .then((response) => {
          loadData(response.data);
          callback && callback();
        })
        .catch((err) => {
          if (err.response?.status === 404)
            alert("Este exerc??cio n??o foi encontrado!");
          else if (err.response?.status === 409)
            alert("Este exerc??cio j?? foi ignorado!");

          alert("Ocorreu um erro ao atualizar exerc??cio");
        });
    },
    []
  );

  const resetExercise = useCallback(
    (currentExercise: ICurrentExercise, callback?: () => void) => {
      CurrentService.restoreCurrentExercise(currentExercise.id)
        .then((response) => {
          loadData(response.data);
          callback && callback();
        })
        .catch((err) => {
          if (err.response?.status === 404)
            alert("Este exerc??cio n??o foi encontrado!");
          else if (err.response?.status === 409)
            alert("Este exerc??cio j?? foi restaurado!");

          alert("Ocorreu um erro ao atualizar exerc??cio");
        });
    },
    []
  );

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  return (
    <ExercisesContext.Provider
      value={{
        activeCurrent,
        hasAvailableCurrent,
        lastFinishedCurrentDate,
        startNewCurrent,
        stopActiveCurrent,
        finishExercise,
        skipExercise,
        resetExercise,
        refreshStatus,
      }}
    >
      {children}
    </ExercisesContext.Provider>
  );
};
