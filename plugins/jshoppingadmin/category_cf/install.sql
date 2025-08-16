CREATE TABLE IF NOT EXISTS `#__jshopping_category_custom_fields` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `type` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `#__jshopping_category_custom_values` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `field_id` INT UNSIGNED NOT NULL,
  `category_id` INT UNSIGNED NOT NULL,
  `value` TEXT,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`field_id`) REFERENCES `#__jshopping_category_custom_fields`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

