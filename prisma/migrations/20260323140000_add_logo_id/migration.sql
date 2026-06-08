ALTER TABLE `StudioProject` ADD COLUMN `logoId` INT NULL;
ALTER TABLE `StudioProject` ADD INDEX `StudioProject_logoId_idx` (`logoId`);
ALTER TABLE `StudioProject` ADD CONSTRAINT `StudioProject_logoId_fkey` FOREIGN KEY (`logoId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
