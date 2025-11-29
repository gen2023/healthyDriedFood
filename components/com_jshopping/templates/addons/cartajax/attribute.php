<?php
use Joomla\CMS\Language\Text;
?>
<?php if (count($this->attributes) || count($this->free_attributes)) {?>
<form class="cartajaxattributes" name="cartajaxattributes-<?php echo $this->product_id?>" id="cartajaxattributes-<?php echo $this->product_id?>">
    <input type="hidden" name="product_id" value="<?php echo $this->product_id?>" />
    <input type="hidden" name="category_id" value="<?php echo $this->category_id?>" />
    <div class="cart_pls_sel_options">
        <?php echo Text::_('JSHOP_SELECT_PRODUCT_OPTIONS')?>
    </div>

    <?php foreach($this->attributes as $aid => $v) {?>
        <?php if ($v->grshow) { ?>
            <div>
                <span class="attributgr_name"><?php print $v->groupname?></span>
            </div>
        <?php } ?>
        <span class="cartajaxattributes-fieldset-wrapper cartajaxattributes-fieldset-wrapper-<?php echo $v->attr_id?>">
            <fieldset>
                <legend>
                    <?php echo $v->attr_name?>:
                    <span class="cartajax-required">*</span>
                </legend>        
                <div class="attr_type_<?php echo $v->attr_type?>">
                    <?php echo $v->selects?>
                </div>
            </fieldset>
        </span>
    <?php }?>

    <?php if (count($this->free_attributes) > 0) {
        foreach($this->free_attributes as $key => $v) { ?>
            <span class="cartajaxattributes-fieldset-wrapper cartajaxattributes-fieldset-wrapper-freeattribute-<?php echo $v->id?>">
                <fieldset>
                    <legend>
                        <?php echo $v->name?>
                        <?php if ($v->required) {?>
                            <span class="cartajax-required">*</span>
                        <?php } ?>
                    </legend>
                    <input type="text" class="inputbox input-medium" name="freeattribut[<?php echo $v->id?>]" value="<?php echo $this->active_free_attributes[$v->id] ?? ''?>" <?php if ($this->free_attributes_upd_price){?>priceupd="1"<?php }?> />
                </fieldset>
            </span>
        <?php }?>
        <div class="cartajax-required">* <?php echo Text::_('JSHOP_REQUIRED')?></div>
    <?php }?>
</form>
<?php }?>