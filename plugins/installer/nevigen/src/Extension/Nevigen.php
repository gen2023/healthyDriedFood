<?php
/*
 * @package    Nevigen Installer Plugin
 * @version    2.1.1
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

namespace Joomla\Plugin\Installer\Nevigen\Extension;

\defined('_JEXEC') or die;

use Joomla\CMS\Event\Installer\AddInstallationTabEvent;
use Joomla\CMS\Http\Http;
use Joomla\CMS\Installer\Installer;
use Joomla\CMS\Installer\InstallerHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\MVC\Factory\MVCFactoryAwareTrait;
use Joomla\CMS\Plugin\CMSPlugin;
use Joomla\CMS\Plugin\PluginHelper;
use Joomla\CMS\Response\JsonResponse;
use Joomla\Component\Installer\Administrator\Model\UpdateModel;
use Joomla\Database\DatabaseAwareTrait;
use Joomla\Database\ParameterType;
use Joomla\Plugin\Installer\Nevigen\Helper\ExtensionHelper;
use Joomla\Registry\Registry;

class Nevigen extends CMSPlugin
{
	use DatabaseAwareTrait;
	use MVCFactoryAwareTrait;

	/**
	 * Affects constructor behavior.
	 *
	 * @var  boolean
	 *
	 * @since  1.1.0
	 */
	protected $autoloadLanguage = true;

	/**
	 * List extensions.
	 *
	 * @var    string
	 *
	 * @since  1.1.0
	 */
	protected ?string $list = null;

	/**
	 * Error html.
	 *
	 * @var    string
	 *
	 * @since  1.1.0
	 */
	protected ?string $error = null;

	/**
	 * Request api.
	 *
	 * @var    string
	 *
	 * @since  2.0.0
	 */
	protected string $api = 'https://nevigen.com/api/v1/server';


	/**
	 * Plugin ajax controller.
	 *
	 * @throws  \Exception
	 *
	 * @return  mixed Action response on success, exception on failure.
	 *
	 * @since  1.1.0
	 */
	public function onAjaxNevigen()
	{
		$app = $this->getApplication();
		if ($app->isClient('site'))
		{
			throw new \Exception('Access is denied', 403);
		}

		if ($this->error === null)
		{
			ob_start();
			include_once PluginHelper::getLayoutPath('installer', 'nevigen', 'error');

			$this->error = ob_get_clean();
		}

		if (!$action = $app->input->get('action'))
		{
			throw new \Exception($this->error, 404);
		}

		if (!method_exists($this, $action))
		{
			throw new \Exception($this->error, 404);
		}
		if ($app->checkToken() === false)
		{
			throw new \Exception($this->error, 404);
		}

		try
		{
			$this->setJSONResponse($this->$action());
		}
		catch (\Exception $e)
		{
			$this->setJSONResponse('', $e->getMessage(), true);
		}
	}


	/**
	 * Event listener for the `onInstallerAddInstallationTab` event.
	 *
	 * @param   AddInstallationTabEvent  $event  The event instance
	 *
	 * @return  void|array
	 *
	 * @since   2.0.0
	 */
	public function onInstallerAddInstallationTab()
	{
		// Load language files
		$this->loadLanguage();

		$app  = $this->getApplication();
		$doc  = $app->getDocument();
		$lang = $this->getLanguage();

		// Load asses
		/** @var \Joomla\CMS\WebAsset\WebAssetRegistry $assetsRegistry */
		$assetsRegistry = $doc->getWebAssetManager()->getRegistry();
		$assetsRegistry->addExtensionRegistryFile('plg_installer_nevigen');

		/** @var \Joomla\CMS\WebAsset\WebAssetManager $assets */
		$assets = $doc->getWebAssetManager();
		$assets->usePreset('installer_nevigen.main')
			->useScript('bootstrap.toast');
		$doc->addScriptOptions(
			'plg_installer_nevigen',
			[
				'language'   => base64_encode($lang->getTag()),
				'controller' => 'index.php?option=com_ajax&plugin=nevigen&group=installer&format=json',
			]
		);

		Text::script('NOTICE');
		Text::script('ERROR');
		if (empty($this->params->get('key')))
		{
			$id  = PluginHelper::getPlugin($this->_type, $this->_name)->id;
			$url = '/administrator/index.php?option=com_plugins&task=plugin.edit&extension_id=' . $id;
			$app->enqueueMessage(Text::sprintf('PLG_INSTALLER_NEVIGEN_ERROR_KEY', $url), 'warning');
		}
		$session = $app->getSession();
		$messages = $session->get('nevigen_install_message');
		if (!empty($messages))
		{
			foreach ($messages as $message)
			{
				$app->enqueueMessage($message['message'], $message['type']);
			}

			$session->set('nevigen_install_message', null);
		}

		$tab = [
			'name'  => 'nevigen',
			'label' => Text::_('PLG_INSTALLER_NEVIGEN_TAB_LABEL'),
		];

		// Render the input
		ob_start();
		include_once PluginHelper::getLayoutPath('installer', 'nevigen');
		$tab['content'] = ob_get_clean();
		$tab['content'] = '<legend>' . $tab['label'] . '</legend>' . $tab['content'];


		return $tab;
	}

	public function getListExtensions()
	{

		$html = '';
		if (empty(ExtensionHelper::getJSVersion()))
		{
			$message = Text::_('PLG_INSTALLER_NEVIGEN_ERROR_JOOMSHOPPING');

			throw new \Exception('<div class="alert alert-danger">' . $message . '</div>', 404);
		}

		$db                = $this->getDatabase();
		$query             = $db->getQuery(true)
			->select(['extension_id', 'element', 'folder', 'type', 'manifest_cache'])
			->from('#__extensions')
			->where([
				$db->quoteName('element') . ' LIKE ' . $db->quote('%nevigen%'),
				$db->quoteName('folder') . ' LIKE ' . $db->quote('%nevigen%')
			], 'OR');
		$installDataResult = $db->setQuery($query)->loadAssocList();
		$install           = [];
		if (!empty($installDataResult))
		{
			foreach ($installDataResult as $installData)
			{
				$element = $installData['element'];
				if ($installData['type'] === 'plugin')
				{
					$element = 'plg_' . $installData['folder'] . '_' . $element;
				}

				$manifest = json_decode($installData['manifest_cache']);

				$install[$element] = [
					'element' => $element,
					'version' => $manifest->version,
				];
			}
		}


		$apiData = ['install' => $install];
		$filter  = $this->getApplication()->input->get('filter', [], 'array');

		if (!empty($filter))
		{
			$apiData['filter'] = $filter;
		}
		if (!empty($this->params->get('key')))
		{
			$data = $this->sendApi('extensions/active', $apiData);

			if (empty($data) || !empty($data['errors']))
			{
				$data = $this->sendApi('extensions', $apiData, [], false);

			}
		}
		else
		{
			$data = $this->sendApi('extensions', $apiData, [], false);
		}

		if (!empty($data) && !empty($data['jsonapi']))
		{
			$html = $data['jsonapi']['render'];
		}

		if (empty($html))
		{
			$html = $this->error;
		}

		return $html;

	}

	public function installExtension()
	{
		$app          = $this->getApplication();
		$extension    = $app->input->getString('extension');
		$free         = $app->input->getInt('free', 0);
		$urlExtension = '';
		if ($free > 0)
		{
			$data = $this->sendApi('link/free', ['extension' => $extension], [], false);
		}
		else
		{
			$data = $this->sendApi('link/paid', ['extension' => $extension]);
		}


		if (empty($data))
		{
			throw new \Exception(Text::_('PLG_INSTALLER_NEVIGEN_ERROR_EXTENSION'), 404);
		}

		if (!empty($data['errors']))
		{
			throw new \Exception($data['errors'][0]['title'], 404);
		}

		if (!empty($data['jsonapi']['url']))
		{
			$urlExtension = $data['jsonapi']['url'];
		}

		try
		{
			return $this->install($urlExtension);
		}
		catch (\Exception $e)
		{
			throw new \Exception($e->getMessage(), 404);
		}
	}

	public function updateExtension(): void
	{
		$app          = $this->getApplication();
		$db           = $this->getDatabase();
		$element      = $app->input->getString('extension');


		if (!$element)
		{
			throw new \RuntimeException(Text::_('PLG_INSTALLER_NEVIGEN_ERROR_UPDATE_ELEMENT'));
		}

		// Step 1: Get extension ID
		$query = $db->getQuery(true)
			->select('extension_id')
			->from('#__extensions')
			->where('element = ' . $db->quote($element))
			->order('extension_id DESC')
			->setLimit(1);

		$extensionId = (int) $db->setQuery($query)->loadResult();

		if (!$extensionId)
		{
			throw new \RuntimeException(Text::sprintf('PLG_INSTALLER_NEVIGEN_ERROR_UPDATE_NOT_FOUND', $element));
		}

		// Step 2: Get update site location
		$query = $db->getQuery(true)
			->select('s.location')
			->from('#__update_sites_extensions AS se')
			->join('INNER', '#__update_sites AS s ON s.update_site_id = se.update_site_id')
			->where('se.extension_id = :extension_id')
			->bind(':extension_id', $extensionId, ParameterType::INTEGER)
			->order('s.update_site_id ASC');

		$updateSite = $db->setQuery($query, 0, 1)->loadResult();

		if (!$updateSite)
		{
			throw new \RuntimeException(Text::sprintf('PLG_INSTALLER_NEVIGEN_ERROR_UPDATE_SITE_NOT_FOUND', $element));
		}


		// Step 3: Load update.xml and find the correct update
		$response = (new Http())->get($updateSite);
		$xml      = '';
		if ($response->code === 200 && $response->body !== '' && $response->body !== null)
		{
			$xmlBody = trim($response->body);
		}

		if ($response->code !== 200 || empty($xmlBody))
		{
			throw new \RuntimeException(Text::sprintf('PLG_INSTALLER_NEVIGEN_ERROR_UPDATE_XML_LOAD_FAIL', $updateSite));
		}

		$xml = simplexml_load_string($xmlBody);

		if (!$xml || empty($xml->update))
		{
			throw new \RuntimeException(Text::sprintf('PLG_INSTALLER_NEVIGEN_ERROR_UPDATE_NO_ENTRIES', $element));
		}

		$urlExtension = '';

		foreach ($xml->update as $update)
		{
			if ((string) $update->element === $element && !empty($update->downloads->downloadurl))
			{
				$urlExtension = (string) $update->downloads->downloadurl;
				break;
			}
		}

		if (empty($urlExtension))
		{
			throw new \RuntimeException(Text::sprintf('PLG_INSTALLER_NEVIGEN_ERROR_UPDATE_NOT_IN_XML', $element));
		}

		try
		{
			$this->install($urlExtension);
		}
		catch (\Exception $e)
		{
			throw new \Exception($e->getMessage(), 404);
		}

		// Step 4: Remove entry from #__updates after successful install
		$query = $db->getQuery(true)
			->delete($db->quoteName('#__updates'))
			->where($db->quoteName('extension_id') . ' = :extId')
			->bind(':extId', $extensionId, ParameterType::INTEGER);

		$db->setQuery($query)->execute();

	}

	public function onInstallerBeforePackageDownload(&$url, &$headers)
	{
		if (strpos($url, 'nevigen.com/api/v1/server/update/paid') !== false)
		{
			$key = trim($this->params->get('key'));
			if (!empty($key))
			{
				$headers['Nevigen-Token'] = $key;
				$domain                   = $this->getApplication()->input->server->get('HTTP_HOST', '');
				$url                      .= '/' . base64_encode($domain);
			}
		}

	}

	protected function install($urlExtension)
	{
		if (!empty($urlExtension))
		{
			$app = $this->getApplication();
			// Download the package at the URL given
			if (!$p_file = InstallerHelper::downloadPackage($urlExtension))
			{
				throw new \Exception(Text::_('PLG_INSTALLER_NEVIGEN_ERROR_EXTENSION'), 404);
			}

			// Unpack the downloaded package file
			if (!$package = InstallerHelper::unpack($app->get('tmp_path') . '/' . $p_file, true))
			{
				throw new \Exception(Text::sprintf('COM_INSTALLER_UNPACK_ERROR', $p_file), 404);

			}

			// Check type
			if (!$package['type'])
			{
				InstallerHelper::cleanupInstall($package['packagefile'], $package['extractdir']);

				return false;
			}

			// Get an installer instance
			$installer = Installer::getInstance();
			$installer->setPath('source', $package['dir']);
			if (!$installer->findManifest())
			{
				InstallerHelper::cleanupInstall($package['packagefile'], $package['extractdir']);

				return false;
			}

			// Install the package
			if (!$installer->install($package['dir']))
			{
				InstallerHelper::cleanupInstall($package['packagefile'], $package['extractdir']);

				return false;
			}

			// CleanUp install
			InstallerHelper::cleanupInstall($package['packagefile'], $package['extractdir']);

			$session = $app->getSession();
			$messages = $app->getMessageQueue();
			if (!empty($messages))
			{
				$messages[] = [
					'message' => Text::sprintf('COM_INSTALLER_INSTALL_SUCCESS', $installer->message),
					'type'     => 'success',
				];

				$session->set('nevigen_install_message',$messages);
			}
			else
			{
				$session->set('nevigen_install_message', [
					[
						'message' => Text::sprintf('COM_INSTALLER_INSTALL_SUCCESS', $installer->message),
						'type'     => 'success',
					]
				]);
			}


			return true;
		}

		return false;
	}

	protected function sendApi($methodName = '', $data = [], $headers = [], $checkKey = true)
	{
		try
		{
			if (empty($methodName))
			{
				return false;
			}
			$key = trim($this->params->get('key'));
			if ($checkKey === true)
			{
				if (empty($key))
				{
					return false;
				}
			}

			if (!empty($key))
			{
				$headers['Nevigen-Token'] = $key;
			}

			if (!isset($data['domain']))
			{
				$data['domain'] = $this->getApplication()->input->server->get('HTTP_HOST', '');
			}
			if (!isset($data['lang']))
			{
				$data['lang'] = $this->getLanguage()->getTag();
			}

			$data['jshopping'] = ExtensionHelper::getJSVersion();
			$nevigen_audit     = ExtensionHelper::getJSVersion('nevigen_audit');
			if (!empty($nevigen_audit))
			{
				$data['nevigen_audit'] = $nevigen_audit;
			}

			$data['php']    = PHP_VERSION;
			$data['joomla'] = JVERSION;
			$url            = $this->api . '/' . $methodName;


			$response = (new Http())->post($url, $data, $headers);

			return (new Registry($response->body))->toArray();
		}
		catch (\Exception $e)
		{
			return false;
		}

	}

	/**
	 * Method to set json response.
	 *
	 * @param   mixed   $response  Response data
	 * @param   string  $msg       Message.
	 * @param   bool    $error     Has error.
	 *
	 * @throws  \Exception
	 *
	 * @return  true True on success, Exception on failure.
	 *
	 * @since  2.0.0
	 */
	public function setJSONResponse($response = null, $msg = null, $error = false)
	{
		header('Content-Type: application/json');
		echo new JsonResponse($response, $msg, $error);
		$this->getApplication()->close(($error) ? 500 : 200);

		return (!$error);
	}
}
