/*
  Warnings:

  - You are about to drop the column `presentationId` on the `StudioProject` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `StudioProject` DROP FOREIGN KEY `StudioProject_presentationId_fkey`;

-- DropIndex
DROP INDEX `StudioProject_presentationId_fkey` ON `StudioProject`;

-- AlterTable
ALTER TABLE `StudioProject` DROP COLUMN `presentationId`,
    ADD COLUMN `presentationUrl` VARCHAR(191) NULL;
