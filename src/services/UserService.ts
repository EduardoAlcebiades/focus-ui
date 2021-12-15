import { api } from "./api";
import { IUser } from "../models/IUser";

class UserService {
  private baseUrl = "/user";

  index() {
    return api.get<IUser[]>(this.baseUrl);
  }

  generateInviteCode() {
    return api.get<number>(`${this.baseUrl}/invite_code`);
  }
}

export default new UserService();
