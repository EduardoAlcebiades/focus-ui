import { ICategory } from "./ICategory";
import { ICurrentExercise } from "./ICurrentExercise";
import { IExperience } from "./IExperience";
import { ITrainingItem } from "./ITrainingItem";

export interface IExercise {
  id: string;
  name: string;
  xp_amount: number;
  category_id: string;
  min_experience_id: string | null;
  max_experience_id: string | null;
  category?: ICategory;
  minExperience?: IExperience | null;
  maxExperience?: IExperience | null;
  trainingItems?: ITrainingItem[];
  currentExercises?: ICurrentExercise[];
}
