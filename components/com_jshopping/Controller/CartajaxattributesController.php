<?php
namespace Joomla\Component\Jshopping\Site\Controller;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\CMS\Factory;
use Joomla\Component\Jshopping\Site\Helper\Helper;
use Joomla\CMS\Language\Text;
defined( '_JEXEC' ) or die( 'Restricted access' );
require_once JPATH_SITE.'/components/com_jshopping/helpers/cartajax.php';

class CartajaxAttributesController extends BaseController {

    function display($cachable = false, $urlparams = false) {
        while(ob_get_level()) ob_end_clean();
        $result = new \stdClass();
        $jshopConfig = JSFactory::getConfig();
        $product_id = Factory::getApplication()->input->getInt('product_id');
        $quantity = Factory::getApplication()->input->getInt('quantity');
        if (!$quantity) $quantity = 1;
        $product = JSFactory::getTable('product', 'jshop'); 
        $product->load($product_id);
        $selected_attributes = (array)Factory::getApplication()->input->getVar('jshop_attr_id');
        $product_attributes = $product->getAttributesDatas($selected_attributes);
        $selected_free_attributes = (array)Factory::getApplication()->input->getVar('freeattribut');
        $product->setAttributeActive($product_attributes['attributeActive']);
        $product->setFreeAttributeActive($selected_free_attributes);
        
        $model_attributes = JSFactory::getModel('cartajaxattributes', 'jshop', array($product));
        $result->form = $model_attributes->getProductAttributesForm($product->product_id, $product->getCategory(), $selected_attributes, $selected_free_attributes);
        $pricefloat = $product->getPrice($quantity, 1, 1, 1);
        $result->price = Helper::formatprice($pricefloat);
        $result->pricefloat = $pricefloat;
        $result->available = $product->getQty() > 0;
        $result->ean = $product->getEan();
        $result->to_order = $product->to_order ?? 0;
        
        if ($result->to_order && !$result->available){
            JSFactory::loadExtLanguageFile("addon_products_on_order");
            $result->btn_bay_name = Text::_('JSHOP_ADDON_PRODUCTS_ON_ORDER_TO_ORDER');
        }else{
            $result->btn_bay_name = Text::_('JSHOP_BUY');
        }
        
        if ($jshopConfig->admin_show_product_basic_price){
            $result->basicprice = Helper::formatprice($product->getBasicPrice());
            $result->product_basic_price_unit_name = $product->product_basic_price_unit_name ?? '';
        }
        if ($jshopConfig->product_show_weight) $result->weight = Helper::formatweight($product->getWeight());
        if ($jshopConfig->product_list_show_price_default && isset($product->product_price_default) && $product->product_price_default > 0) $result->pricedefault = Helper::formatprice($product->product_price_default);
        if ($jshopConfig->product_show_qty_stock) $result->qty = Helper::sprintQtyInStock(Helper::getDataProductQtyInStock($product));
        $product->updateOtherPricesIncludeAllFactors();
        if ($product->product_old_price) $result->oldprice = Helper::formatprice($product->product_old_price);
        if ($jshopConfig->use_extend_attribute_data) {
            $images = $product->getImages();
            if (count($images) > 0) {
                $result->image = $jshopConfig->image_product_live_path.'/'.$images[0]->image_thumb;
            }
        }
        $dispatcher = Factory::getApplication();
        $dispatcher->triggerEvent('onBeforeDisplayAjaxAttribCart', array(&$result, &$product) );
        echo json_encode($result);
        exit;
    }
}