import axiosClient from "@/api/axiosClient";
import {
    LoginPayload,
    LoginResponse,
    RegisterPayload,
    RegisterResponse,
} from "../types/Auth.types";

export class AuthService {
  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    try {
      const response = await axiosClient.post<RegisterResponse>(
        "/auth/register",
        payload,
      );

      return response.data;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  }

  async login(payload: LoginPayload): Promise<LoginResponse> {
    try {
      const response = await axiosClient.post<LoginResponse>(
        "/auth/login",
        payload,
      );

      return response.data;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  }
}

export const authService = new AuthService();
