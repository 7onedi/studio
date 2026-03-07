export function canCreateArticle(role: string) {
  return role === "EDITOR" || role === "ADMIN";
}

export function canPublish(role: string) {
  return role === "ADMIN";
}