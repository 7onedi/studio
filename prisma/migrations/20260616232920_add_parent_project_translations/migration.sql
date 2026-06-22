-- AlterTable
ALTER TABLE `Partner` ADD COLUMN `link` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `StudioProject` ADD COLUMN `body_en` JSON NULL,
    ADD COLUMN `body_lt` JSON NULL,
    ADD COLUMN `body_pl` JSON NULL,
    ADD COLUMN `body_ro` JSON NULL;
