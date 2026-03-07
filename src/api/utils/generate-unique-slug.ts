import { generateSlug } from "./slugify";

export async function generateUniqueSlug(
    findBySlug: (slug: string) => Promise<any>,
    value: string
    ) {
    let baseSlug = generateSlug(value);
    let slug = baseSlug;
    let counter = 1;

    while (await findBySlug(slug)) {
        slug = `${baseSlug}-${counter++}`;
    }

    return slug;
}