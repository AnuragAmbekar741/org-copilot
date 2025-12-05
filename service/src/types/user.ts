export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

export interface User extends CreateUserDto {
  id: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export type UserResponse = Omit<User, "password">;
