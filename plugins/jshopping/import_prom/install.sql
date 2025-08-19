ALTER TABLE `#__jshopping_categories` 
ADD `id_cat_import_prom` INT(11) NULL DEFAULT NULL AFTER `category_parent_id`;

ALTER TABLE `#__jshopping_orders` 
ADD `id_order_prom` INT(11) NULL DEFAULT NULL AFTER `order_number`;