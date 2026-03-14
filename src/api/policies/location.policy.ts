import { canCreate, canUpdate, canPublish, canDelete } from "./permissions";

export const canCreateLocation= (user: any) => canCreate(user.role);
export const canUpdateLocation= (user: any) => canUpdate(user.role);
export const canDeleteLocation= (user: any) => canDelete(user.role);