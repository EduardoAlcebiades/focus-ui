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
            alert("Já existe um treino ativo no momento");
          else if (err.response?.status === 404)
            alert("Nenhum treino disponível foi encontrado");
          else alert("Não foi possível iniciar um novo treino");
        });
  }, []);

  const stopActiveCurrent = useCallback((callback?: () => void) => {
    if (window.confirm("Deseja finalizar o treino? Esta ação é irreversível!"))
      CurrentService.stopCurrent()
        .then((response) => {
          loadData(response.data);
          callback && callback();
        })
        .catch((err) => {
          if (err.response?.status === 404)
            alert("Não foi encontrado nenhum treino ativo no momento");

          alert("Não foi possível finalizar o treino");
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
            alert("Este exercício não foi encontrado!");
          else if (err.response?.status === 409)
            alert("Este exercício já foi concluído!");

          alert("Ocorreu um erro ao atualizar exercício");
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
            alert("Este exercício não foi encontrado!");
          else if (err.response?.status === 409)
            alert("Este exercício já foi ignorado!");

          alert("Ocorreu um erro ao atualizar exercício");
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
            alert("Este exercício não foi encontrado!");
          else if (err.response?.status === 409)
            alert("Este exercício já foi restaurado!");

          alert("Ocorreu um erro ao atualizar exercício");
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
