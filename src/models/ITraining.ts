import { ICurrent } from "./ICurrent";
import { IExperience } from "./IExperience";
import { IUser } from "./IUser";
import { ITrainingItem } from "./ITrainingItem";

export interface ITraining {
  id: string;
  name: string;
  week_day: number | null;
  experience_id: string | null;
  user_id: string | null;
  experience?: IExperience | null;
  user?: IUser | null;
  currents?: ICurrent[];
  trainingItems?: ITrainingItem[];
}
