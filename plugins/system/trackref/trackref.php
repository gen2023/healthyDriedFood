<?php
defined('_JEXEC') or die;

use Joomla\CMS\Plugin\CMSPlugin;
use Joomla\CMS\Factory;

class PlgSystemTrackref extends CMSPlugin
{
    /**
     * Счётчик переходов по меткам
     */
    public function onAfterInitialise()
    {
        $app = Factory::getApplication();
        if ($app->isClient('administrator')) return;

        $input = $app->input;
        $utm_source = $input->getString('utm_source', '');
        $utm_medium = $input->getString('utm_medium', '');
        $utm_campaign = $input->getString('utm_campaign', '');
        $ref = $input->getString('ref', '');

        if ($utm_source || $utm_medium || $utm_campaign || $ref) {
            $db = Factory::getDbo();
            $now = date('Y-m-d H:i:s');

            $query = $db->getQuery(true)
                ->select('*')
                ->from($db->quoteName('#__trackref_summary'))
                ->where('utm_source=' . $db->quote($utm_source))
                ->where('utm_medium=' . $db->quote($utm_medium))
                ->where('utm_campaign=' . $db->quote($utm_campaign))
                ->where('ref=' . $db->quote($ref));
            $db->setQuery($query);
            $row = $db->loadObject();

            if ($row) {
                $query = $db->getQuery(true)
                    ->update($db->quoteName('#__trackref_summary'))
                    ->set('last_visit=' . $db->quote($now))
                    ->set('count = count + 1')
                    ->where('id=' . (int)$row->id);
                $db->setQuery($query);
                $db->execute();
            } else {
                $columns = ['utm_source','utm_medium','utm_campaign','ref','first_visit','last_visit','count'];
                $values = [
                    $db->quote($utm_source),
                    $db->quote($utm_medium),
                    $db->quote($utm_campaign),
                    $db->quote($ref),
                    $db->quote($now),
                    $db->quote($now),
                    1
                ];
                $query = $db->getQuery(true)
                    ->insert($db->quoteName('#__trackref_summary'))
                    ->columns($db->quoteName($columns))
                    ->values(implode(',', $values));
                $db->setQuery($query);
                $db->execute();
            }
        }
    }

    /**
     * Вывод статистики перед отображением отчёта
     */
    public function onBeforeDisplayStatistic(&$view)
    {
        $db = Factory::getDbo();
        $query = $db->getQuery(true)
            ->select('*')
            ->from($db->quoteName('#__trackref_summary'))
            ->order('last_visit DESC');
        $db->setQuery($query);
        $rows = $db->loadObjectList();

        if (!$rows) {
            $view->tmp_html_start .= '<div style="padding:10px;">Нет данных по переходам</div>';
            return;
        }

        $html  = '<div style="padding:15px;">';
        $html .= '<h3>Статистика переходов по меткам (TrackRef)</h3>';
        $html .= '<table class="adminlist" style="width:100%;border-collapse:collapse;">';
        $html .= '<thead><tr style="background:#f0f0f0;">';
        $html .= '<th>Источник (utm_source)</th>';
        $html .= '<th>Канал (utm_medium)</th>';
        $html .= '<th>Кампания (utm_campaign)</th>';
        $html .= '<th>Ref</th>';
        $html .= '<th>Первый визит</th>';
        $html .= '<th>Последний визит</th>';
        $html .= '<th>Количество</th>';
        $html .= '</tr></thead><tbody>';

        foreach ($rows as $r) {
            $html .= '<tr>';
            $html .= '<td>' . htmlspecialchars($r->utm_source ?: '-') . '</td>';
            $html .= '<td>' . htmlspecialchars($r->utm_medium ?: '-') . '</td>';
            $html .= '<td>' . htmlspecialchars($r->utm_campaign ?: '-') . '</td>';
            $html .= '<td>' . htmlspecialchars($r->ref ?: '-') . '</td>';
            $html .= '<td>' . $r->first_visit . '</td>';
            $html .= '<td>' . $r->last_visit . '</td>';
            $html .= '<td style="text-align:center;">' . (int)$r->count . '</td>';
            $html .= '</tr>';
        }

        $html .= '</tbody></table></div>';

        $view->tmp_html_end .= $html;
    }
}
