<?php
/*
 * @package    Nevigen Audit Package
 * @version    1.2.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

namespace Joomla\Component\NevigenAudit\Administrator\WebAsset\AssetItem;

\defined('_JEXEC') or die;

use Joomla\CMS\Document\Document;
use Joomla\CMS\Factory;
use Joomla\CMS\Language\Text;
use Joomla\CMS\WebAsset\WebAssetAttachBehaviorInterface;
use Joomla\CMS\WebAsset\WebAssetItem;

class ModalFieldAssetItem extends WebAssetItem implements WebAssetAttachBehaviorInterface
{
	/**
	 * Method called when asset attached to the Document.
	 *
	 * @param   Document  $doc  Active document
	 *
	 * @throws \Exception
	 *
	 * @since   1.0.0
	 */
	public function onAttachCallback(Document $doc)
	{
		Factory::getApplication()->getLanguage()->load('com_nevigen_audit');

		// Add modal-field.js language strings
		Text::script('COM_NEVIGEN_AUDIT_AJAX_LOADING');
	}
}