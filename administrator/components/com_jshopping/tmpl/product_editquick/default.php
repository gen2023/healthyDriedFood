<?php
use Joomla\CMS\HTML\HTMLHelper;

defined('_JEXEC') or die();    
\JFactory::getDocument()->addScript(\JURI::root().'administrator/components/com_jshopping/js/functions_quickedit.js', 'text/javascript');
\JFactory::getDocument()->addStyleSheet(\JURI::root().'administrator/components/com_jshopping/css/quickedit.css', 'text/css');

$rows=$this->rows;
$lists=$this->lists;
$pageNav=$this->pagination;
$text_search=$this->text_search;
$category_id=$this->category_id;
$manufacturer_id=$this->manufacturer_id;
$count=count ($rows);
$i=0;
$saveOrder=$this->filter_order_Dir=="asc" && $this->filter_order=="ordering";
$dis_fields = $this->dis_fields;
?>
<form action="index.php?option=com_jshopping&controller=products_editquick&tmpl=component" method="post" name="adminForm" id="adminForm">

<table width="100%" style="padding-bottom:5px;">
  <tr>
      <td><a class="btn btn-secondary" href="index.php?option=com_jshopping&controller=products"><? echo \JText::_('JSHOP_BACK'); ?></a></td>
    <td width="95%" align="right">
    	<?php if($this->multilang) echo $this->languages; ?>
        <?php print $this->tmp_html_filter ?? '';?>
        <?php echo \JText::_('JSHOP_CATEGORY').": ".$lists['treecategories'];?>&nbsp;&nbsp;&nbsp;
        <?php echo \JText::_('JSHOP_NAME_MANUFACTURER').": ".$lists['manufacturers'];?>&nbsp;&nbsp;&nbsp;
        <?php if ($this->show_vendor) : ?>
            <?php echo \JText::_('JSHOP_VENDOR').": ".$lists['vendors'];?>&nbsp;&nbsp;&nbsp;
        <?php endif; ?>
        <?php
        if ($this->config->admin_show_product_labels){
            echo \JText::_('JSHOP_LABEL').": ".$lists['labels']."&nbsp;&nbsp;&nbsp;";
        }
        ?>
        <?php echo \JText::_('JSHOP_SHOW').": ".$lists['publish'];?>&nbsp;&nbsp;&nbsp;
    </td>
    <td>
        <input type="text" name="text_search" value="<?php echo htmlspecialchars($text_search);?>" />
    </td>
    <td>
        <input type="submit" class="button btn btn-primary" value="<?php echo \JText::_('JSHOP_SEARCH');?>" />
    </td>
  </tr>
</table>
<div class="thead" style="opacity:0;">
    <table class="adminlistquick">
        <?php /*echo $this->loadTemplate('thead');*/ ?>
    </table>
</div>

