-- CreateIndex
CREATE INDEX `Article_categoryId_published_idx` ON `Article`(`categoryId`, `published`);
ALTER TABLE `Article` ADD FULLTEXT INDEX `idx_title` (`title`);