<?php

defined('_JEXEC') or die('Restricted access');

use Joomla\CMS\Language\Text;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Factory;
use Joomla\CMS\Captcha\Captcha;
use Joomla\CMS\Date\Date;
use Joomla\CMS\Helper\ModuleHelper;
use Joomla\Utilities\IpHelper;
use Joomla\Registry\Registry;
use Joomla\CMS\Uri\Uri;
use Joomla\CMS\Mail\MailHelper;
use Joomla\CMS\Session\Session;


Text::script('MOD_SFNFORMS_REQUIRED');
Text::script('MOD_SFNFORMS_ERROR_MINLENGTH');
Text::script('MOD_SFNFORMS_ERROR_MAXLENGTH');
Text::script('MOD_SFNFORMS_ERROR_EMAIL');
Text::script('MOD_SFNFORMS_ERROR_PHONE_NUMBER');
Text::script('MOD_SFNFORMS_ERROR_NUMBER');
Text::script('MOD_SFNFORMS_ERROR_TEXT');
Text::script('MOD_SFNFORMS_ERROR_TEXT_NUMBER');
Text::script('MOD_SFNFORMS_ERR_SELECT_FILE');
Text::script('MOD_SFNFORMS_FILE_ERR_FORMAT');
Text::script('MOD_SFNFORMS_FILE_ERR_LENGTH');
Text::script('MOD_SFNFORMS_PROCESS_DOWNLOAD');
Text::script('MOD_SFNFORMS_DOWNLOAD_YES');
Text::script('MOD_SFNFORMS_FILE_ERR_DOWNLOAD');
Text::script('MOD_SFNFORMS_FILE_ERR_INTERNET');

class modSFNFormsHelper
{

	public static function loadJs($file)
	{
		HTMLHelper::_('script', 'mod_sfnforms/' . $file . '.js', array('relative' => true, 'version' => 'auto'));
	}

	public static function loadCss($file)
	{
		HTMLHelper::_('stylesheet', 'mod_sfnforms/' . $file . '.css', array('relative' => true, 'version' => 'auto'));
	}

	protected static function encodeHTML(&$item, $key)
	{
		$item = self::cleanInput($item);
	}

	protected static function flatten(&$item, $key)
	{
		if (is_array($item)) {
			$item = implode(', ', $item);
		}
	}

	public static function cleanInput($input)
	{
		if ($input === null) {
			$input = '';
		} elseif (is_array($input)) {
			$input = implode(', ', $input);
		}

		return htmlspecialchars($input, ENT_QUOTES, "UTF-8");
	}

	protected static function replacePlaceholders($text, $placeholders, $escapeCallable = null)
	{
		if (strpos($text, '{') === false) {
			return $text;
		}

		array_walk($placeholders, array('modSFNFormsHelper', 'flatten'));

		if ($escapeCallable) {
			if (strtolower($escapeCallable) == 'html') {
				$escapeCallable = array('modSFNFormsHelper', 'encodeHTML');
			}

			if (is_callable($escapeCallable)) {
				array_walk($placeholders, $escapeCallable);
			}
		}

		foreach ($placeholders as $key => $value) {
			if ($value === null || $value === '' || $value === []) {

				$text = preg_replace('/^.*' . preg_quote($key, '/') . '.*$\n?/mi', '', $text);
				$text = str_replace($key, '', $text);

			}
		}

		$text = str_replace(array_keys($placeholders), array_values($placeholders), $text);
		$text = preg_replace("/\n{2,}/", "\n\n", $text);

		return trim($text);
	}

	protected static function convertHtmlToTextWithLineBreaks($html)
	{
		$html = str_replace(['<br>', '<br/>', '<br />'], "\n", $html);
		$html = preg_replace('/<\/p>\s*/i', "\n", $html);
		$html = preg_replace('/<p[^>]*>/i', '', $html);
		$html = preg_replace('/<hr[^>]*>/i', "\n-----\n", $html);
		$html = preg_replace("/\n\s+\n/", "\n\n", $html);
		$html = strip_tags($html, '<a><b><strong><i><em><code><pre>');

		return trim($html);
	}

	protected static function sendLogged($message)
	{

		$logData = [
			'client_ip' => IpHelper::getIp(),
			'text' => $message
		];

		$fileErrorCaptcha = __DIR__ . DIRECTORY_SEPARATOR . 'mod_sfnforms.log';
		$str = date('Y-m-d H:i:s') . ': ' . json_encode($logData) . PHP_EOL;

		file_put_contents($fileErrorCaptcha, $str, FILE_APPEND | LOCK_EX);
	}

