import { canCreate, canPublish, canDelete, canUpdate } from "./permissions";

export const canCreateArticle = (user: any) => canCreate(user.role);
export const canUpdateArticle = (user: any) => canUpdate(user.role);
export const canPublishArticle = (user: any) => canPublish(user.role);
export const canDeleteArticle = (user: any) => canDelete(user.role);