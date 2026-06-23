import { BaseService } from "./base.service";
import { userRepository } from "@/api/repositories/user.repository";
import { UserRole } from "generated/prisma/enums";
import { canUpdateUserRole, canUpdateUser, canTransferOwner, canUpdateOwnProfile } from "@/api/policies/user.policy";
import { changePasswordSchema, changeUserRoleSchema, updateAvatarSchema, updateUserSchema } from "@/api/schemas/user.schema";
import { ApiError } from "../utils/api-error";
import bcrypt from "bcryptjs";

class UserService extends BaseService {

  constructor() {
    super(userRepository);
  }

  changeRole(user: any, id: number, role: string) {
    if (role === "OWNER") {  // ← ця перевірка блокує?
      throw new Error("Use transferOwnership to assign OWNER role");
    }
    this.assertPolicy(user, canUpdateUserRole);
    const data = changeUserRoleSchema.parse({ role });
    return this.repository.updateRole(id, data.role as UserRole);
  }

  async transferOwnership(user: any, toId: number) {
    this.assertPolicy(user, canTransferOwner);

    if (user.id === toId) {
      throw new Error("Cannot transfer ownership to yourself");
    }

    return this.repository.transferOwner(user.id, toId);
  }

  async update(user: any, id: number, body: any) {
    this.assertPolicy(user, canUpdateUser);
    const data = updateUserSchema.parse(body);

    return this.repository.update(id, data);
  }

  async changePassword(user: any, id: number, body: any) {
    if (!canUpdateOwnProfile(user, id)) throw new ApiError(403, "Forbidden");

    const { currentPassword, newPassword } = changePasswordSchema.parse(body);

    const existing = await this.repository.findById(id);
    if (!existing) throw new ApiError(404, "User not found");

    // перевір поточний пароль
    const fullUser = await this.repository.findByEmail(existing.email);
    const valid = await bcrypt.compare(currentPassword, fullUser!.passwordHash);
    if (!valid) throw new ApiError(400, "Current password is incorrect");

    const passwordHash = await bcrypt.hash(newPassword, 10);
    return this.repository.updatePassword(id, passwordHash);
  }

  async updateAvatar(user: any, id: number, body: any) {
    if (!canUpdateOwnProfile(user, id)) throw new ApiError(403, "Forbidden");
    const { avatarId } = updateAvatarSchema.parse(body);
    return this.repository.updateAvatar(id, avatarId);
  }

  async delete(user: any, id: number) {
    const target = await this.repository.findById(id);
    if (!target) throw new ApiError(404, "User not found");
    if (target.role !== 'USER') throw new ApiError(403, "Can only delete users with USER role");
    if (user.role !== 'ADMIN' && user.role !== 'OWNER') throw new ApiError(403, "Forbidden");
    return this.repository.delete(id);
  }

}

export const userService = new UserService();