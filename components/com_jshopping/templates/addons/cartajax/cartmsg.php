<?php
use Joomla\CMS\Language\Text;
use Joomla\Component\Jshopping\Site\Helper\Helper;
if (!empty($this->cart_page_msg)) {?>
    <div id="system-message-container" class="mt-1 mb-2">
        <joomla-alert type="message" close-text="Close" dismiss="true" role="alert">
            <div class="alert-wrapper">
                <div class="alert-message"><?php echo $this->cart_page_msg; ?></div>
            </div>
        </joomla-alert>
    </div>
<?php } ?>
<div class="cart_popup_item d-flex">
    <div class="img">
        <?php if (!count($this->images)){?>
            <img class="image" src="<?php print $this->image_product_path?>/<?php print $this->noimage?>" alt="<?php print htmlspecialchars($this->product->name)?>" />
        <?php } else {
            $image = $this->images[0];
        ?>                    
            <img class="image" src="<?php print $this->image_product_path?>/<?php print $image->image_name;?>" alt="<?php print htmlspecialchars($image->img_alt)?>" title="<?php print htmlspecialchars($image->img_title)?>" />                            
        <?php }?>
    </div>
    <div class="info">
        <h6 class="mb-3">
            <?php echo $this->product->name;?>
        </h6>
        <div class="descr mb-2">
            <?php echo $this->product->short_description;?>
        </div>
        <?php if (count($this->attr_act)) {?>
            <div class="attr_act mb-2">            
                <?php foreach($this->attr_act as $k => $v) { ?>
                    <div class="d-flex">
                        <div class="name"><?php print $k?>: </div>
                        <div class="val"><?php print $v?></div>
                    </div>
                <?php } ?>
            </div>
        <?php } ?>
        
        <div class="mt-3 price d-flex">            
            <span class="name d-none"><?php print Text::_('JSHOP_PRICE')?>:</span>
            <span id="block_price_cp">
                <?php print Helper::formatprice($this->product->getPriceCalculate())?>                    
            </span>            
        </div>
    </div>
</div>