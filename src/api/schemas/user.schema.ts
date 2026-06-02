import { z } from "zod";

export const changeUserRoleSchema = z.object({
  role: z.enum(["USER", "EDITOR", "ADMIN", "OWNER"])
});

export const updateUserSchema = z.object({
  name: z.string().min(2, "Name too short").optional(),
  avatarId: z.number().int().positive().nullable().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export const updateAvatarSchema = z.object({
  avatarId: z.number().int().positive(),
});