-- CreateTable
CREATE TABLE `StudioProject` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `parentId` INTEGER NULL,
    `categoryId` INTEGER NOT NULL,
    `subcategoryId` INTEGER NULL,
    `title` VARCHAR(191) NOT NULL,
    `body` JSON NULL,
    `description` VARCHAR(191) NULL,
    `imageId` INTEGER NULL,
    `authorId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `publishedAt` DATETIME(3) NULL,

    UNIQUE INDEX `StudioProject_subcategoryId_key`(`subcategoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `StudioProject` ADD CONSTRAINT `StudioProject_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `StudioProject`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudioProject` ADD CONSTRAINT `StudioProject_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudioProject` ADD CONSTRAINT `StudioProject_subcategoryId_fkey` FOREIGN KEY (`subcategoryId`) REFERENCES `Subcategory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudioProject` ADD CONSTRAINT `StudioProject_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudioProject` ADD CONSTRAINT `StudioProject_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
