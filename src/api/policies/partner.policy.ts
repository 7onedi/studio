export const canCreatePartner       = () => true;
export const canUpdatePartner       = (user: any) => user.role === "ADMIN" || user.role === "OWNER";
export const canUpdatePartnerStatus = (user: any) => user.role === "ADMIN" || user.role === "OWNER";
export const canPublishPartner      = (user: any) => user.role === "ADMIN" || user.role === "OWNER";
export const canDeletePartner       = (user: any) => user.role === "ADMIN" || user.role === "OWNER";