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
$user = Factory::getUser();

$countprod = count($this->products);

?>
<div class="jshop cat-page" id="comjshop">
<div class="container">
<div class="page-flex flex between mb80">
<div class="left-side">
    <div class="user-menu">
        <div class="user-info icon icon-user mb25">
         <div class="info">
              <div class="name"><?= $user->name; ?></div>
              <div class="email"><?= $user->email ?></div>
            </div>
        </div>
        <?php
            $module = JModuleHelper::getModules('user-menu');
            $attribs['style'] = 'none';
            echo JModuleHelper::renderModule($module[0], $attribs);
        ?>
    </div> 
</div>
<div class="right-side"> 
<?php if ($countprod > 0) : ?>
    <h1 class="ttl sm mb30">
        <?= JText::_('TPL_CUSTOM_WISHLIST_TTL') ; ?>
    </h1>
    <div class="prod-flex flex mb50">        
        <?php
        $i=1;
        foreach($this->products as $key_id=>$prod){
            echo $prod['_tmp_tr_before'];
        ?>
        <div class="prod-wrap">
        <div class="product">
        <div class="top_prodoct">    
            <div class="image_block">
                <?php echo $prod['_tmp_img_before']; ?>
                <a href="<?php print $prod['href']; ?>">
                    <img src="<?php print $this->image_product_path ?>/<?php if ($prod['thumb_image']) print $prod['thumb_image']; else print $this->no_image; ?>" alt="<?php print htmlspecialchars($prod['product_name']);?>" class="jshop_img" />
                </a>
                <a class="btn-close icon-close" href="<?php print $prod['href_delete']?>" onclick="return confirm('<?php print JText::_('JSHOP_CONFIRM_REMOVE')?>')" title="<?php print JText::_('JSHOP_DELETE')?>">                    
                </a>
                <?php echo $prod['_tmp_img_after']; ?>
            </div>
            <div class="name">     
                <a href="<?php print $prod['href']?>">
                    <?php print $prod['product_name']?>
                </a>
                <?php if ($this->config->show_product_code_in_cart){?>
                    <span class="jshop_code_prod">(<?php print $prod['ean']?>)</span>
                <?php }?>
                <?php print $prod['_ext_product_name'] ?>
                <?php if ($prod['manufacturer']!=''){?>
                    <div class="manufacturer">
                        <?php print JText::_('JSHOP_MANUFACTURER')?>:
                        <span><?php print $prod['manufacturer']?></span>
                    </div>
                <?php }?>
                <?php if ($this->config->manufacturer_code_in_cart && $prod['manufacturer_code']){?>
                    <div class="manufacturer_code"><?php print JText::_('JSHOP_MANUFACTURER_CODE')?>: <span><?php print $prod['manufacturer_code'] ?></span></div>
                <?php }?>
                <?php if ($this->config->real_ean_in_cart && $prod['real_ean']){?>
                    <div class="real_ean"><?php print JText::_('JSHOP_EAN')?>: <span><?php print $prod['real_ean'] ?></span></div>
                <?php }?>
                <?php print \JSHelper::sprintAtributeInCart($prod['attributes_value']);?>
                <?php print \JSHelper::sprintFreeAtributeInCart($prod['free_attributes_value']);?>
                <?php print \JSHelper::sprintFreeExtraFiledsInCart($prod['extra_fields']);?>
                <?php print $prod['_ext_attribute_html']?>
            </div>
        </div>
        <div class="bottom_prodoct">
            <div class="oiproduct">
                <div class="price">
                    <div class="old_price">
                        <span><?php // print \JSHelper::formatprice($prod['old_price'] ?></span>
                    </div>
                    <div class="jshop_price">
    				<?php print \JSHelper::formatprice($prod['price'])?>
                    </div>
    			</div>                
            </div>
            <div class="avail icon-check"><?= JText::_('TPL_CUSTOM_AVAIL'); ?></div> 
            <div class="buttons">
                <a class="btn btn-success button_buy icon-cart" href="<?php print $prod['remove_to_cart'] ?>" >
                    <?= JText::_('TPL_CUSTOM_BUY'); ?>
                </a>
            </div>
        </div>
    </div>
</div>

        <?php
            echo $prod['_tmp_tr_after'];
            $i++;
        }
        ?>
    </div>
<?php else : ?>
    <div class="wishlist_empty_text"><?php print JText::_('JSHOP_WISHLIST_EMPTY') ?></div>
<?php endif; ?>
</div>
<?php print $this->_tmp_html_before_buttons?>

<?php /* <div class="jshop wishlish_buttons">
    <div id="checkout" class="d-flex justify-content-between">

        <div class="pull-left">
            <a href="<?php print $this->href_shop ?>" class="btn btn-arrow-left btn-secondary">
                <?php print JText::_('JSHOP_BACK_TO_SHOP')?>
            </a>
        </div>

        <div class="pull-right">
            <a href="<?php print $this->href_checkout ?>" class="btn btn-arrow-right btn-secondary">
                <?php print JText::_('JSHOP_GO_TO_CART')?>
            </a>
        </div>
    </div>
</div> */?>

<?php print $this->_tmp_html_after_buttons?>

</div>
</div>
<?php
    $module = JModuleHelper::getModules('main-advan');
    $attribs['style'] = 'none';
    echo JModuleHelper::renderModule($module[0], $attribs);
?>
</div>