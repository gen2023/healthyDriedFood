DROP TABLE IF EXISTS `#__com_export_category_exclude`;

CREATE TABLE `#__com_export_category_exclude` ( 
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `category_id` int(11) NOT NULL,
    `product_id` int(11) NOT NULL,
    `export_type` varchar(255) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB; 

DROP TABLE IF EXISTS `#__com_export_binding`;

CREATE TABLE `#__com_export_binding` ( 
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `google_base_category_id` int(11) NOT NULL,
    `category_id` int(11) NOT NULL,
    `product_id` int(11) NOT NULL,
    `export_type` varchar(255) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB; 