CREATE TABLE IF NOT EXISTS `#__trackref_summary` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `utm_source` VARCHAR(255) DEFAULT NULL,
    `utm_medium` VARCHAR(255) DEFAULT NULL,
    `utm_campaign` VARCHAR(255) DEFAULT NULL,
    `ref` VARCHAR(255) DEFAULT NULL,
    `first_visit` DATETIME DEFAULT NULL,
    `last_visit` DATETIME DEFAULT NULL,
    `count` INT(11) DEFAULT 0,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_tag` (`utm_source`(191), `utm_medium`(191), `utm_campaign`(191), `ref`(191))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
