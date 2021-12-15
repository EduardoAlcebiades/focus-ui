import { IExercise } from "./IExercise";
import { ITrainingItem } from "./ITrainingItem";

export interface ICategory {
  id: string;
  name: string;
  exercises?: IExercise[];
  trainingItems?: ITrainingItem[];
}
