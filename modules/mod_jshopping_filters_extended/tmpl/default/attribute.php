<?php if ($show_attributes && isset($listAttribut) && is_array($listAttribut) && count($listAttribut)){ ?>
    <input type="hidden" name="attr_val[]" value="0" />

    <?php if ($show_attributes_title) {?>
        <div class="head_group"><?php print JText::_('Product_attributes')?></div>
    <?php }?>
    
    <?php foreach($listAttribut as $attr) {?>
        <div class="fblock filter_attr<?php echo $span;?>" group="attribute" gid="<?php print $attr->attr_id?>" show_group_name="1">
            <?php $hint = modJshopping_filters_extendedHelper::getModHint('attribut', $attr->attr_id);?>
            <div class="head">
                <span><?php print $attr->name;?></span>
                <?php if ($hint){?>
                    <a href="#hint_attribut_<?php print $attr->attr_id?>" class="modalhint mod_hint_i"></a>
                    <div class="modal_open" style="display:none" id="hint_attribut_<?php print $attr->attr_id?>">
                        <span class="icon-times modal-close"></span>
                        <h3><?php print $attr->name?></h3>
                        <?php print nl2br($hint)?>
                    </div>
                <?php } ?>
            </div>
                
            <?php if (in_array($attr->attr_id, $show_attributes_id_checkbox) || in_array(0, $show_attributes_id_checkbox)){ ?>
                <div class="filters-lists <?php print modJshopping_filters_extendedHelper::addScrollingClass($attr->values, $params->get('filter_scrolling_number_attributes', 0))?>">
                    <?php 
                    if ( (in_array($attr->attr_id, $show_attribute_image) || in_array('0', $show_attribute_image))) {
                        $image = 'image';
                    } else {
                        $image = '';
                    }
                    ?>
                    <?php print $inputCore->getCheckboxs('attr_val[]', $attr->values, $attribut_active, $image, $jshopConfig->image_attributes_live_path, 'value_id'); ?>
                </div>
            <?php } else { ?>
                <?php print $inputCore->getSelect('attr_val[]', $attr->values, $attribut_active, '', '', 'value_id', 'filter_attr_'.$attr->attr_id); ?>
            <?php }?>
        </div>
    <?php } ?>
<?php } ?>