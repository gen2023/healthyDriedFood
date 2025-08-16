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
		<?php if ($delivery_adress = $form_address->renderField('delivery_adress')): ?>
			<div class="delivery_adress_select">
				<?php echo $delivery_adress; ?>
			</div>
		<?php endif; ?>
		<div class="row">
			<?php foreach ($form_address->getFieldsets() as $group => $fieldset):
				$class = ($fieldset->name === 'home_address')?  ' col-md ' : ' col-md-6 '; ?>
				<div class="<?php echo $fieldset->name ?> <?php echo $class;?>">
					<h4><?php echo $fieldset->label ?></h4>
					<?php echo $form_address->renderFieldset($fieldset->name); ?>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
<?php endif; ?>