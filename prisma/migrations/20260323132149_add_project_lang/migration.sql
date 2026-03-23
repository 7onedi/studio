-- AlterTable
ALTER TABLE `StudioProject` ADD COLUMN `lang` ENUM('UK', 'EN', 'PL', 'LT', 'RO') NOT NULL DEFAULT 'UK';
