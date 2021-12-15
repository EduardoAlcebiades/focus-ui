import { api } from "./api";
import { IUser } from "../models/IUser";

export interface ISignUpData {
  first_name: string;
  last_name: string;
  phone_number: string;
  experience_id: string;
  is_trainer?: boolean;
  invite_code?: string;
}

export interface IAuth {
  token: string;
  user: IUser;
}

class AuthService {
  signIn(phone_number: string) {
    return api.post<IAuth>("/signin", { phone_number });
  }

  signUp(data: ISignUpData) {
    return api.post<IUser>("/signup", data);
  }
}

export default new AuthService();
