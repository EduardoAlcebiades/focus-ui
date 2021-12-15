import { ITraining } from "../models/ITraining";
import { api } from "./api";

export interface ITrainingItemData {
  category_id?: string | null;
  exercise_id?: string | null;
  amount?: number | null;
  series: number;
  times: number;
}

export interface ITrainingData {
  name: string;
  week_day?: number | null;
  experience_id?: string | null;
  user_id?: string | null;
  trainingItems: ITrainingItemData[];
}

class TrainingService {
  private baseUrl = "/training";

  index() {
    return api.get<ITraining[]>(this.baseUrl);
  }

  store(data: ITrainingData) {
    return api.post<ITraining>(this.baseUrl, data);
  }

  update(id: string, data: ITrainingData) {
    return api.put<ITraining>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string) {
    return api.delete<ITraining>(`${this.baseUrl}/${id}`);
  }
}

export default new TrainingService();