	public static function captchaGenerate($event, $value = null, $id = '')
	{
		if ($value !== null && !strlen(trim($value))) {
			$value = null;
		}

		try {
			$captcha = Captcha::getInstance(Factory::getConfig()->get('captcha'));
		} catch (Exception $e) {
			Factory::getApplication()->enqueueMessage($e->getMessage(), 'error');
			return false;
		}

		if (!$captcha) {
			Factory::getApplication()->enqueueMessage(Text::_('MOD_SFNFORMS_NO_CAPTCHA_CONFIGURED'), 'error');
			return false;
		}

		switch ($event) {
			case 'onDisplay':
				return $captcha->display('mod-sfnforms-captcha-' . $id, 'mod-sfnforms-captcha-' . $id, 'required');
				break;

			case 'onCheckAnswer':
				return $captcha->checkAnswer($value);
				break;

			default:
				return false;
				break;
		}
	}

	public static function split($input)
	{
		$options = trim($input);
		$options = str_replace(array("\r\n", "\r"), "\n", $options);
		$options = preg_split("/[\n,]+/", $options);
		return $options;
	}

	protected static function showResponse($status, $message, $warnings = array())
	{
		$response = (object) array(
			'status' => $status,
			'message' => $message,
			'warnings' => $warnings
		);
		Factory::getDocument()->setMimeEncoding('application/json');

		echo json_encode($response);

		Factory::getApplication()->close();
	}

	public static function isEmailAddress($value)
	{
		return MailHelper::isEmailAddress($value);
	}

