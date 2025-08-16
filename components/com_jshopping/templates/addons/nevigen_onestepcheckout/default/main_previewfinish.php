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

use Joomla\CMS\Language\Text;

/** @var \Joomla\CMS\Form\Form $form_address */
$form_address = $this->form_address;
?>

<div class="nevigen-onestepcheckout-previewfinish" data-nevigen-onestepcheckout="previewfinish">
	<?php echo (isset($this->_tmp_ext_html_previewfinish_start)) ? $this->_tmp_ext_html_previewfinish_start : '' ?>
	<div class="checkoutinfo">
		<div class="nevigen-onestepcheckout_finish_comment_block_add">
			<div class="nevigen-onestepcheckout_finish_comment_block_add_text small text-muted"><?php echo Text::_('JSHOP_ADD_INFO') ?></div>
			<div class="nevigen-onestepcheckout_finish_comment_block_add_textarea"><textarea class="form-control" id="order_add_info" name="order_add_info"></textarea></div>
		</div>
		<?php if (!empty($privacy_statement = $form_address->getInput('privacy_statement'))): ?>
			<div class="row row-cols-auto mt-2">
				<div class="col-1">
					<?php echo $privacy_statement; ?>
				</div>
				<div class="col">
					<a class="nevigen-onestepcheckout-privacy-statement policy text-reset"
					   data-bs-toggle="modal"
					   href="#onestep_privacy_statement">
						<?php echo Text::_('JSHOP_PRIVACY_STATEMENT'); ?>
					</a>
				</div>
			</div>
		<?php endif; ?>
		<?php if ($this->jshopConfig->display_agb): ?>
			<div class="mt-2">
				<input type="checkbox"  class="form-check-input me-1" name="agb" id="agb-chcbx"required/>
				<label class="form-check-label" for="agb-chcbx">
					<a class="nevigen-onestepcheckout-agb text-reset" data-bs-toggle="modal" href="#onestep_agb">
					<?php echo Text::_('JSHOP_AGB'); ?>
					</a>
					<?php echo Text::_('JSHOP_AND'); ?>
					<a class="nevigen-onestepcheckout-policy-return text-reset" data-bs-toggle="modal" href="#return_policy">
						<?php echo Text::_('JSHOP_RETURN_POLICY') ?>
					</a>
					<?php echo Text::_('JSHOP_CONFIRM'); ?>
				</label>
			</div>
		<?php endif; ?>
		<?php if ($this->no_return): ?>
			<div class="nevigen-onestepcheckout_finish_comment_block mt-1">
				<div class="row_no_return text-danger">
					<input type="checkbox" class="form-check-input me-1" name="no_return" id="no_return" reqired />
					<label class="form-check-label" for="no_return"><?php echo Text::_('JSHOP_NO_RETURN_DESCRIPTION'); ?></label>
				</div>
			</div>
		<?php endif; ?>
		<?php echo (isset($this->_tmp_ext_html_previewfinish_agb)) ? $this->_tmp_ext_html_previewfinish_agb : '' ?>
	</div>
	<?php if ($this->customer_register): ?>
		<div class="customer_register mt-4 mb-4 alert alert-warning">
			<div class="form-check form-switch">
				<input type="checkbox" name="customer_register" id="customer_register"
					   class="form-check-input"
					   value="1">
				<label class="form-check-label" for="customer_register">
					<?php echo Text::_('PLG_SYSTEM_NEVIGEN_JSHOP_ONESTEPCHECKOUT_CUSTOMER_REGISTER') ?>
					<i class="ms-2 icon-info-circle hasTooltip"
					   title="<?php echo Text::_('PLG_SYSTEM_NEVIGEN_JSHOP_ONESTEPCHECKOUT_CUSTOMER_REGISTER_DESC') ?>"
					   data-bs-placement="top"></i>
				</label>
			</div>
		</div>
	<?php endif; ?>
	<?php echo (isset($this->_tmp_ext_html_previewfinish_end)) ? $this->_tmp_ext_html_previewfinish_end : '' ?>
	<div class="nevigen-onestepcheckout-finish mt-4">
		<button class="btn btn-success w-100 fs-5 text-uppercase">
			<i class="me-2 icon-check-circle"></i><?php echo Text::_('JSHOP_ORDER_FINISH') ?>
		</button>
	</div>
</div>
