import api from "./api";

export class AuthService {
  static async login(username: string, password: string): Promise<string> {
    const response = await api.post<{ token: string }>("/auth/login", {
      username,
      password
    });
    return response.data.token;
  }
}
