<?php 
/**
* @version      5.3.1 15.09.2018
* @author       MAXXmarketing GmbH
* @package      Jshopping
* @copyright    Copyright (C) 2010 webdesigner-profi.de. All rights reserved.
* @license      GNU/GPL
*/
defined('_JEXEC') or die;
use Joomla\CMS\Language\Text;

?>
<div class="login-page">
	<div class="wrapper">
		<div class="ico"></div>
		<div class="ttl sm centered mb30"><?= Text::_('TPL_CUSTOM_CHECKOUT_FINISH_TTL') ?></div>
		<div class="text centered mb30"><?= Text::_('TPL_CUSTOM_CHECKOUT_FINISH_TEXT') ?></div>
		<a href="<?= Text::_('TPL_CUSTOM_HOME') ?>" class="btn centered"><?= Text::_('TPL_CUSTOM_BACK_TO_SHOP') ?></a>
	</div>
</div>
<?php /*if (!empty($this->text)){?>
<?php echo $this->text;?>
<?php }else{?>
<p><?php print JText::_('JSHOP_THANK_YOU_ORDER')?></p>
<?php }?>
<?php echo $this->text_end; */?>