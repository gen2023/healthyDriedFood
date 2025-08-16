<?php

namespace Sofona\Component\ExportXml\Administrator\Controller;

defined('_JEXEC') or die;

use Joomla\CMS\MVC\Controller\BaseController;
use Joomla\CMS\Factory;
use Joomla\CMS\Response\JsonResponse;
use Joomla\CMS\Language\Text;

/**
 * @package     com_exportxml
 *
 * @copyright   Copyright (C) 2020 Sofona. All rights reserved.
 * @license     GNU General Public License version 3; see LICENSE
 */

/**
 * Default Controller of ExportXml component
 *
 * @package     com_exportxml
 */
class GooglesyncController extends BaseController
{
    /**
     * The default view for the display method.
     *
     * @var string
     */
    protected $default_view = 'googlesync';
    protected $export_type = 'googleshop';

    public function display($cachable = false, $urlparams = array())
    {
        $model = $this->getModel('Comexport', 'Administrator');

        $paramsProduct = $model->getParamsProduct($this->export_type);
        $google_params=$model->getGoogleParams();

        $extra_fields = $model->getExtraFields();

        $extraFieldsMap = [];
        foreach ($extra_fields as $field) {
            $extraFieldsMap[$field['id']] = $field['name'];
        }

        foreach ($paramsProduct as &$param) {
            $paramId = $param['params'];

            $param['params_name'] = $extraFieldsMap[$paramId] ?? 'Неизвестный параметр';
        }

        unset($param);


        $view = $this->getView('Googlesync', 'html');
        $view->setModel($model, true);
        $view->set('results', $model->getBinding($this->export_type));
        $view->set('results_exclude', $model->getCategoryProductExclude($this->export_type));
        $view->set('extra_fields', $extra_fields);
        $view->set('results_params', $paramsProduct);
        $view->set('google_params', $google_params);

        return $view->display();
    }

    public function options()
    {
        $this->setRedirect('index.php?option=com_config&view=component&component=com_searchtext');
    }
    public function getGoogleCategories()
    {
        $input = Factory::getApplication()->input;
        $search = $input->getString('search', '');

        $model = $this->getModel('Comexport', 'Administrator');

        $categories = $model->getGoogleCategoriesInfo($search);

        echo new JsonResponse($categories);
        Factory::getApplication()->close();
    }
    public function getJoomShoppingCategories()
    {
        $input = Factory::getApplication()->input;
        $search = $input->getString('search', '');

        $model = $this->getModel('Comexport', 'Administrator');
        $categories = $model->getJoomShoppingCategories($search);

        echo new JsonResponse($categories);
        Factory::getApplication()->close();
    }
    public function getJoomShoppingProduct()
    {
        $input = Factory::getApplication()->input;
        $search = $input->getString('search', '');

        $model = $this->getModel('Comexport', 'Administrator');
        $products = $model->getJoomShoppingProducts($search);

        echo new JsonResponse($products);
        Factory::getApplication()->close();
    }

    public function addBindingMapping()
    {
        $app = Factory::getApplication();

        $input = $app->input;
        $google_base_category_id = $input->getInt('google_base_category_id');
        $product_id = $input->getInt('product_id', 0);
        $category_id = $input->getInt('category_id', 0);

        if ($google_base_category_id && ($product_id > 0 || $category_id > 0)) {
            $model = $this->getModel('Comexport', 'Administrator');
            $result = $model->addBinding($google_base_category_id, $category_id, $product_id, $this->export_type);

            $result['messageSuccess']=Text::_('COM_EXPORTXML_MASSAGE_CATEGORY_ADD');
            echo json_encode($result);
            Factory::getApplication()->close();
        }

        echo json_encode(['success' => false, 'error' => 'Invalid input']);
        Factory::getApplication()->close();

    }

    public function addCategoryProductExcludeMapping()
    {
        $app = Factory::getApplication();

        $input = $app->input;
        $category_id = $input->getInt('category_id', 0);
        $product_id = $input->getInt('product_id', 0);
        
        if ($category_id != 0 || $product_id != 0) {
            $model = $this->getModel('Comexport', 'Administrator');
            $result = $model->addCategoryProductExclude($category_id, $product_id, $this->export_type);


            if ($category_id != 0) {
                $result['messageSuccess']=Text::_('COM_EXPORTXML_MASSAGE_ADD_EXCLUDE');
            }
            if ($product_id != 0) {
                $result['messageSuccess']=Text::_('COM_EXPORTXML_MASSAGE_ADD_EXCLUDE');
            }

            echo json_encode($result);
            Factory::getApplication()->close();
        }

        echo json_encode(['success' => false, 'error' => 'Invalid input']);
        Factory::getApplication()->close();
    }

    public function deleteExcludeMapping()
    {
        $app = Factory::getApplication();
        $input = $app->input;
        $id = $input->getInt('id');

        if ($id) {
            $model = $this->getModel('Comexport', 'Administrator');
            $result = $model->deleteExclude($id);

            if ($result) {
                echo json_encode(['success' => true, 'messageSuccess'=>Text::_('COM_EXPORTXML_MASSAGE_DELETE_EXCLUDE')]);
                $app->close();
            }
        }

        echo json_encode(['success' => false, Text::_('COM_EXPORTXML_MASSAGE_ERROR_IN_DELETE')]);
        $app->close();
    }

    public function deleteBindingMapping()
    {
        $app = Factory::getApplication();
        $input = $app->input;
        $id = $input->getInt('id');

        if ($id) {
            $model = $this->getModel('Comexport', 'Administrator');
            $result = $model->deleteBinding($id);

            if ($result) {
                echo json_encode(['success' => true, 'messageSuccess'=>Text::_('COM_EXPORTXML_MASSAGE_DELETE_TRANSPOTR')]);
                $app->close();
            }
        }

        echo json_encode(['success' => false, Text::_('COM_EXPORTXML_MASSAGE_ERROR_IN_DELETE')]);
        $app->close();
    }

    public function addParamsProductMapping()
    {
        $app = Factory::getApplication();
        $input = $app->input;
        $params_id = $input->getInt('params');
        $google_param_id = $input->getInt('google_param');

        if ($params_id != '00' && $google_param_id != '') {
            $model = $this->getModel('Comexport', 'Administrator');
            $result = $model->addParamsProduct($params_id, $google_param_id, $this->export_type);

            if ($result) {
                $result['messageSuccess']=Text::_('COM_EXPORTXML_MASSAGE_PARAMS_ADD');
                echo json_encode($result);
                $app->close();
            }
        }

        echo json_encode(['success' => false, Text::_('COM_EXPORTXML_MASSAGE_ERROR_IN_DELETE')]);
        $app->close();
    }

    public function deleteParamsProductMapping(){
        $app = Factory::getApplication();
        $input = $app->input;
        $id = $input->getInt('id');

        if ($id) {
            $model = $this->getModel('Comexport', 'Administrator');
            $result = $model->deleteParamsProduct($id);
    
            if ($result) {
                echo json_encode(['success' => true, 'messageSuccess'=>Text::_('COM_EXPORTXML_MASSAGE_PARAMS_DELETE')]);
                $app->close();
            }
        }
    
        echo json_encode(['success' => false, Text::_('COM_EXPORTXML_MASSAGE_ERROR_IN_DELETE')]);
        $app->close();      
    }
}