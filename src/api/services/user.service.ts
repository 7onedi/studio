import { BaseService } from "./base.service";
import { userRepository } from "@/api/repositories/user.repository";
import { UserRole } from "generated/prisma/enums";
import { canUpdateUserRole, canUpdateUser } from "@/api/policies/user.policy";
import { changeUserRoleSchema, updateUserSchema } from "@/api/schemas/user.schema";

class UserService extends BaseService {

  constructor() {
    super(userRepository);
  }

  changeRole(user: any, id: number, role: UserRole) {
    this.assertPolicy(user, canUpdateUserRole);
    const data = changeUserRoleSchema.parse({ role });
    return this.repository.updateRole(id, data.role);
  }

  async update(user: any, id: number, body: any) {
    this.assertPolicy(user, canUpdateUser);
    const data = updateUserSchema.parse(body);

    return this.repository.update(id, data);
  }

}

export const userService = new UserService();