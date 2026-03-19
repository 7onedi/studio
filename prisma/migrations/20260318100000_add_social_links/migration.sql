-- CreateTable
CREATE TABLE `SocialLink` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `platform` ENUM('YOUTUBE', 'INSTAGRAM', 'FACEBOOK', 'TWITTER', 'TIKTOK') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `SocialLink_platform_key`(`platform`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProjectSocialLink` (
    `projectId` INTEGER NOT NULL,
    `socialId` INTEGER NOT NULL,
    `url` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`projectId`, `socialId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProjectSocialLink` ADD CONSTRAINT `ProjectSocialLink_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `StudioProject`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectSocialLink` ADD CONSTRAINT `ProjectSocialLink_socialId_fkey` FOREIGN KEY (`socialId`) REFERENCES `SocialLink`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
