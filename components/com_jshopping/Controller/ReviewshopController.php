<?php
namespace Joomla\Component\Jshopping\Site\Controller;

defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Language\Text;
use Joomla\CMS\MVC\Controller\BaseController;

class ReviewshopController extends BaseController
{
    public function save()
    {
        $app = Factory::getApplication();
        $app = Factory::getApplication();
        $input = $app->input;

        $name = trim($input->getString('nameUser', ''));
        $email = trim($input->getString('emailUser', ''));
        $message = trim($input->getString('message', ''));
        $captha = trim($input->getString('capthaModrteviw', ''));
        $rating = (int) $input->getInt('ratingValue', 0);

        // var_dump($name);
        $lang = $app->getLanguage();
        $lang->load('mod_slider_reviews', JPATH_SITE);

        Text::script('MOD_REVIEW_REVIEW_MSG_ERROR_FETCH');

        // 1. Проверка имени
        if (empty($name) || mb_strlen($name, 'UTF-8') < 3 || mb_strlen($name, 'UTF-8') > 15) {
            echo json_encode([
                'success' => false,
                'debug' => [
                    'name' => $name,
                    'email' => $email,
                    'message' => $message,
                    'captha' => $captha,
                    'rating' => $rating,
                ],
                'msg' => Text::_('MOD_REVIEW_REVIEW_MSG_ERROR_NAME')
            ]);
            // echo json_encode(['success' => false, 'msg' => Text::_('MOD_REVIEW_REVIEW_MSG_ERROR_NAME')]);
            $app->close();
        }

        // 2. Проверка на "пустую капчу" (honeypot)
        if (!empty($captha)) {
            echo json_encode(['success' => false, 'msg' => Text::_('MOD_REVIEW_REVIEW_MSG_ERROR_CAPTCHA')]);
            $app->close();
        }

        // 4. Проверка рейтинга
        if ($rating <= 0) {
            echo json_encode(['success' => false, 'msg' => Text::_('MOD_REVIEW_REVIEW_MSG_ERROR_RATING')]);
            $app->close();
        }

        // 5. Проверка сообщения
        if (empty($message) || mb_strlen($message, 'UTF-8') > 255) {
            echo json_encode(['success' => false, 'msg' => Text::_('MOD_REVIEW_REVIEW_MSG_ERROR_MESSAGE')]);
            $app->close();
        }

        // 6. Проверка email
        if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo json_encode(['success' => false, 'msg' => Text::_('MOD_REVIEW_REVIEW_MSG_ERROR_EMAIL')]);
            $app->close();
        }

        $ip = '';

        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ip = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0];
        } elseif (!empty($_SERVER['REMOTE_ADDR'])) {
            $ip = $_SERVER['REMOTE_ADDR'];
        }

        $ip = trim($ip);


        // ============================
        //  Запись в БД
        // ============================
        $db = Factory::getDbo();
        $query = $db->getQuery(true);

        $columns = ['product_id', 'user_id', 'user_name', 'user_email', 'time', 'review', 'mark', 'publish', 'ip'];
        $values = [
            '-1',
            0,
            $db->quote($name),
            $db->quote($email),
            $db->quote(date('Y-m-d H:i:s')),
            $db->quote($message),
            (int) $rating,
            0,
            $db->quote($ip)
        ];

        $query
            ->insert($db->quoteName('#__jshopping_products_reviews'))
            ->columns($db->quoteName($columns))
            ->values(implode(',', $values));

        try {
            $db->setQuery($query);
            $db->execute();
            echo json_encode([
                'success' => true,
                'msg' => Text::_('MOD_REVIEW_REVIEW_MSG_ADD_SUCCESS')
            ]);
        } catch (\Exception $e) {
            echo json_encode([
                'success' => false,
                'msg' => Text::_('MOD_REVIEW_REVIEW_MSG_ERROR'),
                'error' => $e->getMessage(), // ← покажет текст ошибки SQL
                'query' => $query->__toString() // ← покажет сам SQL-запрос
            ]);
        }


        $app->close();
    }

}
