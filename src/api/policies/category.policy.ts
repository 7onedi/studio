import { canCreate, canDelete, canUpdate } from "./permissions";

export const canCreateCategory = (user: any) => canCreate(user.role);
export const canUpdateCategory = (user: any) => canUpdate(user.role);
export const canDeleteCategory = (user: any) => user.role === "ADMIN" || user.role === "EDITOR";