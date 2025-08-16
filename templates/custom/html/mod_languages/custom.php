<?php
/**
 * @package     Joomla.Site
 * @subpackage  mod_languages
 *
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

?>
<div class="mod-languages <?php echo $moduleclass_sfx; ?>">
	<?php foreach ($list as $language) : ?>
		<?php if ($language->active) : ?>
		<span class="active-language"><?php echo strtoupper($language->sef); ?></span>
		<?php endif; ?>
	<?php endforeach; ?>

	<ul class="lang-list" dir="<?php echo JFactory::getLanguage()->isRtl() ? 'rtl' : 'ltr'; ?>">
	<?php foreach ($list as $language) : ?>
		<?php if (!$language->active) : ?>
			<li>
			<a href="<?php echo htmlspecialchars_decode(htmlspecialchars($language->link, ENT_QUOTES, 'UTF-8'), ENT_NOQUOTES); ?>"><?php echo strtoupper($language->sef); ?>
			</a>
			</li>
		<?php endif; ?>
	<?php endforeach; ?>
	</ul>
</div>
