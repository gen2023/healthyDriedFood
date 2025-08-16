DROP TABLE IF EXISTS `#__com_export_params_product`;

CREATE TABLE `#__com_export_params_product` ( 
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `params` int(11) NOT NULL,
    `google_param_id` int(11) NOT NULL,
    `export_type` varchar(255) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB; 

DROP TABLE IF EXISTS `#__com_export_params_google`;

CREATE TABLE `#__com_export_params_google` ( 
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `google_param` varchar(255) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB; 