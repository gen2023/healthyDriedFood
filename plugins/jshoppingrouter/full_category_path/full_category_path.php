<?php
/**
 * @package Joomla
 * @subpackage JoomShopping
 * @author Nevigen.com, Sergey Tolkachyov
 * @website https://nevigen.com/, https://web-tolk.ru
 * @email support@nevigen.com, info@web-tolk.ru
 * @copyright Copyright © Nevigen.com, Sergey Tolkachyov. All rights reserved.
 * @license http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 * @license agreement https://nevigen.com/license-agreement.html
 **/

use Joomla\CMS\Factory;
use Joomla\CMS\Plugin\CMSPlugin;
use Joomla\CMS\Version;


defined('_JEXEC') or die;

class plgJshoppingrouterFull_category_path extends CMSPlugin
{

	protected $category_id;

	protected static function getCategoryList()
	{
		static $categoryList;

		if (!is_array($categoryList)) {


			if ((new Version())->isCompatible('4.0') == true) {
				$allCategories = \JSFactory::getTable('Category', 'jshop')->getAllCategories();
			} else {
				$allCategories = JSFactory::getTable('Category', 'jshop')->getAllCategories();
			}
			$categoryList = array();
			foreach ($allCategories as $row) {
				$categoryList[$row->category_id] = $row->category_parent_id;
			}
			unset($allCategories);
		}

		return $categoryList;
	}

	protected static function buildSegment($category_id)
	{
		static $segments = array();

		if (!isset($segments[$category_id])) {
			$categoryList = self::getCategoryList();
			if ((new Version())->isCompatible('4.0') == true) {
				$aliasCategory = \JSFactory::getAliasCategory();
			} else {
				$aliasCategory = JSFactory::getAliasCategory();
			}

			$segments[$category_id] = array();

			$full_path = array();
			$categoryID = $category_id;
			while ($categoryList[$categoryID]) {
				$categoryID = $categoryList[$categoryID];
				$full_path[] = $categoryID;
			}
			$full_path = array_reverse($full_path);
			foreach ($full_path as $categoryID) {
				$segments[$category_id][] = $aliasCategory[$categoryID];
			}
		}

		return $segments[$category_id];
	}

	function onBeforeBuildRoute(&$query, &$segments)
	{
		static $categoryList;

		// if ( !isset($query['controller'])
		// 	|| ($query['controller']!='category' && $query['controller']!='product')
		// 	|| $query['task']!='view'
		// 	|| !$query['category_id']
		// 	|| ($query['controller']=='product' && !$query['product_id']) ) return;

		if (
			!isset($query['controller']) ||
			($query['controller'] != 'category' && $query['controller'] != 'product') ||
			!isset($query['task']) || $query['task'] != 'view' ||
			!isset($query['category_id']) || !$query['category_id'] ||
			($query['controller'] == 'product' && (!isset($query['product_id']) || !$query['product_id']))
		) {
			return;
		}

		if ((new Version())->isCompatible('4.0') == true) {
			$categoryItemidList = Joomla\Component\Jshopping\Site\Lib\shopItemMenu::getInstance()->getListCategory();
		} else {
			$categoryItemidList = shopItemMenu::getInstance()->getListCategory();
		}

		if (isset($categoryItemidList[$query['category_id']]) && $categoryItemidList[$query['category_id']]) {
			return;
		}

		$segments = self::buildSegment($query['category_id']);
	}

	function onBeforeParseRoute(&$vars, &$segments)
	{
		if ((new Version())->isCompatible('4.0') == true) {
			$aliasCategory = \JSFactory::getAliasCategory();
			$aliasProduct = \JSFactory::getAliasProduct();
		} else {
			$aliasCategory = JSFactory::getAliasCategory();
			$aliasProduct = JSFactory::getAliasProduct();
		}

		$aliases = str_replace(":", "-", $segments);
		$productID = array_search(end($aliases), $aliasProduct);
		$countSegments = count($segments);
		if ($countSegments > 1 && $productID) {
			$productAlias = array_pop($aliases);
			if ((new Version())->isCompatible('4.0') == true) {
				$tProduct = \JSFactory::getTable('Product', 'jshop');
			} else {
				$tProduct = JSFactory::getTable('Product', 'jshop');
			}

			$tProduct->load($productID);
			$listCategory = $tProduct->getCategories(1);
			$categoryAlias = array_pop($aliases);
			$categoryIDS = array_keys($aliasCategory, $categoryAlias);
			$needRedirect = true;
			$categorysForRedirect = array();
			foreach ($categoryIDS as $categoryID) {
				if (in_array($categoryID, $listCategory)) {
					$buildSegments = self::buildSegment($categoryID);
					$categorysForRedirect[$categoryID] = count(array_intersect($aliases, $buildSegments));
					if ($aliases == $buildSegments) {
						$this->category_id = $categoryID;
						$needRedirect = false;
						break;
					}
				}
			}
			if ($needRedirect) {
				arsort($categorysForRedirect);
				$categoryForRedirect = key($categorysForRedirect);
				if (!$categoryForRedirect) {
					$categoryForRedirect = $tProduct->getCategory();
				}
				if ((new Version())->isCompatible('4.0') == true) {

					Factory::getApplication()->redirect(\JSHelper::SEFLink('index.php?option=com_jshopping&controller=product&task=view&category_id=' . $categoryForRedirect . '&product_id=' . $productID, 1), 301);
				} else {
					Factory::getApplication()->redirect(SEFLink('index.php?option=com_jshopping&controller=product&task=view&category_id=' . $categoryForRedirect . '&product_id=' . $productID, 1), 301);
				}


			}
			$productSegment = array_pop($segments);
			$segments = array(end($segments), $productSegment);
		} else if ($countSegments > 0) {
			$categoryAlias = array_pop($aliases);
			$categoryIDS = array_keys($aliasCategory, $categoryAlias);
			$needRedirect = true;
			$categorysForRedirect = array();
			foreach ($categoryIDS as $categoryID) {
				$buildSegments = self::buildSegment($categoryID);
				$categorysForRedirect[$categoryID] = count(array_intersect($aliases, $buildSegments));
				if ($aliases == $buildSegments) {
					$this->category_id = $categoryID;
					$needRedirect = false;
					break;
				}
			}
			if (count($categoryIDS)) {
				if ($needRedirect) {
					arsort($categorysForRedirect);
					$categoryForRedirect = key($categorysForRedirect);
					if ((new Version())->isCompatible('4.0') == true) {
						Factory::getApplication()->redirect(\JSHelper::SEFLink('index.php?option=com_jshopping&controller=category&task=view&category_id=' . $categoryForRedirect, 1), 301);
					} else {
						Factory::getApplication()->redirect(SEFLink('index.php?option=com_jshopping&controller=category&task=view&category_id=' . $categoryForRedirect, 1), 301);
					}

				}
				$segments = array(end($segments));
			}
		}
	}

	function onAfterParseRoute(&$vars, &$segments)
	{
		if (isset($vars['category_id']) && $this->category_id) {
			$vars['category_id'] = $this->category_id;
		}
	}

}