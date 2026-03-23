import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { ApiError } from "@/api/utils/api-error";
import { mediaRepository } from "@/api/repositories/media.repository";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const mediaService = {
    async upload(user: any, file: File) {
        if (!user) throw new ApiError(401, "Unauthorized");

        if (!file) throw new ApiError(400, "File is required");

        if (file.size > MAX_FILE_SIZE)
        throw new ApiError(400, "File too large (max 5MB)");

        if (!ALLOWED_TYPES.includes(file.type))
        throw new ApiError(400, "Invalid file type");

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = path.join(process.cwd(), "public/uploads");

        if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        }

        const uniqueName = `${randomUUID()}-${file.name}`;
        const filePath = path.join(uploadDir, uniqueName);

        fs.writeFileSync(filePath, buffer);

        const url = `/uploads/${uniqueName}`;

        return mediaRepository.create({
        url,
        filename: uniqueName,
        mimeType: file.type,
        size: file.size,
        uploader: { connect: { id: user.id } },
        });
    },

    list() {
        return mediaRepository.findMany();
    },

    async delete(user: any, id: number) {
    if (!user) throw new ApiError(401, "Unauthorized");
    if (user.role !== "ADMIN")
        throw new ApiError(403, "Only ADMIN can delete media");

    const media = await mediaRepository.findById(id);
    if (!media) throw new ApiError(404, "Media not found");

    const filePath = path.join(process.cwd(), "public", media.url);

    try {
        fs.unlinkSync(filePath);
    } catch {
    }

    return mediaRepository.delete(id);
    },

    async findByUrl(url: string) {
        return mediaRepository.findByUrl(url);
    },

    async findById(id: number) {
        return mediaRepository.findById(id);
    }
};