	public static function SfnformsAjax()
	{
		$app = Factory::getApplication();

		$app->getLanguage()->load('mod_sfnforms');
		$warning = array();
		$jInput = $app->input;

		//ajax submit
		$inputs = $jInput->post->getArray();

		$user = $app->getIdentity();
		$config = $app->getConfig();

		$user_id = $user->get('id');
		$username = $user->get('username');
		$user_email = $user->get('email');

		$timeZone = $config->get('offset');
		$myDate = Date::getInstance('now', $timeZone);
		$date = $myDate->format('d-m-Y', true, true);
		$date_time = $myDate->format('d-m-Y H:i:s', true, true);

		if (!empty($inputs['mod_sfnforms_module_id'])) {
			$module = ModuleHelper::getModuleById($inputs['mod_sfnforms_module_id']);
		} else {
			$module = ModuleHelper::getModule('sfnforms', $inputs['mod_sfnforms_module_name']);
		}

		$params = new Registry();
		$params->loadString($module->params);

		$recipient = $params->get('mail_to', '');
		$bcc = $params->get('mail_bcc', '');
		$cc = $params->get('mail_cc', '');
		$message_set = $params->get('mail_msg', '');
		$thank_you = $params->get('thank_you', Text::_('MOD_SFNFORMS_THANK_YOU_DEFAULT'));
		$send_copy = $params->get('send_copy') == 1;
		$show_captcha = $params->get('captcha');
		$show_consent = $params->get('display_consent');
		$consent_text = Text::_('MOD_SFNFORMS_APPLY_CONSENT');
		$subject_predef = $params->get('email_subj', '');
		$set_reply = $params->get('reply_to', '');
		$reply_email = $params->get('reply_email', '');
		$reply_name = $params->get('reply_name', '');
		$ip_remote = IpHelper::getIp();
		$new_field = $params->get('setkalist', []);
		$tegram_send = $params->get('tegram_send');
		$tegram_send_token = $params->get('tegram_send_token');
		$tegram_send_id = $params->get('tegram_send_id');
		$sendloggen = $params->get('sendloggen');
		$send_mail = $params->get('send_mail', '1');

		$email = '';
		$result = [];
		$warnings = [];

		foreach ($new_field as $key => $value) {

			if ($value->type_input == 'email') {
				$email = $inputs['mod_sfnforms_' . $value->field_name];
				$result[$value->field_name] = $inputs['mod_sfnforms_' . $value->field_name];

			} elseif ($value->type_input == 'file' && isset($_FILES['mod_sfnforms_' . $value->field_name])) {

				$fieldName = 'mod_sfnforms_' . $value->field_name;
				$result[$value->field_name] = [];

				$uploadDir = JPATH_SITE . '/images/uploads/sfnforms/';
				if (!is_dir($uploadDir))
					mkdir($uploadDir, 0755, true);

				$allowedExts = array_map('trim', explode(',', $value->field_file_types));
				$maxSizeMb = (float) $value->field_file_maxsize;
				$maxSizeBytes = $maxSizeMb * 1024 * 1024;

				$filesCount = count($_FILES[$fieldName]['name']);

				for ($i = 0; $i < $filesCount; $i++) {
					if (!empty($_FILES[$fieldName]['name'][$i])) {
						$fileTmp = $_FILES[$fieldName]['tmp_name'][$i];
						$originalName = $_FILES[$fieldName]['name'][$i];
						$fileSize = $_FILES[$fieldName]['size'][$i];

						if ($maxSizeMb > 0 && $fileSize > $maxSizeBytes) {
							$warnings[] = Text::_('MOD_SFNFORMS_FILE_ERR_LENGTH') . " {$originalName}";
							if ($sendloggen != 0)
								self::sendLogged(Text::_('MOD_SFNFORMS_FILE_ERR_LENGTH') . " {$originalName}");
							continue;
						}

						$fileExt = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
						if (!in_array($fileExt, $allowedExts)) {
							$warnings[] = Text::_('MOD_SFNFORMS_FILE_ERR_FORMAT') . " {$originalName}";
							if ($sendloggen != 0)
								self::sendLogged(Text::_('MOD_SFNFORMS_FILE_ERR_FORMAT') . " {$originalName}");
							continue;
						}

						$baseName = preg_replace('/[^a-zA-Z0-9_-]/', '', pathinfo($originalName, PATHINFO_FILENAME));
						$fileName = uniqid() . '-' . $baseName . '.' . $fileExt;
						$filePath = $uploadDir . $fileName;

						if (move_uploaded_file($fileTmp, $filePath)) {
							$result[$value->field_name][] = Uri::root() . 'images/uploads/sfnforms/' . $fileName;
						} else {
							$warnings[] = Text::_('MOD_SFNFORMS_FILE_ERR_DOWNLOAD') . " {$originalName}";
							if ($sendloggen != 0)
								self::sendLogged(Text::_('MOD_SFNFORMS_FILE_ERR_DOWNLOAD') . " {$originalName}");
						}
					}
				}

				$result[$value->field_name] = implode(', ', $result[$value->field_name]);
			} else {
				$result[$value->field_name] = $inputs['mod_sfnforms_' . $value->field_name];

			}
		}

		if (!empty($warnings)) {
			self::showResponse(0, implode('<br>', $warnings));
		}

		$selfcopy = !empty($inputs['mod_sfnforms_selfcopy']) ? $inputs['mod_sfnforms_selfcopy'] : '';
		$consent = !empty($inputs['mod_sfnforms_display_consent']) ? $inputs['mod_sfnforms_display_consent'] : '';

		try {
			if (!Session::checkToken()) {
				throw new Exception(Text::_('MOD_SFNFORMS_INVALID_TOKEN'));
			}

			if (!empty($email)) {
				if (!static::isEmailAddress($email)) {
					throw new Exception(Text::_('MOD_SFNFORMS_EMAIL_ERROR'));
				}
			}

			if (!$recipient && !$send_mail) {
				throw new Exception(Text::_('MOD_SFNFORMS_EMAIL_TO_ERROR'));
			}

			if ($show_consent && !$consent) {
				throw new Exception(Text::_('MOD_SFNFORMS_DISPLAY_CONSENT_ERROR'));
			}

			if ($show_captcha && !self::captchaGenerate('onCheckAnswer', null, $module->id)) {
				if ($sendloggen != 0) {
					$text_message = 'captha - bot';
					$logged = self::sendLogged($text_message);
				}
				throw new Exception(Text::_('MOD_SFNFORMS_CAPTCHA_ERROR'));
			}

			if (!empty($inputs['mod_sfnforms_nospam']) && $inputs['mod_sfnforms_nospam'] !== 'valid-user') {
				if ($sendloggen != 0) {
					$text_message = 'nospan - bot';
					$logged = self::sendLogged($text_message);
				}

				die('spam!');
			}

			$placeholders = array(
				'{consent}' => $consent_text,
				'{username}' => $username,
				'{user-id}' => $user_id,
				'{user-email}' => $user_email,
				'{date}' => $date,
				'{date-time}' => $date_time,
				'{ip}' => $ip_remote,
				'{your-website}' => $config->get('sitename'),
				'{your-website-url}' => Uri::root()
			);

			foreach ($new_field as $key => $value) {
				$placeholders['{' . $value->field_name . '}'] = $result[$value->field_name];
			}


			// Replace placeholders for the email body
			$msg = self::replacePlaceholders($message_set, $placeholders);

			$msg_telegram = self::convertHtmlToTextWithLineBreaks($msg);

			// Replace placeholders for the email subject
			$subject_predef = self::replacePlaceholders($subject_predef, $placeholders);

			// Replace placeholders for the Thank You message
			$thank_you = self::replacePlaceholders($thank_you, $placeholders, 'html');

			// array email addresses
			$recipient = array_filter(preg_split('/[;,]+/', $recipient), array('modSFNFormsHelper', 'isEmailAddress'));
			$bcc = array_filter(preg_split('/[;,]+/', $bcc), array('modSFNFormsHelper', 'isEmailAddress'));
			$cc = array_filter(preg_split('/[;,]+/', $cc), array('modSFNFormsHelper', 'isEmailAddress'));

			$sender = '';

			if (!$set_reply) {
				$replyTo = self::replacePlaceholders($reply_email, $placeholders);
				$replyToName = self::replacePlaceholders($reply_name, $placeholders);
			} else {
				$replyTo = $email;
				$replyToName = $sender;
			}

			if (!$replyTo || !static::isEmailAddress($replyTo)) {
				$replyTo = null;
				$replyToName = null;
			}

			if ($send_mail) {
				// send admin email
				$sent_admin = Factory::getMailer()->sendMail($config->get('mailfrom'), $sender, $recipient, $subject_predef, $msg, true, $cc, $bcc, null, $replyTo, $replyToName);
			} else {
				$sent_admin = true;
			}

			//send message telegram
			if ($tegram_send && $tegram_send_token && $tegram_send_id) {
				$url = "https://api.telegram.org/bot{$tegram_send_token}/sendMessage";
				$data = [
					'chat_id' => $tegram_send_id,
					'parse_mode' => 'HTML',
					'text' => $msg_telegram
				];

				$ch = curl_init($url);
				curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
				curl_setopt($ch, CURLOPT_POST, true);
				curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));

				$response = curl_exec($ch);

				if (curl_errno($ch)) {
					if ($sendloggen != 0) {
						$text_message = 'Error telegram';
						$logged = self::sendLogged($text_message);
					}
				} else {
					if ($sendloggen == '1') {
						$text_message = 'Send telegram';
						$logged = self::sendLogged($text_message);
					}
				}

				curl_close($ch);
			}

