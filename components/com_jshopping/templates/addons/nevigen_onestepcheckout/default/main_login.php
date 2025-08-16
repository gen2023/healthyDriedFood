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

if ((int) $this->user->user_id > 0 || !$this->show_login) return;

?>

<button type="button" class="btn btn-info mb-2"
        data-bs-toggle="modal"
        data-bs-target="#nevigenOneStepCheckoutLoginModal">
	<?php echo Text::_('PLG_SYSTEM_NEVIGEN_JSHOP_ONESTEPCHECKOUT_CUSTOMER_LOGIN_BTN'); ?>
</button>
<div class="modal fade" id="nevigenOneStepCheckoutLoginModal" tabindex="-1"
     aria-labelledby="nevigenOneStepCheckoutLoginModalLabel" aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="nevigenOneStepCheckoutLoginModalLabel">
					<?php echo Text::_('PLG_SYSTEM_NEVIGEN_JSHOP_ONESTEPCHECKOUT_CUSTOMER_LOGIN_TITLE'); ?>
				</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
			<div class="modal-body">
				<div class="form needs-validation">
					<div data-nevigen-onestepcheckout-login="message"></div>
					<div class="mb-3">
						<label for="nevigenonestepcheckoutlogin_login" class="form-label">
							<?php echo Text::_('JSHOP_LOGIN') ?>/<?php echo Text::_('JSHOP_EMAIL') ?>
						</label>
						<input type="text" name="nevigenonestepcheckoutlogin[login]"
						       id="nevigenonestepcheckoutlogin_login" class="form-control"
						       required>
					</div>
					<div class="mb-3">
						<label for="nevigenonestepcheckoutlogin_password" class="form-label">
							<?php echo Text::_('JSHOP_PASSWORD') ?>
						</label>
						<input type="password" name="nevigenonestepcheckoutlogin[password]"
						       id="nevigenonestepcheckoutlogin_password" class="form-control"
						       required>
					</div>
					<div class="mb-3">
						<div class="form-check">
							<input name="nevigenonestepcheckoutlogin[remember]"
							       class="form-check-input" type="checkbox"
							       value="1"
							       id="nevigenonestepcheckoutlogin_remember">
							<label class="form-check-label" for="nevigenonestepcheckoutlogin_remember">
								<?php echo Text::_('JSHOP_REMEMBER_ME'); ?>
							</label>
						</div>
					</div>
					<div class="mb-3">
						<button onclick="window.NevigenOneStepCheckout().login()"
						        class="btn btn-primary w-100">
							<?php echo Text::_('JSHOP_LOGIN'); ?>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
