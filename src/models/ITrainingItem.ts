import { ICategory } from "./ICategory";
import { IExercise } from "./IExercise";
import { ITraining } from "./ITraining";

export interface ITrainingItem {
  id: string;
  amount: number | null;
  times: number;
  series: number;
  training_id: string;
  category_id: string | null;
  exercise_id: string | null;
  training?: ITraining;
  category?: ICategory | null;
  exercise?: IExercise | null;
}