			// send selfcopy email
			if ($selfcopy || $send_copy) {
				$subject = Text::sprintf('MOD_SFNFORMS_SEND_COPY_SUBJECT', $config->get('sitename'));

				$sent_user = Factory::getMailer()->sendMail($config->get('mailfrom'), $config->get('fromname'), $email, $subject, $msg, true);
				if ($sent_user !== true) {
					$errorMessage = Text::_('MOD_SFNFORMS_NO_FURTHER_INFORMATION_AVAILABLE');
					if (is_object($sent_user) && is_callable(array($sent_user, 'getMessage'))) {
						$errorMessage = $sent_user->getMessage();
					}
					$warning[] = Text::sprintf('MOD_SFNFORMS_EMAIL_FAILED_COPY', $errorMessage);
				}
			}

			if ($sent_admin !== true) {
				if ($sendloggen != 0) {
					$text_message = 'Error send';
					$logged = self::sendLogged($text_message);
				}
				$db = Factory::getDbo();
				$jdate = new Date('now');
				$query = $db->getQuery(true);

				// Get all admin users for database
				$query->clear()
					->select($db->qn(array('id', 'name', 'email', 'sendEmail')))
					->from($db->qn('#__users'))
					->where($db->qn('sendEmail') . ' = ' . 1);

				$db->setQuery($query);
				if ($rows = $db->loadObjectList()) {
					foreach ($rows as $row) {
						$user_send_from = $user_id ? $user_id : $row->id;
						$not_sent = Text::sprintf('MOD_SFNFORMS_ADMIN_EMAIL_NOT_SENT', '<strong>' . $params->get('mail_to') . '</strong><br />');
						$values = array($db->q($user_send_from), $db->q($row->id), $db->q($jdate->toSql()), $db->q($subject_predef), $db->q($not_sent . $msg));
						$query->clear()
							->insert($db->qn('#__messages'))
							->columns($db->qn(array('user_id_from', 'user_id_to', 'date_time', 'subject', 'message')))
							->values(implode(',', $values));
						$db->setQuery($query);
						$db->execute();
					}
				}

				$errorMessage = Text::_('MOD_SFNFORMS_NO_FURTHER_INFORMATION_AVAILABLE');
				if (is_object($sent_admin) && is_callable(array($sent_admin, 'getMessage'))) {
					$errorMessage = $sent_admin->getMessage();
				}

				$warning[] = Text::sprintf('MOD_SFNFORMS_EMAIL_FAILED', $errorMessage);
			} else {
				if ($sendloggen == '1') {
					$text_message = 'Send mail';
					$logged = self::sendLogged($text_message);
				}
			}

			self::showResponse(1, $thank_you, $warning);
		} catch (Exception $e) {
			self::showResponse(0, $e->getMessage());
		}
	}

}