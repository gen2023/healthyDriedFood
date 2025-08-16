<?php

    defined('_JEXEC') or die();

    $dis_fields = $this->dis_fields;
    
?>

<thead>
    <tr>
        <th class="td40">
            <p>#</p>
        </th>
        <th>
            <p><?php echo \JHTML::_('grid.sort', \JText::_('JSHOP_TITLE'), 'name', $this->filter_order_Dir, $this->filter_order)?></p>
        </th>

        <?php if (!$dis_fields['alias']) :?>
            <th>
                <p><?php echo \JText::_('JSHOP_ALIAS'); ?></p>
            </th>
        <?php endif; ?>

        <?php if (!$dis_fields['code']) :?>  
            <th>
                <p><?php echo \JHTML::_( 'grid.sort', \JText::_('JSHOP_EAN_PRODUCT'), 'ean', $this->filter_order_Dir, $this->filter_order);?></p>
            </th>
        <?php endif; ?>

		<?php if ($this->config->disable_admin['manufacturer_code'] == 0) {?>
            <?php if (!$dis_fields['man_code']) :?>
                <th>
                    <p><?php echo \JText::_('JSHOP_MANUFACTURER_CODE'); ?></p>
                </th>
            <?php endif; ?>
		<?php }?>
        <th style="display:none;">
            <p><?php echo \JText::_('JSHOP_SHORT_DESCRIPTION'); ?></p>
        </th>
        <th style="display:none;">
            <p><?php echo \JText::_('JSHOP_DESCRIPTION'); ?></p>
        </th>
        
        <?php if (!$dis_fields['meta_title']) :?>
            <th>
                <p><?php echo \JText::_('JSHOP_META_TITLE'); ?></p>
            </th>
        <?php endif; ?>

        <?php if (!$dis_fields['meta_keywords']) :?>
            <th>
                <p><?php echo \JText::_('JSHOP_META_KEYWORDS'); ?></p>
            </th>
        <?php endif; ?>

        <?php if (!$dis_fields['meta_descr']) :?>
            <th>
                <p><?php echo \JText::_('JSHOP_META_DESCRIPTION'); ?></p>
            </th>
        <?php endif; ?>

        <th>
            <p><?php echo \JHTML::_('grid.sort', \JText::_('JSHOP_CATEGORY'), 'category', $this->filter_order_Dir, $this->filter_order)?></p>
        </th>

        <?php if (!$dis_fields['manufacturer']) :?>
            <th>
                <p><?php echo \JHTML::_( 'grid.sort', \JText::_('JSHOP_MANUFACTURER'), 'manufacturer', $this->filter_order_Dir, $this->filter_order)?></p>
            </th>
        <?php endif; ?>

        <?php if ($this->show_vendor){?>
        <th>
            <p><?php echo \JHTML::_( 'grid.sort', \JText::_('JSHOP_VENDOR'), 'vendor', $this->filter_order_Dir, $this->filter_order)?></p>
        </th>
        <?php } ?>
        <?php if ($this->config->stock){?>
        <th>
            <p><?php echo \JHTML::_( 'grid.sort', \JText::_('JSHOP_QUANTITY_PRODUCT'), 'qty', $this->filter_order_Dir, $this->filter_order);?></p>
        </th>
        <th>
            <p><?php echo \JText::_('JSHOP_UNLIMITED');?></p>
        </th>
        <?php }?>
        <th>
            <p>
                <?php
                if ($this->config->display_price_admin==0)
                    $price_t = \JText::_('JSHOP_PRODUCT_BRUTTO_PRICE');
                else
                    $price_t = \JText::_('JSHOP_PRODUCT_NETTO_PRICE');
                ?>
                
                <?php echo \JHTML::_( 'grid.sort', $price_t, 'price', $this->filter_order_Dir, $this->filter_order);?>

            </p>
        </th>

        <?php if (!$dis_fields['old_price']) :?>
            <th>
                <p><?php echo \JHTML::_( 'grid.sort', \JText::_('JSHOP_OLD_PRICE'), 'product_old_price', $this->filter_order_Dir, $this->filter_order);?></p>
            </th>
        <?php endif; ?>

        <?php if ($this->config->admin_show_product_bay_price){?>
        <th>
            <p><?php echo \JHTML::_( 'grid.sort', \JText::_('JSHOP_PRODUCT_BUY_PRICE'), 'product_buy_price', $this->filter_order_Dir, $this->filter_order);?></p>
        </th>
        <?php } ?>

        <?php if (!$dis_fields['consignment']) :?>
            <th>
                <p><?php echo \JHTML::_( 'grid.sort', \JText::_('JSHOP_PRODUCT_ADD_PRICE'), 'product_is_add_price', $this->filter_order_Dir, $this->filter_order);?></p>
            </th>
        <?php endif; ?>

        <?php if (!$dis_fields['currency']) :?>  
            <th>
                <p><?php echo \JHTML::_( 'grid.sort', \JText::_('JSHOP_CURRENCY_PARAMETERS'), 'currency', $this->filter_order_Dir, $this->filter_order);?></p>
            </th>
        <?php endif; ?>

        <?php if (!$dis_fields['weight']) :?>  
            <th>
                <p><?php echo \JHTML::_( 'grid.sort', \JText::_('JSHOP_PRODUCT_WEIGHT').' ('.\JText::_('JSHOP_WEIGHT_UNIT').')', 'product_weight', $this->filter_order_Dir, $this->filter_order);?></p>
            </th>
        <?php endif; ?>
        
        <?php if (!$dis_fields['access']) :?>
            <th>
                <p><?php echo \JHTML::_( 'grid.sort', \JText::_('JSHOP_ACCESS'), 'access', $this->filter_order_Dir, $this->filter_order);?></p>
            </th>
        <?php endif; ?>

        <?php if (!$dis_fields['template']) :?>
            <th>
                <p><?php echo \JText::_('JSHOP_TEMPLATE_PRODUCT'); ?></p>
            </th>
        <?php endif; ?>

        <?php if($this->config->tax){?>
            <?php if (!$dis_fields['tax']) :?>
                <th>
                    <p><?php echo \JHTML::_( 'grid.sort', \JText::_('JSHOP_TAX'), 'product_tax_id', $this->filter_order_Dir, $this->filter_order);?></p>
                </th>
            <?php endif; ?>
        <?php } ?>

        <?php if ($this->config->admin_show_delivery_time){?>
            <?php if (!$dis_fields['del_time']) :?>
                <th>
                    <p><?php echo \JText::_('JSHOP_PANEL_DELIVERY_TIME'); ?></p>
                </th>
            <?php endif; ?>
        <?php } ?>

        <?php if ($this->config->admin_show_product_labels){?>
            <?php if (!$dis_fields['label']) :?>
                <th>
                    <p><?php echo \JHTML::_( 'grid.sort', \JText::_('JSHOP_LABEL'), 'label_id', $this->filter_order_Dir, $this->filter_order);?></p>
                </th>
            <?php endif; ?>
        <?php } ?>

        <?php if ($this->config->admin_show_product_basic_price){?>
            <?php if (!$dis_fields['b_price']) :?>
                <th>
                    <p><?php echo \JHTML::_( 'grid.sort', \JText::_('JSHOP_WEIGHT_VOLUME_UNITS').' ('.\JText::_('JSHOP_BASIC_PRICE').')', 'weight_volume_units', $this->filter_order_Dir, $this->filter_order);?></p>
                </th>
                <th>
                    <p><?php echo \JText::_('JSHOP_UNIT_MEASURE').' ('.\JText::_('JSHOP_BASIC_PRICE').')';?></p>
                </th>
            <?php endif; ?>
        <?php } ?>

        <?php if (!$dis_fields['url']) :?>
            <th>
                <p><?php echo \JText::_('JSHOP_URL'); ?></p>
            </th>
        <?php endif; ?>

		<?php foreach ($this->aditional_fields as $field) {?>
		<th>
            <p><?php echo $field; ?></p>
        </th>
		<?php }?>

        <th>
            <p><?php echo \JText::_('JSHOP_PUBLISH'); ?></p>
        </th>
        <th class="td40">
            <p><?php echo \JHTML::_( 'grid.sort', \JText::_('JSHOP_ID'), 'product_id', $this->filter_order_Dir, $this->filter_order);?></p>
        </th>
    </tr>
</thead>
