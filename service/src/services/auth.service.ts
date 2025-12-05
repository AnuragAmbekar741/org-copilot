import { createUser, getUserByEmail } from "./user.service";
import { comparePassword } from "../utils/password";
import { generateToken } from "../utils/jwt";
import { CreateUserDto, UserResponse } from "../types/user";

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserResponse;
  accessToken: string;
}

export const register = async (data: CreateUserDto): Promise<AuthResponse> => {
  const existingUser = await getUserByEmail(data.email);
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const user = await createUser(data);

  const accessToken = generateToken({
    userId: user.id,
    email: user.email,
  });

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    accessToken,
  };
};

export const login = async (data: LoginDto): Promise<AuthResponse> => {
  const user = await getUserByEmail(data.email);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isValidPassword = await comparePassword(data.password, user.password);
  if (!isValidPassword) {
    throw new Error("Invalid email or password");
  }

  const accessToken = generateToken({
    userId: user.id,
    email: user.email,
  });

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    accessToken,
  };
};
