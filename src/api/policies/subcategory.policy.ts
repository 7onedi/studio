import { canCreate, canUpdate, canDelete } from "@/api/policies/permissions";

export const canCreateSubcategory = (user: any) => canCreate(user.role);
export const canUpdateSubcategory = (user: any) => canUpdate(user.role);
export const canDeleteSubcategory = (user: any) => canDelete(user.role);