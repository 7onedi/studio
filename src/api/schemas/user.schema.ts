import { z } from "zod";

export const changeUserRoleSchema = z.object({
  role: z.enum(["USER", "EDITOR", "ADMIN"])
});

export const updateUserSchema = z.object({
  name: z.string().min(2, "Name too short")
});