-- AlterTable
ALTER TABLE `StudioProject` ADD COLUMN `presentationDescription` TEXT NULL,
    ADD COLUMN `presentationId` INTEGER NULL,
    ADD COLUMN `presentationTitle` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `StudioProject` ADD CONSTRAINT `StudioProject_presentationId_fkey` FOREIGN KEY (`presentationId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
