import { api } from "./api";
import { IExperience } from "../models/IExperience";

export interface IExperienceData {
  name: string;
  level: number;
}

class ExperienceService {
  private baseUrl = "/experience";

  index() {
    return api.get<IExperience[]>(this.baseUrl);
  }

  store(data: IExperienceData) {
    return api.post<IExperience>(this.baseUrl, data);
  }

  update(id: string, data: IExperienceData) {
    return api.put<IExperience>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string) {
    return api.delete<IExperience>(`${this.baseUrl}/${id}`);
  }
}

export default new ExperienceService();
