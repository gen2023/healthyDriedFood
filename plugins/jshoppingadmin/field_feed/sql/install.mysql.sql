CREATE TABLE IF NOT EXISTS `#__jshopping_feed_fields` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `field_key` VARCHAR(100) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `field_type` ENUM('text','editor','number') NOT NULL DEFAULT 'text',
  `multilang` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
);
CREATE TABLE IF NOT EXISTS `#__jshopping_feed_values` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `product_id` INT NOT NULL,
  `field_id` INT NOT NULL,
  `value` MEDIUMTEXT NOT NULL,
  PRIMARY KEY (`id`)
);
