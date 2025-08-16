<?php
/*
 * @package    Nevigen JShop Recently Viewed Products Package
 * @version    1.0.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

namespace Joomla\Module\NevigenRecentlyViewedProducts\Site\Dispatcher;

defined('_JEXEC') or die;

use JFactory;
use Joomla\CMS\Dispatcher\AbstractModuleDispatcher;
use Joomla\CMS\Factory;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\Component\Jshopping\Site\Model\Productlist\ListModel;
use Joomla\Plugin\JShopping\NevigenRecentlyViewedProducts\Helper\NevigenRecentlyViewedProductsHelper;


/**
 * Dispatcher class for mod_nevigen_jshopcart
 *
 * @since  1.0.0
 */
class Dispatcher extends AbstractModuleDispatcher
{
	/**
	 * Runs the dispatcher.
	 *
	 * @return  void
	 *
	 * @since   1.0.0
	 */
	public function dispatch()
	{
		if (!file_exists(JPATH_SITE . '/components/com_jshopping/bootstrap.php')
			|| empty(NevigenRecentlyViewedProductsHelper::getProducts()))
		{
			return;
		}

		require_once(JPATH_SITE . '/components/com_jshopping/bootstrap.php');

		\JSFactory::loadCssFiles();
		\JSFactory::loadLanguageFile();

		parent::dispatch();
	}

	/**
	 * Returns the layout data. This function can be overridden by subclasses to add more
	 * attributes for the layout.
	 *
	 * If false is returned, then it means that the dispatch process should be aborted.
	 *
	 * @throws \Exception
	 *
	 * @return  array|false
	 *
	 * @since   1.0.0
	 */
	protected function getLayoutData()
	{
		$data = parent::getLayoutData();

		$data['products'] = [];

		$ids = NevigenRecentlyViewedProductsHelper::getProducts();
		if (!empty($ids))
		{
			/** @var ListModel $model */
			$model = JSFactory::getModel('List', 'Site\\Productlist');
			$app   = Factory::getApplication();
			if ($model)
			{
				$products = $model->getLoadProducts(['products' => $ids]);
				if (!empty($products))
				{
					$app->triggerEvent('onBeforeDisplayProductList', [&$products]);
					$view       = new \stdClass();
					$view->rows = $products;
					$app->triggerEvent('onBeforeDisplayProductListView', [&$view, &$product]);
					$products = $view->rows;


					$data['products']    = $products;
					$data['jshopConfig'] = JSFactory::getConfig();
					$data['noimage']     = $data['jshopConfig']->image_product_live_path . '/noimage.gif';
				}
			}

		}

		return $data;
	}

}
