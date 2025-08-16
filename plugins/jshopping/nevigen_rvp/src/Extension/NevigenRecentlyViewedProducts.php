<?php
/*
 * @package    Nevigen JShop Recently Viewed Products Package
 * @version    1.0.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

namespace Joomla\Plugin\JShopping\NevigenRecentlyViewedProducts\Extension;

\defined('_JEXEC') or die;

use Joomla\CMS\Plugin\CMSPlugin;
use Joomla\Plugin\JShopping\NevigenRecentlyViewedProducts\Helper\NevigenRecentlyViewedProductsHelper;

class NevigenRecentlyViewedProducts extends CMSPlugin
{

	public function onBeforeDisplayProductView($view)
	{
		if (empty($view->product)) {
			return;
		}

		NevigenRecentlyViewedProductsHelper::setProduct($view->product->product_id, $this->params);
	}

}
