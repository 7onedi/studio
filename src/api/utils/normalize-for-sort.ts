// api/utils/normalize-for-sort.ts
export function normalizeTitleForSort(title: string): string {
  return title
    .normalize("NFKD")
    .replace(/[^\p{L}]+/gu, "") // лишаємо тільки букви (\p{L}) — цифри, пробіли, емодзі, дужки, розділові прибираються
    .toLowerCase();
}