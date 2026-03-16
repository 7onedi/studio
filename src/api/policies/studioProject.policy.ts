import { canCreate, canUpdate, canPublish, canDelete } from "./permissions";

export const canCreateStudioProject = (user: any) => canCreate(user.role);
export const canUpdateStudioProject = (user: any) => canUpdate(user.role);
export const canPublishStudioProject = (user: any) => canPublish(user.role);
export const canDeleteStudioProject = (user: any) => canDelete(user.role);