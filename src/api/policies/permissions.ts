export function canCreate(role: string) {
  return ["USER", "EDITOR", "ADMIN", "OWNER"].includes(role);
}

export function canUpdate(role: string) {
  return ["EDITOR", "ADMIN", "OWNER"].includes(role);
}

export function canPublish(role: string) {
  return ["ADMIN", "OWNER"].includes(role);
}

export function canDelete(role: string) {
  return ["ADMIN", "OWNER"].includes(role);
}