<?php
/**
 * @version      5.0.0 15.09.2018
 * @author       MAXXmarketing GmbH
 * @package      Jshopping
 * @copyright    Copyright (C) 2010 webdesigner-profi.de. All rights reserved.
 * @license      GNU/GPL
 */
defined('_JEXEC') or die();
use Joomla\CMS\Factory;
use Joomla\CMS\Language\Text;

print $this->_tmp_category_html_start;

$currentCategoryId = Factory::getApplication()->input->getInt('category_id');
$subcategories = [];

if ($currentCategoryId) {
    $categoryTable = JSFactory::getTable('category');
    $categoryTable->load($currentCategoryId);

    $subcategories = $categoryTable->getSubCategories($currentCategoryId);

    if (empty($subcategories) && $categoryTable->category_parent_id) {
        $subcategories = $categoryTable->getSubCategories($categoryTable->category_parent_id);
    }
}
// $db = JFactory::getDbo();

// // Получаем все ID товаров
// $query = $db->getQuery(true)
//     ->select('product_id')
//     ->from('#__jshopping_products');
// $db->setQuery($query);
// $productIds = $db->loadColumn();

// foreach ($productIds as $productId) {
//     $randomManufacturerId = rand(1, 3);

//     $query = $db->getQuery(true)
//         ->update($db->qn('#__jshopping_products'))
//         ->set($db->qn('product_manufacturer_id') . ' = ' . (int)$randomManufacturerId)
//         ->where($db->qn('product_id') . ' = ' . (int)$productId);

//     $db->setQuery($query);
//     $db->execute();
// }
?>

<div class="jshop cat-page" id="comjshop">
    <div class="container">
        <div class="mb15">
            <?php
            $module = JModuleHelper::getModules('breadcrumbs');
            $attribs['style'] = 'none';
            echo JModuleHelper::renderModule($module[0], $attribs);
            ?>
        </div>
        <h1 class="ttl md mb15"><?php print $this->category->name ?></h1>
        <?php if (!empty($subcategories)) { ?>
            <div class="slider-wrapper subcategory-list">
                <div class="swiper subcategory-slider">
                    <div class="swiper-wrapper">
                        <?php foreach ($subcategories as $subcategory) { ?>
                            <?php if (isset($subcategory->category_image) && $subcategory->category_image != '') {
                                $image = '/components/com_jshopping/files/img_categories/' . $subcategory->category_image;
                            } else {
                                $image = '/components/com_jshopping/files/img_categories/noimage.gif';
                            }
                            ?>
                            <div class="swiper-slide">
                                <a href="<?= \JSHelper::SEFLink('index.php?option=com_jshopping&controller=category&task=view&category_id=' . $subcategory->category_id, 1) ?> ">
                                    <span class="icon"><img class="image_cat" src="<?= $image ?>" alt="<?= $subcategory->img_alt ?>" title="<?= $subcategory->img_title ?>"></span>
                                    <span class="namesubcat"><?= htmlspecialchars($subcategory->name) ?></span>
                                </a>
                            </div>
                        <?php } ?>
                    </div>
                </div>
                <div class="control_swiper">
                    <div class="swiper-button-prev">&nbsp;</div>
                    <div class="swiper-button-next">&nbsp;</div>
                </div>
            </div>
        <?php } ?>
        <?php include(dirname(__FILE__) . "/../" . $this->template_block_form_filter); ?>
        <div class="page-flex flex between">
            <div class="filter_block">
                <h2 class="mob_title"><?= Text::_('TPL_CUSTOM_TITLE_FILTER') ?>
                    <div class="close">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path
                                d="M0.586039 11.9999C0.470137 11.9999 0.356832 11.9656 0.260457 11.9012C0.164081 11.8368 0.0889642 11.7453 0.0446076 11.6382C0.000250992 11.5311 -0.0113525 11.4133 0.0112647 11.2996C0.0338819 11.186 0.0897039 11.0816 0.17167 10.9996L10.9996 0.171637C11.1095 0.0617398 11.2586 0 11.414 0C11.5694 0 11.7185 0.0617398 11.8284 0.171637C11.9383 0.281535 12 0.430588 12 0.586006C12 0.741425 11.9383 0.890478 11.8284 1.00038L1.00041 11.8283C0.946042 11.8828 0.881449 11.926 0.810339 11.9555C0.739229 11.9849 0.663003 12 0.586039 11.9999Z"
                                fill="black" />
                            <path
                                d="M11.414 11.9999C11.337 12 11.2608 11.9849 11.1897 11.9555C11.1186 11.926 11.054 11.8828 10.9996 11.8283L0.171637 1.00038C0.0617398 0.890478 0 0.741425 0 0.586006C0 0.430588 0.0617398 0.281535 0.171637 0.171637C0.281535 0.0617398 0.430588 0 0.586006 0C0.741425 0 0.890478 0.0617398 1.00038 0.171637L11.8283 10.9996C11.9103 11.0816 11.9661 11.186 11.9887 11.2996C12.0114 11.4133 11.9998 11.5311 11.9554 11.6382C11.911 11.7453 11.8359 11.8368 11.7396 11.9012C11.6432 11.9656 11.5299 11.9999 11.414 11.9999Z"
                                fill="black" />
                        </svg>
                    </div>
                </h2>
                <?php
                $module = JModuleHelper::getModules('filters');
                $attribs['style'] = 'none';
                echo JModuleHelper::renderModule($module[0], $attribs);
                ?>
                <?php /*<ul class="subcat-menu">
   <?php foreach ($subcategories as $subcategory) {
       $isActive = ($subcategory->category_id == $currentCategoryId) ? ' active' : '';
       ?>
       <li class="<?= $isActive ?>">
           <a href="<?= \JSHelper::SEFLink('index.php?option=com_jshopping&controller=category&task=view&category_id=' . $subcategory->category_id, 1) ?>">
               <span class="namesubcat"><?= htmlspecialchars($subcategory->name) ?></span>
           </a>
       </li>

   <?php } ?>
</ul>*/ ?>
            </div>
            <div class="right-side">
                <?php include(dirname(__FILE__) . "/products.php"); ?>
                <?php if ($this->pagination_obj->pagesCurrent == 1) { ?>
                    <div class="articleBody category_description mt50">
                        <?php print $this->category->description ?>
                    </div>
                <?php } ?>
            </div>
        </div>
    </div>
</div>
<?php
$module = JModuleHelper::getModules('main-advan');
$attribs['style'] = 'none';
echo JModuleHelper::renderModule($module[0], $attribs);
?>
</div>