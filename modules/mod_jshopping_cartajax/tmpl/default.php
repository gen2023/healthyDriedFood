<div class="cartajax-module">
    <ul class="module-list">
        <?php foreach($cart->products as $number_in_cart => $product){ ?>
            <li class="module-item" ca-product_id="<?php print $product['product_id']?>" ca-number="<?php print $number_in_cart?>">
                <div class="module-item-count"><n><?php print $product['quantity']?></n>&nbsp;x&nbsp;</div>
                <?php if ($params->get("showImage", 1)) : ?>
                    <?php if (!$product['thumb_image']) $product['thumb_image'] = $jshopConfig->noimage;?>
                    <div class="module-item-image">
                        <img src="<?php print $jshopConfig->image_product_live_path?>/<?php print $product['thumb_image']?>" alt="<?php print $product['product_name']?>" />
                    </div>
                <?php endif; ?>
                <div class="module-item-label"><a href="<?php echo $product['product_link']; ?>"><n><?php print $product['product_name']?></n></a></div>
                <?php if ($params->get("showEan", 1)) : ?>
                    <div class="module-item-id"><span><?php echo \JText::_('JSHOP_EAN') ?>:</span> <n><?php print $product['ean']?></n></div>
                <?php endif; ?>
                <div class="module-item-price"><span><?php echo \JText::_('JSHOP_PRICE') ?>:</span> <n><?php print \JSHelper::formatprice($product['price'])?></n></div>
                <a class="module-item-remove"></a>
                <div class="module-item-attributes">
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
            </li>
        <?php }?>        
    </ul>
    <div class="no-products-msg" ca-prodcount="<?php print count($cart->products)?>">
        <?php print \JText::_('JSHOP_NO_PRODUCTS_CART')?>
    </div>    
    <div class="module-bottom" ca-prodcount="<?php print count($cart->products)?>">
		<div class="module-total">
			<n class="name"><?php print \JText::_('JSHOP_TOTAL')?>:</n>
			<span class="val"><?php print \JSHelper::formatprice($cart->price_product)?></span>
		</div>
		<div class="module-count">
			<n class="name"><?php print \JText::_('JSHOP_PRODUCTS')?>:</n>
			<span class="val"><?php print isset($cart->count_product) ? $cart->count_product : 0;?></span>			
		</div>		
        <div class="module-checkout">
            <a class="module-checkout" href="<?php print $cart->cartAjaxHrefLink->link; ?>">
                <?php print $cart->cartAjaxHrefLink->label; ?>
            </a>
        </div>
    </div>

    <div class="module-item-template" style="display:none">
        <li class="module-item" ca-product_id="" ca-number="">
            <div class="module-item-count"><n></n>&nbsp;x&nbsp;</div>
            <?php if ($params->get("showImage", 1)) : ?>
                <div class="module-item-image"><img src="" alt=""></div>
            <?php endif; ?>
            <div class="module-item-label"><a href=""><n></n></a></div>
            <?php if ($params->get("showEan", 1)) : ?>
                <div class="module-item-code"><span><?php echo \JText::_('JSHOP_EAN') ?>:</span> <n></n></div>
            <?php endif; ?>
            <div class="module-item-price"><span><?php echo \JText::_('JSHOP_PRICE') ?>:</span> <n></n></div>
            <a class="module-item-remove"></a>
            <div class="module-item-attributes">
                <p class="jshop_cart_attribute">
                    <span class="name"></span>
                    <span class="value"></span>
                </p>
            </div>
        </li>
    </div>

</div>