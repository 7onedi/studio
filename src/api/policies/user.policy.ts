// Тільки OWNER може змінювати ролі (включно з передачею OWNER)
export const canUpdateUserRole = (user: any) =>
  user.role === "OWNER" || user.role === "ADMIN";

// OWNER може передати свою роль — але тільки собі забрати (логіка в сервісі)
export const canTransferOwner = (user: any) => user.role === "OWNER";

export const canUpdateUser = (user: any) =>
  user.role === "ADMIN" || user.role === "OWNER";

export const canUpdateOwnProfile = (user: any, targetId: number) =>
  user.id === targetId || user.role === "ADMIN" || user.role === "OWNER";

export const canDeleteUser = (user: any) => user.role === "OWNER";