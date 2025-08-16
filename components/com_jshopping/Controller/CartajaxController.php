<?php
/**
* @version      1.4.1 22.08.2012
* @author       MAXXmarketing GmbH
* @package      Jshopping
* @copyright    Copyright (C) 2010 webdesigner-profi.de. All rights reserved.
*/
namespace Joomla\Component\Jshopping\Site\Controller;
defined( '_JEXEC' ) or die();

class CartajaxController extends BaseController {
    
    private $_template = 'addons';

    function display($cachable = false, $urlparams = false){
		$jshopConfig = \JSFactory::getConfig();
		$session = \JFactory::getSession();
        $app = \JFactory::getApplication();
		\JSFactory::loadExtLanguageFile("addon_cart_ajax");
		$product_id = $app->input->get('product_id');
        $type_cart = $app->input->get('type_cart');
		$attr_id = $app->input->getVar('jshop_attr_id', []);
        
		$product = \JSFactory::getTable('product', 'jshop');
		$product->load($product_id);
		$product->name = $product->getName();
		
		$model = \JSFactory::getModel('productShop', 'Site');
		$model->setProduct($product);
		$back_value = $model->getBackValue($product_id, $attr_id);
		$model->prepareView($back_value);
		$product_images = $product->getImages();
		
		$attr_act = [];
		if (is_array($attr_id) && count($attr_id)){
			$attr = \JSFactory::getTable('attribut');
			$attr_v = \JSFactory::getTable('attributvalue');
			foreach($attr_id as $key=>$value){
				$attr_act[$attr->getName($key)] = $attr_v->getName($value);
			}
		}

		$shopurl = \JSHelper::SEFLink('index.php?option=com_jshopping&controller=category',1);
		if ($jshopConfig->cart_back_to_shop=="product"){
			$endpagebuyproduct = $session->get('jshop_end_page_buy_product');
		}elseif ($jshopConfig->cart_back_to_shop=="list"){
			$endpagebuyproduct = $session->get('jshop_end_page_list_product');
		}
		if ($endpagebuyproduct){
			$shopurl = $endpagebuyproduct;
		}
        $layout = 'cartmsg';

		$view_name = "cartajax";
		$view_config = array("template_path" => JPATH_COMPONENT."/templates/addons/".$view_name);
        $view = new \Joomla\Component\Jshopping\Site\View\Addons\HtmlView($view_config);		
		$view->setLayout($layout);
		$view->set('href_shop', $shopurl);
		$view->set('href_cart', \JSHelper::SEFLink('index.php?option=com_jshopping&controller=cart&task=view',1,1));
		$view->set('href_wishlist', \JSHelper::SEFLink('index.php?option=com_jshopping&controller=wishlist&task=view',1,1));
		$view->set('product', $product->name);
		$view->set('type_cart', $type_cart);
		$view->set('config', $jshopConfig);
        $view->set('image_path', $jshopConfig->live_path.'/images');
        $view->set('noimage', $jshopConfig->noimage);
        $view->set('image_product_path', $jshopConfig->image_product_live_path);
        $view->set('video_product_path', $jshopConfig->video_product_live_path);
        $view->set('video_image_preview_path', $jshopConfig->video_product_live_path);
        $view->set('product', $product);
        $view->set('images', $product_images);
        $view->set('attr_act', $attr_act);
		echo $view->display();
		die();
    }
}