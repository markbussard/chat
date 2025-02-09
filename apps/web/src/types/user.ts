import { User } from "@repo/db";

export type SessionUser = Pick<User, "id" | "email" | "name" | "image">;
