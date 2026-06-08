import { canCreate, canDelete, canUpdate } from "./permissions";

export const canCreateCategory = (user: any) => user.role === "OWNER" || user.role === "ADMIN";
export const canUpdateCategory = (user: any) => user.role === "OWNER" || user.role === "ADMIN";
export const canDeleteCategory = (user: any) => user.role === "OWNER" || user.role === "ADMIN";