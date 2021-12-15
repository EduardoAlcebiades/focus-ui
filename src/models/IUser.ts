import { ICurrent } from "./ICurrent";
import { IExperience } from "./IExperience";
import { IInvite } from "./IInvite";
import { ITraining } from "./ITraining";

export interface IUser {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  code: number;
  level: number;
  current_xp: number;
  xp_to_next_level: number;
  training_frequency: number,
  is_trainer: boolean;
  experience_id: string;
  experience?: IExperience;
  trainings?: ITraining[];
  currents?: ICurrent;
  invites?: IInvite[];
}
