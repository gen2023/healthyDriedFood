<?php
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\Component\Jshopping\Site\Helper\Helper;

defined('_JEXEC') or die();
$jshopConfig = JSFactory::getConfig();
$params = $this->settingsPlg;
$lists = $this->lists;
// $params['column_product_id']

?>
<div id="j-main-container" class="j-main-container">
    <form name="adminForm" id="adminForm" method="post" action="index.php?option=com_jshopping&controller=sofonareports&task=reportsproduct">
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
                    <div><?php echo $lists['treecategories']; ?></div>
                    <?php if ($this->countCurrency > 1) { ?>
                        <div><?php echo $lists['currencies']; ?></div>
                    <?php } ?>
                    <div>
                        <?php echo HTMLHelper::_('calendar', $this->filter['date_from'], 'date_from', 'date_from', $jshopConfig->store_date_format, array('class' => 'inputbox middle2', 'size' => '5', 'maxlength' => '10', 'placeholder' => Text::_('JSHOP_DATE_FROM'))); ?>
                    </div>
                    <div>
                        <?php echo HTMLHelper::_('calendar', $this->filter['date_to'], 'date_to', 'date_to', $jshopConfig->store_date_format, array('class' => 'inputbox middle2', 'size' => '5', 'maxlength' => '10', 'placeholder' => Text::_('JSHOP_DATE_TO'))); ?>
                    </div>
                    <div>
                        <button type="submit" class="btn btn-primary hasTooltip" title="<?php print Text::_('JSHOP_SEARCH') ?>">
                            <span class="icon-search" aria-hidden="true"></span>
                        </button>
                    </div>
                    <div>
                        <button type="button" class="btn btn-primary js-stools-btn-clear"><?php echo Text::_('JSEARCH_FILTER_CLEAR'); ?></button>
                    </div>
                    <div>
                        <a href="/" id="exportProductXlsBtn" class="btn btn-success exportXlsBtn" data-type="products">
                            <span class="icon-download" aria-hidden="true"></span>&nbsp;<?php echo Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_BTN_EXPORT'); ?>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>#</th>
                    <?php if ($params['column_product_id']) { ?>
                        <th><?php echo HTMLHelper::_('grid.sort', 'JSHOP_ID', 'product_id', $this->filter_order_Dir, $this->filter_order); ?></th>
                    <?php } ?>
                    <th>
                        <?php echo HTMLHelper::_('grid.sort', Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_NAME'), 'product_name', $this->filter_order_Dir, $this->filter_order); ?>
                    </th>

                    <?php if ($params['column_manufacturer_code']) { ?>
                        <th>
                            <?php echo HTMLHelper::_('grid.sort', Text::_('JSHOP_MANUFACTURER_CODE'), 'product_ean', $this->filter_order_Dir, $this->filter_order); ?>
                        </th>
                    <?php } ?>
                    <?php if ($params['column_product_ean']) { ?>
                        <th>
                            <?php /* echo HTMLHelper::_('grid.sort', Text::_('JSHOP_EAN_PRODUCT'), 'manufacturer_code', $this->filter_order_Dir, $this->filter_order); */ ?>
                            <?= Text::_('JSHOP_EAN_PRODUCT'); ?>
                        </th>
                    <?php } ?>

                    <?php if ($params['column_count_product']) { ?>
                        <th>
                            <?php echo HTMLHelper::_('grid.sort', Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_COUNT_SOLD'), 'total_quantity', $this->filter_order_Dir, $this->filter_order); ?>
                        </th>
                    <?php } ?>
                    <?php if ($params['column_hits']) { ?>
                        <th>
                            <?php echo HTMLHelper::_('grid.sort', Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_HITS'), 'hits', $this->filter_order_Dir, $this->filter_order); ?>
                        </th>
                    <?php } ?>
                    <?php if ($params['column_sum_sold']) { ?>
                        <th>
                            <?php echo HTMLHelper::_('grid.sort', Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_SUM_SOLD'), 'total_sum', $this->filter_order_Dir, $this->filter_order); ?>
                        </th>
                    <?php } ?>
                    <?php if ($params['column_count_orders']) { ?>
                        <th>
                            <?php echo HTMLHelper::_('grid.sort', Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_COUNT_ORDERS'), 'orders_count', $this->filter_order_Dir, $this->filter_order); ?>
                        </th>
                    <?php } ?>
                </tr>
            </thead>
            <tbody>
                <?php if (!empty($this->productRows)): ?>
                    <?php foreach ($this->productRows as $i => $row): ?>
                        <tr>
                            <td><?php echo $this->pageNavProducts->getRowOffset($i); ?></td>
                            <?php if ($params['column_product_id']) { ?>
                                <td><?php echo (int) $row->product_id; ?></td>
                            <?php } ?>
                            <td>
                                <a href="index.php?option=com_jshopping&controller=products&task=edit&product_id=<?php print $row->product_id?>">
                                    <?php echo htmlspecialchars($row->product_name); ?>
                                </a>
                            </td>
                            <?php if ($params['column_manufacturer_code']) { ?>
                                <td><?= $row->manufacturer_code ?></td><?php } ?>
                            <?php if ($params['column_product_ean']) { ?>
                                <td><?= $row->product_ean ?></td><?php } ?>

                            <?php if ($params['column_count_product']) { ?>
                                <td class="text-center"><?php echo (int) $row->total_quantity; ?></td>
                            <?php } ?>
                            <?php if ($params['column_hits']) { ?>
                                <td><?= $row->hits ?></td><?php } ?>

                            <?php if ($params['column_sum_sold']) { ?>
                                <td class="text-end">
                                    <?php echo number_format($row->total_sum, 2) . ' ' . $row->currency_name; ?>
                                </td>
                            <?php } ?>
                            <?php if ($params['column_count_orders']) { ?>
                                <td class="text-center"><?php echo (int) $row->orders_count; ?></td>
                            <?php } ?>
                        </tr>
                    <?php endforeach; ?>
                <?php else: ?>
                    <tr>
                        <td colspan="5"><?php echo Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_ERROR_NO_DATA'); ?></td>
                    </tr>
                <?php endif; ?>
            </tbody>
        </table>

        <div class="d-flex justify-content-between align-items-center">
            <div><?php echo $this->pageNavProducts->getListFooter(); ?></div>
        </div>
        <input type="hidden" name="filter_order" value="<?php echo $this->filter_order ?>" />
        <input type="hidden" name="filter_order_Dir" value="<?php echo $this->filter_order_Dir ?>" />
        <input type="hidden" name="task" value="reportsproduct" />
        <input type="hidden" name="type" value="products" />
        <input type="hidden" name="boxchecked" value="0" />
        <input type="hidden" name="js_nolang" id='js_nolang' value="0">
    </form>
</div>