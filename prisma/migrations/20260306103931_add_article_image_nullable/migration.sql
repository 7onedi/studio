-- DropIndex
DROP INDEX `idx_title` ON `Article`;

-- AlterTable
ALTER TABLE `Article` ADD COLUMN `imageId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Article` ADD CONSTRAINT `Article_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
