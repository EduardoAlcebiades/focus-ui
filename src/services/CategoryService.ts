import { api } from "./api";
import { ICategory } from "../models/ICategory";

class CategoryService {
  private baseUrl = "/category";

  index() {
    return api.get<ICategory[]>(this.baseUrl);
  }

  store(name: string) {
    return api.post<ICategory>(this.baseUrl, { name });
  }

  update(id: string, name: string) {
    return api.put<ICategory>(`${this.baseUrl}/${id}`, { name });
  }

  delete(id: string) {
    return api.delete<ICategory>(`${this.baseUrl}/${id}`);
  }
}

export default new CategoryService();