<div class="scrollcontt">
    <table class="adminlistquick">
    <?php echo $this->loadTemplate('thead'); ?>
    <tbody>
    <?php foreach($rows as $row){?>
      <tr data-id="<?php echo $row->product_id?>">
		<td align="center" class="td40">
            <?php echo $pageNav->getRowOffset($i);?>
		</td>
		<td data-field="product_name" data-type="text">
         <p><?php echo $row->name;?></p>
		</td>
        
        <?php if (!$dis_fields['alias']) :?>  
            <td data-field="alias" data-type="text">
            <p><?php echo $row->alias;?></p>
            </td>
        <?php endif; ?>

        <?php if (!$dis_fields['code']) :?>  
            <td data-field="product_ean" align="center">
                <p><?php echo $row->ean?></p>
            </td>
        <?php endif; ?>

		<?php if ($this->config->disable_admin['manufacturer_code'] == 0) {?>
            <?php if (!$dis_fields['man_code']) :?>
                <td data-field="manufacturer_code" align="center">
                    <p><?php echo $row->manufacturer_code?></p>
                </td>
            <?php endif; ?>
		<?php }?>
		<td data-field="short_description" data-type="textarea" style="display:none;">
			<p><?php echo $row->short_description;?></p>
		</td>
       <td data-field="description" data-type="textarea" style="display:none;">
         <p><?php echo $row->description;?></p>
       </td>

       <?php if (!$dis_fields['meta_title']) :?>
            <td data-field="meta_title">
                <p><?php echo $row->meta_title;?></p>
            </td>
       <?php endif; ?>

       <?php if (!$dis_fields['meta_keywords']) :?>
            <td data-field="meta_keyword">
                <p><?php echo $row->meta_keyword;?></p>
            </td>
       <?php endif; ?>

       <?php if (!$dis_fields['meta_descr']) :?>
            <td data-field="meta_description">
                <p><?php echo $row->meta_description;?></p>
            </td>
       <?php endif; ?>

       <td data-field="categories" data-type="select">
          <p><?php echo $row->namescats;?></p>
       </td>

       <?php if (!$dis_fields['manufacturer']) :?>
            <td data-field="manufacturer" data-type="select">
                <p><?php echo $row->man_name;?></p>
            </td>
       <?php endif; ?>


       <?php if ($this->show_vendor){?>
       <td data-field="vendor_name" data-type="select">
            <p><?php echo $row->vendor_name;?></p>
       </td>
       <?php }?>
       <?php if ($this->config->stock){?>
        <?php
            if($row->unlimited > 0){
                $checked = 'checked="checked"';
                $clas='';
                $data_attr = '';
                $qty = '-';
            }else{
                $checked = '';
                $clas='';
                $data_attr = 'data-field="product_quantity"';
                $qty = $row->qty;
            }
        ?>
       <td <?php echo $data_attr; ?> class="<?php echo $clas; ?>" align="center">
        <p><?php echo $qty;  ?></p>
       </td>
        <td align="center" data-type="checkbox">
        <?php
            echo '<input type="checkbox" onclick="Qty(this,'.$row->product_id.')" value="1" name="unlimited['.$row->product_id.']" '.$checked.'>';
        ?>
       </td>
       <?php }?>
       <td data-field="product_price" align="center" data-format="price">
        <p><?php echo $row->product_price;?></p>
       </td>

       <?php if (!$dis_fields['old_price']) :?>
            <td data-field="product_old_price" align="center" data-format="price">
                <p><?php echo $row->product_old_price; ?></p>
            </td>
       <?php endif; ?>

        <?php if ($this->config->admin_show_product_bay_price){?>        
            <td data-field="product_buy_price" align="center" data-format="price">
                <p><?php echo $row->product_buy_price; ?></p>
            </td>          
        <?php } ?>

        <?php if (!$dis_fields['consignment']) :?>  
            <td data-field="product_is_add_price" align="left" data-type="checkbox" class="middle80">
                <?php
                    if ($row->product_is_add_price > 0) {
                        $checked = 'checked="checked"';
                        $link = '<a data-bs-toggle="modal" data-bs-target="#aModal" style="padding-left:5px;" href="index.php?option=com_jshopping&controller=products_editquick&task=addPrice&product_id='.$row->product_id.'&tmpl=component" onclick="loadHrefToModal(this)"><img src="components/com_jshopping/images/icon-16-edit.png"></a>';
                    } else {
                        $checked = '';
                        $link = '<a data-bs-toggle="modal" data-bs-target="#aModal" style="padding-left:5px;display:none;" href="index.php?option=com_jshopping&controller=products_editquick&task=addPrice&product_id='.$row->product_id.'&tmpl=component" onclick="loadHrefToModal(this)"><img src="components/com_jshopping/images/icon-16-edit.png"></a>';
                    }
                    echo '<input style="margin-left:15px;" type="checkbox" onclick="AddPrice(this,'.$row->product_id.')" value="1" name="product_is_add_price" '.$checked.'>'; 
                    echo '  ';
                    echo  $link;
                ?>        
            </td>
       <?php endif; ?>

       <?php if (!$dis_fields['currency']) :?>  
            <td data-field="currency_id" align="center" data-type="select">
                <p><?php echo \JSHelper::sprintCurrency($row->currency_id);?></p>
            </td>
       <?php endif; ?>

       <?php if (!$dis_fields['weight']) :?>  
            <td data-field="product_weight" align="center">
                <p><?php echo $row->product_weight;?></p>
            </td>
       <?php endif; ?>

       <?php if (!$dis_fields['access']) :?>
            <td data-field="access" align="center" data-type="select">
                <p><?php echo $row->access_name;?></p>
            </td>
       <?php endif; ?>

       <?php if (!$dis_fields['template']) :?>
            <td data-field="product_template" align="center" data-type="select">
                <p><?php echo $row->product_template;?></p>
            </td>
       <?php endif; ?>

       <?php if ($this->config->tax){?>
            <?php if (!$dis_fields['tax']) :?>
                <td data-field="product_tax_id" align="center" data-type="select">
                    <p><?php echo $row->tax_name;?></p>
                </td>
        <?php endif; ?>
       <?php }?>

       <?php if ($this->config->admin_show_delivery_time){?>
            <?php if (!$dis_fields['del_time']) :?>
                <td data-field="delivery_times_id" align="center" data-type="select">
                    <p><?php echo $row->delivery_times_name; ?></p>
                </td>
            <?php endif; ?>
       <?php } ?>

       <?php if ($this->config->admin_show_product_labels){?>
            <?php if (!$dis_fields['label']) :?>
                <td data-field="label_id" align="center" data-type="select">
                    <p><?php echo $row->label_name; ?></p>
                </td>
            <?php endif; ?>
       <?php } ?>

       <?php if ($this->config->admin_show_product_basic_price){?>
            <?php if (!$dis_fields['b_price']) :?>
                <td data-field="weight_volume_units" align="center" data-format="price">
                    <p><?php echo $row->weight_volume_units; ?></p>
                </td>
                <td data-field="basic_price_unit_id" align="center" data-type="select">
                    <p><?php echo $row->basic_price_unit_name; ?></p>
                </td>
            <?php endif; ?>
       <?php } ?>

       <?php if (!$dis_fields['url']) :?>
            <td data-field="product_url" align="center">
                <p><?php echo $row->product_url; ?></p>
            </td>
       <?php endif; ?>

	    <?php foreach ($this->aditional_fields as $field) {?>
		<td data-field="<?php print $field?>">
			<p><?php echo $row->$field; ?></p>
        </td>
	    <?php }?>

        
       <td align="center" data-type="checkbox">
        <?php if($row->product_publish) $checked = 'checked="checked"'; else $checked = '';
        echo '<input type="checkbox" value="1" name="product_publish['.$row->product_id.']" '.$checked.' onclick="Publish(this,'.$row->product_id.')">';
        ?>
       </td>
       <td align="center" class="td40">
         <?php echo $row->product_id; ?>
       </td>
      </tr>
    <?php
    $i++;
    }
    ?>
    </tbody>
    </table>
    <br><br><br><br><br>
