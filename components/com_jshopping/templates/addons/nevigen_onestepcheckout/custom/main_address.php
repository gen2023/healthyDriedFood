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
if ($this->customer_register) {
	HTMLHelper::_('bootstrap.tooltip', '.hasTooltip');
}

?>

<?php 
if (!empty($form_address)): 
?>
	<div class="address_block_onestepcheckout" data-nevigen-onestepcheckout="address">
		<?php  /*доп адресс 
		if ($delivery_adress = $form_address->renderField('delivery_adress')): ?>
			<div class="delivery_adress_select">
				<?php echo $delivery_adress; ?>
			</div>
		<?php endif; */?>

		<?php foreach ($form_address->getFieldsets() as $group => $fieldset):
			
			$class = ($fieldset->name === 'home_address') ? ' col-md ' : ' col-md-6 '; ?>
			<div class="<?php echo $fieldset->name . $class; ?>">

				<?php
				$fields = $form_address->getFieldset($fieldset->name);
				foreach ($fields as $key => $field):
						if ($field->fieldname === 'city' || $field->fieldname=='ext_field_1'):
							continue;
						else:
							echo $field->renderField(array_merge(['class' => 'field_' . $key]));
						endif;


				endforeach; ?>

			</div>
		<?php endforeach; ?>

	</div>
<?php endif; ?>