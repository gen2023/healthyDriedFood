<div class="cartajax_adv_module" id="cartajax-advanced-module<?php echo $module->id; ?>" module-id="<?php echo $module->id; ?>">
    <div class="cartajax-module">

        <div class="block">
            <div class="module-count" ca-prodcount="<?php echo ((isset($cart->count_product)) ? $cart->count_product : 0) ?>">
                <div>
                    <span><?php echo ((isset($cart->count_product)) ? $cart->count_product : 0) ?></span> 
                    <?php echo \JText::_('JSHOP_PRODUCTS'); ?>
                </div>
            </div>
            <div class="module-total">
                <div><span><?php print \JSHelper::formatprice($cart->price_product)?></span></div>
            </div>
            <div class="clear"></div>
            <div class="module-checkout">
                <div>
                    <a href="<?php print $cart->cartAjaxHrefLink->link; ?>"><?php print $cart->cartAjaxHrefLink->label; ?></a>
                </div>
            </div>
            <div class="module-show-products">
                <div>
                    <a class="cartajax-link" btn-product="show">
                        <span class="text_show"><?php print \JText::_('_JSHOP_CART_AJAX_SHOW_PRODUCTS')?></span>
                        <span class="text_hide"><?php print \JText::_('_JSHOP_CART_AJAX_HIDE_PRODUCTS')?></span>
                    </a>
                </div>
            </div>
        </div>
        
        <div class="block products-block" style="display: none;">
            <ul class="module-list">
                <?php foreach($cart->products as $number_in_cart => $product) : ?>
                    <li class="module-item" ca-product_id="<?php print $product['product_id']?>" ca-number="<?php print $number_in_cart?>">
                        <?php if ($params->get("showImage", 1)) : ?>
                            <?php if (!$product['thumb_image']) $product['thumb_image'] = $jshopConfig->noimage;?>
                            <div class="module-item-image">
                                <a href = "<?php echo $product['product_link'];?>"><img src="<?php print $jshopConfig->image_product_live_path?>/<?php print $product['thumb_image']?>" alt="<?php print $product['product_name']?>" /></a>
                            </div>
                        <?php endif; ?>
                        <div class = "module-product-info">
                            <div class="module-item-label"><a href = "<?php echo $product['product_link'];?>"><n><?php print $product['product_name']?></n></a></div>
                            <div class="module-item-count"><?php echo \JText::_('JSHOP_QUANTITY'); ?>: <?php print $product['quantity']?></div>
                            
                            <?php if ($params->get("showEan", 1)) : ?>
                                <div class="module-item-code"><?php echo \JText::_('JSHOP_EAN'); ?>: <n><?php print $product['ean']?></n></div>
                            <?php endif; ?>
                                
                            <div class="module-item-price"><?php echo \JText::_('JSHOP_PRICE'); ?>: <n><?php print \JSHelper::formatprice($product['price'])?></n></div>
                            <a class="module-item-remove"> </a>                            
                            <?php for($i = 0; $i < count($product['attributes_value']); $i++){ ?>
                                <p class="jshop_cart_attribute">
                                    <span class="name">
                                        <?php print_r($product['attributes_value'][$i]->attr); ?>         
                                    </span>
                                    <span class="value">
                                        <?php print_r($product['attributes_value'][$i]->value); ?>    
                                    </span>
                                </p>
                            <?php } ?>
                            <?php for($i = 0; $i < count($product['free_attributes_value']); $i++){ ?>
                                <p class="jshop_cart_attribute">
                                    <span class="name">
                                        <?php print_r($product['free_attributes_value'][$i]->attr); ?>      
                                    </span>
                                    <span class="value">
                                        <?php print_r($product['free_attributes_value'][$i]->value); ?>
                                    </span>
                                </p>
                            <?php } ?> 
                        </div>
                        <div class = "clr"></div>
                    </li>
                <?php endforeach; ?>                
            </ul>
            <div class="module-close">
                <a href="javascript:void(0)" class="cartajax-link">
                    <?php print \JText::_('_JSHOP_CART_AJAX_CLOSE'); ?>
                </a>
            </div>
            <div class = "clr"></div>
        </div>

        <div class="module-item-template" style="display:none">
            <li class="module-item" ca-product_id="" ca-number="">                
                <?php if ($params->get("showImage", 1)) : ?>
                    <div class="module-item-image">
                        <a href="">
                            <img src="" alt="">
                        </a>
                    </div>
                <?php endif; ?>
                <div class="module-product-info">
                    <div class="module-item-label"><a href=""><n></n></a></div>
                    <div class="module-item-count"><?php echo \JText::_('JSHOP_QUANTITY'); ?>: <n></n></div>
                    <?php if ($params->get("showEan", 1)) : ?>
                        <div class="module-item-code"><?php echo \JText::_('JSHOP_EAN'); ?>: <n></n></div>
                    <?php endif; ?>
                    <div class="module-item-price"><span><?php echo \JText::_('JSHOP_PRICE') ?>:</span> <n></n></div>
                    <a class="module-item-remove"></a>
                    <div class="module-item-attributes">
                        <p class="jshop_cart_attribute">
                            <span class="name"></span>
                            <span class="value"></span>
                        </p>
                    </div>                    
                </div>
                <div class="clr"></div>
            </li>
        </div>

    </div>
</div>