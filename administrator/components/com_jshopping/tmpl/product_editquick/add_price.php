<?php
defined('_JEXEC') or die();
$jshopConfig = \JSFactory::getConfig();
?>
<form id="item-form" name="adminForm" enctype="multipart/form-data" method="post" action="index.php?option=com_jshopping&controller=products">
<table id = "table_add_price" class = "adminlist table">
    <thead>
        <tr>
            <th>
                <?php echo \JText::_('JSHOP_PRODUCT_QUANTITY_START');?>
            </th>
            <th>
                <?php echo \JText::_('JSHOP_PRODUCT_QUANTITY_FINISH');?>
            </th>
            <th>
                <?php echo \JText::_('JSHOP_DISCOUNT');?>
                (<?php if ($jshopConfig->product_price_qty_discount==1) echo ""; else print "%";?>)
            </th>
            <th>
                <?php echo \JText::_('JSHOP_PRODUCT_PRICE');?>
            </th>
            <th>
                <?php echo \JText::_('JSHOP_DELETE');?>
            </th>
        </tr>
    </thead>
    <?php
    $add_prices = $this->product->product_add_prices;
    $count = count($add_prices);
    for ($i = 0; $i < $count; $i++){
        if ($jshopConfig->product_price_qty_discount==1){
            $_add_price = $this->product->product_price - $add_prices[$i]->discount;
        }else{
            $_add_price = $this->product->product_price - ($this->product->product_price * $add_prices[$i]->discount / 100);
        }
        $_add_price = number_format($_add_price,2,".","");
    ?>
        <tr id="add_price_<?php print $i?>">
            <td>
                <input type = "text" name = "quantity_start[]" id="quantity_start_<?php print $i?>" value = "<?php echo $add_prices[$i]->product_quantity_start;?>" />
            </td>
            <td>
                <input type = "text" name = "quantity_finish[]" id="quantity_finish_<?php print $i?>" value = "<?php echo $add_prices[$i]->product_quantity_finish;?>" />
            </td>
            <td>
                <input type = "text" name = "product_add_discount[]" id="product_add_discount_<?php print $i?>" value = "<?php echo $add_prices[$i]->discount;?>" onkeyup="jshopAdmin.productAddPriceupdateValue(<?php print $i?>)" />
            </td>
            <td>
                <input type = "text" id="product_add_price_<?php print $i?>" value = "<?php echo $_add_price;?>" onkeyup="jshopAdmin.productAddPriceupdateDiscount(<?php print $i?>)" />
            </td>
            <td align="center">
                <a href="#" onclick="jshopAdmin.delete_add_price(<?php print $i?>);return false;"><img src="components/com_jshopping/images/publish_r.png" border="0"/></a>
            </td>
        </tr>
        <?php
    }
    ?>
</table>
    
<table class="adminlist">
    <tr>
        <td style="text-align: left"><?php echo $this->lists['add_price_units'];?> - <?php echo \JText::_('JSHOP_UNIT_MEASURE');?></td>
        <td align = "right" width="100">
            <input class="button btn btn-primary" type = "button" name = "add_new_price" onclick = "jshopAdmin.addNewPrice()" value = "<?php echo \JText::_('JSHOP_PRODUCT_ADD_PRICE_ADD');?>" />
        </td>
    </tr>
    <tr>
        <td></td>
        <td align = "right" width="100">
            <input class="button btn btn-success" type = "button" name = "form_save" onclick = "saveForm()" value = "<?php echo \JText::_('JSAVE');?>" />
        </td>
    </tr>    
</table>
    <input type="hidden" id="product_price" value="<? echo $this->product->product_price;?>">
    <input type="hidden" value="<? echo $this->product_id; ?>" name="product_id">
</form>
<script type="text/javascript">
<?php
print "jshopAdmin.add_price_num = $i;";
print "jshopAdmin.config_product_price_qty_discount = ".$jshopConfig->product_price_qty_discount.";";
?>
function saveForm(){
    var data = jQuery('form[name="adminForm"]').serialize();
    jQuery.ajax({
        type: 'POST',
        url: 'index.php?option=com_jshopping&controller=products_editquick&task=addPriceSave&ajax=1',
        data: data,
        beforeSend: function() {
            
        },
        success: function(html){
            window.parent.CloseModal();
        }
    });
    return false;
}
</script>