</div>

<div class="tfoot">
    <div>
        <?php print $this->tmp_html_col_before_td_foot ?? '';?>
        <div><?php echo $pageNav->getListFooter();?></div>
        <?php print $this->tmp_html_col_after_td_foot ?? '';?>
    </div>
</div>

<input type="hidden" name="filter_order" value="<?php echo $this->filter_order?>" />
<input type="hidden" name="filter_order_Dir" value="<?php echo $this->filter_order_Dir?>" />
<input type="hidden" name="task" value="" />
<input type="hidden" name="hidemainmenu" value="0" />
<input type="hidden" name="boxchecked" value="0" />
<input type="hidden" name="selected_old_value" value="" />
<input type="hidden" name="selected_edit_row" value="" />
<input type="hidden" name="selected_edit_col" value="" />
<input type="hidden" name="lang" value="<?php echo $this->lang; ?>" />
</form>

<?php 
print HTMLHelper::_(
    'bootstrap.renderModal',
    'aModal',
    array(
        'title'       => \JText::_('Prices'),
        'backdrop'    => 'static',
        'url'         => 'index.php?option=com_jshopping&controller=products_editquick&task=addPrice&product_id=0&tmpl=component',
        'height'      => '400px',
        'width'       => '600px',
        'bodyHeight'  => 70,
        'modalWidth'  => 80        
    )
);
?>