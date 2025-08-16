<?php
/*
 * @package    Nevigen Audit Package
 * @version    1.2.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

\defined('_JEXEC') or die;

use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;

// Load assets
$this->document->getWebAssetManager()->useStyle('com_nevigen_audit.administrator.main');

?>
<div id="nevigenAudit">
	<?php echo HTMLHelper::_('uitab.startTabSet', 'myTab',
		['active' => 'list', 'recall' => true, 'breakpoint' => 768]);
	echo HTMLHelper::_('uitab.addTab', 'myTab', 'list',
		Text::_('COM_NEVIGEN_AUDIT_ORDERS'));
	echo $this->loadTemplate('list');
	echo HTMLHelper::_('uitab.endTab');

	echo HTMLHelper::_('uitab.addTab', 'myTab', 'statistic',
		Text::_('COM_NEVIGEN_AUDIT_TAB_STATISTIC'));
	echo $this->loadTemplate('statistic');
	echo HTMLHelper::_('uitab.endTab');

	if (!empty($this->tabs) && is_array($this->tabs))
	{
		foreach ($this->tabs as $key => $tab)
		{
			if (empty($tab['name']) || empty($tab['content']) || !is_string($tab['content']))
			{
				continue;
			}

			$key = 'tab_' . $key;
			echo HTMLHelper::_('uitab.addTab', 'myTab', $key, $tab['name']);
			echo $tab['content'];
			echo HTMLHelper::_('uitab.endTab');
		}
	}
	echo HTMLHelper::_('uitab.endTabSet'); ?>
</div>