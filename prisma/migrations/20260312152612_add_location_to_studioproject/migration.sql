/*
  Warnings:

  - A unique constraint covering the columns `[locationId]` on the table `StudioProject` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `StudioProject` ADD COLUMN `locationId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Location` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `coordinates` JSON NULL,
    `description` VARCHAR(191) NULL,
    `publishedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Location_url_key`(`url`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `StudioProject_locationId_key` ON `StudioProject`(`locationId`);

-- AddForeignKey
ALTER TABLE `StudioProject` ADD CONSTRAINT `StudioProject_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
