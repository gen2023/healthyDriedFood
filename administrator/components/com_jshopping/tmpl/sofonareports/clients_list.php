<?php
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\Component\Jshopping\Site\Helper\Helper;

defined('_JEXEC') or die();

$rows = $this->clientRows;
$lists = $this->lists;
$pageNav = $this->pageNavClients;
$jshopConfig = JSFactory::getConfig();
$params = $this->settingsPlg;
?>

<div id="j-main-container" class="j-main-container">

    <form name="adminForm" id="adminForm" method="post" action="index.php?option=com_jshopping&controller=sofonareports&task=reportsclients">
        <?php echo HTMLHelper::_('form.token'); ?>

        <div class="js-filters">
            <div class="filters-containers">
                <?php if ($params['show_filter_statusOrder_products']) { ?>
                    <div class="selectStatusOrder">
                        <div class="text"><?= Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_MULTIPLE_SELECT_STATUS_ORDER') ?></div>
                        <div id="statusOrder" class="form-control"><?= Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_MULTIPLE_SELECT_STATUS_ORDER') ?></div>
                        <?php print $lists['changestatus']; ?>
                    </div>
                <?php } ?>
                <div class="other-filter">
                    <?php if ($this->countCurrency > 1) { ?>
                        <div><?php echo $lists['currencies']; ?></div>
                    <?php } ?>
                    <div class="block_search_cliens">
                        <input type="text" id="clientSearch" placeholder="<?php echo Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_PLACEHOLDER_SEARCH_CLIENT'); ?>" class="form-control"
                            value="<?= isset($this->current_client['name']) ? htmlspecialchars($this->current_client['name']) : ''; ?>" style="margin-bottom:5px;">

                        <div class="list_search_client list_search_client-js"></div>
                        <?php print $lists['clients']; ?>
                    </div>
                    <div>
                        <?php print $lists['client_type']; ?>
                    </div>
                    <div>
                        <?php print $lists['select_group']; ?>
                    </div>
                    <div>
                        <?php echo HTMLHelper::_('calendar', $this->filter['date_from'], 'date_from', 'date_from', $jshopConfig->store_date_format, array('class' => 'inputbox middle2', 'size' => '5', 'maxlength' => '10', 'placeholder' => Text::_('JSHOP_DATE_FROM'))); ?>
                    </div>
                    <div>
                        <?php echo HTMLHelper::_('calendar', $this->filter['date_to'], 'date_to', 'date_to', $jshopConfig->store_date_format, array('class' => 'inputbox middle2', 'size' => '5', 'maxlength' => '10', 'placeholder' => Text::_('JSHOP_DATE_TO'))); ?>
                    </div>
                    <div>
                        <button type="submit" class="btn btn-primary hasTooltip" title="<?php echo Text::_('JSHOP_SEARCH'); ?>">
                            <span class="icon-search" aria-hidden="true"></span>
                        </button>
                    </div>
                    <div>
                        <button type="button" class="btn btn-primary js-stools-btn-clear"><?php echo Text::_('JSEARCH_FILTER_CLEAR'); ?></button>
                    </div>
                    <div>
                        <a href="/" id="exportClientsXlsBtn" class="btn btn-success exportXlsBtn" data-type="clients">
                            <span class="icon-download" aria-hidden="true"></span>
                            <?php echo Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_BTN_EXPORT'); ?>
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <table class="table table-striped">
            <thead>
                <tr>
                    <th width="20">#</th>
                    <th>
                        <?php echo HTMLHelper::_('grid.sort', Text::_('JSHOP_USER'), 'client_name', $this->filter_order_Dir, $this->filter_order); ?>
                    </th>
                    <?php if ($params['client_column_email']) { ?>
                        <th>
                            <?php echo HTMLHelper::_('grid.sort', Text::_('JSHOP_EMAIL'), 'email', $this->filter_order_Dir, $this->filter_order); ?>
                        </th>
                    <?php } ?>
                    <?php if ($params['client_column_phone']) { ?>
                        <th>
                            <?php echo HTMLHelper::_('grid.sort', Text::_('JSHOP_TELEFON'), 'phone', $this->filter_order_Dir, $this->filter_order); ?>
                        </th>
                    <?php } ?>
                    <?php if ($params['client_column_orders_count']) { ?>
                        <th>
                            <?php echo HTMLHelper::_('grid.sort', Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_COUNT_ORDERS'), 'total_orders', $this->filter_order_Dir, $this->filter_order); ?>
                        </th>
                    <?php } ?>
                    <?php if ($params['client_column_total_sum']) { ?>
                        <th>
                            <?php echo HTMLHelper::_('grid.sort', Text::_('JSHOP_TOTAL'), 'total_sum', $this->filter_order_Dir, $this->filter_order); ?>
                        </th>
                    <?php } ?>
                    <?php if ($params['client_column_first_order_date']) { ?>
                        <th>
                            <?php echo HTMLHelper::_('grid.sort', Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_FIRST_ORDER_DATE'), 'first_order_date', $this->filter_order_Dir, $this->filter_order); ?>
                        </th>
                    <?php } ?>
                    <?php if ($params['client_column_last_order_date']) { ?>
                        <th>
                            <?php echo HTMLHelper::_('grid.sort', Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_LAST_ORDER_DATE'), 'last_order_date', $this->filter_order_Dir, $this->filter_order); ?>
                        </th>
                    <?php } ?>
                </tr>
            </thead>
            <tbody>
                <?php if (!empty($rows)): ?>
                    <?php foreach ($rows as $k => $row): ?>
                        <tr class="row<?php echo ($k % 2); ?>">
                            <td>
                                <?php echo $pageNav->getRowOffset($k); ?>
                            </td>
                            <td><?php echo htmlspecialchars($row->client_name); ?></td>
                            <?php if ($params['client_column_email']) { ?>
                                <td><?php echo htmlspecialchars($row->email); ?></td>
                            <?php } ?>
                            <?php if ($params['client_column_phone']) { ?>
                                <td><?php echo $row->phone; ?></td>
                            <?php } ?>

                            <?php if ($params['client_column_orders_count']) { ?>
                                <td><?php echo (int) $row->total_orders; ?></td>
                            <?php } ?>
                            <?php if ($params['client_column_total_sum']) { ?>
                                <td>
                                    <?php echo number_format($row->total_sum, 2) . ' ' . $row->currency_name; ?>
                                </td>
                            <?php } ?>
                            <?php if ($params['client_column_first_order_date']) { ?>
                                <td>
                                    <?php echo $row->first_order_date ? Helper::formatdate($row->first_order_date, 1) : '-'; ?>
                                </td>
                            <?php } ?>
                            <?php if ($params['client_column_last_order_date']) { ?>
                                <td>
                                    <?php echo $row->last_order_date ? Helper::formatdate($row->last_order_date, 1) : '-'; ?>
                                </td>
                            <?php } ?>
                        </tr>
                    <?php endforeach; ?>
                <?php else: ?>
                    <tr>
                        <td colspan="6" class="text-center"><?php echo Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_ERROR_NO_DATA'); ?></td>
                    </tr>
                <?php endif; ?>
            </tbody>
        </table>

        <div class="d-flex justify-content-between align-items-center">
            <div class="jshop_list_footer"><?php echo $pageNav->getListFooter(); ?></div>
            <div class="jshop_limit_box"><?php echo $pageNav->getLimitBox(); ?></div>
        </div>

        <input type="hidden" name="filter_order" value="<?php echo $this->filter_order ?>" />
        <input type="hidden" name="filter_order_Dir" value="<?php echo $this->filter_order_Dir ?>" />
        <input type="hidden" name="task" value="reportsclients" />
        <input type="hidden" name="type" value="clients" />
        <input type="hidden" name="boxchecked" value="0" />
        <input type="hidden" name="js_nolang" id='js_nolang' value="0">
    </form>
</div>