import { db } from "../config/db.config";
import { users } from "../models/user";
import { eq } from "drizzle-orm";
import { CreateUserDto, User } from "../types/user";
import { hashPassword } from "../utils/password";

export const getUserById = async (id: string): Promise<User | null> => {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return result[0] || null;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return result[0] || null;
};

export const createUser = async (data: CreateUserDto): Promise<User> => {
  const result = await db
    .insert(users)
    .values({
      name: data.name,
      email: data.email,
      password: await hashPassword(data.password),
    })
    .returning();

  return result[0];
};
