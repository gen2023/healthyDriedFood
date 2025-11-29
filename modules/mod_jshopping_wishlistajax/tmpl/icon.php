<?php
use Joomla\Component\Jshopping\Site\Helper\Helper;
use Joomla\CMS\Uri\Uri;
?>
<div class="wishlist-module wishlist-module-icon">    
	<a href="<?php print Helper::SEFLink('index.php?option=com_jshopping&controller=wishlist', 1, 0); ?>">
		<div class="module-bottom">
			<div class="module-count" ca-prodcount="<?php print isset($wishlist->count_product) ? $wishlist->count_product : 0;?>">
				<span class="val"><?php print isset($wishlist->count_product) ? $wishlist->count_product : 0;?></span>			
			</div>        
		</div>
		<img src="<?php print Uri::base()?>components/com_jshopping/css/addons/images/wish.png" alt="wishlist">
	</a>
</div>