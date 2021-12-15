import { IExercise } from "./IExercise";
import { IUser } from "./IUser";
import { ITraining } from "./ITraining";

export interface IExperience {
  id: string;
  name: string;
  level: number;
  exercisesMins?: IExercise[];
  exercisesMaxs?: IExercise[];
  trainings?: ITraining[];
  users?: IUser[];
}
