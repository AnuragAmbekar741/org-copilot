import { get } from "@/utils/request";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export type UserResponse = {
  success: boolean;
  data: User;
};

export const getMeApi = async () => {
  const data = await get<UserResponse>("/me");
  return data;
};
