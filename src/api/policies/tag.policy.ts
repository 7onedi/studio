import { canCreate, canUpdate, canDelete } from "./permissions";

export const canCreateTag = (user: any) => canCreate(user.role);
export const canUpdateTag = (user: any) => canUpdate(user.role);
export const canDeleteTag = (user: any) => user.role === "ADMIN" || user.role === "EDITOR";