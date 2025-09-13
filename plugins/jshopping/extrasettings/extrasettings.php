<?php
/**
 * @package     Joomla.Plugin
 * @subpackage  Jshopping.extrasettings
 *
 * @copyright   (C) 
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

use Joomla\CMS\Plugin\CMSPlugin;
use Joomla\CMS\Factory;

class PlgJshoppingExtrasettings extends CMSPlugin
{
  protected $app;

  public function __construct(&$subject, $config)
  {
    parent::__construct($subject, $config);
  }

  /**
   * Пример события перед сохранением продукта
   */
  public function onBeforeDisplaySofonareportsDefault(&$view)
  {
    $view->tmp_html_end .= '
        <div style="float:left;">
            <div class="icon">
                <a href="index.php?option=com_jshopping&amp;controller=buhgalteria">
                    <img src="/administrator/components/com_jshopping/images/jshop_currencies_b.png" alt="">
                    <span>Бухгалтерия</span>
                </a>
            </div>
        </div>
    <?php } ?>';

  }
}
