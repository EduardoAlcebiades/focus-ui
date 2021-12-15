import { ICurrentExercise } from "./ICurrentExercise";
import { IUser } from "./IUser";
import { ITraining } from "./ITraining";

export interface ICurrent {
  id: string;
  started_at: string;
  ended_at: string | null;
  training_id: string;
  user_id: string;
  training?: ITraining;
  user?: IUser;
  currentExercises?: ICurrentExercise[];
}
