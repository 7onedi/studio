export const canCreatePartner = () => true;
export const canUpdatePartner = (user: any) => user.role === "ADMIN";
export const canUpdatePartnerStatus = (user: any) => user.role === "ADMIN";
export const canPublishPartner = (user: any) => user.role === "ADMIN";
export const canDeletePartner = (user: any) => user.role === "ADMIN";