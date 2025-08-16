<?php if (isset($show_characteristics) && $show_characteristics && is_array($characteristics) && count($characteristics)){?> 

    <?php if ($show_characteristics_title) { ?>
        <div class="head_group"><?php print JText::_('Product_Characteristics')?></div>
    <?php } ?>
    
    <?php foreach($characteristics as $ch){ ?>

        <?php if ($show_characteristics_group && $ch->groupname!='' && (!isset($group_name) || $ch->groupname!=$group_name)){ ?>
            <div class="head_group head_group_name"><?php print $group_name = $ch->groupname;?></div>
        <?php } ?>

        <div class="fblock filter_characteristic<?php echo $span;?>" group="extra_field" gid="<?php print $ch->id?>" show_group_name="1">
            <?php $hint = modJshopping_filters_extendedHelper::getModHint('exfield', $ch->id);?>
            <div class="head">
                <?php print modJshopping_filters_extendedHelper::getCharactiristicImage($ch->id)?>
                <span><?php print $ch->name?></span>
                <?php if ($hint) {?>
                    <a href="#hint_exfield_<?php print $ch->id?>" class="modalhint mod_hint_i"></a>
                    <div class="modal_open" style="display:none" id="hint_exfield_<?php print $ch->id?>">
                        <span class="icon-times modal-close"></span>                        
                        <h3><?php print $ch->name?></h3>
                        <?php print nl2br($hint)?>
                    </div>
                <?php }?>
            </div>
                    
            <?php if ( isset($ch->values) ) {?>
                <?php 
                if ($ch->type != '1'){
                    $field_name = 'extra_fields['.$ch->id.'][]';
                    $hidden_val = 0;
                    $_active = isset($extra_fields_active[$ch->id]) ? $extra_fields_active[$ch->id] : '';
                } else {
                    $field_name = 'extra_fields_t['.$ch->id.'][]';
                    $hidden_val = '';
                    $_active = isset($extra_fields_t_active[$ch->id]) ? $extra_fields_t_active[$ch->id] : '';
                }                
                ?>

                <?php if (in_array($ch->id, $show_characteristics_id_checkbox) || in_array(0, $show_characteristics_id_checkbox)){?>
                    <div class="filters-lists <?php print modJshopping_filters_extendedHelper::addScrollingClass($ch->values ?? [], $params->get('filter_scrolling_number_characteristics', 0))?>">
                        <input type="hidden" name="<?php print $field_name?>" value="<?php print $hidden_val?>">
                        <?php print $inputCore->getCheckboxs($field_name, $ch->values, $_active, 'image', $jshopConfig->image_attributes_live_path,  'id');?>
                    </div>
                <?php } else { ?>
                    <?php print $inputCore->getSelect($field_name, $ch->values, $_active, '', '', 'id','item_ch_'.$ch->id);?>
                <?php } ?>

            <?php } else { ?>
                <div class="filter_item">
                    <div class="item_ch_text">
                        <?php
                        $value = $extra_fields_active[$ch->id] ?? '';
                        ?>
                        <input type="text" size="15" name="extra_fields[<?php print $ch->id?>]" value="<?php print htmlspecialchars($value, ENT_QUOTES)?>" />
                        <?php if ($show_characteristics_button) { ?>
                            <button class="btn btn-primary btn-go" onclick="jshop_filters_submit(<?php print $filter_number?>, true);return false;">
                                <?php print \JText::_('GO')?>
                            </button>
                        <?php }?>
                    </div>
                </div>
            <?php } ?>

        </div>
    <?php } ?>
<?php } ?>  