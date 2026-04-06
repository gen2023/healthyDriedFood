<?php
namespace Joomla\Component\Jshopping\Administrator\Controller;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Factory;

defined('_JEXEC') or die;

require_once JPATH_SITE.'/components/com_jshopping/addons/addon_jshopping_save_cart/JshSCHelper.php';
		
class Cart_saveController extends BaseadminController {
	
	public function sendMail(){		
		$user_id = $this->input->getInt('user_id');		
		\JshSCHelper::sendList(null, null, $user_id);

		$this->setRedirect('index.php?option=com_jshopping&controller=users', Text::_('_MESSAGE_SENT'));
	}

	public function migration290() {
		$db = Factory::getDbo();		
        $query = "INSERT INTO #__jshopping_cart_temp (id_cookie, user_id, cart, type_cart, date_create, email_sent, lang, cur)
        SELECT md5(concat(user_id,date_create,type_cart)) ,user_id, products, type_cart, date_create, email_sent, lang, cur
        FROM #__jshopping_cart_for_user";
        $db->setQuery($query);
        $db->execute();
		\JshSCHelper::setMigraion290finsh();
		print "Migration finished";
	}
	
}