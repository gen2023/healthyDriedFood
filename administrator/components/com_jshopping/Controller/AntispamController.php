<?php

namespace Joomla\Component\Jshopping\Administrator\Controller;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\CMS\Language\Text;

defined('_JEXEC') or die();

class AntispamController extends BaseadminController
{
  function display($cachable = false, $urlparams = false)
  {
    $jshopConfig = JSFactory::getConfig();
    $view = $this->getView("config", 'html');
    $view->setLayout("fieldregister");
    $config = new \stdClass();
    include($jshopConfig->path . 'config/default_config.php');

    $current_fields = $jshopConfig->getListFieldsRegister();

    $model = $this->getModel('Antispam');
    $savedFields = $model->getAntispamFields();

    $view = $this->getView("antispam", 'html');
    $view->set("fields", $fields_client);
    $view->set("current_fields", $current_fields);
    $view->set("fields_sys", $fields_client_sys);
    $view->set("saved_fields", $savedFields);

    $view->display();
  }


  function cancel()
  {
    $this->setRedirect("index.php?option=com_jshopping&controller=config");
  }
  public function save()
  {
    $post = $this->input->post->getArray();

    try {
      $model = $this->getModel('Antispam');

      if ($model->saveConfigs($post)) {
        $msg = Text::_('PLG_JSHOPPING_ANTISPAM_SAVE_SETTINGS');

        if ($this->getTask() == 'apply') {
          $this->setRedirect("index.php?option=com_jshopping&controller=antispam", $msg);
        } else {
          $this->setRedirect("index.php?option=com_jshopping&controller=config", $msg);
        }

      } else {
        throw new \Exception(Text::_('PLG_JOOMSHOPPING_ANTISPAM_ERROR_SAVING_DATA'));
      }
    } catch (\Exception $e) {
      $this->setRedirect("index.php?option=com_jshopping&controller=antispam", $e->getMessage(), 'error');
    }
  }

}