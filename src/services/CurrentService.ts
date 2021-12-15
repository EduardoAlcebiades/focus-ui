import { api } from "./api";
import { ICurrent } from "../models/ICurrent";

export interface ICurrentStatus {
  activeCurrent: ICurrent | null;
  hasAvailableCurrent: boolean;
  lastFinishedCurrentDate: string | null;
}

class CurrentService {
  private baseUrl = "/current";

  startCurrent() {
    return api.post<ICurrentStatus>(`${this.baseUrl}/start`);
  }

  getCurrentStatus() {
    return api.get<ICurrentStatus>(`${this.baseUrl}/active`);
  }

  stopCurrent() {
    return api.put<ICurrentStatus>(`${this.baseUrl}/active/stop`);
  }

  completeCurrentExercise(currentExerciseId: string) {
    return api.put<ICurrentStatus>(
      `${this.baseUrl}/active/exercise/${currentExerciseId}/finish`
    );
  }

  skipCurrentExercise(currentExerciseId: string) {
    return api.put<ICurrentStatus>(
      `${this.baseUrl}/active/exercise/${currentExerciseId}/skip`
    );
  }

  restoreCurrentExercise(currentExerciseId: string) {
    return api.put<ICurrentStatus>(
      `${this.baseUrl}/active/exercise/${currentExerciseId}/restore`
    );
  }
}

export default new CurrentService();
