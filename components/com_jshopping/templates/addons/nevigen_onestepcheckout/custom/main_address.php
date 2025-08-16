<?php
/*
 * @package    Nevigen JShop OneStepCheckout
 * @version    1.1.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

\defined('_JEXEC') or die;

use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;

/** @var \Joomla\CMS\Form\Form $form_address */
$form_address = $this->form_address;
if ($this->customer_register)
{
	HTMLHelper::_('bootstrap.tooltip', '.hasTooltip');
}

?>

<?php if (!empty($form_address)): ?>
	<div class="address_block_onestepcheckout" data-nevigen-onestepcheckout="address">
		<div class="row">
			<?php foreach ($form_address->getFieldsets() as $group => $fieldset):?>
				<div class="<?php echo $fieldset->name ?> <?php // echo $class;?>">
					<?php echo $form_address->renderFieldset($fieldset->name); ?>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
<?php endif; ?>