import { IUser } from "./IUser";

export interface IInvite {
  invite_id: string;
  code: number;
  created_at: string;
  expires_in: string;
  user_id: string;
  user?: IUser;
}
