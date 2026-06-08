import { userService } from "@/api/services/user.service";

export const userController = {
  update: (id: number, body: any, user: any) => userService.update(user, id, body),
  changeRole: (id: number, role: any, user: any) => userService.changeRole(user, id, role),
  transferOwnership: (toId: number, user: any) => userService.transferOwnership(user, toId),
  findById: (id: number) => userService.findById(id),
  search: (filters: Record<string, any>, options?: any, include?: any) => userService.search(filters, options, include),
  changePassword: (id: number, body: any, user: any) => userService.changePassword(user, id, body),
  updateAvatar: (id: number, body: any, user: any) => userService.updateAvatar(user, id, body),
};