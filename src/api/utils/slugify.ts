import slugifyLib from "slugify";

export function generateSlug(text: string) {
    return slugifyLib(text, {
        lower: true,
        strict: true,   // прибирає спецсимволи
        trim: true,
    });
}