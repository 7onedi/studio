-- AlterTable
ALTER TABLE `Article` ADD COLUMN `authorAvatarId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Article` ADD CONSTRAINT `Article_authorAvatarId_fkey` FOREIGN KEY (`authorAvatarId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
