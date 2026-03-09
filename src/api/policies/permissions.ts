export function canCreate(role: string) {
  return role === "EDITOR" || role === "ADMIN";
}

export function canUpdate(role: string) {
  return role === "EDITOR" || role === "ADMIN";
}

export function canPublish(role: string) {
  return role === "ADMIN";
}

export function canDelete(role: string) {
  return role === "ADMIN";
}