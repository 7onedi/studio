-- AlterTable
ALTER TABLE `Partner` MODIFY `description` TEXT NULL;
-- AlterTable
ALTER TABLE `User` ADD COLUMN `avatarId` INTEGER NULL,
    MODIFY `role` ENUM('USER', 'EDITOR', 'ADMIN', 'OWNER') NOT NULL DEFAULT 'USER';
-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_avatarId_fkey` FOREIGN KEY (`avatarId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
