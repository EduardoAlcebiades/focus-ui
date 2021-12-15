import { api } from "./api";
import { IExercise } from "../models/IExercise";

export interface IExerciseData {
  name: string;
  xp_amount: number;
  category_id: string;
  max_experience_id?: string | null;
  min_experience_id?: string | null;
}

class ExerciseService {
  private baseUrl = "/exercise";

  index() {
    return api.get<IExercise[]>(this.baseUrl);
  }

  store(data: IExerciseData) {
    return api.post<IExercise>(this.baseUrl, data);
  }

  update(id: string, data: IExerciseData) {
    return api.put<IExercise>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string) {
    return api.delete<IExercise>(`${this.baseUrl}/${id}`);
  }
}

export default new ExerciseService();
