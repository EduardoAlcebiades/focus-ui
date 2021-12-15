import { ICurrent } from "./ICurrent";
import { IExercise } from "./IExercise";

export interface ICurrentExercise {
  id: string;
  concluded_at: string | null;
  exited_at: string | null;
  times: number;
  series: number;
  current_id: string;
  exercise_id: string;
  current?: ICurrent;
  exercise?: IExercise;
}
