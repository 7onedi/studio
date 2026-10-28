-- AlterTable
ALTER TABLE `Article` ADD COLUMN `sliderOrder` INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX `Article_slider_lang_sliderOrder_idx` ON `Article`(`slider`, `lang`, `sliderOrder`);

