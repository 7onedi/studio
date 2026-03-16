import { userService } from "@/api/services/user.service";

export const userController = {
  update: (id: number, body: any, user: any) => userService.update(user, id, body),
  changeRole: (id: number, role: any, user: any) => userService.changeRole(user, id, role),
  findById: (id: number) => userService.findById(id),
  search: (filters: Record<string, any>, options?: any) => userService.search(filters, options),
};