import { post } from "@/utils/request";

type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  success: boolean;
  data: {
    user: User;
    accessToken: string;
  };
};
type LoginPayload = { email: string; password: string };
type SignupPayload = { name: string; email: string; password: string };

export const loginApi = async (payload: LoginPayload) => {
  const data = await post<AuthResponse, LoginPayload>("/login", payload);
  return data;
};

export const signupApi = async (payload: SignupPayload) => {
  const data = await post<AuthResponse, SignupPayload>("/register", payload);
  return data;
};
