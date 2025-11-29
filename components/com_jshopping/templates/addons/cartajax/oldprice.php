<?php
use Joomla\Component\Jshopping\Site\Helper\Helper;
use Joomla\CMS\Language\Text;
?>
<div class="old_price" style="display:none">
	<?php if ($this->config->product_list_show_price_description) print Text::_('JSHOP_OLD_PRICE').': ';?>
	<span><?php print Helper::formatprice($this->product->product_old_price)?><?php print $this->product->_tmp_var_old_price_ext?></span>
</div>