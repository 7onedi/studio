-- AlterTable
ALTER TABLE `Media` ADD COLUMN `cropDesktop` JSON NULL,
    ADD COLUMN `cropDesktopUrl` VARCHAR(191) NULL,
    ADD COLUMN `cropMobile` JSON NULL,
    ADD COLUMN `cropMobileUrl` VARCHAR(191) NULL;

