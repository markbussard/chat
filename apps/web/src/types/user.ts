import { User } from "@repo/database";

export type SessionUser = Pick<User, "id" | "email" | "name" | "image">;
